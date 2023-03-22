import { StyleSheet, Text, View, Image, SafeAreaView } from 'react-native';
import React, { FC, useEffect } from 'react';
import { HeaderBackButton } from '@react-navigation/stack';
import { arrow_right_icon } from 'images/index';
import { CustomTheme, useTheme } from '../../../../app/util/theme';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { CREATE_PASSWORD_CONTAINER_ID } from '../../../constants/test-ids';
import { strings } from '../../../../locales/i18n';
import PassCode from '../../../../app/components/Base/PassCode';
import Device from '../../../util/device';
import { fontStyles } from '../../../styles/common';
import { PREVIOUS_SCREEN, ONBOARDING } from '../../../constants/navigation';

const createStyles = (colors: CustomTheme['colors']) =>
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

const ChoosePassword: FC<{ navigation: any; route: any }> = ({
  navigation,
  route,
}) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  useEffect(() => {
    navigation.setOptions({
      title: 'Set Password',
      headerStyle: { backgroundColor: 'white', shadowOpacity: 0 },
      headerLeft: (props: any) => (
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

  const onSubmitEditing = (passcode: string) => {
    return navigation.navigate('ConfirmPassword', {
      passcode,
      [PREVIOUS_SCREEN]: ONBOARDING,
    });
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
                {strings('choose_password.title')}
              </Text>
              <PassCode onSubmitEditing={onSubmitEditing} />
              <Text style={styles.subtitle2}>
                {strings('choose_password.subtitle2')}
              </Text>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </View>
    </SafeAreaView>
  );
};

export default ChoosePassword;
