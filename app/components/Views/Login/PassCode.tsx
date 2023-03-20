import { StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';

import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';

const CELL_COUNT = 6;
const PassCode = () => {
  const [value, setValue] = useState('');
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  return (
    <>
      <CodeField
        ref={ref}
        {...props}
        // Use `caretHidden={false}` when users can't paste a text value, because context menu doesn't appear
        value={value}
        onChangeText={setValue}
        cellCount={CELL_COUNT}
        rootStyle={styles.codeFieldRoot}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        renderCell={({ index, symbol, isFocused }) => (
          <View
            style={{
              borderWidth: 1,
              borderStyle: 'dashed',
              marginRight: 8,
              borderRadius: 8,
              width: 48,
            }}
          >
            <Text
              key={index}
              style={[styles.cell, isFocused && styles.focusCell, {}]}
              onLayout={getCellOnLayoutHandler(index)}
            >
              {symbol || (isFocused ? <Cursor /> : null)}
            </Text>
          </View>
        )}
        textInputStyle={{
          height: 64,
          padding: 20,
        }}
      />
    </>
  );
};

export default PassCode;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    padding: 20,
  },
  title: {
    textAlign: 'center',
    fontSize: 30,
  },
  codeFieldRoot: {
    // marginTop: 20,
    height: 64,
    // borderWidth: 1,
  },
  cell: {
    width: 48,
    height: 64,
    fontSize: 24,
    textAlign: 'center',
    lineHeight: 64,
  },
  focusCell: {
    // borderColor: '#000',
  },
});
