import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Text,
  View,
  SafeAreaView,
  ActivityIndicator,
  InteractionManager,
  TextInput,
  KeyboardAvoidingView,
  Appearance,
  Image,
  TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { MetaMetricsEvents } from '../../../core/Analytics';
import { baseStyles } from '../../../styles/common';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import FeatherIcons from 'react-native-vector-icons/Feather';
import { BlurView } from '@react-native-community/blur';
import StyledButton from '../../UI/StyledButton';
import OnboardingProgress from '../../UI/OnboardingProgress';
import { strings } from '../../../../locales/i18n';
import ActionView from '../../UI/ActionView';
import Engine from '../../../core/Engine';
import { getOnboardingNavbarOptions } from '../../UI/Navbar';
import { ScreenshotDeterrent } from '../../UI/ScreenshotDeterrent';
import {
  MANUAL_BACKUP_STEPS,
  SEED_PHRASE,
  CONFIRM_PASSWORD,
  WRONG_PASSWORD_ERROR,
} from '../../../constants/onboarding';
import { useTheme } from '../../../util/theme';
import { trackEvent } from '../../../util/analyticsV2';
import { createStyles } from './styles';
import { CONFIRM_CHANGE_PASSWORD_INPUT_BOX_ID } from '../../../constants/test-ids';
import { Authentication } from '../../../core';
import {
  arrow_right_icon,
  copy_icon,
  shield_warning_2_icon,
  shield_warning_icon,
} from '../../../images/index';
import HStack from '../../../components/Base/HStack';
import { ScrollView } from 'react-native-gesture-handler';
import Share from 'react-native-share';
import Logger from '../../../util/Logger';
import { trackLegacyEvent } from '../../../util/analyticsV2';
import { HeaderBackButton } from '@react-navigation/stack';
import ReadMoreModal from './ReadMoreModal';

/**
 * View that's shown during the second step of
 * the backup seed phrase flow
 */
