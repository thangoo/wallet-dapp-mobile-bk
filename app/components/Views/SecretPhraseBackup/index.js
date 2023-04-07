import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import { strings } from '../../../../locales/i18n';
import {
  WALLET_SETUP_CREATE_NEW_WALLET_BUTTON_ID,
  WELCOME_SCREEN_CAROUSEL_CONTAINER_ID,
  WELCOME_SCREEN_GET_STARTED_BUTTON_ID,
} from '../../../../wdio/screen-objects/testIDs/Screens/WelcomeScreen.testIds';
import generateTestId from '../../../../wdio/utils/generateTestId';
import { saveOnboardingEvent } from '../../../actions/onboarding';
import { ONBOARDING, PREVIOUS_SCREEN } from '../../../constants/navigation';
import { baseStyles, fontStyles } from '../../../styles/common';
import Device from '../../../util/device';
import { ThemeContext, mockTheme } from '../../../util/theme';
import FadeOutOverlay from '../../UI/FadeOutOverlay';
import { getTransparentOnboardingNavbarOptions } from '../../UI/Navbar';
import StyledButton from '../../UI/StyledButton';

import {
  backgroundOnboarding,
  imgSecretPhrase,
  imgWalletOnboarding,
} from 'images/index';
import { tHeaderOptions } from '../../../../app/components/UI/Navbar/index.thango';
import ConfirmBackupModal from './ConfirmBackupModal';

const IMAGE_3_RATIO = 215 / 315;
const IMAGE_2_RATIO = 222 / 239;
const IMAGE_1_RATIO = 285 / 203;
const DEVICE_WIDTH = Dimensions.get('window').width;

const IMG_PADDING = Device.isIphoneX() ? 100 : Device.isIphone5S() ? 180 : 220;

const createStyles = (colors) =>
  StyleSheet.create({
    scroll: {
      flexGrow: 1,
    },
    wrapper: {
      flex: 1,
      position: 'relative',
    },
    title: {
      fontSize: 28,
      marginBottom: 16,
      color: colors['tvn.gray.10'],
      justifyContent: 'flex-end',
      textAlign: 'center',
      ...fontStyles.bold,
      textTransform: 'capitalize',
    },
    subtitle: {
      fontSize: 16,
      lineHeight: 19,
      color: colors['tvn.gray.10'],
      justifyContent: 'center',
      textAlign: 'center',
      ...fontStyles.normal,
    },
    ctas: {
      paddingHorizontal: 32,
      paddingBottom: Device.isIphoneX() ? 40 : 20,
      marginTop: 86,
    },
    ctaWrapper: {},

    // eslint-disable-next-line react-native/no-unused-styles
    carouselImage: {
      width: '97%',
      height: '75%',
    },
    // eslint-disable-next-line react-native/no-unused-styles
    carouselImage2: {
      width: DEVICE_WIDTH - IMG_PADDING,
      height: (DEVICE_WIDTH - IMG_PADDING) * IMAGE_2_RATIO,
    },
    // eslint-disable-next-line react-native/no-unused-styles
    carouselImage3: {
      width: DEVICE_WIDTH - 60,
      height: (DEVICE_WIDTH - 60) * IMAGE_3_RATIO,
    },
    carouselImageWrapper: {
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
    },
    circle: {
      width: 6,
      height: 6,
      borderRadius: 8 / 2,
      backgroundColor: colors['tvn.gray.04'],
      marginHorizontal: 4,
    },
    solidCircle: {
      width: 24,
      backgroundColor: colors['tvn.primary.blue'],
    },
    progessContainer: {
      flexDirection: 'row',
      alignSelf: 'center',
      marginBottom: 30,
    },
    tab: {
      marginHorizontal: 32,
    },
  });

const carousel_images = [
  imgWalletOnboarding,
  imgWalletOnboarding,
  imgWalletOnboarding,
  imgWalletOnboarding,
];

/**
 * View that is displayed to first time (new) users
 */
const SecretPhrase = (props) => {
  const [currentTab, setCurrentTab] = useState(1);
  const refConfirmBackup = useRef(null);

  const onPressCreate = () => {
    props.navigation.navigate('Legal', {
      [PREVIOUS_SCREEN]: ONBOARDING,
    });
  };

  const { colors } = useContext(ThemeContext) || mockTheme.colors;

  const updateNavBar = () => {
    props.navigation.setOptions(getTransparentOnboardingNavbarOptions(colors));
  };

  useEffect(() => {
    props.navigation.setOptions(
      tHeaderOptions(
        props.navigation,
        colors,
        { title: 'Secret Phrase Backup' },
        { headerTransparent: true },
      ),
    );
  }, [props.navigation, props.route, colors]);

  const styles = createStyles(colors);

  const onManually = () => refConfirmBackup.current?.toggle();

  const onNext = () => props.navigation.navigate('ManualBackupStep1');

  return (
    <View style={baseStyles.flexGrow} testID={'secret-phrase-screen--screen'}>
      <View>
        <Image
          source={backgroundOnboarding}
          style={StyleSheet.absoluteFillObject}
        />
      </View>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View
          style={styles.wrapper}
          {...generateTestId(Platform, WELCOME_SCREEN_CAROUSEL_CONTAINER_ID)}
        >
          <View style={[baseStyles.flexGrow]}>
            <View style={styles.carouselImageWrapper}>
              <Image
                source={imgSecretPhrase}
                style={styles.carouselImage}
                resizeMode={'contain'}
                testID={`carousel-image`}
              />
              <View style={styles.tab}>
                <Text style={styles.title}>
                  {strings('secret_phrase.heading2')}
                </Text>
                <Text style={styles.subtitle}>
                  {strings('secret_phrase.subheading2')}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      <View style={styles.ctas}>
        <StyledButton
          type={'blue'}
          testID={WALLET_SETUP_CREATE_NEW_WALLET_BUTTON_ID}
        >
          {strings('secret_phrase.back_up_to_icloud')}
        </StyledButton>
        <StyledButton
          type={'transparent-blue'}
          onPress={onManually}
          testID={WELCOME_SCREEN_GET_STARTED_BUTTON_ID}
        >
          {strings('secret_phrase.back_up_manual')}
        </StyledButton>
      </View>
      <FadeOutOverlay />
      <ConfirmBackupModal ref={refConfirmBackup} onNext={onNext} />
    </View>
  );
};

SecretPhrase.contextType = ThemeContext;

const mapDispatchToProps = (dispatch) => ({
  saveOnboardingEvent: (...eventArgs) =>
    dispatch(saveOnboardingEvent(eventArgs)),
});

export default connect(null, mapDispatchToProps)(SecretPhrase);
