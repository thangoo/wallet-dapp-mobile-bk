import React, { PureComponent } from 'react';
import {
  InteractionManager,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
  Image,
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { swapsUtils } from '@metamask/swaps-controller';
import { MetaMetricsEvents } from '../../../core/Analytics';
import AppConstants from '../../../core/AppConstants';
import AssetActionButton from '../AssetActionButton';
import TokenImage from '../../UI/TokenImage';
import { fontStyles } from '../../../styles/common';
import { strings } from '../../../../locales/i18n';
import { setReceiveAsset, toggleReceiveModal } from '../../../actions/modals';
import {
  renderFromTokenMinimalUnit,
  balanceToFiat,
  renderFromWei,
  weiToFiat,
  hexToBN,
  renderFiat,
} from '../../../util/number';
import { trackLegacyEvent } from '../../../util/analyticsV2';
import { safeToChecksumAddress } from '../../../util/address';
import { getEther } from '../../../util/transactions';
import { newAssetTransaction } from '../../../actions/transaction';
import { isSwapsAllowed } from '../Swaps/utils';
import {
  swapsLivenessSelector,
  swapsTokensObjectSelector,
} from '../../../reducers/swaps';
import { getTokenList } from '../../../reducers/tokens';
import Engine from '../../../core/Engine';
import Logger from '../../../util/Logger';
import { allowedToBuy } from '../FiatOnRampAggregator';
import AssetSwapButton from '../Swaps/components/AssetSwapButton';
import NetworkMainAssetLogo from '../NetworkMainAssetLogo';
import { ThemeContext, mockTheme } from '../../../util/theme';
import Routes from '../../../constants/navigation/Routes';
import { isTestNet } from '../../../util/networks';
import {
  selectChainId,
  selectTicker,
} from '../../../selectors/networkController';
import { createWebviewNavDetails } from '../../Views/SimpleWebview';
import generateTestId from '../../../../wdio/utils/generateTestId';
import { TOKEN_ASSET_OVERVIEW } from '../../../../wdio/screen-objects/testIDs/Screens/TokenOverviewScreen.testIds';
import { send_plane } from 'images/index';

const createStyles = (colors) =>
  StyleSheet.create({
    wrapper: {
      flex: 1,
      padding: 20,
      // borderBottomWidth: StyleSheet.hairlineWidth,
      // borderBottomColor: colors.border.muted,
      // alignContent: 'center',
      // alignItems: 'center',
      // paddingBottom: 30,
      backgroundColor: 'transparent',
    },
    wrapperAsset:{
      alignItems: 'center',
    },
    assetLogo: {
      marginTop: 15,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 50,
      marginBottom: 10,
      width: 48,
      height: 48,
      backgroundColor: colors.tText.light,
    },
    ethLogo: {
      width: 70,
      height: 70,
    },
    imgAsset: {
      width: 28,
      height: 32,
    },
    balance: {
      alignItems: 'center',
      marginTop: 10,
      marginBottom: 20,
    },
    amount: {
      fontSize: 32,
      color: colors.tText.light,
      ...fontStyles.bold,
      textTransform: 'uppercase',
    },
    testNetAmount: {
      fontSize: 32,
      color: colors.tText.light,
      ...fontStyles.bold,
    },
    amountFiat: {
      fontSize: 14,
      color: colors.tText.light,
      ...fontStyles.normal,
      textTransform: 'uppercase',
    },
    actions: {
      flex: 1,
      justifyContent: 'space-evenly',
      alignItems: 'center',
      flexDirection: 'row',
      paddingHorizontal: 22,
      marginTop: 31,
    },
    warning: {
      borderRadius: 8,
      color: colors.text.default,
      ...fontStyles.normal,
      fontSize: 14,
      lineHeight: 20,
      borderWidth: 1,
      borderColor: colors.warning.default,
      backgroundColor: colors.warning.muted,
      padding: 20,
    },
    warningLinks: {
      color: colors.primary.default,
    },
    secondaryBalanceStyle: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-around',
      width: '100%',
      marginTop: 11,
      paddingHorizontal: 62,
    },
    divider: {
      width: 1,
      height: 24,
      backgroundColor: colors.tText.light,
      opacity: 0.3
    },
  });

/**
 * View that displays the information of a specific asset (Token or ETH)
 * including the overview (Amount, Balance, Symbol, Logo)
 */
