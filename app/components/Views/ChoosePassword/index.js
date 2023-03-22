import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  ActivityIndicator,
  Alert,
  Text,
  View,
  TextInput,
  SafeAreaView,
  StyleSheet,
  Image,
  InteractionManager,
  Platform,
  Switch,
} from 'react-native';
import zxcvbn from 'zxcvbn';
import CheckBox from '@react-native-community/checkbox';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { connect } from 'react-redux';
import AnimatedFox from 'react-native-animated-fox';
import { MetaMetricsEvents } from '../../../core/Analytics';
import {
  passwordSet,
  passwordUnset,
  seedphraseNotBackedUp,
} from '../../../actions/user';
import { setLockTime } from '../../../actions/settings';
import Engine from '../../../core/Engine';
import Device from '../../../util/device';
import {
  passcodeType,
  updateAuthTypeStorageFlags,
} from '../../../util/authentication';
import { fontStyles } from '../../../styles/common';
import { strings } from '../../../../locales/i18n';
import { getOnboardingNavbarOptions } from '../../UI/Navbar';
import PassCode from '../Login/PassCode';

// import Icon from 'react-native-vector-icons/FontAwesome';

import AppConstants from '../../../core/AppConstants';
import Logger from '../../../util/Logger';
import { ONBOARDING, PREVIOUS_SCREEN } from '../../../constants/navigation';
import {
  EXISTING_USER,
  TRUE,
  SEED_PHRASE_HINTS,
  BIOMETRY_CHOICE_DISABLED,
  PASSCODE_DISABLED,
} from '../../../constants/storage';
import {
  getPasswordStrengthWord,
  passwordRequirementsMet,
  MIN_PASSWORD_LENGTH,
} from '../../../util/password';

import { CHOOSE_PASSWORD_STEPS } from '../../../constants/onboarding';
import { trackEvent } from '../../../util/analyticsV2';
import { Authentication } from '../../../core';
import AUTHENTICATION_TYPE from '../../../constants/userProperties';
import { ThemeContext, mockTheme } from '../../../util/theme';

import { CREATE_PASSWORD_CONTAINER_ID } from '../../../constants/test-ids';
import { LoginOptionsSwitch } from '../../UI/LoginOptionsSwitch';

const createStyles = (colors) =>
  StyleSheet.create({
    mainWrapper: {
      backgroundColor: colors['tvn.background.default'],
      flex: 1,
    },
    wrapper: {
      flex: 1,
      marginBottom: 10,
    },

    scrollableWrapper: {
      flex: 1,
      paddingHorizontal: 32,
    },
    keyboardScrollableWrapper: {
      flexGrow: 1,
    },
    loadingWrapper: {
      paddingHorizontal: 40,
      paddingBottom: 30,
      alignItems: 'center',
      flex: 1,
    },
    foxWrapper: {
      width: Device.isIos() ? 90 : 80,
      height: Device.isIos() ? 90 : 80,
      marginTop: 30,
      marginBottom: 30,
    },
    image: {
      alignSelf: 'center',
      width: 80,
      height: 80,
    },

    title: {
      fontSize: Device.isAndroid() ? 20 : 18,
      paddingBottom: 32,
      justifyContent: 'center',
      textAlign: 'center',
      ...fontStyles.bold,
      color: colors['tvn.gray.10'],
    },
    subtitle: {
      fontSize: 16,
      lineHeight: 23,
      color: colors['tvn.grayLight'],
      textAlign: 'center',
      ...fontStyles.normal,
    },
    subtitle2: {
      fontSize: 14,
      lineHeight: 18,
      color: colors['tvn.gray.10'],
      textAlign: 'center',
      ...fontStyles.normal,
      paddingTop: 32,
    },

    field: {
      marginTop: 198,
    },

    icon: {
      padding: 16,
      color: colors.icon.alternative,
      position: 'absolute',
      right: 10,
      zIndex: 2,
    },
  });

const PASSCODE_NOT_SET_ERROR = 'Error: Passcode not set.';
const IOS_REJECTED_BIOMETRICS_ERROR =
  'Error: The user name or passphrase you entered is not correct.';

/**
 * View where users can set their password for the first time
 */