const ManualBackupStep1 = ({ route, navigation, appTheme }) => {
  const [seedPhraseHidden, setSeedPhraseHidden] = useState(true);

  const [password, setPassword] = useState(undefined);
  const [warningIncorrectPassword, setWarningIncorrectPassword] =
    useState(undefined);
  const [ready, setReady] = useState(false);
  const [view, setView] = useState(SEED_PHRASE);
  const [words, setWords] = useState([]);

  const { colors, themeAppearance } = useTheme();
  const styles = createStyles(colors);
  const refReadMore = useRef(null);

  const currentStep = 1;
  const steps = MANUAL_BACKUP_STEPS;

  const updateNavBar = useCallback(() => {
    navigation.setOptions({
      title: 'Secret Phrase',
      headerStyle: { backgroundColor: 'white', shadowOpacity: 0 },
      headerLeft: (props) => (
        <HeaderBackButton
          {...props}
          labelVisible={false}
          style={{ marginLeft: 16 }}
          backImage={() => (
            <Image
              source={arrow_right_icon}
              style={{ width: 32, height: 32 }}
            />
          )}
        />
      ),
    });
  }, [colors, navigation, route]);

  const tryExportSeedPhrase = async (password) => {
    const { KeyringController } = Engine.context;
    const mnemonic = await KeyringController.exportSeedPhrase(
      password,
    ).toString();
    return JSON.stringify(mnemonic).replace(/"/g, '').split(' ');
  };

  useEffect(() => {
    const getSeedphrase = async () => {
      if (!words.length) {
        try {
          const credentials = await Authentication.getPassword();
          if (credentials) {
            setWords(await tryExportSeedPhrase(credentials.password));
          } else {
            setView(CONFIRM_PASSWORD);
          }
        } catch (e) {
          setView(CONFIRM_PASSWORD);
        }
      }
    };

    getSeedphrase();
    setWords(route.params?.words ?? []);
    setReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    updateNavBar();
  }, [updateNavBar]);

  const onPasswordChange = (password) => {
    setPassword(password);
  };

  const goNext = () => {
    navigation.navigate('ManualBackupStep2', {
      words,
      steps,
    });
  };

  const revealSeedPhrase = () => {
    setSeedPhraseHidden(false);
    InteractionManager.runAfterInteractions(() => {
      trackEvent(MetaMetricsEvents.WALLET_SECURITY_PHRASE_REVEALED);
    });
  };

  const tryUnlockWithPassword = async (password) => {
    setReady(false);
    try {
      const seedPhrase = await tryExportSeedPhrase(password);
      setWords(seedPhrase);
      setView(SEED_PHRASE);
      setReady(true);
    } catch (e) {
      let msg = strings('reveal_credential.warning_incorrect_password');
      if (e.toString().toLowerCase() !== WRONG_PASSWORD_ERROR.toLowerCase()) {
        msg = strings('reveal_credential.unknown_error');
      }
      setWarningIncorrectPassword(msg);
      setReady(true);
    }
  };

  const tryUnlock = () => {
    tryUnlockWithPassword(password);
  };

  const getBlurType = () => {
    let blurType = 'light';
    switch (appTheme) {
      case 'light':
        blurType = 'light';
        break;
      case 'dark':
        blurType = 'dark';
        break;
      case 'os':
        blurType = Appearance.getColorScheme();
        break;
      default:
        blurType = 'light';
    }
    return blurType;
  };

  /**
   * Share seed phrase
   */
  const onShare = () => {
    Share.open({
      message: words.join(', '),
    })
      .then(() => {})
      .catch((err) => {
        Logger.log('Error while trying to copy ', err);
      });
    // InteractionManager.runAfterInteractions(() => {
    //   trackLegacyEvent(MetaMetricsEvents.RECEIVE_OPTIONS_SHARE_ADDRESS);
    // });
  };

  const onReadMore = () => refReadMore.current.toggle();

  const renderSeedPhraseConcealer = () => {
    const blurType = getBlurType();

    return (
      <View style={styles.seedPhraseConcealerContainer}>
        <BlurView blurType={blurType} blurAmount={5} style={styles.blurView} />
        <View style={styles.seedPhraseConcealer}>
          <FeatherIcons name="eye-off" size={24} style={styles.icon} />
          <Text style={styles.reveal}>
            {strings('manual_backup_step_1.reveal')}
          </Text>
          <Text style={styles.watching}>
            {strings('manual_backup_step_1.watching')}
          </Text>
          <View style={styles.viewButtonWrapper}>
            <StyledButton
              type={'onOverlay'}
              testID={'view-button'}
              onPress={revealSeedPhrase}
              containerStyle={styles.viewButtonContainer}
            >
              {strings('manual_backup_step_1.view')}
            </StyledButton>
          </View>
        </View>
      </View>
    );
  };

  const renderConfirmPassword = () => (
    <KeyboardAvoidingView
      style={styles.keyboardAvoidingView}
      behavior={'padding'}
    >
      <KeyboardAwareScrollView style={baseStyles.flexGrow} enableOnAndroid>
        <View style={styles.confirmPasswordWrapper}>
          <View style={[styles.content, styles.passwordRequiredContent]}>
            <Text style={styles.title}>
              {strings('manual_backup_step_1.confirm_password')}
            </Text>
            <View style={styles.text}>
              <Text style={styles.label}>
                {strings('manual_backup_step_1.before_continiuing')}
              </Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder={'Password'}
              placeholderTextColor={colors.text.muted}
              onChangeText={onPasswordChange}
              secureTextEntry
              onSubmitEditing={tryUnlock}
              testID={CONFIRM_CHANGE_PASSWORD_INPUT_BOX_ID}
              keyboardAppearance={themeAppearance}
            />
            {warningIncorrectPassword && (
              <Text style={styles.warningMessageText}>
                {warningIncorrectPassword}
              </Text>
            )}
          </View>
          <View style={styles.buttonWrapper}>
            <StyledButton
              containerStyle={styles.button}
              type={'confirm'}
              onPress={tryUnlock}
              testID={'submit-button'}
            >
              {strings('manual_backup_step_1.confirm')}
            </StyledButton>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </KeyboardAvoidingView>
  );

  const renderSeedphraseView = () => {
    const wordLength = words.length;
    const half = wordLength / 2 || 6;

    return (
      <>
        <ScrollView
          style={{ marginHorizontal: 32 }}
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity onPress={onReadMore}>
            <HStack style={styles.wrapWarning}>
              <Image
                source={shield_warning_icon}
                style={{ width: 24, height: 24, marginRight: 16 }}
                resizeMode="contain"
              />
              <HStack style={{ flex: 1 }}>
                <Text style={styles.warningText}>
                  {'Never share your secret phrase with anyone. '}
                  <Text
                    style={{
                      textDecorationLine: 'underline',
                      fontWeight: '500',
                    }}
                  >
                    {'Read more'}
                  </Text>
                </Text>
              </HStack>
            </HStack>
          </TouchableOpacity>

          <View style={styles.seedPhraseWrapper}>
            <View style={styles.wordColumn}>
              {words.slice(0, half).map((word, i) => (
                <View key={`word_${i}`} style={styles.wordWrapper}>
                  <Text style={[styles.wordIndex]}>
                    {`${i + 1}.   `}
                    <Text style={styles.word}>{word}</Text>
                  </Text>
                </View>
              ))}
            </View>
            <View style={{ width: 16 }} />
            <View style={styles.wordColumn}>
              {words.slice(-half).map((word, i) => (
                <View key={`word_${i}`} style={styles.wordWrapper}>
                  <Text style={styles.wordIndex}>
                    {`${i + (half + 1)}.   `}
                    <Text style={styles.word}>{word}</Text>
                  </Text>
                </View>
              ))}
            </View>
            <ScreenshotDeterrent enabled isSRP />
          </View>

          <TouchableOpacity onPress={onShare}>
            <HStack style={styles.wrapCopy}>
              <Image
                source={copy_icon}
                style={{ width: 24, height: 24 }}
                resizeMode="contain"
              />
              <Text style={styles.copyText}>
                {strings('receive_request.copy')}
              </Text>
            </HStack>
          </TouchableOpacity>

          <View style={{ flex: 1, marginBottom: 16 }} />

          <HStack style={{ marginBottom: 24 }}>
            <Image
              source={shield_warning_2_icon}
              style={{ width: 24, height: 24 }}
              resizeMode="contain"
            />
            <Text style={styles.footerText}>
              {'Never share your secret phrase with anyone, store it securely!'}
            </Text>
          </HStack>
        </ScrollView>
        <StyledButton
          testID={'manual-backup-step-1-continue-button'}
          type={'confirm'}
          onPress={goNext}
          containerStyle={{ marginHorizontal: 32, marginBottom: 16 }}
        >
          {strings('manual_backup_step_1.continue')}
        </StyledButton>
      </>
    );
  };

  return ready ? (
    <View style={styles.mainWrapper}>
      <ReadMoreModal ref={refReadMore} onNext={goNext} />
      {view === SEED_PHRASE ? renderSeedphraseView() : renderConfirmPassword()}
    </View>
  ) : (
    <View style={styles.loader}>
      <ActivityIndicator size="small" />
    </View>
  );
};

ManualBackupStep1.propTypes = {
  /**
  /* navigation object required to push and pop other views
  */
  navigation: PropTypes.object,
  /**
   * Object that represents the current route info like params passed to it
   */
  route: PropTypes.object,
  /**
   * Theme that app is set to
   */
  appTheme: PropTypes.string,
};

const mapStateToProps = (state) => ({
  appTheme: state.user.appTheme,
});

export default connect(mapStateToProps)(ManualBackupStep1);
