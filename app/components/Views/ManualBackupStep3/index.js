import React, { PureComponent } from 'react';
import {
  Alert,
  BackHandler,
  Text,
  View,
  StyleSheet,
  Keyboard,
  // TouchableOpacity,
  InteractionManager,
  ImageBackground,
} from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// import Emoji from 'react-native-emoji';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';

import { MetaMetricsEvents } from '../../../core/Analytics';
import { fontStyles } from '../../../styles/common';
import OnboardingProgress from '../../UI/OnboardingProgress';
import ActionView from '../../UI/ActionView';
import { strings } from '../../../../locales/i18n';
import { showAlert } from '../../../actions/alert';
import AndroidBackHandler from '../AndroidBackHandler';
import Device from '../../../util/device';
import Confetti from '../../UI/Confetti';
import HintModal from '../../UI/HintModal';
import { getNoneHeaderNavbarOptions } from '../../UI/Navbar';
import setOnboardingWizardStep from '../../../actions/wizard';
import {
  ONBOARDING_WIZARD,
  SEED_PHRASE_HINTS,
} from '../../../constants/storage';
import { trackEvent } from '../../../util/analyticsV2';
import DefaultPreference from 'react-native-default-preference';
import Icon, {
  IconSize,
  IconName,
} from '../../../component-library/components/Icons/Icon';
import { vectorSplashScreen } from 'images/index';

import { ThemeContext, mockTheme } from '../../../util/theme';

const createStyles = (colors) =>
  StyleSheet.create({
    mainWrapper: {
      flex: 1,
      marginTop: 60,
    },
    linearGradient: {
      ...StyleSheet.absoluteFillObject,
      flex: 1,
    },
    backgroundSplash: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    actionView: {
      paddingTop: 40,
    },
    wrapper: {
      flex: 1,
      paddingHorizontal: 50,
    },
    onBoardingWrapper: {
      paddingHorizontal: 20,
    },
    congratulations: {
      fontSize: Device.isMediumDevice() ? 24 : 28,
      color: colors['tvn.white'],
      marginBottom: 12,
      justifyContent: 'center',
      textAlign: 'center',
      ...fontStyles.bold,
    },
    recoverText: {
      fontSize: 16,
      color: colors['tvn.white'],
      marginBottom: 26,
      justifyContent: 'center',
      textAlign: 'center',
      ...fontStyles.normal,
    },
    doneCircleWhite: {
      alignItems: 'center',
      marginBottom: 16,
    },
    shieldEffectWhite: {
      alignItems: 'center',
      marginBottom: 16,
    },
    // Skip button style
    styleButton: {
      color: colors['tvn.primary.default'],
    },
    containerStyleButton: {
      flex: 1,
      marginLeft: 8,
      backgroundColor: colors['tvn.white'],
    },
  });

const hardwareBackPress = () => ({});
const HARDWARE_BACK_PRESS = 'hardwareBackPress';

/**
 * View that's shown during the last step of
 * the backup seed phrase flow
 */
class ManualBackupStep3 extends PureComponent {
  constructor(props) {
    super(props);
    this.steps = props.route.params?.steps;
  }

  state = {
    currentStep: 4,
    showHint: false,
    hintText: '',
  };

  static propTypes = {
    /**
    /* navigation object required to push and pop other views
    */
    navigation: PropTypes.object,
    /**
     * Object that represents the current route info like params passed to it
     */
    route: PropTypes.object,
    /**
     * Action to set onboarding wizard step
     */
    setOnboardingWizardStep: PropTypes.func,
  };

  updateNavBar = () => {
    const { navigation } = this.props;
    navigation.setOptions(getNoneHeaderNavbarOptions());
  };

  componentWillUnmount = () => {
    BackHandler.removeEventListener(HARDWARE_BACK_PRESS, hardwareBackPress);
  };

  componentDidMount = async () => {
    this.updateNavBar();
    const currentSeedphraseHints = await AsyncStorage.getItem(
      SEED_PHRASE_HINTS,
    );
    const parsedHints =
      currentSeedphraseHints && JSON.parse(currentSeedphraseHints);
    const manualBackup = parsedHints?.manualBackup;
    this.setState({
      hintText: manualBackup,
    });
    InteractionManager.runAfterInteractions(() => {
      trackEvent(MetaMetricsEvents.WALLET_SECURITY_COMPLETED);
    });
    BackHandler.addEventListener(HARDWARE_BACK_PRESS, hardwareBackPress);
  };

  componentDidUpdate = () => {
    this.updateNavBar();
  };

  toggleHint = () => {
    this.setState((state) => ({ showHint: !state.showHint }));
  };

