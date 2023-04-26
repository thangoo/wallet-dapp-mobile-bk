/* eslint-disable import/prefer-default-export */
import { CustomTheme } from '../../../../app/util/theme';
import { StyleSheet } from 'react-native';

export const createStyles = (colors: CustomTheme['colors']) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      paddingHorizontal: 24,
      paddingVertical: 16,
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: colors.background.default,
    },
    content: {
      justifyContent: 'center',
      paddingHorizontal: 16,
      flexGrow: 1,
    },
    title: {
      textAlign: 'center',
      paddingBottom: 16,
    },
    description: {
      textAlign: 'center',
    },
    images: {
      alignItems: 'center',
    },
    actionButtonWrapper: {
      width: '100%',
      padding: 16,
    },
    actionButton: {
      height: undefined,
      marginVertical: 10,
      padding: 8,
      backgroundColor: colors.tButton.disable,
    },
  });
