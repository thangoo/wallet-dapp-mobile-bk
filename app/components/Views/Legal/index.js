import React, { useState, useEffect, useContext } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import CheckBox from '@react-native-community/checkbox';

import AppConstants from '../../../core/AppConstants';
import { PREVIOUS_SCREEN, ONBOARDING } from '../../../constants/navigation';

import StyledButton from '../../UI/StyledButton';
import Device from '../../../util/device';
import { fontStyles } from '../../../styles/common';
import { strings } from '../../../../locales/i18n';
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
import HStack from '../../Base/HStack';
import { tHeaderOptions } from '../../../../app/components/UI/Navbar/index.thango';

const createStyles = (colors) =>
  StyleSheet.create({
    mainWrapper: {
      backgroundColor: colors.background.default,
      flex: 1,
      marginHorizontal: 32,
    },
    wrapper: {
      justifyContent: 'space-between',
      flex: 1,
    },
    content: {
      alignItems: 'center',
      marginTop: 20,
    },

    container: {
      backgroundColor: colors['tvn.light_gray_blue'],
      borderRadius: 18,
      width: '100%',
    },
    wrapperAccordion: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    image: {
      alignSelf: 'center',
      width: 80,
      height: 80,
    },
    title: {
      fontSize: 14,
      marginVertical: 20,
      textAlign: 'center',
      ...fontStyles.normal,
      color: colors.tText.default,
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
    wrapperBottom: {},

    label: {
      ...fontStyles.normal,
      fontSize: 14,
      lineHeight: 18,
      color: colors.tText.default,
      marginHorizontal: Device.isAndroid() ? 16 : 8,
    },
    icon: {
      padding: 16,
      color: colors.icon.alternative,
      right: 10,
      zIndex: 2,
    },
    ctaWrapper: {
      marginVertical: 20,
    },
    text: {
      flex: 1,
      fontWeight: '600',
      fontSize: 16,
      color: colors.tText.default,
    },
    btn: {
      height: 64,
      backgroundColor: colors.tBackground.alternative,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 16,
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
    navigation.setOptions(
      tHeaderOptions(navigation, colors, { title: 'Legal' }),
    );
  }, [navigation, route, colors]);

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
    <View style={styles.mainWrapper}>
      <View style={styles.wrapper}>
        <View>
          <Text style={styles.title}>
            {strings('terms_and_conditions.subtitle')}
          </Text>
          <TouchableOpacity
            style={[
              styles.btn,
              { borderTopLeftRadius: 18, borderTopRightRadius: 18 },
            ]}
            onPress={onPrivacyPolicy}
          >
            <HStack>
              <Text style={styles.text}>{strings('privacy_policy.title')}</Text>
              <Icon
                name={IconName.ArrowRight}
                size={IconSize.Md}
                color={IconColor.Default}
                style={{ marginRight: 10 }}
              />
            </HStack>
          </TouchableOpacity>
          <View
            style={{ borderWidth: 0.5, borderColor: colors.tBorder.default }}
          />
          <TouchableOpacity
            style={[
              styles.btn,
              { borderBottomLeftRadius: 18, borderBottomRightRadius: 18 },
            ]}
            onPress={onTermConditions}
          >
            <HStack>
              <Text style={styles.text}>
                {strings('terms_and_conditions.title')}
              </Text>
              <Icon
                name={IconName.ArrowRight}
                size={IconSize.Md}
                color={IconColor.Default}
                style={{ marginRight: 10 }}
              />
            </HStack>
          </TouchableOpacity>
        </View>

        <View style={styles.wrapperBottom}>
          <View style={styles.checkboxContainer}>
            <CheckBox
              value={isSelected}
              onValueChange={setSelection}
              style={styles.checkbox}
              tintColors={{
                true: colors.tPrimary.default,
                false: colors.tPrimary.default,
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
            >
              {strings('manual_backup_step_1.continue')}
            </StyledButton>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Legal;