  learnMore = () =>
    this.props.navigation.navigate('Webview', {
      screen: 'SimpleWebview',
      params: {
        url: 'https://support.metamask.io',
        title: strings('drawer.metamask_support'),
      },
    });

  isHintSeedPhrase = (hintText) => {
    const words = this.props.route.params?.words;
    if (words) {
      const lower = (string) => String(string).toLowerCase();
      return lower(hintText) === lower(words.join(' '));
    }
    return false;
  };

  saveHint = async () => {
    const { hintText } = this.state;
    if (!hintText) return;
    if (this.isHintSeedPhrase(hintText)) {
      Alert.alert('Error!', strings('manual_backup_step_3.no_seedphrase'));
      return;
    }
    this.toggleHint();
    const currentSeedphraseHints = await AsyncStorage.getItem(
      SEED_PHRASE_HINTS,
    );
    const parsedHints = JSON.parse(currentSeedphraseHints);
    await AsyncStorage.setItem(
      SEED_PHRASE_HINTS,
      JSON.stringify({ ...parsedHints, manualBackup: hintText }),
    );
    InteractionManager.runAfterInteractions(() => {
      trackEvent(MetaMetricsEvents.WALLET_SECURITY_RECOVERY_HINT_SAVED);
    });
  };

  done = async () => {
    const onboardingWizard = await DefaultPreference.get(ONBOARDING_WIZARD);
    if (onboardingWizard) {
      this.props.navigation.reset({ routes: [{ name: 'HomeNav' }] });
    } else {
      this.props.setOnboardingWizardStep(1);
      this.props.navigation.reset({ routes: [{ name: 'HomeNav' }] });
    }
  };

  handleChangeText = (text) => this.setState({ hintText: text });

  renderHint = () => {
    const { showHint, hintText } = this.state;
    return (
      <HintModal
        onConfirm={this.saveHint}
        onCancel={this.toggleHint}
        modalVisible={showHint}
        onRequestClose={Keyboard.dismiss}
        value={hintText}
        onChangeText={this.handleChangeText}
      />
    );
  };

  render() {
    const colors = this.context.colors || mockTheme.colors;
    const styles = createStyles(colors);

    return (
      <LinearGradient
        start={{ x: 0.5, y: 0.75 }}
        end={{ x: 0, y: 0.25 }}
        colors={[
          // @ts-ignore
          colors['tvn.background.linear1'],
          // @ts-ignore
          colors['tvn.background.linear2'],
        ]}
        style={styles.linearGradient}
      >
        <ImageBackground
          source={vectorSplashScreen}
          resizeMode="cover"
          style={styles.backgroundSplash}
        >
          <View style={styles.mainWrapper}>
            {/* <Confetti /> */}
            {this.steps ? (
              <View style={styles.onBoardingWrapper}>
                <OnboardingProgress
                  currentStep={this.state.currentStep}
                  steps={this.steps}
                />
              </View>
            ) : null}

            <ActionView
              confirmTestID={'manual-backup-step-3-done-button'}
              confirmText={strings('manual_backup_step_3.done')}
              onConfirmPress={this.done}
              showCancelButton={false}
              confirmButtonMode={'confirm'}
              style={styles.actionView}
              styledButtonProps={{
                containerStyle: styles.containerStyleButton,
                style: styles.styleButton,
              }}
              isFullScreen
            >
              <View style={styles.wrapper} testID={'import-congrats-screen'}>
                {/* <Emoji name="tada" style={styles.emoji} /> */}
                <View style={styles.doneCircleWhite}>
                  <Icon name={IconName.DoneCircleWhite} size={IconSize.Xxxl} />
                </View>
                <Text style={styles.congratulations}>
                  {strings('manual_backup_step_3.congratulations')}
                </Text>

                <Text style={[styles.baseText, styles.recoverText]}>
                  {strings('manual_backup_step_3.recover')}
                </Text>
                <View style={styles.shieldEffectWhite}>
                  <Icon name={IconName.ShieldEffectWhite} size={'300'} />
                </View>
              </View>
            </ActionView>
            {Device.isAndroid() && (
              <AndroidBackHandler customBackPress={this.props.navigation.pop} />
            )}
            {this.renderHint()}
          </View>
        </ImageBackground>
      </LinearGradient>
    );
  }
}

ManualBackupStep3.contextType = ThemeContext;

const mapDispatchToProps = (dispatch) => ({
  showAlert: (config) => dispatch(showAlert(config)),
  setOnboardingWizardStep: (step) => dispatch(setOnboardingWizardStep(step)),
});

export default connect(null, mapDispatchToProps)(ManualBackupStep3);
