import React, { useImperativeHandle, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import {
  CodeField,
  Cursor,
  MaskSymbol,
  useBlurOnFulfill,
  useClearByFocusCell,
  isLastFilledCell,
} from 'react-native-confirmation-code-field';
import { useTheme } from '../../util/theme';
import { ThangoThemeColors } from '../../../app/types/common.thangoType';

export const refPassCode = React.createRef();
const CELL_COUNT = 6;
const PassCode = ({
  onSubmitEditing,
}: {
  onSubmitEditing: (passcode: string) => void;
}) => {
  const [value, setValue] = useState('');
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  const { colors } = useTheme();
  const styles = createStyles(colors);

  useImperativeHandle(refPassCode, () => ({
    clearValue: () => setValue(''),
  }));

  const onBlur = () => {
    if (value.length === CELL_COUNT) {
      onSubmitEditing(value);
    }
  };

  const renderCell = ({
    index,
    symbol,
    isFocused,
  }: {
    index: number;
    symbol: string;
    isFocused: boolean;
  }) => {
    let textChild = null;

    if (symbol) {
      textChild = (
        <MaskSymbol
          maskSymbol="●"
          isLastFilledCell={isLastFilledCell({ index, value })}
        >
          {symbol}
        </MaskSymbol>
      );
    } else if (isFocused) {
      textChild = <Cursor />;
    }

    return (
      <View style={styles.wrapText} key={index}>
        <Text
          style={[styles.cell, isFocused && styles.focusCell, {}]}
          onLayout={getCellOnLayoutHandler(index)}
        >
          {textChild}
        </Text>
      </View>
    );
  };

  return (
    <CodeField
      ref={ref}
      {...props}
      // Use `caretHidden={false}` when users can't paste a text value, because context menu doesn't appear
      value={value}
      onChangeText={setValue}
      cellCount={CELL_COUNT}
      keyboardType="number-pad"
      textContentType="oneTimeCode"
      secureTextEntry
      onBlur={onBlur}
      renderCell={renderCell}
    />
  );
};

export default PassCode;

const createStyles = (colors: ThangoThemeColors) =>
  StyleSheet.create({
    cell: {
      fontSize: 24,
      textAlign: 'center',
      lineHeight: 64,
      height: 64,
      color: colors.tText.default,
    },
    focusCell: {},
    wrapText: {
      borderWidth: 1,
      borderStyle: 'dashed',
      borderColor: colors.tBorder.default,
      borderRadius: 8,
      height: 64,
      flex: 1,
      marginHorizontal: 4,
    },
  });