class AssetOverview extends PureComponent {
  static propTypes = {
    /**
     * Map of accounts to information objects including balances
     */
    accounts: PropTypes.object,
    /**
    /* navigation object required to access the props
    /* passed by the parent component
    */
    navigation: PropTypes.object,
    /**
     * Object that represents the asset to be displayed
     */
    asset: PropTypes.object,
    /**
     * ETH to current currency conversion rate
     */
    conversionRate: PropTypes.number,
    /**
     * Currency code of the currently-active currency
     */
    currentCurrency: PropTypes.string,
    /**
     * A string that represents the selected address
     */
    selectedAddress: PropTypes.string,
    /**
     * Start transaction with asset
     */
    newAssetTransaction: PropTypes.func,
    /**
     * An object containing token balances for current account and network in the format address => balance
     */
    tokenBalances: PropTypes.object,
    /**
     * An object containing token exchange rates in the format address => exchangeRate
     */
    tokenExchangeRates: PropTypes.object,
    /**
     * Action that toggles the receive modal
     */
    toggleReceiveModal: PropTypes.func,
    /**
     * Primary currency, either ETH or Fiat
     */
    setReceiveAsset: PropTypes.func,
    /**
     * Primary currency, either ETH or Fiat
     */
    primaryCurrency: PropTypes.string,
    /**
     * Chain id
     */
    chainId: PropTypes.string,
    /**
     * Wether Swaps feature is live or not
     */
    swapsIsLive: PropTypes.bool,
    /**
     * Object that contains swaps tokens addresses as key
     */
    swapsTokens: PropTypes.object,
    /**
     * Network ticker
     */
    ticker: PropTypes.string,
    /**
     * Object that contains tokens by token addresses as key
     */
    tokenList: PropTypes.object,
  };

  onReceive = () => {
    const { asset } = this.props;
    this.props.toggleReceiveModal(asset);
  };

  onBuy = () => {
    this.props.navigation.navigate(Routes.FIAT_ON_RAMP_AGGREGATOR.ID);
    InteractionManager.runAfterInteractions(() => {
      trackLegacyEvent(MetaMetricsEvents.BUY_BUTTON_CLICKED, {
        text: 'Buy',
        location: 'Token Screen',
        chain_id_destination: this.props.chainId,
      });
    });
  };

  onSend = async () => {
    const { asset, ticker } = this.props;
    if (asset.isETH) {
      this.props.newAssetTransaction(getEther(ticker));
      this.props.navigation.navigate('SendFlowView');
    } else {
      this.props.newAssetTransaction(asset);
      this.props.navigation.navigate('SendFlowView');
    }
  };

  goToSwaps = () => {
    this.props.navigation.navigate('Swaps', {
      screen: 'SwapsAmountView',
      params: {
        sourceToken: this.props.asset.isETH
          ? swapsUtils.NATIVE_SWAPS_TOKEN_ADDRESS
          : this.props.asset.address,
      },
    });
  };

  goToBrowserUrl(url) {
    this.props.navigation.navigate(
      ...createWebviewNavDetails({
        url,
      }),
    );
  }

  renderLogo = () => {
    const { tokenList, asset } = this.props;
    const colors = this.context.colors || mockTheme.colors;
    const styles = createStyles(colors);

    return asset.isETH ? (
      <NetworkMainAssetLogo biggest style={styles.imgAsset} />
    ) : (
      <TokenImage asset={asset} tokenList={tokenList} />
    );
  };

  componentDidMount = async () => {
    const { SwapsController } = Engine.context;
    try {
      await SwapsController.fetchTokenWithCache();
    } catch (error) {
      Logger.error(
        error,
        'Swaps: error while fetching tokens with cache in AssetOverview',
      );
    }
  };

  renderWarning = () => {
    const {
      asset: { symbol },
    } = this.props;
    const colors = this.context.colors || mockTheme.colors;
    const styles = createStyles(colors);

    return (
      <TouchableOpacity
        onPress={() => this.goToBrowserUrl(AppConstants.URLS.TOKEN_BALANCE)}
      >
        <Text style={styles.warning}>
          {strings('asset_overview.were_unable')} {symbol}{' '}
          {strings('asset_overview.balance')}{' '}
          <Text style={styles.warningLinks}>
            {strings('asset_overview.troubleshooting_missing')}
          </Text>{' '}
          {strings('asset_overview.for_help')}
        </Text>
      </TouchableOpacity>
    );
  };

