import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  TouchableOpacity,
  StyleSheet,
  View,
  ScrollView,
  Image,
} from 'react-native';
import { query } from '@metamask/controller-utils';
import { connect } from 'react-redux';
import URL from 'url-parse';

import { fontStyles } from '../../../../styles/common';
import { strings } from '../../../../../locales/i18n';
import {
  getNetworkTypeById,
  findBlockExplorerForRpc,
  getBlockExplorerName,
  isMainNet,
  isMultiLayerFeeNetwork,
} from '../../../../util/networks';
import {
  getEtherscanTransactionUrl,
  getEtherscanBaseUrl,
} from '../../../../util/etherscan';
import { TRANSACTION_TYPES } from '../../../../util/transactions';
import Logger from '../../../../util/Logger';
import EthereumAddress from '../../EthereumAddress';
import TransactionSummary from '../../../Views/TransactionSummary';
import { toDateFormat } from '../../../../util/date';
import StyledButton from '../../StyledButton';
import StatusText from '../../../Base/StatusText';
import Text from '../../../Base/Text';
import DetailsModal from '../../../Base/DetailsModal';
import { RPC, NO_RPC_BLOCK_EXPLORER } from '../../../../constants/network';
import { withNavigation } from '@react-navigation/compat';
import { ThemeContext, mockTheme, useTheme } from '../../../../util/theme';
import Engine from '../../../../core/Engine';
import decodeTransaction from '../../TransactionElement/utils';
import {
  selectChainId,
  selectTicker,
} from '../../../../selectors/networkController';
import HStack from '../../../Base/HStack';
import TokenIcon from '../../Swaps/components/TokenIcon';
import { arrow_right_icon, external_icon, plus_icon } from 'images/index';
import { HeaderBackButton } from '@react-navigation/stack';

const infoIcon = require('../../../../images/transaction-icons/info.png');

const createStyles = (colors) =>
  StyleSheet.create({
    viewOnEtherscan: {
      fontSize: 14,
      color: colors['tvn.primary.default'],
      ...fontStyles.bold,
      textAlign: 'center',
    },
    touchableViewOnEtherscan: {
      marginBottom: 24,
      marginTop: 32,
    },
    summaryWrapper: {
      marginVertical: 8,
    },
    actionContainerStyle: {
      height: 25,
      width: 70,
      padding: 0,
    },
    speedupActionContainerStyle: {
      marginRight: 10,
    },
    actionStyle: {
      fontSize: 10,
      padding: 0,
      paddingHorizontal: 10,
    },
    transactionActionsContainer: {
      flexDirection: 'row',
      paddingTop: 10,
    },
  });

/**
 * View that renders a transaction details as part of transactions list
 */
class TransactionDetails extends PureComponent {
  static propTypes = {
    /**
    /* navigation object required to push new views
    */
    navigation: PropTypes.object,
    /**
     * Chain Id
     */
    chainId: PropTypes.string,
    /**
     * Object representing the selected the selected network
     */
    network: PropTypes.object,
    /**
     * Object corresponding to a transaction, containing transaction object, networkId and transaction hash string
     */
    transactionObject: PropTypes.object,
    /**
     * Object with information to render
     */
    transactionDetails: PropTypes.object,
    /**
     * Frequent RPC list from PreferencesController
     */
    frequentRpcList: PropTypes.array,
    /**
     * Callback to close the view
     */
    close: PropTypes.func,
    /**
     * A string representing the network name
     */
    showSpeedUpModal: PropTypes.func,
    showCancelModal: PropTypes.func,
    transaction: PropTypes.object,
    selectedAddress: PropTypes.string,
    transactions: PropTypes.array,
    ticker: PropTypes.string,
    tokens: PropTypes.object,
    contractExchangeRates: PropTypes.object,
    conversionRate: PropTypes.number,
    currentCurrency: PropTypes.string,
    swapsTransactions: PropTypes.object,
    swapsTokens: PropTypes.array,
    primaryCurrency: PropTypes.string,
  };

  state = {
    rpcBlockExplorer: undefined,
    renderTxActions: true,
    updatedTransactionDetails: undefined,
  };

  fetchTxReceipt = async (transactionHash) => {
    const { TransactionController } = Engine.context;
    return await query(
      TransactionController.ethQuery,
      'getTransactionReceipt',
      [transactionHash],
    );
  };

  viewOnEtherscan = () => {
    const { tx } = this.props.route.params;

    const {
      navigation,
      close,
      network: {
        providerConfig: { type },
      },
    } = this.props;
    const { rpcBlockExplorer } = this.state;
    try {
      if (type === RPC) {
        const url = `${rpcBlockExplorer}/tx/${tx?.transactionHash}`;
        const title = new URL(rpcBlockExplorer).hostname;
        navigation.push('Webview', {
          screen: 'SimpleWebview',
          params: { url, title },
        });
      } else {
        const network = getNetworkTypeById(tx?.networkID);
        const url = getEtherscanTransactionUrl(network, tx?.transactionHash);
        const etherscan_url = getEtherscanBaseUrl(network).replace(
          'https://',
          '',
        );
        navigation.push('Webview', {
          screen: 'SimpleWebview',
          params: {
            url,
            title: etherscan_url,
          },
        });
      }
      close && close();
    } catch (e) {
      // eslint-disable-next-line no-console
      Logger.error(e, {
        message: `can't get a block explorer link for network `,
        networkID,
      });
    }
  };

