import * as React from 'react';
import { View, ViewStyle } from 'react-native';

const HStack: React.FC<React.PropsWithChildren<{ style?: ViewStyle }>> = (
  props,
) => (
  <View style={[{ alignItems: 'center', flexDirection: 'row' }, props.style]}>
    {props.children}
  </View>
);

export default HStack;
