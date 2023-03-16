/* eslint-disable @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports, import/no-commonjs */
import React from 'react';
import {
  Dimensions,
  View,
  StyleSheet,
  Image,
  ImageBackground,
} from 'react-native';
import { useTheme } from '../../../util/theme';

const LOGO_SIZE = 175;
const LOGO_PADDING = 25;

const createStyles = (colors: any) =>
  StyleSheet.create({
    main: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: colors.background.default,
    },
    backgroundSplash: {
      flex: 1,
      justifyContent: 'center',
      backgroundColor: 'black',
    },
    logoWrapper: {
      paddingTop: 50,
      marginTop:
        Dimensions.get('window').height / 2 - LOGO_SIZE / 2 - LOGO_PADDING,
      height: LOGO_SIZE + LOGO_PADDING * 2,
    },
    paymeLogo: {
      width: 240,
      height: 60,
      alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

const MetaMaskAnimation = (): JSX.Element => {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <View style={styles.main}>
      <ImageBackground
        source={require('../../../images/bgSplash.png')}
        resizeMode="cover"
        style={styles.backgroundSplash}
      >
        <Image
          style={styles.paymeLogo}
          source={require('../../../images/logoPM.png')}
        />
      </ImageBackground>
    </View>
  );
};

export default MetaMaskAnimation;
