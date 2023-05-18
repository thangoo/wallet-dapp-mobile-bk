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
import { tHeaderPhraseOptions } from '../../../../app/components/UI/Navbar/index.thango';
import ConfirmBackupModal from './ConfirmBackupModal';

const IMAGE_3_RATIO = 215 / 315;
const IMAGE_2_RATIO = 222 / 239;
const IMAGE_1_RATIO = 285 / 203;
const DEVICE_WIDTH = Dimensions.get('window').width;

const IMG_PADDING = Device.isIphoneX() ? 100 : Device.isIphone5S() ? 180 : 220;

const createStyles = (colors) =>
  StyleSheet.create({
    wrapper: {
      flexGrow: 1,
      position: 'relative',
    },
    wrapperImage: {
      flexGrow: 1,
      marginTop: 30,
    },
    title: {
      fontSize: 28,
      marginBottom: 16,
      color: colors.tText.default,
      justifyContent: 'flex-end',
      textAlign: 'center',
      ...fontStyles.bold,
      textTransform: 'capitalize',
    },
    subtitle: {
      fontSize: 16,
      lineHeight: 19,
      color: colors.tText.default,
      justifyContent: 'center',
      textAlign: 'center',
      ...fontStyles.normal,
    },
    ctas: {
      paddingHorizontal: 32,
      paddingBottom: Device.isIphoneX() ? 40 : 20,
      flexGrow: 1,
      // marginTop: 86,
    },

    // eslint-disable-next-line react-native/no-unused-styles
    carouselImage: {
      // width: '94%',
      // height: '75%',
      // marginTop: 70
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
      alignItems: 'center',
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
      marginHorizontal: 22,
      flexGrow: 1,
      paddingBottom: 66,
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
      tHeaderPhraseOptions(
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
    <View style={styles.wrapper} testID={'secret-phrase-screen--screen'}>
      <View style={{ top: -90, flexGrow: 1 }}>
        <Image
          source={backgroundOnboarding}
          style={[StyleSheet.absoluteFillObject]}
        />
      </View>
      <ScrollView>
        <View style={styles.wrapperImage}>
          <View style={styles.carouselImageWrapper}>
            <Image
              source={imgSecretPhrase}
              style={styles.carouselImage}
              resizeMode={'contain'}
              testID={'carousel-image'}
            />
          </View>
        </View>
        <View style={styles.tab}>
          <Text style={styles.title}>{strings('secret_phrase.heading2')}</Text>
          <Text
            style={styles.subtitle}
            numberOfLines={3}
            ellipsizeMode="middle"
          >
            {strings('secret_phrase.subheading2')}
          </Text>
        </View>
        <View style={styles.ctas}>
          {/* <StyledButton
            type={'blue'}
            testID={WALLET_SETUP_CREATE_NEW_WALLET_BUTTON_ID}
          >
            {strings('secret_phrase.back_up_to_icloud')}
          </StyledButton> */}
          <StyledButton
            type={'transparent-blue'}
            onPress={onManually}
            testID={WELCOME_SCREEN_GET_STARTED_BUTTON_ID}
          >
            {strings('secret_phrase.back_up_manual')}
          </StyledButton>
        </View>
      </ScrollView>

      <FadeOutOverlay />
      <ConfirmBackupModal ref={refConfirmBackup} onNext={onNext} />
    </View>
  );
};

const mapDispatchToProps = (dispatch) => ({
  saveOnboardingEvent: (...eventArgs) =>
    dispatch(saveOnboardingEvent(eventArgs)),
});

export default connect(null, mapDispatchToProps)(SecretPhrase);
