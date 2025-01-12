import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicon from 'react-native-vector-icons/Ionicons';
import FeatherIcon from 'react-native-vector-icons/Feather';
import Device from '../../../util/device';
import Text from '../../Base/Text';
import { useTheme } from '../../../util/theme';
import Icon, {
  IconName,
  IconSize,
} from '../../../component-library/components/Icons/Icon';
import { fontStyles } from '../../../styles/common';

const createStyles = (colors) =>
  StyleSheet.create({
    button: {
      flexShrink: 1,
      marginHorizontal: 0,
      justifyContent: 'center',
      alignItems: 'center',
      minWidth: 60,
      marginLeft: 5,
      marginRight: 5,
    },
    disabledButton: {
      opacity: 0.5,
    },
    buttonIconWrapper: {
      // Design FIGMA
      width: 48,
      height: 48,
      borderRadius: 12,
      justifyContent: 'center',
      alignContent: 'center',
      alignItems: 'center',
      backgroundColor: colors['tvn.background.asset.action.button'],
    },
    buttonIcon: {
      justifyContent: 'center',
      alignContent: 'center',
      textAlign: 'center',
      color: colors.primary.inverse,
    },
    buttonText: {
      marginTop: 8,
      marginHorizontal: 3,
      color: colors['tvn.text.default'],
      fontSize: 14,
      ...fontStyles.normal,
    },
    receive: {
      right: Device.isIos() ? 1 : 0,
      bottom: 1,
      transform: [{ rotate: '90deg' }],
    },
    swapsIcon: {
      right: Device.isAndroid() ? 1 : 0,
      bottom: Device.isAndroid() ? 1 : 0,
    },
    buyIcon: {
      right: Device.isAndroid() ? 0.5 : 0,
      bottom: Device.isAndroid() ? 1 : 2,
    },
  });

function AssetActionButton({ onPress, icon, label, disabled }) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const maxStringLength = 10;

  const getIcon = (type) => {
    switch (type) {
      case 'send': {
        return (
          <Icon
            name={IconName.SendPlane}
            size={24}
            style={[styles.buttonIcon, styles.sendIcon]}
          />
        );
      }
      case 'receive': {
        return (
          <Icon
            name={IconName.ReceiveIcon}
            size={24}
            style={[styles.buttonIcon, styles.receive]}
          />
        );
      }
      case 'add': {
        return <Ionicon name="ios-add" size={30} style={styles.buttonIcon} />;
      }
      case 'information': {
        return (
          <Ionicon name="md-information" size={30} style={styles.buttonIcon} />
        );
      }
      case 'swap': {
        return (
          <Icon
            name={IconName.SwapIcon}
            size={24}
            style={[styles.buttonIcon, styles.swapsIcon]}
          />
        );
      }
      case 'buy': {
        return (
          <Icon
            name={IconName.CreditCard}
            size={24}
            style={[styles.buttonIcon, styles.buyIcon]}
          />
        );
      }
      default: {
        return null;
      }
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.button, disabled && styles.disabledButton]}
      disabled={disabled}
    >
      <View style={styles.buttonIconWrapper}>
        {icon && (typeof icon === 'string' ? getIcon(icon) : icon)}
      </View>
      <Text centered style={styles.buttonText} numberOfLines={1}>
        {label.length > maxStringLength
          ? `${label.substring(0, maxStringLength - 3)}...`
          : label}
      </Text>
    </TouchableOpacity>
  );
}

AssetActionButton.propTypes = {
  onPress: PropTypes.func,
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  label: PropTypes.string,
  disabled: PropTypes.bool,
};

export default AssetActionButton;
