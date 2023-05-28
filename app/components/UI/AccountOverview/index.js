import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  ScrollView,
  TextInput,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  InteractionManager,
  Platform,
} from 'react-native';
import { swapsUtils } from '@metamask/swaps-controller';
import { connect } from 'react-redux';
import Engine from '../../../core/Engine';
import { MetaMetricsEvents } from '../../../core/Analytics';
import AppConstants from '../../../core/AppConstants';
import { strings } from '../../../../locales/i18n';
import { trackLegacyEvent } from '../../../util/analyticsV2';

import { swapsLivenessSelector } from '../../../reducers/swaps';
import { showAlert } from '../../../actions/alert';
import { protectWalletModalVisible } from '../../../actions/user';
import { toggleReceiveModal } from '../../../actions/modals';
import { newAssetTransaction } from '../../../actions/transaction';
import Device from '../../../util/device';
import { renderFiat } from '../../../util/number';
import { isQRHardwareAccount, renderAccountName } from '../../../util/address';
import { getEther } from '../../../util/transactions';
import {
  doENSReverseLookup,
  isDefaultAccountName,
} from '../../../util/ENSUtils';
import { isSwapsAllowed } from '../Swaps/utils';

import Identicon from '../Identicon';
import AssetActionButton from '../AssetActionButton';
import EthereumAddress from '../EthereumAddress';
import { fontStyles, baseStyles } from '../../../styles/common';
import { allowedToBuy } from '../FiatOnRampAggregator';
import AssetSwapButton from '../Swaps/components/AssetSwapButton';
import ClipboardManager from '../../../core/ClipboardManager';
import { ThemeContext, mockTheme } from '../../../util/theme';
import Routes from '../../../constants/navigation/Routes';
import generateTestId from '../../../../wdio/utils/generateTestId';
import {
  WALLET_ACCOUNT_ICON,
  WALLET_ACCOUNT_NAME_LABEL_TEXT,
  WALLET_ACCOUNT_NAME_LABEL_INPUT,
} from '../../../../wdio/screen-objects/testIDs/Screens/WalletView.testIds';
import {
  selectChainId,
  selectNetwork,
  selectTicker,
} from '../../../selectors/networkController';

import { createAccountSelectorNavDetails } from '../../Views/AccountSelector';
const createStyles = (colors) =>
  StyleSheet.create({
    scrollView: {
      // backgroundColor: colors.background.default,
      backgroundColor: 'transparent',
    },
    wrapper: {
      paddingTop: 10,
      paddingHorizontal: 20,
      paddingBottom: 0,
      alignItems: 'center',
      zIndex: 2,
    },
    info: {
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
    },
    data: {
      textAlign: 'center',
    },
    label: {
      fontSize: 24,
      textAlign: 'center',
      ...fontStyles.normal,
      color: colors.text.default,
    },
    labelInput: {
      marginBottom: Device.isAndroid() ? -10 : 0,
    },
    labelWrapper: {
      // flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    tag: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 2,
      padding: 4,
      paddingHorizontal: 8,
      borderWidth: 1,
      borderColor: colors.text.default,
      height: 28,
      borderRadius: 14,
    },
    tagText: {
      fontSize: 12,
      ...fontStyles.bold,
      minWidth: 32,
      textAlign: 'center',
      color: colors.text.default,
    },
    addressWrapper: {
      backgroundColor: colors.tText.light,
      borderRadius: 12,
      marginTop: 10,
      marginBottom: 20,
      paddingVertical: 4,
      paddingHorizontal: 16,
    },
    address: {
      fontSize: 12,
      color: colors.tText.fourth,
      ...fontStyles.normal,
      letterSpacing: 0.8,
    },
    amountFiat: {
      fontSize: 40,
      color: colors.tText.light,
      ...fontStyles.bold,
    },
    amountSubFiat: {
      fontSize: 14,
      paddingVertical: 8,
      color: colors.tText.light,
      ...fontStyles.normal,
    },
    identiconBorder: {
      borderRadius: 80,
      borderWidth: 2,
      padding: 2,
      borderColor: colors.primary.default,
    },
    onboardingWizardLabel: {
      borderWidth: 2,
      borderRadius: 4,
      paddingVertical: Device.isIos() ? 2 : -4,
      paddingHorizontal: Device.isIos() ? 5 : 5,
      top: Device.isIos() ? 0 : -2,
      fontSize: 14,
      color: colors.tText.light,
      ...fontStyles.normal,
    },
    actions: {
      flex: 1,
      justifyContent: 'space-between',
      // alignItems: 'flex-start',
      flexDirection: 'row',
      // marginTop: 48,
    },
    actionIcon: {
      marginLeft: 15,
    },
  });

