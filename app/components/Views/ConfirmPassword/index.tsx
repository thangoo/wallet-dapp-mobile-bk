import { RouteProp, useRoute } from '@react-navigation/native';
import React, { FC, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  InteractionManager,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { connect } from 'react-redux';
import PassCode from '../../../../app/components/Base/PassCode';
import { CustomTheme, useTheme } from '../../../../app/util/theme';
import { strings } from '../../../../locales/i18n';
import { setLockTime } from '../../../actions/settings';
import {
  passwordSet,
  passwordUnset,
  seedphraseNotBackedUp,
} from '../../../actions/user';
import { CREATE_PASSWORD_CONTAINER_ID } from '../../../constants/test-ids';
import { fontStyles } from '../../../styles/common';
import Logger from '../../../util/Logger';
import Device from '../../../util/device';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { ONBOARDING, PREVIOUS_SCREEN } from '../../../constants/navigation';
import {
  BIOMETRY_CHOICE_DISABLED,
  EXISTING_USER,
  PASSCODE_DISABLED,
  SEED_PHRASE_HINTS,
  TRUE,
} from '../../../constants/storage';
import AppConstants from '../../../core/AppConstants';
import { passwordRequirementsMet } from '../../../util/password';

import { tHeaderOptions } from '../../../../app/components/UI/Navbar/index.thango';
import AUTHENTICATION_TYPE from '../../../constants/userProperties';
import { Authentication } from '../../../core';
import { MetaMetricsEvents } from '../../../core/Analytics';
import Engine from '../../../core/Engine';
import { trackEvent } from '../../../util/analyticsV2';
import {
  passcodeType,
  updateAuthTypeStorageFlags,
} from '../../../util/authentication';
import { LoginOptionsSwitch } from '../../UI/LoginOptionsSwitch';

const PASSCODE_NOT_SET_ERROR = 'Error: Passcode not set.';
const IOS_REJECTED_BIOMETRICS_ERROR =
  'Error: The user name or passphrase you entered is not correct.';

const createStyles = (colors: CustomTheme['colors']) =>
  StyleSheet.create({
    mainWrapper: {
      backgroundColor: colors.tBackground.default,
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
    title: {
      fontSize: Device.isAndroid() ? 20 : 18,
      paddingBottom: 32,
      justifyContent: 'center',
      textAlign: 'center',
      ...fontStyles.bold,
      color: colors.tText.default,
    },
    subtitle2: {
      fontSize: 14,
      lineHeight: 18,
      color: colors.tText.default,
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
    errorMsg: {
      color: colors.error.default,
      ...fontStyles.normal,
      marginTop: 8,
    },
  });

export type VerifyCodeParamList = {
  Detail: {
    passcode: string;
    [PREVIOUS_SCREEN]: string;
  };
};

interface Props {
  navigation: any;
  seedphraseNotBackedUp: () => void;
  passwordSet: () => void;
  setLockTime: (time: number) => void;
  passwordUnset: () => void;
  selectedAddress: string;
}

const ConfirmPassword: FC<Props> = (props) => {
  const route = useRoute<RouteProp<VerifyCodeParamList, 'Detail'>>();
  const passcode = route.params?.passcode ?? null;

  const { colors } = useTheme();
  const styles = createStyles(colors);

  const [loading, setLoading] = useState(false);
  const [biometryType, setBiometryType] = useState<string | null | undefined>(
    null,
  );
  const [biometryChoice, setBiometryChoice] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSelected, setIsSelected] = useState(true);
  // Flag to know if password in keyring was set or not
  //  keyringControllerPasswordSet = false;
  const [keyringControllerPasswordSet, setKeyringControllerPasswordSet] =
    useState(false);

  useEffect(() => {
    props.navigation.setOptions(
      tHeaderOptions(props.navigation, colors, { title: 'Set Password' }),
    );
  }, [props.navigation, route, colors]);

  const componentDidMount = async () => {
    const authData = await Authentication.getType();
    const previouslyDisabled = await AsyncStorage.getItem(
      BIOMETRY_CHOICE_DISABLED,
    );
    const passcodePreviouslyDisabled = await AsyncStorage.getItem(
      PASSCODE_DISABLED,
    );
    if (authData.currentAuthType === AUTHENTICATION_TYPE.PASSCODE) {
      // this.setState({
      //   biometryType: passcodeType(authData.currentAuthType),
      //   biometryChoice: !(
      //     passcodePreviouslyDisabled && passcodePreviouslyDisabled === TRUE
      //   ),
      // });
      setBiometryType(passcodeType(authData.currentAuthType));
      setBiometryChoice(
        !(passcodePreviouslyDisabled && passcodePreviouslyDisabled === TRUE),
      );
    } else if (authData.availableBiometryType) {
      // this.setState({
      //   biometryType: authData.availableBiometryType,
      //   biometryChoice: !(previouslyDisabled && previouslyDisabled === TRUE),
      // });
      setBiometryType(authData.availableBiometryType);
      setBiometryChoice(!(previouslyDisabled && previouslyDisabled === TRUE));
    }
    // this.updateNavBar();
    // setTimeout(() => {
    //   this.setState({
    //     inputWidth: { width: '100%' },
    //   });
    // }, 100);
  };

  useEffect(() => {
    componentDidMount();
  }, []);

  const onPressCreate = async (confirmPasscode: string) => {
    // const { loading, isSelected, password, confirmPassword } = this.state;
    const passwordsMatch = passcode !== '' && passcode === confirmPasscode;
    const canSubmit = passwordsMatch && isSelected;

    if (!passwordsMatch) return setError('Confirm Passcode not match!');
    if (!canSubmit) return;
    if (loading) return;
    if (!passwordRequirementsMet(passcode)) {
      Alert.alert('Error', strings('choose_password.password_length_error'));
      return;
    } else if (passcode !== confirmPasscode) {
      Alert.alert('Error', strings('choose_password.password_dont_match'));
      return;
    }
    InteractionManager.runAfterInteractions(() => {
      trackEvent(MetaMetricsEvents.WALLET_CREATION_ATTEMPTED);
    });

    try {
      // this.setState({ loading: true });
      setLoading(true);
      const previous_screen = route.params?.[PREVIOUS_SCREEN];

      const authType = await Authentication.componentAuthenticationType(
        // this.state.biometryChoice,
        // this.state.rememberMe,
        biometryChoice,
        rememberMe,
      );

      if (previous_screen === ONBOARDING) {
        try {
          await Authentication.newWalletAndKeychain(passcode, authType);
        } catch (error: any) {
          // retry faceID if the user cancels the
          if (
            // @ts-ignore
            Device.isIos &&
            error.toString() === IOS_REJECTED_BIOMETRICS_ERROR
          )
            // await this.handleRejectedOsBiometricPrompt();
            await handleRejectedOsBiometricPrompt();
        }
        // this.keyringControllerPasswordSet = true;
        // this.props.seedphraseNotBackedUp();
        setKeyringControllerPasswordSet(true);
        props.seedphraseNotBackedUp();
      } else {
        // await this.recreateVault(password, authType);
        await recreateVault(passcode, authType);
      }

      // this.props.passwordSet();
      // this.props.setLockTime(AppConstants.DEFAULT_LOCK_TIMEOUT);
      // this.setState({ loading: false });
      // this.props.navigation.replace('AccountBackupStep1');
      props.passwordSet();
      props.setLockTime(AppConstants.DEFAULT_LOCK_TIMEOUT);
      setLoading(false);
      // remove screen choose password out of stack navigation
      props.navigation.pop(2);
      props.navigation.replace('SecretPhraseBackup');

      InteractionManager.runAfterInteractions(() => {
        trackEvent(MetaMetricsEvents.WALLET_CREATED, {
          biometrics_enabled: Boolean(biometryType),
        });
        trackEvent(MetaMetricsEvents.WALLET_SETUP_COMPLETED, {
          wallet_setup_type: 'new',
          new_wallet: true,
        });
      });
    } catch (error: any) {
      // await this.recreateVault('');
      await recreateVault('');
      // Set state in app as it was with no password
      await AsyncStorage.setItem(EXISTING_USER, TRUE);
      await AsyncStorage.removeItem(SEED_PHRASE_HINTS);
      // this.props.passwordUnset();
      // this.props.setLockTime(-1);
      props.passwordUnset();
      props.setLockTime(-1);

      // Should we force people to enable passcode / biometrics?
      if (error.toString() === PASSCODE_NOT_SET_ERROR) {
        Alert.alert(
          strings('choose_password.security_alert_title'),
          strings('choose_password.security_alert_message'),
        );
        // this.setState({ loading: false });
        setLoading(false);
      } else {
        // this.setState({ loading: false, error: error.toString() });
        setLoading(false);
        setError(error.toString());
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
  const handleRejectedOsBiometricPrompt = async () => {
    const newAuthData = await Authentication.componentAuthenticationType(
      false,
      false,
    );
    try {
      await Authentication.newWalletAndKeychain(passcode, newAuthData);
    } catch (err) {
      throw Error(strings('choose_password.disable_biometric_error'));
    }
    // this.setState({
    //   biometryType: newAuthData.availableBiometryType,
    //   biometryChoice: false,
    // });
    setBiometryType(newAuthData.availableBiometryType);
    setBiometryChoice(false);
  };

  /**
   * Recreates a vault
   *
   * @param password - Password to recreate and set the vault with
   */
  const recreateVault = async (password: string, authType?: any) => {
    const { KeyringController, PreferencesController } = Engine.context as any;
    const seedPhrase = await getSeedPhrase();
    let importedAccounts: any[] = [];
    try {
      const keychainPassword = keyringControllerPasswordSet ? password : '';
      // Get imported accounts
      const simpleKeyrings = KeyringController.state.keyrings.filter(
        (keyring: { type: string }) => keyring.type === 'Simple Key Pair',
      );
      for (let i = 0; i < simpleKeyrings.length; i++) {
        const simpleKeyring = simpleKeyrings[i];
        const simpleKeyringAccounts = await Promise.all(
          simpleKeyring.accounts.map((account: any) =>
            KeyringController.exportAccount(keychainPassword, account),
          ),
        );
        importedAccounts = [...importedAccounts, ...simpleKeyringAccounts];
      }
    } catch (e: any) {
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
    // this.keyringControllerPasswordSet = password !== '';
    setKeyringControllerPasswordSet(password !== '');

    // Get props to restore vault
    const hdKeyring = KeyringController.state.keyrings[0];
    const existingAccountCount = hdKeyring.accounts.length;
    const selectedAddress = props.selectedAddress;
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
    } catch (e: any) {
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
  const getSeedPhrase = async () => {
    const { KeyringController } = Engine.context as any;
    // const { password } = this.state;
    const keychainPassword = keyringControllerPasswordSet ? passcode : '';
    const mnemonic = await KeyringController.exportSeedPhrase(
      keychainPassword,
    ).toString();
    return JSON.stringify(mnemonic).replace(/"/g, '');
  };

  const updateBiometryChoice = async (biometryChoice: boolean) => {
    await updateAuthTypeStorageFlags(biometryChoice);
    // this.setState({ biometryChoice });
    setBiometryChoice(biometryChoice);
  };

  const renderSwitch = () => {
    // const { biometryType, biometryChoice } = this.state;
    const handleUpdateRememberMe = (rememberMe: boolean) => {
      // this.setState({ rememberMe });
      setRememberMe(rememberMe);
    };
    return (
      <LoginOptionsSwitch
        // @ts-ignore
        shouldRenderBiometricOption={biometryType}
        biometryChoiceState={biometryChoice}
        onUpdateBiometryChoice={updateBiometryChoice}
        onUpdateRememberMe={handleUpdateRememberMe}
      />
    );
  };

  const onSubmitEditing = async (passcode: string) => {
    await onPressCreate(passcode);
  };

  return (
    <SafeAreaView style={styles.mainWrapper}>
      <View style={styles.wrapper} testID={'choose-password-screen'}>
        <KeyboardAwareScrollView
          style={styles.scrollableWrapper}
          contentContainerStyle={styles.keyboardScrollableWrapper}
          resetScrollToCoords={{ x: 0, y: 0 }}
        >
          <View testID={CREATE_PASSWORD_CONTAINER_ID}>
            <View style={styles.field}>
              <Text style={styles.title}>
                {strings('choose_password.confirm_password')}
              </Text>
              <PassCode onSubmitEditing={onSubmitEditing} />
              {!!error && <Text style={styles.errorMsg}>{error}</Text>}
              {loading ? (
                <ActivityIndicator
                  size="small"
                  color={colors['tvn.primary.blue']}
                  style={{ marginTop: 16 }}
                />
              ) : null}
              <Text style={styles.subtitle2}>
                {strings('choose_password.subtitle2')}
              </Text>
            </View>
          </View>

          <View>{renderSwitch()}</View>
        </KeyboardAwareScrollView>
      </View>
    </SafeAreaView>
  );
};

const mapStateToProps = (state: any) => ({
  selectedAddress:
    state.engine.backgroundState.PreferencesController?.selectedAddress,
});

const mapDispatchToProps = (dispatch: any) => ({
  passwordSet: () => dispatch(passwordSet()),
  passwordUnset: () => dispatch(passwordUnset()),
  setLockTime: (time: number) => dispatch(setLockTime(time)),
  seedphraseNotBackedUp: () => dispatch(seedphraseNotBackedUp()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmPassword);
