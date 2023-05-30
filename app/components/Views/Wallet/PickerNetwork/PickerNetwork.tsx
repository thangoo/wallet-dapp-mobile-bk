/* eslint-disable react/prop-types */

// Third party dependencies.
import React from 'react';
import { Image, TouchableOpacity, Text, Animated } from 'react-native';

// External dependencies.
import Icon, {
  IconName,
  IconSize,
} from '../../../../component-library/components/Icons/Icon';

// Internal dependencies.
import stylesheet from './PickerNetwork.styles';
import { arrow_down } from 'images/index';
import Avatar, {
  AvatarSize,
  AvatarVariants,
} from '../../../../component-library/components/Avatars/Avatar';
import { useStyles } from '../../../../component-library/hooks';
import { useTheme } from '../../../../util/theme';

interface PickerNetworkProps {
  /**
   * Optional Network image from either a local or remote source.
   */
  imageSource: any;
  /**
   * Network label to display.
   */
  label: string;
  /**
   * Callback to trigger when picker is pressed.
   */
  onPress: () => void;
  animatedColor: any;
  animatedColorBorder: any;
  style: any;
  upper: boolean;
}

const PickerNetwork = ({
  onPress,
  style,
  label,
  imageSource,
  upper = true,
  ...props
}: PickerNetworkProps) => {
  const { colors } = useTheme();
  const { styles } = useStyles(stylesheet, { style });
  return (
    <TouchableOpacity
      style={[styles.base, upper ? styles.higher : styles.lower]}
      onPress={onPress}
      {...props}
    >
      <Avatar
        variant={AvatarVariants.Network}
        size={AvatarSize.Sm}
        name={label}
        imageSource={imageSource}
        style={{ backgroundColor: 'transparent' }}
      />
      <Animated.Text
        style={[styles.label, upper ? styles.higher : styles.lower]}
        numberOfLines={1}
      >
        {label}
      </Animated.Text>
      <Animated.Image
        source={arrow_down}
        width={24}
        style={{
          tintColor: upper ? colors.gray01 : colors.tIcon.default,
        }}
        height={24}
      />
    </TouchableOpacity>
  );
};

export default PickerNetwork;
