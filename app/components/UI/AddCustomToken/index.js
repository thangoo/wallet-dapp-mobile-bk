import React, { PureComponent } from 'react';
import {
  Text,
  TextInput,
  View,
  StyleSheet,
  InteractionManager,
  Platform,
  Image,
} from 'react-native';
import PropTypes from 'prop-types';
import { isValidAddress } from 'ethereumjs-util';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Engine from '../../../core/Engine';
import { MetaMetricsEvents } from '../../../core/Analytics';
import NotificationManager from '../../../core/NotificationManager';
import ActionView from '../ActionView';
import { isSmartContractAddress } from '../../../util/transactions';
import { trackEvent } from '../../../util/analyticsV2';
import AppConstants from '../../../core/AppConstants';
import Alert, { AlertType } from '../../Base/Alert';
import { ThemeContext, mockTheme } from '../../../util/theme';
import { strings } from '../../../../locales/i18n';
import { fontStyles } from '../../../styles/common';
import generateTestId from '../../../../wdio/utils/generateTestId';
import {
  CUSTOM_TOKEN_CONTAINER_ID,
  TOKEN_ADDRESS_INPUT_BOX_ID,
  TOKEN_ADDRESS_SYMBOL_ID,
  TOKEN_ADDRESS_WARNING_MESSAGE_ID,
  TOKEN_CANCEL_IMPORT_BUTTON_ID,
  TOKEN_PRECISION_WARNING_MESSAGE_ID,
} from '../../../../wdio/screen-objects/testIDs/Screens/AddCustomToken.testIds';
import { NFT_IDENTIFIER_INPUT_BOX_ID } from '../../../../wdio/screen-objects/testIDs/Screens/NFTImportScreen.testIds';
import WarningCustomToken from './Warning';
import WrapActionView from '../SearchTokenAutocomplete/WrapActionView';
import { shield_warning_icon } from 'images/index';

const createStyles = (colors) =>
  StyleSheet.create({
    wrapper: {
      backgroundColor: colors.background.default,
      flex: 1,
    },
    rowWrapper: {
      paddingHorizontal: 16,
      // paddingVertical: 5,
      marginTop: 16,
    },
    textInput: {
      borderRadius: 16,
      paddingVertical: 24,
      paddingHorizontal: 16,
      ...fontStyles.bold,
      color: colors.tText.secondary,
      backgroundColor: colors.tBackground.third,
      fontSize: 16,
    },
    inputLabel: {
      ...fontStyles.normal,
      color: colors.tText.default,
      fontSize: 14,
      marginBottom: 8,
      paddingHorizontal: 16,
    },
    warningText: {
      ...fontStyles.normal,
      marginTop: 5,
      paddingLeft: 16,
      color: colors.error.default,
    },
    tokenDetectionBanner: {
      marginHorizontal: 15,
      marginTop: 20,
      backgroundColor: colors.tWarning.default,
      alignItems: 'flex-start',
      height: 76,
      borderRadius: 14,
      borderWidth: 0,
    },
    tokenDetectionDescription: {
      color: colors.tText.light,
      fontSize: 14,
      ...fontStyles.normal,
    },
    tokenDetectionLink: {
      color: colors.tText.light,
      textDecorationLine: 'underline',
      fontSize: 14,
      ...fontStyles.normal,
    },
    tokenDetectionIcon: {
      paddingTop: 4,
      paddingRight: 8,
    },
  });

/**
 * Copmonent that provides ability to add custom tokens.
 */
export default class AddCustomToken extends PureComponent {
  state = {
    address: '',
    symbol: '',
    decimals: '',
    warningAddress: '',
    warningSymbol: '',
    warningDecimals: '',
  };

  static propTypes = {
    /**
    /* navigation object required to push new views
    */
    navigation: PropTypes.object,
    /**
     * Checks if token detection is supported
     */
    isTokenDetectionSupported: PropTypes.bool,
  };

  getAnalyticsParams = () => {
    try {
      const { NetworkController } = Engine.context;
      const { chainId } = NetworkController?.state?.providerConfig || {};
      const { address, symbol } = this.state;
      return {
        token_address: address,
        token_symbol: symbol,
        chain_id: chainId,
        source: 'Custom token',
      };
    } catch (error) {
      return {};
    }
  };

  addToken = async () => {
    if (!(await this.validateCustomToken())) return;
    const { TokensController } = Engine.context;
    const { address, symbol, decimals } = this.state;
    await TokensController.addToken(address, symbol, decimals);

    trackEvent(MetaMetricsEvents.TOKEN_ADDED, this.getAnalyticsParams());

    // Clear state before closing
    this.setState(
      {
        address: '',
        symbol: '',
        decimals: '',
        warningAddress: '',
        warningSymbol: '',
        warningDecimals: '',
      },
      () => {
        InteractionManager.runAfterInteractions(() => {
          this.props.navigation.goBack();
          NotificationManager.showSimpleNotification({
            status: `simple_notification`,
            duration: 5000,
            title: strings('wallet.token_toast.token_imported_title'),
            description: strings('wallet.token_toast.token_imported_desc', {
              tokenSymbol: symbol,
            }),
          });
        });
      },
    );
  };

