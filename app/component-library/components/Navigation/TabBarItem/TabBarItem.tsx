/* eslint-disable react/prop-types */

// Third party dependencies.
import React, { useMemo } from 'react';
import { Image, TouchableOpacity, Text } from 'react-native';

// External dependencies.
import Icon, { IconSize } from '../../Icons/Icon';
import { useStyles } from '../../../hooks';

// Internal dependencies
import styleSheet from './TabBarItem.styles';
import { TabBarItemProps } from './TabBarItem.types';
import { useTheme } from '../../../../../app/util/theme';

const TabBarItem = ({
  style,
  label,
  icon,
  isSelected,
  ...props
}: TabBarItemProps) => {
  const { styles } = useStyles(styleSheet, { style, isSelected });
  const { colors } = useTheme();
  const colorSelect = isSelected
    ? colors.primary.default
    : colors['tvn.gray.10'];
  const tabColor = useMemo(() => colorSelect, [isSelected, colors]);

  return (
    <TouchableOpacity {...props} style={styles.base}>
      <Image source={icon} style={{ tintColor: tabColor }} />
      <Text style={{ color: colorSelect, fontSize: 12, marginTop: 6 }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export default TabBarItem;
