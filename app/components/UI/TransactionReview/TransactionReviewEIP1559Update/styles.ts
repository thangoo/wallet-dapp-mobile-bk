import { StyleSheet } from 'react-native';
import { fontStyles } from '../../../../styles/common';

const createStyles = (colors: any) =>
  StyleSheet.create({
    overview: (noMargin) => ({
      marginHorizontal: noMargin ? 0 : 24,
      paddingTop: 10,
      paddingBottom: 10,
    }),
    overviewTransactionDetail: (noMargin) => ({
      // marginHorizontal: noMargin ? 0 : 24,
      paddingTop: 10,
      paddingBottom: 10,
    }),
    valuesContainer: {
      flex: 1,
      flexDirection: 'row',
      // justifyContent: 'flex-end',
    },
    gasInfoContainer: {
      paddingLeft: 2,
    },
    gasInfoIcon: (hasOrigin) => ({
      color: hasOrigin ? colors.secondary.default : colors.icon.muted,
    }),
    amountContainer: {
      flex: 1,
      paddingRight: 10,
    },
    gasRowContainer: {
      flexDirection: 'row',
      flex: 1,
      // alignItems: 'center',
      marginBottom: 2,
    },
    gasRowInfoContainer: {
      marginLeft: 20,
      width: 95,
    },
    gasBottomRowContainer: {
      marginTop: 4,
    },
    hitSlop: {
      top: 10,
      left: 10,
      bottom: 10,
      right: 10,
    },
    redInfo: {
      color: colors.error.default,
    },
    timeEstimateContainer: {
      alignItems: 'center',
      flexDirection: 'row',
    },
    flex: {
      flex: 1,
    },
    gasFeeText: {
      ...fontStyles.normal,
      color: colors.tText.secondary,
      fontSize: 12,
      width: 70,
    },
    amountText: {
      ...fontStyles.normal,
      color: colors.tText.default,
      fontSize: 14,
    },
  });

export default createStyles;
