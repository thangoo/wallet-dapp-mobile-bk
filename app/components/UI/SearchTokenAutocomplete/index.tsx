import React, { useCallback, useState } from 'react';
import {
  View,
  StyleSheet,
  InteractionManager,
  Text,
  LayoutAnimation,
} from 'react-native';
import { strings } from '../../../../locales/i18n';
import AssetSearch from '../AssetSearch';
import AssetList from '../AssetList';
import Engine from '../../../core/Engine';
import { MetaMetricsEvents } from '../../../core/Analytics';
import { trackEvent } from '../../../util/analyticsV2';
import Alert, { AlertType } from '../../Base/Alert';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useSelector } from 'react-redux';
import { FORMATTED_NETWORK_NAMES } from '../../../constants/on-ramp';
import NotificationManager from '../../../core/NotificationManager';
import { useTheme } from '../../../util/theme';
import { selectChainId } from '../../../selectors/networkController';
import _ from 'lodash';
import WrapActionView from './WrapActionView';

const createStyles = (colors: any) =>
  StyleSheet.create({
    wrapper: {
      backgroundColor: colors.background.default,
      flex: 1,
    },
    tokenDetectionBanner: {
      marginHorizontal: 20,
      marginTop: 20,
      paddingRight: 0,
    },
    tokenDetectionDescription: { color: colors.text.default },
    tokenDetectionLink: { color: colors.primary.default },
    tokenDetectionIcon: {
      paddingTop: 4,
      paddingRight: 8,
    },
  });

interface Props {
  /**
	/* navigation object required to push new views
	*/
  navigation: any;
}

/**
 * Component that provides ability to add searched assets with metadata.
 */
const SearchTokenAutocomplete = ({ navigation }: Props) => {
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [selectedAssets, setSelectedAssets] = useState<any[]>([]);
  const [selectedAssetsCopy, setSelectedAssetsCopy] = useState<any[]>([]);

  const { colors } = useTheme();
  const styles = createStyles(colors);

  const isTokenDetectionEnabled = useSelector(
    (state: any) =>
      state.engine.backgroundState.PreferencesController.useTokenDetection,
  );
  const chainId = useSelector(selectChainId);

  const setFocusState = useCallback(
    (isFocused: boolean) => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setIsSearchFocused(isFocused);
    },
    [setIsSearchFocused],
  );

  // const getAnalyticsParams = useCallback(() => {
  //   try {
  //     return {
  //       token_address: address,
  //       token_symbol: symbol,
  //       chain_id: chainId,
  //       source: 'Add token dropdown',
  //     };
  //   } catch (error) {
  //     return {};
  //   }
  // }, [address, symbol, chainId]);

  const cancelAddToken = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleSearch = useCallback(
    (opts: any) => {
      setSearchResults(opts.results);
      setSearchQuery(opts.searchQuery);
    },
    [setSearchResults, setSearchQuery],
  );

  const handleSelectAsset = useCallback(
    (asset) => {
      setSelectedAssetsCopy({ ...selectedAssets });
      console.log(selectedAssetsCopy);
      const { address } = asset;
      const hasAddress = _.includes(selectedAssetsCopy, address);

      if (hasAddress) {
        setSelectedAssets(selectedAssets.filter((i) => i?.address !== address));
      } else {
        setSelectedAssets((prev) => [...prev, asset]);
      }
    },
    [setSelectedAssets, selectedAssetsCopy, setSelectedAssetsCopy],
  );

  const addToken = useCallback(async () => {
    const { TokensController } = Engine.context as any;
    await Promise.all(
      selectedAssets.map(({ address, symbol, decimals }) =>
        TokensController.addToken(address, symbol, decimals),
      ),
    );

    // trackEvent(MetaMetricsEvents.TOKEN_ADDED, getAnalyticsParams());

    // Clear state before closing
    setSearchResults([]);
    setSearchQuery('');
    setSelectedAssets([]);

    NotificationManager.showSimpleNotification({
      status: `simple_notification`,
      duration: 5000,
      title: strings('wallet.token_toast.token_imported_title'),
      // description: strings('wallet.token_toast.token_imported_desc', {
      //   tokenSymbol: 'symbol',
      // }),
    });

    InteractionManager.runAfterInteractions(() => {
      navigation.goBack();
      NotificationManager.showSimpleNotification({
        status: `simple_notification`,
        duration: 5000,
        title: strings('wallet.token_toast.token_imported_title'),
        // description: strings('wallet.token_toast.token_imported_desc', {
        //   tokenSymbol: 'symbol',
        // }),
      });
    });
  }, [selectedAssets]);

  const renderTokenDetectionBanner = useCallback(() => {
    if (isTokenDetectionEnabled || isSearchFocused) {
      return null;
    }
    return (
      <Alert
        type={AlertType.Info}
        style={styles.tokenDetectionBanner}
        renderIcon={() => (
          <FontAwesome
            style={styles.tokenDetectionIcon}
            name={'exclamation-circle'}
            color={colors.primary.default}
            size={18}
          />
        )}
      >
        <>
          <Text style={styles.tokenDetectionDescription}>
            {strings('add_asset.banners.search_desc', {
              network: FORMATTED_NETWORK_NAMES[chainId],
            })}
          </Text>
          <Text
            suppressHighlighting
            onPress={() => {
              navigation.navigate('SettingsView', {
                screen: 'SettingsFlow',
                params: {
                  screen: 'AdvancedSettings',
                  params: {
                    scrollToBottom: true,
                  },
                },
              });
            }}
            style={styles.tokenDetectionLink}
          >
            {strings('add_asset.banners.search_link')}
          </Text>
        </>
      </Alert>
    );
  }, [
    navigation,
    isSearchFocused,
    isTokenDetectionEnabled,
    colors,
    styles,
    chainId,
  ]);

  return (
    <View style={styles.wrapper} testID={'search-token-screen'}>
      <WrapActionView
        cancelText={strings('add_asset.tokens.cancel_add_token')}
        confirmText={strings('add_asset.tokens.add_token')}
        onCancelPress={cancelAddToken}
        onConfirmPress={addToken}
        confirmButtonMode="confirm"
        // confirmDisabled={!(address && symbol && decimals)}
      >
        <View>
          {renderTokenDetectionBanner()}
          <AssetSearch
            onSearch={handleSearch}
            onFocus={() => {
              setFocusState(true);
            }}
            onBlur={() => setFocusState(false)}
          />
          <AssetList
            searchResults={searchResults}
            handleSelectAsset={handleSelectAsset}
            selectedAsset={selectedAssets}
            searchQuery={searchQuery}
          />
        </View>
      </WrapActionView>
    </View>
  );
};

export default SearchTokenAutocomplete;