  cancelAddToken = () => {
    this.props.navigation.goBack();
  };

  onAddressChange = (address) => {
    this.setState({ address });
  };

  onSymbolChange = (symbol) => {
    this.setState({ symbol });
  };

  onDecimalsChange = (decimals) => {
    this.setState({ decimals });
  };

  onAddressBlur = async () => {
    const validated = await this.validateCustomTokenAddress();
    if (validated) {
      const address = this.state.address;
      const { AssetsContractController } = Engine.context;
      const decimals = await AssetsContractController.getERC20TokenDecimals(
        address,
      );
      const symbol = await AssetsContractController.getERC721AssetSymbol(
        address,
      );
      this.setState({ decimals: String(decimals), symbol });
    }
  };

  validateCustomTokenAddress = async () => {
    let validated = true;
    const address = this.state.address;
    const isValidTokenAddress = isValidAddress(address);
    const { NetworkController } = Engine.context;
    const { chainId } = NetworkController?.state?.providerConfig || {};
    const toSmartContract =
      isValidTokenAddress && (await isSmartContractAddress(address, chainId));
    const addressWithoutSpaces = address.replace(/\s/g, '');
    if (addressWithoutSpaces.length === 0) {
      this.setState({ warningAddress: strings('token.address_cant_be_empty') });
      validated = false;
    } else if (!isValidTokenAddress) {
      this.setState({ warningAddress: strings('token.address_must_be_valid') });
      validated = false;
    } else if (!toSmartContract) {
      this.setState({
        warningAddress: strings('token.address_must_be_smart_contract'),
      });
      validated = false;
    } else {
      this.setState({ warningAddress: `` });
    }
    return validated;
  };

  validateCustomTokenSymbol = () => {
    let validated = true;
    const symbol = this.state.symbol;
    const symbolWithoutSpaces = symbol.replace(/\s/g, '');
    if (symbolWithoutSpaces.length === 0) {
      this.setState({ warningSymbol: strings('token.symbol_cant_be_empty') });
      validated = false;
    } else {
      this.setState({ warningSymbol: `` });
    }
    return validated;
  };

  validateCustomTokenDecimals = () => {
    let validated = true;
    const decimals = this.state.decimals;
    const decimalsWithoutSpaces = decimals.replace(/\s/g, '');
    if (decimalsWithoutSpaces.length === 0) {
      this.setState({
        warningDecimals: strings('token.decimals_cant_be_empty'),
      });
      validated = false;
    } else {
      this.setState({ warningDecimals: `` });
    }
    return validated;
  };

  validateCustomToken = async () => {
    const validatedAddress = await this.validateCustomTokenAddress();
    const validatedSymbol = this.validateCustomTokenSymbol();
    const validatedDecimals = this.validateCustomTokenDecimals();
    return validatedAddress && validatedSymbol && validatedDecimals;
  };

  assetSymbolInput = React.createRef();
  assetPrecisionInput = React.createRef();

  jumpToAssetSymbol = () => {
    const { current } = this.assetSymbolInput;
    current && current.focus();
  };

  jumpToAssetPrecision = () => {
    const { current } = this.assetPrecisionInput;
    current && current.focus();
  };

  renderInfoBanner = () => {
    const { navigation } = this.props;
    const colors = this.context.colors || mockTheme.colors;
    const styles = createStyles(colors);

    return (
      <Alert
        type={AlertType.Info}
        style={styles.tokenDetectionBanner}
        renderIcon={() => (
          <Image
            source={shield_warning_icon}
            style={{ width: 24, height: 24, marginRight: 8 }}
            resizeMode="contain"
          />
        )}
      >
        <>
          <Text style={styles.tokenDetectionDescription}>
            {strings('add_asset.banners.custom_warning_desc')}
          </Text>
          <Text
            suppressHighlighting
            onPress={() => {
              navigation.navigate('Webview', {
                screen: 'SimpleWebview',
                params: {
                  url: AppConstants.URLS.SECURITY,
                  title: strings('add_asset.banners.custom_security_tips'),
                },
              });
            }}
            style={styles.tokenDetectionLink}
          >
            {strings('add_asset.banners.custom_info_link')}
          </Text>
        </>
      </Alert>
    );
  };