  updateNavBar = () => {
    const { navigation } = this.props;
    navigation.setOptions({
      title: 'Transfer',
      headerStyle: { backgroundColor: 'white', shadowOpacity: 0 },
      headerLeft: (props) => (
        <HeaderBackButton
          {...props}
          labelVisible={false}
          style={{ marginLeft: 16 }}
          backImage={() => (
            <Image
              source={arrow_right_icon}
              style={{ width: 32, height: 32 }}
            />
          )}
        />
      ),
      headerRight: (props) => (
        <HeaderBackButton
          {...props}
          labelVisible={false}
          onPress={this.viewOnEtherscan}
          style={{ marginRight: 16 }}
          backImage={() => (
            <Image source={external_icon} style={{ width: 32, height: 32 }} />
          )}
        />
      ),
    });
  };

  /**
   * Updates transactionDetails for multilayer fee networks (e.g. for Optimism).
   */
  updateTransactionDetails = async () => {
    const {
      transactionObject,
      transactionDetails,
      selectedAddress,
      ticker,
      chainId,
      conversionRate,
      currentCurrency,
      contractExchangeRates,
      tokens,
      primaryCurrency,
      swapsTransactions,
      swapsTokens,
      transactions,
    } = this.props.route.params;
    const multiLayerFeeNetwork = isMultiLayerFeeNetwork(chainId);
    const transactionHash = transactionDetails?.transactionHash;
    if (
      !multiLayerFeeNetwork ||
      !transactionHash ||
      !transactionObject.transaction
    ) {
      this.setState({ updatedTransactionDetails: transactionDetails });
      return;
    }
    try {
      let { l1Fee: multiLayerL1FeeTotal } = await this.fetchTxReceipt(
        transactionHash,
      );
      if (!multiLayerL1FeeTotal) {
        multiLayerL1FeeTotal = '0x0'; // Sets it to 0 if it's not available in a txReceipt yet.
      }
      transactionObject.transaction.multiLayerL1FeeTotal = multiLayerL1FeeTotal;
      const decodedTx = await decodeTransaction({
        tx: transactionObject,
        selectedAddress,
        ticker,
        chainId,
        conversionRate,
        currentCurrency,
        transactions,
        contractExchangeRates,
        tokens,
        primaryCurrency,
        swapsTransactions,
        swapsTokens,
      });
      this.setState({ updatedTransactionDetails: decodedTx[1] });
    } catch (e) {
      Logger.error(e);
      this.setState({ updatedTransactionDetails: transactionDetails });
    }
  };

  componentDidMount = () => {
    this.updateNavBar();
    const {
      network: {
        providerConfig: { rpcTarget, type },
      },
      frequentRpcList,
    } = this.props;
    let blockExplorer;
    if (type === RPC) {
      blockExplorer =
        findBlockExplorerForRpc(rpcTarget, frequentRpcList) ||
        NO_RPC_BLOCK_EXPLORER;
    }
    this.setState({ rpcBlockExplorer: blockExplorer });
    this.updateTransactionDetails();
  };

  getStyles = () => {
    const colors = this.context.colors || mockTheme.colors;
    return createStyles(colors);
  };

