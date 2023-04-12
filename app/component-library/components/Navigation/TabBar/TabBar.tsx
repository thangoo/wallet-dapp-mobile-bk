/* eslint-disable react/prop-types */

// Third party dependencies.
import React, { useCallback } from 'react';
import { Alert, Platform, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// External dependencies.
import TabBarItem from '../TabBarItem';
import { useStyles } from '../../../hooks';

// Internal dependencies.
import { TabBarProps } from './TabBar.types';
import styleSheet from './TabBar.styles';
import { ICON_BY_TAB_BAR_ICON_KEY } from './TabBar.constants';
import generateTestId from '../../../../../wdio/utils/generateTestId';
import Routes from '../../../../constants/navigation/Routes';
import { strings } from '../../../../../locales/i18n';
import { importAccountFromPrivateKey } from '../../../../../app/util/address';
import SharedDeeplinkManager from '../../../../../app/core/DeeplinkManager';
import AppConstants from '../../../../../app/core/AppConstants';

const TabBar = ({ state, descriptors, navigation }: TabBarProps) => {
  const { bottom: bottomInset } = useSafeAreaInsets();
  const { styles } = useStyles(styleSheet, { bottomInset });

  const onScanSuccess = (data, content) => {
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
        SharedDeeplinkManager.parse(content, {
          origin: AppConstants.DEEPLINKS.ORIGIN_QR_CODE,
        });
      }, 500);
    }
  };

  const renderTabBarItem = useCallback(
    (route: { name: string; key: string }, index: number) => {
      const { options } = descriptors[route.key];
      const tabBarIconKey = options.tabBarIconKey;
      const label = options.tabBarLabel as string;
      //TODO: use another option on add it to the prop interface
      const callback = options.callback;
      const rootScreenName = options.rootScreenName;
      const key = `tab-bar-item-${label}`;
      const isSelected = state.index === index;
      const icon = ICON_BY_TAB_BAR_ICON_KEY[tabBarIconKey];
      const onPress = () => {
        callback?.();
        switch (rootScreenName) {
          case Routes.WALLET_VIEW:
            navigation.navigate(Routes.WALLET.HOME, {
              screen: Routes.WALLET.TAB_STACK_FLOW,
              params: {
                screen: Routes.WALLET_VIEW,
              },
            });
            break;
          // case Routes.BROWSER_VIEW:
          //   navigation.navigate(Routes.BROWSER.HOME, {
          //     screen: Routes.BROWSER_VIEW,
          //   });
          //   break;
          case Routes.SETTINGS_VIEW:
            navigation.navigate(Routes.SETTINGS_TAB.HOME, {
              screen: Routes.SETTINGS_TAB.TAB_STACK_FLOW,
            });
            break;
          case Routes.SCAN_VIEW:
            navigation.navigate('QRScanner', {
              onScanSuccess,
            });
            break;
        }
      };

      return (
        <TabBarItem
          key={key}
          isSelected={isSelected}
          label={label}
          icon={icon}
          onPress={onPress}
          {...generateTestId(Platform, key)}
        />
      );
    },
    [state, descriptors, navigation],
  );

  const renderTabBarItems = useCallback(
    () => state.routes.map(renderTabBarItem),
    [state, renderTabBarItem],
  );

  return <View style={styles.base}>{renderTabBarItems()}</View>;
};

export default TabBar;
