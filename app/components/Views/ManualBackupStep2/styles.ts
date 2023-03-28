import { StyleSheet } from 'react-native';

import { fontStyles } from '../../../styles/common';
import { CustomTheme } from '../../../util/theme';

const createStyles = (colors: CustomTheme['colors']) =>
  StyleSheet.create({
    mainWrapper: {
      backgroundColor: colors.background.default,
      flex: 1,
    },
    wrapper: {
      flex: 1,
      paddingHorizontal: 32,
    },
    onBoardingWrapper: {
      paddingHorizontal: 20,
    },
    action: {
      fontSize: 18,
      marginBottom: 16,
      color: colors.text.default,
      justifyContent: 'center',
      textAlign: 'center',
      ...fontStyles.bold,
    },
    infoWrapper: {
      marginTop: 30,
      justifyContent: 'center',
    },
    info: {
      fontSize: 14,
      color: colors['tvn.gray.10'],
      textAlign: 'center',
      ...fontStyles.normal,
      paddingHorizontal: 6,
    },
    seedPhraseWrapper: {
      backgroundColor: colors['tvn.light_gray_blue'],
      borderRadius: 8,
      flexDirection: 'row',
      justifyContent: 'space-between',
      // borderColor: colors['tvn.grayLight'],
      // borderWidth: 1,
      marginTop: 24,
    },
    seedPhraseWrapperComplete: {
      borderColor: colors.success.default,
    },
    seedPhraseWrapperError: {
      borderColor: colors.error.default,
    },
    confirmPassPhraseWrapper: {
      paddingTop: 18,
      paddingLeft: 20,
      paddingRight: 20,
      paddingBottom: 4,

      flexDirection: 'row',
      justifyContent: 'center',
      flexWrap: 'wrap',
      height: 240,
    },

    // colLeft: {
    //   paddingTop: 18,
    //   paddingLeft: 27,
    //   paddingBottom: 4,
    //   alignItems: 'flex-start',
    // },
    // colRight: {
    //   paddingTop: 18,
    //   paddingRight: 27,
    //   paddingBottom: 4,
    //   alignItems: 'flex-end',
    // },

    wordBoxWrapper: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 5,
    },
    wordWrapper: {
      // height: Device.isMediumDevice() ? 35 : 40,
      paddingHorizontal: 8,
      paddingVertical: 6,
      marginLeft: 6,

      backgroundColor: colors['tvn.primary.blue'],
      borderRadius: 8,
      alignItems: 'center',
    },
    word: {
      fontSize: 12,
      fontWeight: '600',
      lineHeight: 13,
      color: colors['tvn.white'],
    },
    selectableWord: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      color: colors.text.default,
      backgroundColor: colors.background.default,
      borderColor: colors['tvn.gray.04'],
      borderWidth: 1,
      borderRadius: 8,
      marginBottom: 7,
      marginLeft: 6,
    },
    selectableWordText: {
      fontSize: 12,
      fontWeight: '400',
      lineHeight: 14,
      color: colors['tvn.gray.10'],
    },
    // Selectable list of PassPhrase
    words: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      marginTop: 20,
      // height: 300,
    },
    successRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    successText: {
      fontSize: 12,
      color: colors.success.default,
      marginLeft: 4,
    },
    selectedWord: {
      backgroundColor: colors['tvn.light_gray_blue'],
      borderWidth: 0,
      // borderColor: colors.icon.muted,
    },
    selectedWordText: {
      color: colors['tvn.gray.05'],
    },
    currentWord: {
      borderWidth: 1,
      borderColor: colors['tvn.gray.05'],
    },
    confirmedWord: {
      borderWidth: 1,
      borderColor: colors.primary.default,
      borderStyle: 'solid',
    },
    wordBoxIndex: {
      color: colors.text.default,
    },
  });

export default createStyles;