class ChoosePassword extends PureComponent {
  static propTypes = {
    /**
     * The navigator object
     */
    navigation: PropTypes.object,
    /**
     * The action to update the password set flag
     * in the redux store
     */
    passwordSet: PropTypes.func,
    /**
     * The action to update the password set flag
     * in the redux store to false
     */
    passwordUnset: PropTypes.func,
    /**
     * The action to update the lock time
     * in the redux store
     */
    setLockTime: PropTypes.func,
    /**
     * A string representing the selected address => account
     */
    selectedAddress: PropTypes.string,
    /**
     * Action to reset the flag seedphraseBackedUp in redux
     */
    seedphraseNotBackedUp: PropTypes.func,
    /**
     * Object that represents the current route info like params passed to it
     */
    route: PropTypes.object,
  };

  state = {
    isSelected: false,
    password: '',
    confirmPassword: '',
    secureTextEntry: true,
    biometryType: null,
    biometryChoice: false,
    rememberMe: false,
    loading: false,
    error: null,
    inputWidth: { width: '99%' },
    isEnabled: false,
  };

  mounted = true;

  confirmPasswordInput = React.createRef();
  // Flag to know if password in keyring was set or not
  keyringControllerPasswordSet = false;

  updateNavBar = () => {
    const { route, navigation } = this.props;
    const colors = this.context.colors || mockTheme.colors;
    navigation.setOptions(
      getOnboardingNavbarOptions(route, {}, colors, 'Set Password'),
    );
  };

  async componentDidMount() {
    const authData = await Authentication.getType();
    const previouslyDisabled = await AsyncStorage.getItem(
      BIOMETRY_CHOICE_DISABLED,
    );
    const passcodePreviouslyDisabled = await AsyncStorage.getItem(
      PASSCODE_DISABLED,
    );
    if (authData.currentAuthType === AUTHENTICATION_TYPE.PASSCODE) {
      this.setState({
        biometryType: passcodeType(authData.currentAuthType),
        biometryChoice: !(
          passcodePreviouslyDisabled && passcodePreviouslyDisabled === TRUE
        ),
      });
    } else if (authData.availableBiometryType) {
      this.setState({
        biometryType: authData.availableBiometryType,
        biometryChoice: !(previouslyDisabled && previouslyDisabled === TRUE),
      });
    }
    this.updateNavBar();
    setTimeout(() => {
      this.setState({
        inputWidth: { width: '100%' },
      });
    }, 100);
  }

