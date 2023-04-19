import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  Image,
  Dimensions,
  InteractionManager,
  Platform,
} from 'react-native';
import { MetaMetricsEvents } from '../../../core/Analytics';
import StyledButton from '../../UI/StyledButton';
import { fontStyles, baseStyles } from '../../../styles/common';
import { strings } from '../../../../locales/i18n';
import FadeOutOverlay from '../../UI/FadeOutOverlay';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import { getTransparentOnboardingNavbarOptions } from '../../UI/Navbar';
import { PREVIOUS_SCREEN, ONBOARDING } from '../../../constants/navigation';
import Device from '../../../util/device';
import { saveOnboardingEvent } from '../../../actions/onboarding';
import { connect } from 'react-redux';
import { trackEvent } from '../../../util/analyticsV2';
import DefaultPreference from 'react-native-default-preference';
import { METRICS_OPT_IN } from '../../../constants/storage';
import { ThemeContext, mockTheme } from '../../../util/theme';
import {
  WELCOME_SCREEN_CAROUSEL_TITLE_ID,
  WELCOME_SCREEN_GET_STARTED_BUTTON_ID,
  WELCOME_SCREEN_CAROUSEL_CONTAINER_ID,
  WALLET_SETUP_CREATE_NEW_WALLET_BUTTON_ID,
} from '../../../../wdio/screen-objects/testIDs/Screens/WelcomeScreen.testIds';
import generateTestId from '../../../../wdio/utils/generateTestId';
import Routes from '../../../constants/navigation/Routes';
import WarningExistingUserModal from '../../UI/WarningExistingUserModal';

import { backgroundOnboarding, imgWalletOnboarding } from 'images/index';

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
      flexGrow: 1,
      position: 'relative',
    },
    wrapperCarousel: {
      flexGrow: 1,
    },
    title: {
      fontSize: 28,
      marginBottom: 16,
      color: colors.tText.default,
      justifyContent: 'flex-end',
      textAlign: 'center',
      ...fontStyles.bold,
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
      paddingHorizontal: 40,
      paddingBottom: Device.isIphoneX() ? 40 : 20,
    },
    ctaWrapper: {},

    // eslint-disable-next-line react-native/no-unused-styles
    carouselImage: {
      width: DEVICE_WIDTH > 400 ? '85%' : '97%',
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
      flexGrow: 1,
    },
    circle: {
      width: 6,
      height: 6,
      borderRadius: 8 / 2,
      backgroundColor: colors.tBackground.fourth,
      marginHorizontal: 4,
    },
    solidCircle: {
      width: 24,
      backgroundColor: colors.tPrimary.default,
    },
    progessContainer: {
      flexDirection: 'row',
      alignSelf: 'center',
      marginBottom: 30,
      paddingTop: 10
    },
    tab: {
      marginHorizontal: 32,
      paddingBottom : 20
    },
    wrapperBg : {
      top : DEVICE_WIDTH < 400 ? -50 : 0,
    }
  });
  console.log(Dimensions.get('window').width);

const carousel_images = [
  imgWalletOnboarding,
  imgWalletOnboarding,
  imgWalletOnboarding,
  imgWalletOnboarding,
];

/**
 * View that is displayed to first time (new) users
 */
class OnboardingCarousel extends PureComponent {
  static propTypes = {
    /**
     * The navigator object
     */
    navigation: PropTypes.object,
    /**
     * Save onboarding event to state
     */
    saveOnboardingEvent: PropTypes.func,
  };

  state = {
    currentTab: 1,
    warningModalVisible: false,
  };

  trackEvent = (eventArgs) => {
    InteractionManager.runAfterInteractions(async () => {
      const metricsOptIn = await DefaultPreference.get(METRICS_OPT_IN);
      if (metricsOptIn) {
        trackEvent(eventArgs);
      } else {
        this.props.saveOnboardingEvent(eventArgs);
      }
    });
  };

  alertExistingUser = (callback) => {
    this.warningCallback = () => {
      callback();
      this.toggleWarningModal();
    };
    this.toggleWarningModal();
  };

  toggleWarningModal = () => {
    const warningModalVisible = this.state.warningModalVisible;
    this.setState({ warningModalVisible: !warningModalVisible });
  };

  handleExistingUser = (action) => {
    if (this.state.existingUser) {
      this.alertExistingUser(action);
    } else {
      action();
    }
  };

  onPressCreate = () => {
    this.props.navigation.navigate('Legal', {
      [PREVIOUS_SCREEN]: ONBOARDING,
    });
  };

  renderTabBar = () => <View />;

  onChangeTab = (obj) => {
    this.setState({ currentTab: obj.i + 1 });
    this.trackEvent(MetaMetricsEvents.ONBOARDING_WELCOME_SCREEN_ENGAGEMENT, {
      message_title: strings(`onboarding_carousel.title${[obj.i + 1]}`, {
        locale: 'en',
      }),
    });
  };