/**
 * View that's part of the <Wallet /> component
 * which shows information about the selected account
 */
class AccountOverview extends PureComponent {
  static propTypes = {
    /**
     * String that represents the selected address
     */
    selectedAddress: PropTypes.string,
    /**
    /* Identities object required to get account name
    */
    identities: PropTypes.object,
    /**
     * Object that represents the selected account
     */
    account: PropTypes.object,
    /**
    /* Selected currency
    */
    currentCurrency: PropTypes.string,
    /**
    /* Triggers global alert
    */
    showAlert: PropTypes.func,
    /**
     * whether component is being rendered from onboarding wizard
     */
    onboardingWizard: PropTypes.bool,
    /**
     * Used to get child ref
     */
    onRef: PropTypes.func,
    /**
     * Prompts protect wallet modal
     */
    protectWalletModalVisible: PropTypes.func,
    /**
     * Start transaction with asset
     */
    newAssetTransaction: PropTypes.func,
    /**
    /* navigation object required to access the props
    /* passed by the parent component
    */
    navigation: PropTypes.object,
    /**
     * Action that toggles the receive modal
     */
    toggleReceiveModal: PropTypes.func,
    /**
     * Chain id
     */
    chainId: PropTypes.string,
    /**
     * Wether Swaps feature is live or not
     */
    swapsIsLive: PropTypes.bool,
    /**
     * ID of the current network
     */
    network: PropTypes.string,
    /**
     * Current provider ticker
     */
    ticker: PropTypes.string,
    /**
     * Current token
     */
    token: PropTypes.array,
  };
  state = {
    accountLabelEditable: false,
    accountLabel: '',
    originalAccountLabel: '',
    ens: undefined,
  };

  editableLabelRef = React.createRef();
  scrollViewContainer = React.createRef();
  mainView = React.createRef();

  openAccountSelector = () => {
    const { onboardingWizard, navigation } = this.props;
    !onboardingWizard &&
      navigation.navigate(...createAccountSelectorNavDetails({}));
  };

  isAccountLabelDefined = (accountLabel) =>
    !!accountLabel && !!accountLabel.trim().length;

  input = React.createRef();

  componentDidMount = () => {
    const { identities, selectedAddress, onRef } = this.props;
    const accountLabel = renderAccountName(selectedAddress, identities);
    this.setState({ accountLabel });
    onRef && onRef(this);
    InteractionManager.runAfterInteractions(() => {
      this.doENSLookup();
    });

    const { PreferencesController } = Engine.context;
    if (!this.isAccountLabelDefined(accountLabel)) {
      PreferencesController.setAccountLabel(selectedAddress, 'Account');
    }
  };

  componentDidUpdate(prevProps) {
    if (
      prevProps.account.address !== this.props.account.address ||
      prevProps.network !== this.props.network
    ) {
      requestAnimationFrame(() => {
        this.doENSLookup();
      });
    }
  }

  setAccountLabel = () => {
    const { PreferencesController } = Engine.context;
    const { selectedAddress } = this.props;
    const { accountLabel } = this.state;

    const lastAccountLabel =
      PreferencesController.state.identities[selectedAddress].name;

    PreferencesController.setAccountLabel(
      selectedAddress,
      this.isAccountLabelDefined(accountLabel)
        ? accountLabel
        : lastAccountLabel,
    );
    this.setState({ accountLabelEditable: false });
  };

  onAccountLabelChange = (accountLabel) => {
    this.setState({ accountLabel });
  };

