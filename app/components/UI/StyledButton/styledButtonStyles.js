import { StyleSheet } from 'react-native';
import { colors as importedColors, fontStyles } from '../../../styles/common';

const createStyles = (colors) =>
  StyleSheet.create({
    container: {
      padding: 15,
      borderRadius: 12,
      justifyContent: 'center',
      minHeight: 48,
    },
    disabledContainer: {
      backgroundColor: colors.tButton.disable,
    },
    text: {
      fontSize: 14,
      textAlign: 'center',
      fontWeight: '600',
    },
    blue: {
      backgroundColor: colors.tPrimary.default,
    },
    blueText: {
      color: colors.tText.button,
      textTransform: 'uppercase',
    },
    orange: {
      borderColor: colors.secondary.default,
      borderWidth: 1,
    },
    orangeText: {
      color: colors.secondary.default,
    },
    infoText: {
      color: colors.primary.default,
    },
    confirm: {
      backgroundColor: colors.tPrimary.default,
      minHeight: 32,
    },
    confirmText: {
      color: colors.primary.inverse,
    },
    roundedNormal: {
      backgroundColor: colors.background.default,
      borderWidth: 1,
      borderColor: colors.primary.default,
      padding: 8,
    },
    roundedNormalText: {
      color: colors.primary.default,
    },
    normal: {
      backgroundColor: colors.background.default,
      borderWidth: 1,
      borderColor: colors.primary.default,
    },
    normalText: {
      color: colors.tPrimary.default,
    },
    tokenList: {
      backgroundColor: colors['tvn.gray.02'],
      borderWidth: 0,
      // borderColor: importedColors.transparent,
    },
    transparent: {
      backgroundColor: importedColors.transparent,
      borderWidth: 0,
      borderColor: importedColors.transparent,
    },
    cancel: {
      backgroundColor: colors.background.default,
      borderWidth: 1,
      borderColor: colors.text.alternative,
    },
    cancelText: {
      color: colors.text.alternative,
    },
    signingCancel: {
      backgroundColor: colors.background.default,
      borderWidth: 2,
      borderColor: colors.primary.default,
    },
    signingCancelText: {
      color: colors.primary.default,
    },
    warning: {
      backgroundColor: colors.error.default,
    },
    info: {
      backgroundColor: colors.background.default,
      borderWidth: 1,
      borderColor: colors.primary.default,
    },
    warningText: {
      color: colors.error.inverse,
    },
    warningTextEmpty: {
      color: colors.error.default,
    },
    neutral: {
      backgroundColor: colors.background.default,
      borderWidth: 1,
      borderColor: colors.text.alternative,
    },
    neutralText: {
      color: colors.text.alternative,
    },
    sign: {
      backgroundColor: colors.primary.default,
      borderWidth: 1,
      borderColor: colors.primary.default,
    },
    signText: {
      color: colors.primary.inverse,
    },
    danger: {
      backgroundColor: colors.error.default,
      borderColor: colors.error.default,
      borderWidth: 1,
    },
    whiteText: {
      ...fontStyles.bold,
      color: colors.overlay.inverse,
    },
    gray10Text: {
      ...fontStyles.bold,
      fontSize: 16,
    },
    onOverlayText: {
      fontSize: 18,
      ...fontStyles.bold,
      color: colors.overlay.inverse,
    },
    onOverlayBackground: {
      borderWidth: 1,
      borderColor: colors.overlay.inverse,
    },
    unselectBackground: {
      borderColor: 'transparent',
      backgroundColor: colors.tBackground.third,
    },
    selectBackground: {
      borderColor: colors.tPrimary.default,
      borderWidth: 1,
      backgroundColor: colors.tBackground.third,
    },
    inverseTransparentBackground: {
      backgroundColor: importedColors.transparent,
      borderWidth: 0,
      borderColor: importedColors.transparent,
    },
    inverseTransparentText: {
      color: colors.primary.inverse,
    },
    inverseBackground: {
      backgroundColor: colors.primary.inverse,
    },
    inverseText: {
      color: colors.primary.default,
    },
  });

function getStyles(type, colors) {
  const styles = createStyles(colors);

  let fontStyle, containerStyle;

  switch (type) {
    case 'orange':
      fontStyle = styles.orangeText;
      containerStyle = styles.orange;
      break;
    case 'blue':
      fontStyle = styles.blueText;
      containerStyle = styles.blue;
      break;
    case 'confirm':
      fontStyle = styles.confirmText;
      containerStyle = styles.confirm;
      break;
    case 'inverse':
      fontStyle = styles.inverseText;
      containerStyle = styles.inverseBackground;
      break;
    case 'inverse-transparent':
      fontStyle = styles.inverseTransparentText;
      containerStyle = styles.inverseTransparentBackground;
      break;
    case 'normal':
      fontStyle = styles.normalText;
      containerStyle = styles.normal;
      break;
    case 'rounded-normal':
      fontStyle = styles.roundedNormalText;
      containerStyle = styles.roundedNormal;
      break;
    case 'cancel':
      fontStyle = styles.cancelText;
      containerStyle = styles.cancel;
      break;
    case 'signingCancel':
      fontStyle = styles.signingCancelText;
      containerStyle = styles.signingCancel;
      break;
    case 'tokenList':
      fontStyle = styles.whiteText;
      containerStyle = styles.tokenList;
      break;
    case 'transparent':
      fontStyle = styles.whiteText;
      containerStyle = styles.transparent;
      break;
    case 'transparent-blue':
      fontStyle = styles.normalText;
      containerStyle = styles.transparent;
      break;
    case 'transparent-gray-10':
      fontStyle = styles.gray10Text;
      containerStyle = styles.transparent;
      break;
    case 'warning':
      fontStyle = styles.warningText;
      containerStyle = styles.warning;
      break;
    case 'warning-empty':
      fontStyle = styles.warningTextEmpty;
      containerStyle = styles.transparent;
      break;
    case 'info':
      fontStyle = styles.infoText;
      containerStyle = styles.info;
      break;
    case 'neutral':
      fontStyle = styles.neutralText;
      containerStyle = styles.neutral;
      break;
    case 'danger':
      fontStyle = styles.confirmText;
      containerStyle = styles.danger;
      break;
    case 'sign':
      fontStyle = styles.signText;
      containerStyle = styles.sign;
      break;
    case 'onOverlay':
      fontStyle = styles.onOverlayText;
      containerStyle = styles.onOverlayBackground;
      break;
    case 'unselect':
      containerStyle = styles.unselectBackground;
      break;
    case 'selected':
      containerStyle = styles.selectBackground;
      break;
    default:
      throw new Error('Unknown button type');
  }

  return {
    fontStyle: [styles.text, fontStyle],
    containerStyle: [styles.container, containerStyle],
    disabledContainerStyleGlobal: styles.disabledContainer,
  };
}

export default getStyles;
