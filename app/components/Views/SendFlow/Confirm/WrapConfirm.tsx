import {
  Animated,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import React, { FC, PropsWithChildren, useEffect } from 'react';
import { useCardAnimation } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { CustomTheme, useTheme } from '../../../../../app/util/theme';
import HStack from '../../../../../app/components/Base/HStack';
import { close_icon, finger_print_icon } from '../../../../images/index';
import { BlurView } from '@react-native-community/blur';

interface Props {}

const WrapConfirm: FC<PropsWithChildren<Props>> = (props) => {
  const { height } = useWindowDimensions();
  const { current } = useCardAnimation();
  const navigation = useNavigation();
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Pressable
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: 'rgba(0, 0, 0, 0.5)' },
        ]}
        onPress={navigation.goBack}
      >
        <BlurView style={styles.blurView} blurAmount={2} />
      </Pressable>

      <Animated.View
        style={[
          {
            height: height,
            transform: [
              {
                translateY: current.progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, height * 0.2],
                  extrapolate: 'clamp',
                }),
              },
            ],
          },
          styles.viewAnimated,
        ]}
      >
        <View style={styles.viewContainer}>
          <HStack
            style={{
              justifyContent: 'space-between',
              height: 64,
            }}
          >
            <TouchableOpacity onPress={navigation.goBack}>
              <Image
                source={close_icon}
                style={{ tintColor: colors.tIcon.default }}
              />
            </TouchableOpacity>
            <Text style={styles.text}>{'Payment Details'}</Text>
            <TouchableOpacity>
              <Image
                source={finger_print_icon}
                style={{ tintColor: colors.tIcon.default }}
              />
            </TouchableOpacity>
          </HStack>
          {props.children}
        </View>
      </Animated.View>
    </View>
  );
};

export default WrapConfirm;

const createStyles = (colors: CustomTheme['colors']) =>
  StyleSheet.create({
    viewAnimated: {
      width: '100%',
    },
    viewContainer: {
      flex: 1,
      backgroundColor: colors.tBackground.secondary,
      paddingHorizontal: 16,
    },
    text: {
      fontSize: 18,
      color: colors.tText.default,
    },
    blurView: {
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      borderRadius: 8,
      backgroundColor: 'rgba(0, 0, 0, 0.2)',
    },
  });
