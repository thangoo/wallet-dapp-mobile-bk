import { HeaderBackButton } from '@react-navigation/stack';
import { fontStyles } from '../../../../app/styles/common';
import { Image, StyleSheet, Text, View } from 'react-native';
import { arrow_right_icon } from 'images/index';

export function tHeaderOptions(
  route,
  themeColors,
  { title } = { title: 'Title' },
  rest,
) {
  const innerStyles = StyleSheet.create({
    headerStyle: {
      backgroundColor: themeColors.background.default,
      shadowColor: 'transparent',
      elevation: 0,
    },
    headerTitleStyle: {
      fontSize: 20,
      color: themeColors.text.default,
      textAlign: 'center',
      ...fontStyles.normal,
      alignItems: 'center',
    },
  });

  return {
    title: 'Legal',
    headerStyle: innerStyles.headerStyle,
    headerLeft: (props) => (
      <HeaderBackButton
        {...props}
        labelVisible={false}
        style={{ marginLeft: 16 }}
        backImage={() => (
          <Image
            source={arrow_right_icon}
            style={{
              width: 32,
              height: 32,
              tintColor: themeColors.tIcon.default,
            }}
          />
        )}
      />
    ),
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
}
