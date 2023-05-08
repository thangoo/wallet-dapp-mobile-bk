import React, { useCallback, useState } from 'react';
import {
  View,
  StyleSheet,
  InteractionManager,
  Text,
  LayoutAnimation,
  ScrollView,
  ActivityIndicator,
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
import HStack from '../../../../app/components/Base/HStack';
import StyledButton from '../StyledButton';
import { SafeAreaView } from 'react-native-safe-area-context';

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
  const tokens = useSelector(
    (state: any) => state.engine.backgroundState.TokensController.tokens,
  );
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [selectedAssets, setSelectedAssets] = useState<any[]>(tokens || []);
  const [loading, setLoading] = useState<boolean>(false);
  const [disable, setDisable] = useState<boolean>(true);

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
      const dataTokens = [...opts.results];
      setSearchResults(dataTokens);
      setSearchQuery(opts.searchQuery);
    },
    [setSearchResults, setSearchQuery],
  );

  const handleSelectAsset = useCallback(
    async (asset) => {
      const { address } = asset;
      const copyAddress = [...selectedAssets];
      const hasAddress = _.includes(_.map(copyAddress, 'address'), address);
      if (hasAddress) {
        _.remove(copyAddress, (obj) => obj.address === address);
        setSelectedAssets(copyAddress);
        if (_.isEqual(copyAddress, tokens)) {
          setDisable(true);
        } else {
          setDisable(false);
        }
      } else {
        setSelectedAssets((prev) => [...prev, asset]);
        setDisable(false);
      }
    },
    [setSelectedAssets, selectedAssets, searchResults],
  );

  const addToken = useCallback(async () => {
    const { TokensController } = Engine.context as any;
    setLoading(true);
    await Promise.all(
      selectedAssets.map(({ address, symbol, decimals }) =>
        TokensController.addToken(address, symbol, decimals),
      ),
    )

      .then(() => {
        // trackEvent(MetaMetricsEvents.TOKEN_ADDED, getAnalyticsParams());

        // Clear state before closing
        setSearchResults([]);
        setSearchQuery('');
        setSelectedAssets([]);

        NotificationManager.showSimpleNotification({
          status: `simple_notification`,
          duration: 5000,
          title: strings('wallet.token_toast.token_imported_title'),
          description: strings('wallet.token_toast.token_imported_desc1'),
        });

        InteractionManager.runAfterInteractions(() => {
          navigation.goBack();
          NotificationManager.showSimpleNotification({
            status: `simple_notification`,
            duration: 5000,
            title: strings('wallet.token_toast.token_imported_title'),
            description: strings('wallet.token_toast.token_imported_desc1'),
          });
        });
      })
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, [selectedAssets, setLoading]);

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
        tokens={tokens}
      />

      <SafeAreaView
        edges={['bottom']}
        style={{ marginHorizontal: 32, marginBottom: 16 }}
      >
        <HStack>
          <StyledButton
            testID={'cancelTestID'}
            type={'signingCancel'}
            onPress={cancelAddToken}
            containerStyle={{ flex: 1 }}
          >
            {strings('add_asset.tokens.cancel_add_token')}
          </StyledButton>
          <View style={{ width: 16 }} />
          <StyledButton
            testID={'confirmTestID'}
            type={'blue'}
            onPress={addToken}
            disabled={loading || disable}
            containerStyle={{ flex: 1 }}
          >
            {loading ? (
              <ActivityIndicator size="small" color={colors.primary.inverse} />
            ) : (
              strings('add_asset.tokens.add_token')
            )}
          </StyledButton>
        </HStack>
      </SafeAreaView>
    </View>
  );
};

export default SearchTokenAutocomplete;
