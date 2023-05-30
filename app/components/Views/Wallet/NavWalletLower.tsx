import React from 'react';
import { Alert, Animated, Image, TouchableOpacity, View } from 'react-native';
import { menu_icon, qr_code_icon } from 'images/index';
import { strings } from '../../../../locales/i18n';
import { trackLegacyEvent, trackEvent } from '../../../util/analyticsV2';
import { MetaMetricsEvents } from '../../../core/Analytics';

import PickerNetwork from './PickerNetwork';
import { importAccountFromPrivateKey } from '../../../util/address';
import DeeplinkManager from '../../../core/DeeplinkManager';
import AppConstants from '../../../core/AppConstants';

interface Props {
  networkName: string;
  networkImageSource: any;
  navigation: any;
  drawerRef: any;
  onPressTitle: () => void;
  themeColors: any;
}

const NavWalletLower = ({
  networkName,
  networkImageSource,
  navigation,
  drawerRef,
  onPressTitle,
  themeColors,
}: Props) => {
  const openDrawer = () => {
    drawerRef.current?.showDrawer?.();
    trackEvent(MetaMetricsEvents.COMMON_TAPS_HAMBURGER_MENU);
  };

  const onScanSuccess = (data: any, content: any) => {
    if (data.private_key) {
      Alert.alert(
        strings('wallet.private_key_detected'),
        strings('wallet.do_you_want_to_import_this_account'),
        [
          {
            text: strings('wallet.cancel'),
            onPress: () => false,
            style: 'cancel',
          },
          {
            text: strings('wallet.yes'),
            onPress: async () => {
              try {
                await importAccountFromPrivateKey(data.private_key);
                navigation.navigate('ImportPrivateKeyView', {
                  screen: 'ImportPrivateKeySuccess',
                });
              } catch (e) {
                Alert.alert(
                  strings('import_private_key.error_title'),
                  strings('import_private_key.error_message'),
                );
              }
            },
          },
        ],
        { cancelable: false },
      );
    } else if (data.seed) {
      Alert.alert(
        strings('wallet.error'),
        strings('wallet.logout_to_import_seed'),
      );
    } else {
      setTimeout(() => {
        DeeplinkManager.parse(content, {
          origin: AppConstants.DEEPLINKS.ORIGIN_QR_CODE,
        });
      }, 500);
    }
  };

  const openQRScanner = () => {
    navigation.navigate('QRScanner', {
      onScanSuccess,
    });
    trackEvent(MetaMetricsEvents.WALLET_QR_SCANNER);
  };
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        alignItems: 'center',
        paddingBottom: 10,
      }}
    >
      <TouchableOpacity onPress={openDrawer}>
        <Image
          source={menu_icon}
          style={{
            tintColor: themeColors.gray10,
            width: 24,
            height: 24,
          }}
        />
      </TouchableOpacity>
      <PickerNetwork
        colors={themeColors}
        label={networkName}
        imageSource={networkImageSource}
        onPress={onPressTitle}
        upper={false}
        // {...generateTestId(Platform, NAVBAR_NETWORK_BUTTON)}
      />
      <TouchableOpacity onPress={openQRScanner}>
        <Image
          source={qr_code_icon}
          style={{
            tintColor: themeColors.gray10,
            width: 24,
            height: 24,
          }}
        />
      </TouchableOpacity>
    </View>
  );
};

export default NavWalletLower;
