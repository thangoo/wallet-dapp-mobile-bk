/* eslint-disable @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports, import/no-commonjs */
import { logoSplashScreen, vectorSplashScreen } from 'images/index';
import React from 'react';
import {
  Dimensions,
  View,
  StyleSheet,
  Image,
  ImageBackground,
  Text,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { getVersion } from 'react-native-device-info';

import { useAppTheme, useTheme } from '../../../util/theme';

const LOGO_SIZE = 175;
const LOGO_PADDING = 25;

const createStyles = (colors: any) =>
  StyleSheet.create({
    main: {
      ...StyleSheet.absoluteFillObject,
      flex: 1,
    },
    backgroundSplash: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
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
    },
    text: {
      color: colors['tvn.text.default'],
      textAlign: 'center',
      fontSize: 14,
      fontWeight: '400',
    },
    versionAndPowered: {
      position: 'absolute',
      bottom: 33,
    },
  });

const SplashScreen = (): JSX.Element => {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  const appVersion = getVersion();

  return (
    <LinearGradient
      start={{ x: 0.5, y: 0.75 }}
      end={{ x: 0, y: 0.25 }}
      colors={[
        // @ts-ignore
        colors['tvn.background.linear1'],
        // @ts-ignore
        colors['tvn.background.linear2'],
      ]}
      style={styles.main}
    >
      <ImageBackground
        source={vectorSplashScreen}
        resizeMode="cover"
        style={styles.backgroundSplash}
      >
        <Image style={styles.paymeLogo} source={logoSplashScreen} />
        <View style={styles.versionAndPowered}>
          <Text style={styles.text}>
            version {appVersion} | Powered by Payme
          </Text>
        </View>
      </ImageBackground>
    </LinearGradient>
  );
};

export default SplashScreen;