  componentDidUpdate(prevProps, prevState) {
    this.updateNavBar();
    const prevLoading = prevState.loading;
    const { loading } = this.state;
    const { navigation } = this.props;
    if (!prevLoading && loading) {
      // update navigationOptions
      navigation.setParams({
        headerLeft: () => <View />,
      });
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  setSelection = () => {
    const { isSelected } = this.state;
    this.setState(() => ({ isSelected: !isSelected }));
  };

  onPressCreate = async () => {
    const { loading, isSelected, password, confirmPassword } = this.state;
    const passwordsMatch = password !== '' && password === confirmPassword;
    const canSubmit = passwordsMatch && isSelected;

    if (!canSubmit) return;
    if (loading) return;
    if (!passwordRequirementsMet(password)) {
      Alert.alert('Error', strings('choose_password.password_length_error'));
      return;
    } else if (password !== confirmPassword) {
      Alert.alert('Error', strings('choose_password.password_dont_match'));
      return;
    }
    InteractionManager.runAfterInteractions(() => {
      trackEvent(MetaMetricsEvents.WALLET_CREATION_ATTEMPTED);
    });

    try {
      this.setState({ loading: true });
      const previous_screen = this.props.route.params?.[PREVIOUS_SCREEN];

      const authType = await Authentication.componentAuthenticationType(
        this.state.biometryChoice,
        this.state.rememberMe,
      );

      if (previous_screen === ONBOARDING) {
        try {
          await Authentication.newWalletAndKeychain(password, authType);
        } catch (error) {
          // retry faceID if the user cancels the
          if (
            Device.isIos &&
            error.toString() === IOS_REJECTED_BIOMETRICS_ERROR
          )
            await this.handleRejectedOsBiometricPrompt();
        }
        this.keyringControllerPasswordSet = true;
        this.props.seedphraseNotBackedUp();
      } else {
        await this.recreateVault(password, authType);
      }

      this.props.passwordSet();
      this.props.setLockTime(AppConstants.DEFAULT_LOCK_TIMEOUT);
      this.setState({ loading: false });
      this.props.navigation.replace('AccountBackupStep1');
      InteractionManager.runAfterInteractions(() => {
        trackEvent(MetaMetricsEvents.WALLET_CREATED, {
          biometrics_enabled: Boolean(this.state.biometryType),
        });
        trackEvent(MetaMetricsEvents.WALLET_SETUP_COMPLETED, {
          wallet_setup_type: 'new',
          new_wallet: true,
        });
      });
    } catch (error) {
      await this.recreateVault('');
      // Set state in app as it was with no password
      await AsyncStorage.setItem(EXISTING_USER, TRUE);
      await AsyncStorage.removeItem(SEED_PHRASE_HINTS);
      this.props.passwordUnset();
      this.props.setLockTime(-1);
      // Should we force people to enable passcode / biometrics?
      if (error.toString() === PASSCODE_NOT_SET_ERROR) {
        Alert.alert(
          strings('choose_password.security_alert_title'),
          strings('choose_password.security_alert_message'),
        );
        this.setState({ loading: false });
      } else {
        this.setState({ loading: false, error: error.toString() });
      }
      InteractionManager.runAfterInteractions(() => {
        trackEvent(MetaMetricsEvents.WALLET_SETUP_FAILURE, {
          wallet_setup_type: 'new',
          error_type: error.toString(),
        });
      });
    }
  };

  /**
   * This function handles the case when the user rejects the OS prompt for allowing use of biometrics.
   * If this occurs we will create the wallet automatically with password as the login method
   */
  handleRejectedOsBiometricPrompt = async () => {
    const newAuthData = await Authentication.componentAuthenticationType(
      false,
      false,
    );
    try {
      await Authentication.newWalletAndKeychain(
        this.state.password,
        newAuthData,
      );
    } catch (err) {
      throw Error(strings('choose_password.disable_biometric_error'));
    }
    this.setState({
      biometryType: newAuthData.availableBiometryType,
      biometryChoice: false,
    });
  };

  /**
   * Recreates a vault
   *
   * @param password - Password to recreate and set the vault with
   */
  recreateVault = async (password, authType) => {
    const { KeyringController, PreferencesController } = Engine.context;
    const seedPhrase = await this.getSeedPhrase();
    let importedAccounts = [];
    try {
      const keychainPassword = this.keyringControllerPasswordSet
        ? this.state.password
        : '';
      // Get imported accounts
      const simpleKeyrings = KeyringController.state.keyrings.filter(
        (keyring) => keyring.type === 'Simple Key Pair',
      );
      for (let i = 0; i < simpleKeyrings.length; i++) {
        const simpleKeyring = simpleKeyrings[i];
        const simpleKeyringAccounts = await Promise.all(
          simpleKeyring.accounts.map((account) =>
            KeyringController.exportAccount(keychainPassword, account),
          ),
        );
        importedAccounts = [...importedAccounts, ...simpleKeyringAccounts];
      }
    } catch (e) {
      Logger.error(
        e,
        'error while trying to get imported accounts on recreate vault',
      );
    }

    // Recreate keyring with password given to this method
    await Authentication.newWalletAndRestore(
      password,
      authType,
      seedPhrase,
      true,
    );
    // Keyring is set with empty password or not
    this.keyringControllerPasswordSet = password !== '';

    // Get props to restore vault
    const hdKeyring = KeyringController.state.keyrings[0];
    const existingAccountCount = hdKeyring.accounts.length;
    const selectedAddress = this.props.selectedAddress;
    let preferencesControllerState = PreferencesController.state;

    // Create previous accounts again
    for (let i = 0; i < existingAccountCount - 1; i++) {
      await KeyringController.addNewAccount();
    }

    try {
      // Import imported accounts again
      for (let i = 0; i < importedAccounts.length; i++) {
        await KeyringController.importAccountWithStrategy('privateKey', [
          importedAccounts[i],
        ]);
      }
    } catch (e) {
      Logger.error(
        e,
        'error while trying to import accounts on recreate vault',
      );
    }

    // Reset preferencesControllerState
    preferencesControllerState = PreferencesController.state;

    // Set preferencesControllerState again
    await PreferencesController.update(preferencesControllerState);
    // Reselect previous selected account if still available
    if (hdKeyring.accounts.includes(selectedAddress)) {
      PreferencesController.setSelectedAddress(selectedAddress);
    } else {
      PreferencesController.setSelectedAddress(hdKeyring.accounts[0]);
    }
  };

  /**
   * Returns current vault seed phrase
   * It does it using an empty password or a password set by the user
   * depending on the state the app is currently in
   */
  getSeedPhrase = async () => {
    const { KeyringController } = Engine.context;
    const { password } = this.state;
    const keychainPassword = this.keyringControllerPasswordSet ? password : '';
    const mnemonic = await KeyringController.exportSeedPhrase(
      keychainPassword,
    ).toString();
    return JSON.stringify(mnemonic).replace(/"/g, '');
  };

  jumpToConfirmPassword = () => {
    const { current } = this.confirmPasswordInput;
    current && current.focus();
  };

  updateBiometryChoice = async (biometryChoice) => {
    await updateAuthTypeStorageFlags(biometryChoice);
    this.setState({ biometryChoice });
  };

  renderSwitch = () => {
    const { biometryType, biometryChoice } = this.state;
    const handleUpdateRememberMe = (rememberMe) => {
      this.setState({ rememberMe });
    };
    return (
      <LoginOptionsSwitch
        shouldRenderBiometricOption={biometryType}
        biometryChoiceState={biometryChoice}
        onUpdateBiometryChoice={this.updateBiometryChoice}
        onUpdateRememberMe={handleUpdateRememberMe}
      />
    );
  };

  onPasswordChange = (val) => {
    const passInfo = zxcvbn(val);
    this.setState({ password: val, passwordStrength: passInfo.score });
  };

  toggleShowHide = () => {
    this.setState((state) => ({ secureTextEntry: !state.secureTextEntry }));
  };

  toggleSwitch = () => {
    this.setState((previousState) => ({
      isEnabled: !previousState.isEnabled,
    }));
  };

  learnMore = () => {
    this.props.navigation.push('Webview', {
      screen: 'SimpleWebview',
      params: {
        url: 'https://metamask.zendesk.com/hc/en-us/articles/360039616872-How-can-I-reset-my-password-',
        title: 'metamask.zendesk.com',
      },
    });
  };

  setConfirmPassword = (val) => this.setState({ confirmPassword: val });

  //  navigate to confirm password
  triggerConfirm = (passcode) => {
    const { navigation } = this.props;
    navigation.navigate('ConfirmPassword', {
      passcode: passcode,
      [PREVIOUS_SCREEN]: ONBOARDING,
    });
  };

  render() {
    const {
      isSelected,
      inputWidth,
      password,
      passwordStrength,
      confirmPassword,
      secureTextEntry,
      error,
      loading,
      isEnabled,
    } = this.state;

    const passwordsMatch = password !== '' && password === confirmPassword;
    const canSubmit = passwordsMatch && isSelected;
    const previousScreen = this.props.route.params?.[PREVIOUS_SCREEN];
    const passwordStrengthWord = getPasswordStrengthWord(passwordStrength);
    const colors = this.context.colors || mockTheme.colors;
    const themeAppearance = this.context.themeAppearance || 'light';
    const styles = createStyles(colors);

    return (
      <SafeAreaView style={styles.mainWrapper}>
        {loading ? (
          <View style={styles.loadingWrapper}>
            <View style={styles.foxWrapper}>
              {Device.isAndroid() ? (
                <Image
                  source={require('../../../images/fox.png')}
                  style={styles.image}
                  resizeMethod={'auto'}
                />
              ) : (
                <AnimatedFox bgColor={colors.background.default} />
              )}
            </View>
            <ActivityIndicator size="large" color={colors.text.default} />
            <Text style={styles.title}>
              {strings(
                previousScreen === ONBOARDING
                  ? 'create_wallet.title'
                  : 'secure_your_wallet.creating_password',
              )}
            </Text>
            <Text style={styles.subtitle}>
              {strings('create_wallet.subtitle')}
            </Text>
          </View>
        ) : (
          <View style={styles.wrapper} testID={'choose-password-screen'}>
            <KeyboardAwareScrollView
              style={styles.scrollableWrapper}
              contentContainerStyle={styles.keyboardScrollableWrapper}
              resetScrollToCoords={{ x: 0, y: 0 }}
            >
              <View testID={CREATE_PASSWORD_CONTAINER_ID}>
                <View style={styles.field}>
                  <Text style={styles.title}>
                    {strings('choose_password.title')}
                  </Text>
                  <PassCode onSubmitEditing={this.triggerConfirm} />
                  <Text style={styles.subtitle2}>
                    {strings('choose_password.subtitle2')}
                  </Text>
                </View>
              </View>
            </KeyboardAwareScrollView>
          </View>
        )}
      </SafeAreaView>
    );
  }
}

ChoosePassword.contextType = ThemeContext;

const mapStateToProps = (state) => ({
  selectedAddress:
    state.engine.backgroundState.PreferencesController?.selectedAddress,
});

const mapDispatchToProps = (dispatch) => ({
  passwordSet: () => dispatch(passwordSet()),
  passwordUnset: () => dispatch(passwordUnset()),
  setLockTime: (time) => dispatch(setLockTime(time)),
  seedphraseNotBackedUp: () => dispatch(seedphraseNotBackedUp()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ChoosePassword);