  setAccountLabelEditable = () => {
    const { identities, selectedAddress } = this.props;
    const accountLabel = renderAccountName(selectedAddress, identities);
    this.setState({ accountLabelEditable: true, accountLabel });
    setTimeout(() => {
      this.input && this.input.current && this.input.current.focus();
    }, 100);
  };

  cancelAccountLabelEdition = () => {
    const { identities, selectedAddress } = this.props;
    const accountLabel = renderAccountName(selectedAddress, identities);
    this.setState({ accountLabelEditable: false, accountLabel });
  };

  copyAccountToClipboard = async () => {
    const { selectedAddress } = this.props;
    await ClipboardManager.setString(selectedAddress);
    this.props.showAlert({
      isVisible: true,
      autodismiss: 1500,
      content: 'clipboard-alert',
      data: { msg: strings('account_details.account_copied_to_clipboard') },
    });
    setTimeout(() => this.props.protectWalletModalVisible(), 2000);
    InteractionManager.runAfterInteractions(() => {
      trackLegacyEvent(MetaMetricsEvents.WALLET_COPIED_ADDRESS);
    });
  };

  // onReceive = () => this.props.toggleReceiveModal();
  // onReceive = () => this.props.navigation.navigate('ReceiveScreen');

  onReceive = () => {
    const { token } = this.props;
    this.props.navigation.navigate('ReceivedCryptoScreen', {
      ...token,
    });
  };

  onSend = () => {
    const { newAssetTransaction, navigation, ticker } = this.props;
    newAssetTransaction(getEther(ticker));
    navigation.navigate('SendFlowView');
  };

  onBuy = () => {
    this.props.navigation.navigate(Routes.FIAT_ON_RAMP_AGGREGATOR.ID);
    InteractionManager.runAfterInteractions(() => {
      trackLegacyEvent(MetaMetricsEvents.BUY_BUTTON_CLICKED, {
        text: 'Buy',
        location: 'Wallet',
        chain_id_destination: this.props.chainId,
      });
    });
  };

  goToSwaps = () =>
    this.props.navigation.navigate('Swaps', {
      screen: 'SwapsAmountView',
      params: {
        sourceToken: swapsUtils.NATIVE_SWAPS_TOKEN_ADDRESS,
      },
    });

  doENSLookup = async () => {
    const { network, account } = this.props;
    try {
      const ens = await doENSReverseLookup(account.address, network);
      this.setState({ ens });
      // eslint-disable-next-line no-empty
    } catch {}
  };

