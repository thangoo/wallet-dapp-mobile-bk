import React, { useCallback, useState } from 'react';
import {
  View,
  StyleSheet,
  InteractionManager,
  Text,
  LayoutAnimation,
} from 'react-native';
import { strings } from '../../../../locales/i18n';
import ActionView from '../ActionView';
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
import StyledButton from '../StyledButton';

const createStyles = (colors: any) =>
  StyleSheet.create({
    wrapper: {
      backgroundColor: colors.background.default,
      flex: 1,
    },
    listTokenWrapper: {
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
  onChangeCustomToken: any;
}

/**
 * Component that provides ability to add searched assets with metadata.
 */
const SearchTokenAutocomplete = ({
  navigation,
  onChangeCustomToken,
}: Props) => {
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAsset, setSelectedAsset] = useState({});
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const { address, symbol, decimals, image } = selectedAsset as any;
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

  const getAnalyticsParams = useCallback(() => {
    try {
      return {
        token_address: address,
        token_symbol: symbol,
        chain_id: chainId,
        source: 'Add token dropdown',
      };
    } catch (error) {
      return {};
    }
  }, [address, symbol, chainId]);

  const cancelAddToken = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  // Handle UI and don't search anything
  const handleSearch = useCallback(
    (opts: any) => {
      setSearchResults(opts.results);
      setSearchQuery(opts.searchQuery);
    },
    [setSearchResults, setSearchQuery],
  );

  const addToken = useCallback(async () => {
    const { TokensController } = Engine.context as any;
    await TokensController.addToken(address, symbol, decimals, image);

    trackEvent(MetaMetricsEvents.TOKEN_ADDED, getAnalyticsParams());

    // Clear state before closing
    // setSearchResults([]);
    // setSearchQuery('');
    setSelectedAsset({});

    NotificationManager.showSimpleNotification({
      status: `simple_notification`,
      duration: 5000,
      title: strings('wallet.token_toast.token_imported_title'),
      description: strings('wallet.token_toast.token_imported_desc', {
        tokenSymbol: symbol,
      }),
    });

    // InteractionManager.runAfterInteractions(() => {
    //   navigation.goBack();
    //   NotificationManager.showSimpleNotification({
    //     status: `simple_notification`,
    //     duration: 5000,
    //     title: strings('wallet.token_toast.token_imported_title'),
    //     description: strings('wallet.token_toast.token_imported_desc', {
    //       tokenSymbol: symbol,
    //     }),
    //   });
    // });
  }, [
    address,
    symbol,
    decimals,
    image,
    setSearchResults,
    setSearchQuery,
    setSelectedAsset,
    navigation,
    getAnalyticsParams,
  ]);

  const handleToggleAsset = useCallback(
    (asset, isSelected) => {
      setSelectedAsset(asset);
      addToken();
    },
    [setSelectedAsset, addToken],
  );

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
      <AssetSearch
        onSearch={handleSearch}
        onFocus={() => {
          setFocusState(true);
        }}
        onBlur={() => setFocusState(false)}
      />
      <AssetList
        searchResults={searchResults}
        handleToggleAsset={handleToggleAsset}
        selectedAsset={selectedAsset}
        searchQuery={searchQuery}
        // selectedTokens={selectedTokens}
      />
      {/* <ActionView
        // cancelText={strings('add_asset.tokens.cancel_add_token')}
        // onCancelPress={cancelAddToken}
        showCancelButton={false}
        confirmText={strings('add_asset.tokens.add_new_token')}
        confirmButtonMode={'confirm'}
        onConfirmPress={onChangeCustomToken}
        isFullScreen
        // confirmDisabled={!(address && symbol && decimals)}
      >
        <View style={styles.listTokenWrapper}>
          {renderTokenDetectionBanner()}
         
          <StyledButton
              type={'blue'}
              onPress={addToken}
              testID={'continue-button'}
              // disabled={!canSubmit}
              disabledContainerStyle={{
                backgroundColor: colors['tvn.dark_gray_blue'],
              }}
              containerStyle={{marginHorizontal:16, marginBottom:16}}
            > 
              {strings('manual_backup_step_1.continue')}
            </StyledButton>
        </View>
      </ActionView> */}
    </View>
  );
};

export default SearchTokenAutocomplete;
