import { fontStyles } from '../../../../styles/common';
import { StyleSheet } from 'react-native';

const createStyles = (colors: any) =>
  StyleSheet.create({
    wrapper: {
      flex: 1,
      backgroundColor: colors.background.default,
    },
    inputWrapper: {
      flex: 0,
      // borderBottomWidth: 1,
      // borderBottomColor: colors.border.default,
      // paddingHorizontal: 8,
    },
    amountWrapper: {
      flexDirection: 'column',
      alignItems: 'center',
      margin: 24,
    },
    assetLogo: {
      width: 50,
      height: 50,
      marginBottom: 10,
    },
    textAmountLabel: {
      ...fontStyles.normal,
      fontSize: 14,
      textAlign: 'center',
      color: colors.text.alternative,
      textTransform: 'uppercase',
      marginVertical: 3,
    },
    textAmount: {
      ...fontStyles.bold,
      color: colors.text.default,
      fontSize: 24,
      textAlign: 'center',
    },
    buttonNext: {
      flex: 1,
      marginHorizontal: 24,
      alignSelf: 'flex-end',
    },
    buttonNextWrapper: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      marginBottom: 16,
    },
    actionTouchable: {
      padding: 12,
    },
    actionText: {
      ...fontStyles.normal,
      color: colors.primary.default,
      fontSize: 14,
      alignSelf: 'center',
    },
    actionsWrapper: {
      margin: 24,
    },
    CollectibleMediaWrapper: {
      flexDirection: 'column',
      alignItems: 'center',
      margin: 16,
    },
    collectibleName: {
      ...fontStyles.normal,
      fontSize: 18,
      color: colors.text.default,
      textAlign: 'center',
    },
    collectibleTokenId: {
      ...fontStyles.normal,
      fontSize: 12,
      color: colors.text.alternative,
      marginTop: 8,
      textAlign: 'center',
    },
    CollectibleMedia: {
      height: 120,
      width: 120,
    },
    qrCode: {
      marginBottom: 16,
      paddingHorizontal: 36,
      paddingBottom: 24,
      paddingTop: 16,
      backgroundColor: colors.background.default,
      borderRadius: 8,
      width: '100%',
    },
    hexDataWrapper: {
      padding: 10,
      alignItems: 'center',
      borderRadius: 10,
      backgroundColor: colors.background.default,
    },
    addressTitle: {
      ...fontStyles.bold,
      color: colors.text.default,
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      fontSize: 16,
      marginBottom: 16,
    },
    hexDataClose: {
      zIndex: 999,
      position: 'absolute',
      top: 12,
      right: 20,
    },
    hexDataText: {
      textAlign: 'justify',
    },
    bottomModal: {
      justifyContent: 'flex-end',
      margin: 0,
    },
    keyboardAwareWrapper: {
      flex: 1,
      justifyContent: 'flex-end',
    },
    errorWrapper: {
      marginHorizontal: 24,
      marginTop: 12,
      paddingHorizontal: 10,
      paddingVertical: 8,
      backgroundColor: colors.error.muted,
      borderColor: colors.error.default,
      borderRadius: 8,
      borderWidth: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    error: {
      color: colors.text.default,
      fontSize: 12,
      lineHeight: 16,
      ...fontStyles.normal,
      textAlign: 'center',
    },
    underline: {
      textDecorationLine: 'underline',
      ...fontStyles.bold,
    },
    text: {
      lineHeight: 20,
      color: colors.text.default,
    },
    tokenInfoWrapper: {
      flex: 1,
      flexDirection: 'row',
    },
    tokenTitle: {
      ...fontStyles.normal,
      color: colors.tText.secondary,
      fontSize: 12,
      width: 70,
      marginLeft: 20,
      marginRight: 30,
    },
    tokenContent: {
      ...fontStyles.normal,
      color: colors.tText.default,
      fontSize: 14,
    },
    seprateLine: {
      borderBottomColor: colors.tBackground.fourth,
      borderBottomWidth: StyleSheet.hairlineWidth,
      marginLeft: 10,
      marginRight: 30,
      marginTop: 20,
      marginBottom: 20,
    },
    body: {
      backgroundColor: colors.tBackground.secondary,
      paddingHorizontal: 22,
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
    modal: {
      margin: 0,
      justifyContent: 'flex-end',
    },
    walletImg : {
      marginBottom :  20,
    },
    text1: {
      fontSize: 14,
      fontWeight: '400',
      color: colors.tText.default,
    },
    title: {
      marginBottom: 20,
      fontSize: 24,
      fontWeight: '600',
      textAlign: 'center',
      textTransform: 'capitalize',
      color: colors.tText.default,
    },
    title2: {
      marginBottom: 30,
      fontSize: 14,
      fontWeight: '400',
      textAlign: 'center',
      color: colors.tText.default,
    },
    dragger: {
      width: 36,
      height: 5,
      borderRadius: 2.5,
      backgroundColor: colors.tBackground.sixth,
      marginTop: 6,
      marginBottom: 32,
    },
    noteWrap: {
      alignItems: 'flex-start',
      marginBottom: 16,
    },
    wrapItem: {
      backgroundColor: colors.tBackground.alternative,
      width: '100%',
      borderRadius: 18,
      paddingHorizontal: 16,
      paddingVertical: 32,
      paddingBottom: 16,
      marginTop: 32,
      marginBottom: 64,
    },
  });

export default createStyles;