  updateNavBar = () => {
    const colors = this.context.colors || mockTheme.colors;
    // this.props.navigation.setOptions(
    //   getTransparentOnboardingNavbarOptions(colors),
    // );
  };

  componentDidMount = () => {
    // this.updateNavBar();
    this.trackEvent(MetaMetricsEvents.ONBOARDING_WELCOME_MESSAGE_VIEWED);
  };

  componentDidUpdate = () => {
    // this.updateNavBar();
  };

  onPressImport = () => {
    const action = async () => {
      const metricsOptIn = await DefaultPreference.get(METRICS_OPT_IN);
      if (metricsOptIn) {
        this.props.navigation.push(
          Routes.ONBOARDING.IMPORT_FROM_SECRET_RECOVERY_PHRASE,
        );
        this.track(MetaMetricsEvents.WALLET_IMPORT_STARTED);
      } else {
        this.props.navigation.navigate('OptinMetrics', {
          onContinue: () => {
            this.props.navigation.replace(
              Routes.ONBOARDING.IMPORT_FROM_SECRET_RECOVERY_PHRASE,
            );
            this.track(MetaMetricsEvents.WALLET_IMPORT_STARTED);
          },
        });
      }
    };
    this.handleExistingUser(action);
  };

  track = (...eventArgs) => {
    InteractionManager.runAfterInteractions(async () => {
      if (MetaMetrics.checkEnabled()) {
        trackEvent(...eventArgs);
        return;
      }
      const metricsOptIn = await DefaultPreference.get(METRICS_OPT_IN);
      if (!metricsOptIn) {
        this.props.saveOnboardingEvent(eventArgs);
      }
    });
  };

  render() {
    const { currentTab } = this.state;
    const colors = this.context.colors || mockTheme.colors;
    const styles = createStyles(colors);

    return (
      <View
        style={styles.wrapper}
        testID={'onboarding-carouselcarousel-screen--screen'}
      >
        <View style={styles.wrapperBg}>
          <Image
            source={backgroundOnboarding}
            style={StyleSheet.absoluteFillObject}
          />
        </View>
        <ScrollView contentContainerStyle={styles.scroll}>
          <View
           style={styles.wrapperCarousel}
            {...generateTestId(Platform, WELCOME_SCREEN_CAROUSEL_CONTAINER_ID)}
          >
            <ScrollableTabView
              style={styles.scrollTabs}
              renderTabBar={this.renderTabBar}
              onChangeTab={this.onChangeTab}
            >
              {['one', 'two', 'three', 'four'].map((value, index) => {
                const key = index + 1;
                return (
                  <View key={key} style={{flexGrow: 1}}>
                    <View style={styles.carouselImageWrapper}>
                      <Image
                        source={carousel_images[index]}
                        style={styles.carouselImage}
                        resizeMode={'contain'}
                        testID={`carousel-${value}-image`}
                      />
                      <View
                        style={styles.tab}
                        {...generateTestId(
                          Platform,
                          WELCOME_SCREEN_CAROUSEL_TITLE_ID(key),
                        )}
                      >
                        <Text style={styles.title}>
                          {strings(`onboarding_carousel.title${key}`)}
                        </Text>
                        <Text style={styles.subtitle} numberOfLines={3} ellipsizeMode="middle">
                          {strings(`onboarding_carousel.subtitle${key}`)}
                        </Text>
                      </View>
                    </View>
                  </View>
                );
              })}
            </ScrollableTabView>
          
          </View>
        </ScrollView>
        <View style={styles.progessContainer}>
              {[1, 2, 3, 4].map((i) => (
                <View
                  key={i}
                  style={[
                    styles.circle,
                    currentTab === i ? styles.solidCircle : {},
                  ]}
                />
              ))}
            </View>
        <View style={styles.ctas}>
          <View style={styles.ctaWrapper}>
            <StyledButton
              type={'blue'}
              onPress={this.onPressCreate}
              testID={WALLET_SETUP_CREATE_NEW_WALLET_BUTTON_ID}
            >
              {strings('onboarding.start_exploring_now')}
            </StyledButton>
            <StyledButton
              type={'transparent-blue'}
              onPress={this.onPressImport}
              testID={WELCOME_SCREEN_GET_STARTED_BUTTON_ID}
            >
              {strings('onboarding.already_have_wallet')}
            </StyledButton>
          </View>
        </View>
        <FadeOutOverlay />
        <WarningExistingUserModal
          warningModalVisible={this.state.warningModalVisible}
          onCancelPress={this.warningCallback}
          onRequestClose={this.toggleWarningModal}
          onConfirmPress={this.toggleWarningModal}
        />
      </View>
    );
  }
}

OnboardingCarousel.contextType = ThemeContext;

const mapDispatchToProps = (dispatch) => ({
  saveOnboardingEvent: (...eventArgs) =>
    dispatch(saveOnboardingEvent(eventArgs)),
});

export default connect(null, mapDispatchToProps)(OnboardingCarousel);