  render = () => {
    const { tx, assetSymbol, transactionDetails } = this.props.route.params;
    const { updatedTransactionDetails } = this.state;
    const colors = this.context.colors || mockTheme.colors;
    const styles = createStyles(colors);

    const RenderTime = (timestamp) => {
      const date = new Date(timestamp);
      const month = strings(`date.months.${date.getMonth()}`);
      const day = date.getDate();
      const nowDate = new Date();
      const nowMonth = strings(`date.months.${nowDate.getMonth()}`);
      const nowDay = nowDate.getDate();

      let hours = date.getHours();
      let minutes = date.getMinutes();
      hours %= 24;
      hours = hours || 24;
      minutes = minutes < 10 ? '0' + minutes : minutes;
      return nowMonth + nowDay == month + day
        ? `Today ${strings('date.connector')} ${hours}:${minutes} `
        : `${month} ${day} ${strings('date.connector')} ${hours}:${minutes} `;
    };
    const RenderStatus = (status) => {
      let statusText;
      switch (status) {
        case 'confirmed':
          statusText = 'Completed';
          break;
        default:
          statusText = 'Completed';
      }
      return statusText;
    };

    const RenderTypeTransaction = (typeTransaction, toOrFrom) => {
      let type;
      switch (typeTransaction) {
        case TRANSACTION_TYPES.SENT_TOKEN:
        case TRANSACTION_TYPES.SENT_COLLECTIBLE:
        case TRANSACTION_TYPES.SENT:
          type = toOrFrom.renderTo;
          break;
        case TRANSACTION_TYPES.RECEIVED_TOKEN:
        case TRANSACTION_TYPES.RECEIVED_COLLECTIBLE:
        case TRANSACTION_TYPES.RECEIVED:
          type = toOrFrom.renderFrom;
          break;
        case TRANSACTION_TYPES.SITE_INTERACTION:
          type = toOrFrom.renderFrom;
          break;
        case TRANSACTION_TYPES.APPROVE:
          type = toOrFrom.renderFrom;
          break;
      }
      return type;
    };

    const { rpcBlockExplorer } = this.state;

    return updatedTransactionDetails ? (
      <ScrollView>
        <HStack
          style={{
            justifyContent: 'center',
            marginTop: 22,
            flexDirection: 'column',
          }}
        >
          <TokenIcon symbol={assetSymbol} style={{ width: 56, height: 56 }} />
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: 16,
            }}
          >
            <Image
              source={plus_icon}
              style={{ width: 24, height: 24, marginRight: 12 }}
            />
            <Text
              style={{
                fontSize: 24,
                color: colors['tvn.gray.10'],
                ...fontStyles.bold,
              }}
            >
              {transactionDetails.summaryAmount}
            </Text>
          </View>
          <Text
            style={{
              fontSize: 14,
              color: colors['tvn.gray.10'],
              ...fontStyles.normal,
            }}
          >
            = {transactionDetails.summarySecondaryTotalAmount}
          </Text>
        </HStack>
        <Item title="Date" content={RenderTime(tx.time)} showIconInfo={false} />
        <Item
          title="Status"
          content={RenderStatus(tx?.status)}
          showIconInfo={true}
        />
        <Item
          title="Sender"
          content={RenderTypeTransaction(
            transactionDetails.transactionType,
            transactionDetails,
          )}
        />
        <Item
          title="Network"
          content={`${transactionDetails.summaryFee} (${transactionDetails.summarySecondaryTotalAmount})`}
          showIconInfo={true}
        />

        {updatedTransactionDetails.transactionHash &&
          tx?.status !== 'cancelled' &&
          rpcBlockExplorer !== NO_RPC_BLOCK_EXPLORER && (
            <TouchableOpacity
              onPress={this.viewOnEtherscan}
              style={styles.touchableViewOnEtherscan}
            >
              <Text reset style={styles.viewOnEtherscan}>
                {(rpcBlockExplorer &&
                  `${strings('transactions.view_on')} ${getBlockExplorerName(
                    rpcBlockExplorer,
                  )}`) ||
                  strings('transactions.view_on_etherscan')}
              </Text>
            </TouchableOpacity>
          )}
      </ScrollView>
    ) : null;
  };
}

const Item = ({ title, content, showIconInfo }) => {
  const { colors } = useTheme();

  return (
    <HStack
      style={{
        justifyContent: 'center',
        alignItems: 'flex-start',
        marginTop: 6,
        flexDirection: 'column',
        paddingHorizontal: 16,
      }}
    >
      <Text
        style={{
          paddingHorizontal: 16,
          paddingVertical: 8,
          fontSize: 16,
          color: colors['tvn.gray.10'],
          ...fontStyles.normal,
        }}
      >
        {title}
      </Text>
      <View
        style={{
          paddingVertical: 12,
          paddingHorizontal: 16,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: colors['tvn.gray.02'],
          width: '100%',
          borderRadius: 16,
        }}
      >
        <Text
          numberOfLines={1}
          ellipsizeMode="middle"
          style={{
            paddingVertical: 8,
            fontSize: 16,
            color: colors['tvn.gray.10'],
            ...fontStyles.normal,
            width: '60%',
          }}
        >
          {content}
        </Text>
        {showIconInfo && <Image source={infoIcon} />}
      </View>
    </HStack>
  );
};

const mapStateToProps = (state) => ({
  network: state.engine.backgroundState.NetworkController,
  chainId: selectChainId(state),
  frequentRpcList:
    state.engine.backgroundState.PreferencesController.frequentRpcList,
  selectedAddress:
    state.engine.backgroundState.PreferencesController.selectedAddress,
  transactions: state.engine.backgroundState.TransactionController.transactions,
  ticker: selectTicker(state),
  tokens: state.engine.backgroundState.TokensController.tokens.reduce(
    (tokens, token) => {
      tokens[token.address] = token;
      return tokens;
    },
    {},
  ),
  contractExchangeRates:
    state.engine.backgroundState.TokenRatesController.contractExchangeRates,
  conversionRate:
    state.engine.backgroundState.CurrencyRateController.conversionRate,
  currentCurrency:
    state.engine.backgroundState.CurrencyRateController.currentCurrency,
  primaryCurrency: state.settings.primaryCurrency,
  swapsTransactions:
    state.engine.backgroundState.TransactionController.swapsTransactions || {},
  swapsTokens: state.engine.backgroundState.SwapsController.tokens,
});

TransactionDetails.contextType = ThemeContext;

export default connect(mapStateToProps)(withNavigation(TransactionDetails));