  renderWarningBanner = () => {
    const { navigation } = this.props;
    const colors = this.context.colors || mockTheme.colors;
    const styles = createStyles(colors);

    return (
      <WarningCustomToken
        style={styles.tokenDetectionBanner}
        warningMessage={
          <>
            <Text style={styles.tokenDetectionDescription}>
              {strings('add_asset.banners.custom_warning_desc')}
            </Text>
            <Text
              suppressHighlighting
              onPress={() => {
                // TODO: This functionality exists in a bunch of other places. We need to unify this into a utils function
                navigation.navigate('Webview', {
                  screen: 'SimpleWebview',
                  params: {
                    url: AppConstants.URLS.SECURITY,
                    title: strings('add_asset.banners.custom_security_tips'),
                  },
                });
              }}
              style={styles.tokenDetectionLink}
            >
              {strings('add_asset.banners.custom_warning_link')}
            </Text>
          </>
        }
      />
    );
  };

  renderBanner = () =>
    this.props.isTokenDetectionSupported
      ? this.renderWarningBanner()
      : this.renderInfoBanner();

  render = () => {
    const { address, symbol, decimals } = this.state;
    const colors = this.context.colors || mockTheme.colors;
    const themeAppearance = this.context.themeAppearance || 'light';
    const styles = createStyles(colors);

    return (
      <View
        style={styles.wrapper}
        {...generateTestId(Platform, CUSTOM_TOKEN_CONTAINER_ID)}
      >
        <WrapActionView
          cancelTestID={'add-custom-asset-cancel-button'}
          confirmTestID={'add-custom-asset-confirm-button'}
          cancelText={strings('add_asset.tokens.cancel_add_token')}
          confirmText={strings('add_asset.tokens.add_token')}
          confirmButtonMode="confirm"
          onCancelPress={this.cancelAddToken}
          {...generateTestId(Platform, TOKEN_CANCEL_IMPORT_BUTTON_ID)}
          onConfirmPress={this.addToken}
          confirmDisabled={!(address && symbol && decimals)}
        >
          <View style={{ marginBottom: 20 }}>
            {this.renderBanner()}
            <View style={styles.rowWrapper}>
              <Text style={styles.inputLabel}>
                {strings('token.token_address')}
              </Text>
              <TextInput
                style={styles.textInput}
                placeholder={'0x...'}
                placeholderTextColor={colors.tText.secondary}
                value={this.state.address}
                onChangeText={this.onAddressChange}
                onBlur={this.onAddressBlur}
                {...generateTestId(Platform, TOKEN_ADDRESS_INPUT_BOX_ID)}
                onSubmitEditing={this.jumpToAssetSymbol}
                returnKeyType={'next'}
                keyboardAppearance={themeAppearance}
              />
              <Text
                style={styles.warningText}
                {...generateTestId(Platform, TOKEN_ADDRESS_WARNING_MESSAGE_ID)}
              >
                {this.state.warningAddress}
              </Text>
            </View>
            <View style={styles.rowWrapper}>
              <Text style={styles.inputLabel}>
                {strings('token.token_symbol')}
              </Text>
              <TextInput
                style={styles.textInput}
                placeholder={'GNO'}
                placeholderTextColor={colors.text.muted}
                value={this.state.symbol}
                onChangeText={this.onSymbolChange}
                onBlur={this.validateCustomTokenSymbol}
                {...generateTestId(Platform, TOKEN_ADDRESS_SYMBOL_ID)}
                ref={this.assetSymbolInput}
                onSubmitEditing={this.jumpToAssetPrecision}
                returnKeyType={'next'}
                keyboardAppearance={themeAppearance}
              />
              <Text style={styles.warningText}>{this.state.warningSymbol}</Text>
            </View>
            <View style={styles.rowWrapper}>
              <Text style={styles.inputLabel}>
                {strings('token.token_decimal')}
              </Text>
              <TextInput
                style={styles.textInput}
                value={this.state.decimals}
                keyboardType="numeric"
                maxLength={2}
                placeholder={'18'}
                placeholderTextColor={colors.text.muted}
                onChangeText={this.onDecimalsChange}
                onBlur={this.validateCustomTokenDecimals}
                {...generateTestId(Platform, NFT_IDENTIFIER_INPUT_BOX_ID)}
                ref={this.assetPrecisionInput}
                onSubmitEditing={this.addToken}
                returnKeyType={'done'}
                keyboardAppearance={themeAppearance}
              />
              <Text
                style={styles.warningText}
                {...generateTestId(
                  Platform,
                  TOKEN_PRECISION_WARNING_MESSAGE_ID,
                )}
              >
                {this.state.warningDecimals}
              </Text>
            </View>
          </View>
        </WrapActionView>
      </View>
    );
  };
}

AddCustomToken.contextType = ThemeContext;
