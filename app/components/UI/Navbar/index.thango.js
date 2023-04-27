import { HeaderBackButton } from '@react-navigation/stack';
import { fontStyles } from '../../../../app/styles/common';
import { Image, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { arrow_right_icon, xBack_icon, finger_icon } from 'images/index';
import { useNavigation } from '@react-navigation/native';

const tHeaderOptions = (
  route,
  themeColors,
  { title, leftImage = arrow_right_icon, onPressLeft } = {
    title: 'Title',
    onPressLeft: () => {},
  },
  rest,
) => {
  const innerStyles = StyleSheet.create({
    headerStyle: {
      backgroundColor: themeColors.background.default,
      shadowColor: 'transparent',
      elevation: 0,
    },
    headerTitleStyle: {
      fontSize: 18,
      color: themeColors.tText.default,
      textAlign: 'center',
      alignItems: 'center',
      fontWeight: '600',
    },
  });

  return {
    title,
    headerStyle: innerStyles.headerStyle,
    headerLeft: (props) => {
      return (
        <HeaderBackButton
          {...props}
          labelVisible={false}
          style={{ marginLeft: 16 }}
          backImage={() => (
            <Image
              source={leftImage ? leftImage : arrow_right_icon}
              style={{
                width: 24,
                height: 24,
                tintColor: themeColors.tIcon.default,
              }}
            />
          )}
          onPress={Boolean(onPressLeft) ? onPressLeft : props.onPress}
        />
      );
    },
    headerTitle: () => (
      <Text style={innerStyles.headerTitleStyle}>{title}</Text>
    ),
    headerRight: () => <View />,
    ...rest,
  };
};

const tHeaderPhraseOptions = (
  route,
  themeColors,
  { title, leftImage = arrow_right_icon, onPressLeft } = {
    title: 'Title',
    onPressLeft: () => {},
  },
  rest,
) => {
  const innerStyles = StyleSheet.create({
    headerStyle: {
      backgroundColor: themeColors.background.default,
      shadowColor: 'transparent',
      elevation: 0,
    },
    headerTitleStyle: {
      fontSize: 18,
      color: themeColors.tText.light,
      textAlign: 'center',
      ...fontStyles.bold,
      alignItems: 'center',
    },
  });

  return {
    title,
    headerStyle: innerStyles.headerStyle,
    headerLeft: (props) => {
      return (
        <HeaderBackButton
          {...props}
          labelVisible={false}
          style={{ marginLeft: 16 }}
          backImage={() => (
            <Image
              source={leftImage ? leftImage : arrow_right_icon}
              style={{
                width: 24,
                height: 24,
                tintColor: themeColors.tIcon.light,
              }}
            />
          )}
          onPress={Boolean(onPressLeft) ? onPressLeft : props.onPress}
        />
      );
    },
    headerTitle: () => (
      <Text style={innerStyles.headerTitleStyle}>{title}</Text>
    ),
    headerRight: () => <View />,
    headerTitleStyle: {
      fontSize: 20,
      color: themeColors.tText.default,
      ...fontStyles.normal,
    },
    ...rest,
  };
};

const ImageToken = ({ souceIcon, themeColors }) => (
  <Image
    source={souceIcon}
    style={{
      width: 25,
      height: 25,
      tintColor: themeColors.tIcon.default,
    }}
  />
);

const tHeaderPaymentDetailOptions = (
  route,
  themeColors,
  { title } = { title: 'Title' },
  rest,
) => {
  const innerStyles = StyleSheet.create({
    headerStyle: {
      backgroundColor: themeColors.background.default,
      shadowColor: 'transparent',
      elevation: 0,
    },
    headerTitleStyle: {
      fontSize: 18,
      color: themeColors.text.default,
      textAlign: 'center',
      ...fontStyles.bold,
      alignItems: 'center',
    },
  });

  return {
    title,
    headerStyle: innerStyles.headerStyle,
    headerLeft: (props) => (
      <HeaderBackButton
        {...props}
        labelVisible={false}
        style={{ marginLeft: 16 }}
        backImage={() => (
          <ImageToken souceIcon={xBack_icon} themeColors={themeColors} />
        )}
      />
    ),
    headerTitle: () => (
      <Text style={innerStyles.headerTitleStyle}>{title}</Text>
    ),
    headerRight: (onPress) => (
      <TouchableOpacity onPress={onPress}>
        <ImageToken souceIcon={finger_icon} themeColors={themeColors} />
      </TouchableOpacity>
    ),
    headerTitleStyle: {
      fontSize: 20,
      color: themeColors.tText.default,
      ...fontStyles.normal,
    },
    ...rest,
  };
};

export { tHeaderOptions, tHeaderPhraseOptions, tHeaderPaymentDetailOptions };