  render() {
    const {
      accounts,
      asset: {
        address,
        isETH = undefined,
        decimals,
        symbol,
        balanceError = null,
      },
      primaryCurrency,
      selectedAddress,
      tokenExchangeRates,
      tokenBalances,
      conversionRate,
      currentCurrency,
      chainId,
      swapsIsLive,
      swapsTokens,
    } = this.props;
    const colors = this.context.colors || mockTheme.colors;
    const styles = createStyles(colors);

    let mainBalance, secondaryBalance;
    const itemAddress = safeToChecksumAddress(address);
    let balance, balanceFiat;

    if (isETH) {
      balance = renderFromWei(
        accounts[selectedAddress] && accounts[selectedAddress].balance,
      );
      balanceFiat = weiToFiat(
        hexToBN(accounts[selectedAddress].balance),
        conversionRate,
        currentCurrency,
      );
    } else {
      const exchangeRate =
        itemAddress in tokenExchangeRates
          ? tokenExchangeRates[itemAddress]
          : undefined;
      balance =
        itemAddress in tokenBalances
          ? renderFromTokenMinimalUnit(tokenBalances[itemAddress], decimals)
          : 0;
      balanceFiat = balanceToFiat(
        balance,
        conversionRate,
        exchangeRate,
        currentCurrency,
      );
    }
    // choose balances depending on 'primaryCurrency'
    if (primaryCurrency === 'ETH') {
      mainBalance = `${balance} ${symbol}`;
      secondaryBalance = balanceFiat;
    } else {
      mainBalance = !balanceFiat ? `${balance} ${symbol}` : balanceFiat;
      secondaryBalance = !balanceFiat ? balanceFiat : `${balance} ${symbol}`;
    }

    return (
      <View
        style={styles.wrapper}
        {...generateTestId(Platform, TOKEN_ASSET_OVERVIEW)}
      >
        <View style={styles.wrapperAsset}>
          <View style={styles.assetLogo}>{this.renderLogo()}</View>
          <View style={styles.balance}>
            {balanceError ? (
              this.renderWarning()
            ) : (
              <>
                <Text
                  style={
                    isTestNet(chainId) ? styles.testNetAmount : styles.amount
                  }
                  testID={'token-amount'}
                >
                  {mainBalance}
                </Text>
                {secondaryBalance && (
                  <View style={styles.secondaryBalanceStyle}>
                    <Text style={styles.amountFiat}>
                      = {renderFiat(conversionRate, currentCurrency, 2)}
                    </Text>
                    <View style={styles.divider} />
                    <Text style={styles.amountFiat}>{secondaryBalance}</Text>
                    <Text style={styles.amountFiat}>0%</Text>
                    <View style={styles.divider} />
                    <Text style={styles.amountFiat}>{'COIN'}</Text>
                  </View>
                )}
              </>
            )}
          </View>
        </View>
        {!balanceError && (
          <View style={styles.actions}>
            <AssetActionButton
              icon={'receive'}
              onPress={this.onReceive}
              label={strings('asset_overview.receive_button')}
            />
            <AssetActionButton
              testID={'token-send-button'}
              icon="send"
              onPress={this.onSend}
              label={strings('asset_overview.send_button')}
            />
            {isETH && allowedToBuy(chainId) && (
              <AssetActionButton
                icon="buy"
                onPress={this.onBuy}
                label={strings('asset_overview.buy_button')}
              />
            )}

            {AppConstants.SWAPS.ACTIVE && (
              <AssetSwapButton
                isFeatureLive={swapsIsLive}
                isNetworkAllowed={isSwapsAllowed(chainId)}
                isAssetAllowed={isETH || address?.toLowerCase() in swapsTokens}
                onPress={this.goToSwaps}
              />
            )}
          </View>
        )}
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  accounts: state.engine.backgroundState.AccountTrackerController.accounts,
  conversionRate:
    state.engine.backgroundState.CurrencyRateController.conversionRate,
  currentCurrency:
    state.engine.backgroundState.CurrencyRateController.currentCurrency,
  primaryCurrency: state.settings.primaryCurrency,
  selectedAddress:
    state.engine.backgroundState.PreferencesController.selectedAddress,
  tokenBalances:
    state.engine.backgroundState.TokenBalancesController.contractBalances,
  tokenExchangeRates:
    state.engine.backgroundState.TokenRatesController.contractExchangeRates,
  chainId: selectChainId(state),
  ticker: selectTicker(state),
  swapsIsLive: swapsLivenessSelector(state),
  swapsTokens: swapsTokensObjectSelector(state),
  tokenList: getTokenList(state),
});

const mapDispatchToProps = (dispatch) => ({
  toggleReceiveModal: (asset) => dispatch(toggleReceiveModal(asset)),
  newAssetTransaction: (selectedAsset) =>
    dispatch(newAssetTransaction(selectedAsset)),
  setReceiveAsset: (asset) => dispatch(setReceiveAsset(asset)),
});

AssetOverview.contextType = ThemeContext;

export default connect(mapStateToProps, mapDispatchToProps)(AssetOverview);
