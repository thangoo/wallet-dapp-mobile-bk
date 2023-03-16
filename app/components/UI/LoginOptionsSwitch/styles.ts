/* eslint-disable import/prefer-default-export */
import { fontStyles } from '../../../styles/common';
import { StyleSheet } from 'react-native';

export const createStyles = (colors: any) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.background.default,
    },
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 24,
    },
    label: {
      marginLeft: 16,
      flex: 1,
      fontSize: 14,
      fontWeight: '400',
      color: colors.text.default,
      ...fontStyles.normal,
    },
    switch: {},
  });