  render() {
    const {
      account: { address, name },
      currentCurrency,
      onboardingWizard,
      chainId,
      swapsIsLive,
    } = this.props;
    const colors = this.context.colors || mockTheme.colors;
    const themeAppearance = this.context.themeAppearance || 'light';
    const styles = createStyles(colors);

    const fiatBalance = `${renderFiat(
      Engine.getTotalFiatAccountBalance(),
      currentCurrency,
    )}`;

    if (!address) return null;
    const { accountLabelEditable, accountLabel, ens } = this.state;

    const isQRHardwareWalletAccount = isQRHardwareAccount(address);

    return (
      <View
        style={baseStyles.flexGrow}
        ref={this.scrollViewContainer}
        collapsable={false}
      >
        <ScrollView
          bounces={false}
          keyboardShouldPersistTaps={'never'}
          style={styles.scrollView}
          contentContainerStyle={styles.wrapper}
          testID={'account-overview'}
        >
          <View style={styles.info} ref={this.mainView}>
            {/* <TouchableOpacity
              style={styles.identiconBorder}
              disabled={onboardingWizard}
              onPress={this.openAccountSelector}
              {...generateTestId(Platform, WALLET_ACCOUNT_ICON)}
            >
              <Identicon
                address={address}
                diameter={38}
                noFadeIn={onboardingWizard}
              />
            </TouchableOpacity> */}
            <Text style={styles.amountFiat}>{fiatBalance}</Text>
            <View
              ref={this.editableLabelRef}
              style={styles.data}
              collapsable={false}
            >
              {accountLabelEditable ? (
                <TextInput
                  style={[
                    styles.label,
                    styles.labelInput,
                    styles.onboardingWizardLabel,
                    onboardingWizard
                      ? { borderColor: colors.primary.default }
                      : { borderColor: colors.background.default },
                  ]}
                  editable={accountLabelEditable}
                  onChangeText={this.onAccountLabelChange}
                  onSubmitEditing={this.setAccountLabel}
                  onBlur={this.setAccountLabel}
                  {...generateTestId(Platform, WALLET_ACCOUNT_NAME_LABEL_INPUT)}
                  value={accountLabel}
                  selectTextOnFocus
                  ref={this.input}
                  returnKeyType={'done'}
                  autoCapitalize={'none'}
                  autoCorrect={false}
                  numberOfLines={1}
                  placeholderTextColor={colors.text.muted}
                  keyboardAppearance={themeAppearance}
                />
              ) : (
                <View style={styles.labelWrapper}>
                  {/* <TouchableOpacity onLongPress={this.setAccountLabelEditable}>
                    <Text
                      style={[
                        styles.label,
                        styles.onboardingWizardLabel,
                        { borderWidth: 0 },
                        // {
                        //   borderColor: onboardingWizard
                        //     ? colors.primary.default
                        //     : colors.background.default,
                        // },
                      ]}
                      numberOfLines={1}
                      {...generateTestId(
                        Platform,
                        WALLET_ACCOUNT_NAME_LABEL_TEXT,
                      )}
                    >
                      {isDefaultAccountName(name) && ens ? ens : name}
                    </Text>
                  </TouchableOpacity> */}
                  <Text style={styles.amountSubFiat}>{fiatBalance}</Text>
                  <TouchableOpacity
                    style={styles.addressWrapper}
                    onPress={this.copyAccountToClipboard}
                  >
                    <EthereumAddress
                      address={address}
                      style={styles.address}
                      type={'short'}
                    />
                  </TouchableOpacity>
                  {isQRHardwareWalletAccount && (
                    <View style={styles.tag}>
                      <Text style={styles.tagText}>
                        {strings('transaction.hardware')}
                      </Text>
                    </View>
                  )}
                </View>
              )}
            </View>

            {/* <TouchableOpacity
              style={styles.addressWrapper}
              onPress={this.copyAccountToClipboard}
            >
              <EthereumAddress
                address={address}
                style={styles.address}
                type={'short'}
              />
            </TouchableOpacity> */}

            <View style={styles.actions}>
              <View>
                <AssetActionButton
                  icon="receive"
                  onPress={this.onReceive}
                  label={strings('asset_overview.receive_button')}
                />
              </View>
              <View style={styles.actionIcon}>
                <AssetActionButton
                  testID={'token-send-button'}
                  icon="send"
                  onPress={this.onSend}
                  label={strings('asset_overview.send_button')}
                />
              </View>
              {allowedToBuy(chainId) && (
                <View style={styles.actionIcon}>
                  <AssetActionButton
                    icon="buy"
                    onPress={this.onBuy}
                    label={strings('asset_overview.buy_button')}
                  />
                </View>
              )}
              {AppConstants.SWAPS.ACTIVE && (
                <View style={styles.actionIcon}>
                  <AssetSwapButton
                    isFeatureLive={swapsIsLive}
                    isNetworkAllowed={isSwapsAllowed(chainId)}
                    onPress={this.goToSwaps}
                    isAssetAllowed
                  />
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  selectedAddress:
    state.engine.backgroundState.PreferencesController.selectedAddress,
  identities: state.engine.backgroundState.PreferencesController.identities,
  currentCurrency:
    state.engine.backgroundState.CurrencyRateController.currentCurrency,
  chainId: selectChainId(state),
  ticker: selectTicker(state),
  network: String(selectNetwork(state)),
  swapsIsLive: swapsLivenessSelector(state),
});

const mapDispatchToProps = (dispatch) => ({
  showAlert: (config) => dispatch(showAlert(config)),
  protectWalletModalVisible: () => dispatch(protectWalletModalVisible()),
  newAssetTransaction: (selectedAsset) =>
    dispatch(newAssetTransaction(selectedAsset)),
  toggleReceiveModal: (asset) => dispatch(toggleReceiveModal(asset)),
});

AccountOverview.contextType = ThemeContext;

export default connect(mapStateToProps, mapDispatchToProps)(AccountOverview);
