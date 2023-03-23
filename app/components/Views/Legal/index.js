import React, { useState, useEffect, useContext } from 'react';
import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';

import AppConstants from '../../../core/AppConstants';
import { PREVIOUS_SCREEN, ONBOARDING } from '../../../constants/navigation';

import StyledButton from '../../UI/StyledButton';
import Device from '../../../util/device';
import { fontStyles } from '../../../styles/common';
import { strings } from '../../../../locales/i18n';
import { getOnboardingNavbarOptions } from '../../UI/Navbar';
// import Icon from 'react-native-vector-icons/FontAwesome';

import Icon, {
  IconName,
  IconSize,
  IconColor,
} from '../../../component-library/components/Icons/Icon';

import { ThemeContext, mockTheme } from '../../../util/theme';

import {
  IOS_I_UNDERSTAND_BUTTON_ID,
  ANDROID_I_UNDERSTAND_BUTTON_ID,
} from '../../../constants/test-ids';
import { HeaderBackButton } from '@react-navigation/stack';
import { arrow_right_icon } from 'images/index';

const createStyles = (colors) =>
  StyleSheet.create({
    mainWrapper: {
      backgroundColor: colors['tvn.gray.01'],
      flex: 1,
    },
    wrapper: {
      ...StyleSheet.absoluteFillObject,
      paddingHorizontal: 28,
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    content: {
      textAlign: 'center',
      alignItems: 'center',
      marginBottom: 20,
    },

    containerCollpase: {
      backgroundColor: colors['tvn.light_gray_blue'],
      borderRadius: 18,
      top: 90,
      width: '100%',
      position: 'absolute',
      top: 90,
    },
    wrapperAccordion: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },

    headerCollapse: {
      ...fontStyles.bold,
      fontSize: 16,
      color: colors['tvn.gray.10'],
    },
    accordionItem1: {
      color: colors['tvn.gray.10'],
      paddingLeft: 12,
      paddingVertical: 6,
      borderBottomColor: colors['tvn.gray.04'],
      borderBottomWidth: 1,
    },
    accordionItem2: {
      color: colors['tvn.gray.10'],
      paddingLeft: 12,
      paddingVertical: 6,
    },
    clBody: {
      paddingVertical: 15,
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
    image: {
      alignSelf: 'center',
      width: 80,
      height: 80,
    },

    title: {
      fontSize: Device.isAndroid() ? 16 : 14,
      marginTop: 20,
      marginBottom: 20,
      justifyContent: 'center',
      textAlign: 'center',
      ...fontStyles.normal,
      color: colors['tvn.gray.10'],
    },
    subtitle: {
      fontSize: 16,
      lineHeight: 23,
      color: colors['tvn.grayLight'],
      textAlign: 'center',
      ...fontStyles.normal,
    },
    text: {
      marginBottom: 10,
      justifyContent: 'center',
      ...fontStyles.normal,
    },
    checkboxContainer: {
      alignItems: 'flex-end',
      justifyContent: 'center',
      flexDirection: 'row',
    },
    checkbox: {
      width: 18,
      height: 18,
      margin: 10,
      marginTop: -5,
    },
    wrapperBottom: {
      position: 'absolute',
      bottom: 45,
    },

    label: {
      ...fontStyles.normal,
      fontSize: 14,
      paddingHorizontal: 10,
      lineHeight: 18,
      color: colors['tvn.gray.10'],
    },

    icon: {
      padding: 16,
      color: colors.icon.alternative,
      right: 10,
      zIndex: 2,
    },
    ctaWrapper: {
      marginTop: 20,
      paddingHorizontal: 10,
    },
  });

/**
 * View where users can set their password for the first time
 */
const Legal = ({ navigation, route }) => {
  const [isSelected, setSelected] = useState(false);
  const [canSubmit, setCanSubmit] = useState(false);
  const colors = useContext(ThemeContext).colors;

  useEffect(() => {
    navigation.setOptions({
      title: 'Legal',
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
  }, [navigation, route, colors]);

  const updateNavBar = () => {
    navigation.setOptions(getOnboardingNavbarOptions(navigation, {}, colors));
  };

  const setSelection = () => {
    setSelected(!isSelected);
    setCanSubmit(!isSelected);
  };

  const onTermConditions = () => {
    navigation.navigate('Webview', {
      screen: 'SimpleWebview',
      params: {
        url: AppConstants.URLS.TERMS_AND_CONDITIONS,
        title: strings('terms_and_conditions.title'),
      },
    });
  };
  const onPrivacyPolicy = () => {
    navigation.navigate('Webview', {
      screen: 'SimpleWebview',
      params: {
        url: AppConstants.URLS.PRIVACY_POLICY,
        title: strings('privacy_policy.title'),
      },
    });
  };

  const onPressContinue = () => {
    navigation.navigate('ChoosePassword');
  };

  const styles = createStyles(colors);

  return (
    <SafeAreaView style={styles.mainWrapper}>
      <View testID={'LEGAL_SCREEN_CONTAINER'} style={styles.wrapper}>
        <View style={styles.content}>
          <Text style={styles.title}>
            {strings('terms_and_conditions.subtitle')}
          </Text>
        </View>
        <View style={styles.containerCollpase}>
          <View style={styles.accordionItem1}>
            <StyledButton
              type={'transparent-gray-10'}
              onPress={onPrivacyPolicy}
              testID={'continue-button'}
            >
              {strings('privacy_policy.title')}
              <Icon
                onPress={onPrivacyPolicy}
                name={IconName.ArrowRight}
                size={IconSize.Md}
                color={IconColor.Default}
                style={{ marginRight: 10 }}
              />
            </StyledButton>
          </View>
          <View style={styles.accordionItem2}>
            <StyledButton
              type={'transparent-gray-10'}
              onPress={onTermConditions}
              testID={'continue-button'}
            >
              {strings('terms_and_conditions.title')}
              <Icon
                onPress={onPrivacyPolicy}
                name={IconName.ArrowRight}
                size={IconSize.Md}
                color={IconColor.Default}
                style={{ marginRight: 10 }}
              />
            </StyledButton>
          </View>
        </View>
        <View style={styles.wrapperBottom}>
          <View style={styles.checkboxContainer}>
            <CheckBox
              value={isSelected}
              onValueChange={setSelection}
              style={styles.checkbox}
              tintColors={{
                true: colors['tvn.primary.blue'],
                false: colors['tvn.gray.01'],
              }}
              boxType="square"
              testID={IOS_I_UNDERSTAND_BUTTON_ID}
              accessibilityLabel={IOS_I_UNDERSTAND_BUTTON_ID}
            />
            <TouchableOpacity onPress={setSelection}>
              <Text
                style={styles.label}
                onPress={setSelection}
                testID={ANDROID_I_UNDERSTAND_BUTTON_ID}
              >
                {strings('terms_and_conditions.agree_term')}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.ctaWrapper}>
            <StyledButton
              type={'blue'}
              onPress={onPressContinue}
              testID={'continue-button'}
              disabled={!canSubmit}
              disabledContainerStyle={{
                backgroundColor: colors['tvn.dark_gray_blue'],
              }}
            >
              {strings('manual_backup_step_1.continue')}
            </StyledButton>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Legal;
