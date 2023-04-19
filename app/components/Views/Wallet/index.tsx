import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useContext,
  useMemo,
} from 'react';
import {
  RefreshControl,
  ScrollView,
  InteractionManager,
  ActivityIndicator,
  StyleSheet,
  View,
  TextStyle,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Theme } from '@metamask/design-tokens';
import { useDispatch, useSelector } from 'react-redux';
import ScrollableTabView, {
  DefaultTabBar,
} from 'react-native-scrollable-tab-view';
import { MetaMetricsEvents } from '../../../core/Analytics';
import { baseStyles } from '../../../styles/common';
import AccountOverview from '../../UI/AccountOverview';
import Tokens from '../../UI/Tokens';
import {
  getWalletNavbarOptions,
  getNoneHeaderNavbarOptions,
} from '../../UI/Navbar';
import { strings } from '../../../../locales/i18n';
import { renderFromWei, weiToFiat, hexToBN } from '../../../util/number';
import Engine from '../../../core/Engine';
import CollectibleContracts from '../../UI/CollectibleContracts';
import { getTicker } from '../../../util/transactions';
import OnboardingWizard from '../../UI/OnboardingWizard';
import ErrorBoundary from '../ErrorBoundary';
import { DrawerContext } from '../../Nav/Main/MainNavigator';
import { CustomTheme, useTheme } from '../../../util/theme';
import { shouldShowWhatsNewModal } from '../../../util/onboarding';
import Logger from '../../../util/Logger';
import { trackLegacyEvent } from '../../../util/analyticsV2';
import { renderAccountName } from '../../../util/address';

import ButtonIcon, {
  ButtonIconVariants,
} from '../../../component-library/components/Buttons/ButtonIcon';
import {
  IconName,
  IconSize,
} from '../../../component-library/components/Icons/Icon';
import Device from '../../../util/device';

import Routes from '../../../constants/navigation/Routes';
import {
  getNetworkImageSource,
  getNetworkNameFromProvider,
} from '../../../util/networks';
import { toggleNetworkModal } from '../../../actions/modals';
import generateTestId from '../../../../wdio/utils/generateTestId';
import {
  selectProviderConfig,
  selectTicker,
} from '../../../selectors/networkController';
import LinearGradient from 'react-native-linear-gradient';
import { add_plus_circle } from '../../../images/index';
import { SafeAreaView } from 'react-native-safe-area-context';

const createStyles = ({ colors, typography }: CustomTheme) =>
  StyleSheet.create({
    wrapperAccount: {
      flex: 1,
      zIndex: 3,
    },
    wrapperContent: {
      // flex: 1,
      // zIndex: 2,
    },
    wrapperTokenList: {
      flex: 1,
      zIndex: 2,
    },
    bgGradient: {
      borderBottomLeftRadius: 56,
      borderBottomRightRadius: 56,
      position: 'absolute',
      width: '100%',
      height: 362,
      zIndex: -1,
    },
    assetItem: {
      position: 'absolute',
      width: '100%',
      top: 90,
    },

    loader: {
      backgroundColor: colors.background.default,
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },

    tabUnderlineStyle: {
      height: 0,
      backgroundColor: colors.primary.default,
    },

    tabBar: {
      borderColor: colors.border.muted,
      marginTop: 16,
      justifyContent: 'flex-start',
      marginLeft: 20,
      borderBottomWidth: 0,
    },
    splitTab: {
      fontSize: 18,
      color: colors.tText.muted,
      marginRight: 15,
    },
    textStyle: {
      fontSize: 16,
      ...(typography.HeadingSM as TextStyle),
    },
    tabWrapper: {
      paddingLeft: 15,
    },
    tabWrapperFinal: {
      flex: 1,
      paddingLeft: 15,
    },
    tabStyleFirst: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingBottom: 0,
    },
    tabStyleSecond: {
      flex: 1,
      alignItems: 'center',
      paddingBottom: 0,
      flexDirection: 'row',
    },
    tabs: {
      height: 50,
      flexDirection: 'row',
      justifyContent: 'space-around',

      borderTopWidth: 0,
      borderLeftWidth: 0,
      borderRightWidth: 0,
      borderColor: '#ccc',
    },
    addIconWrapper: {
      flex: 1,
      flexDirection: 'row-reverse',
      alignItems: 'center',
    },
    iconPlus: {
      width: 32,
      height: 32,
      tintColor: colors.tIcon.default,
      marginRight: 32,
    },
  });

/**
 * Main view for the wallet
 */
const Wallet = ({ navigation }: any) => {
  const { drawerRef } = useContext(DrawerContext);
  const [refreshing, setRefreshing] = useState(false);
  const accountOverviewRef = useRef(null);
  const tokensRef = useRef(null);
  const theme = useTheme();
  const styles = createStyles(theme);
  const { colors } = theme;
  /**
   * Map of accounts to information objects including balances
   */
  const accounts = useSelector(
    (state: any) =>
      state.engine.backgroundState.AccountTrackerController.accounts,
  );
  /**
   * ETH to current currency conversion rate
   */
  const conversionRate = useSelector(
    (state: any) =>
      state.engine.backgroundState.CurrencyRateController.conversionRate,
  );
  /**
   * Currency code of the currently-active currency
   */
  const currentCurrency = useSelector(
    (state: any) =>
      state.engine.backgroundState.CurrencyRateController.currentCurrency,
  );
  /**
   * An object containing each identity in the format address => account
   */
  const identities = useSelector(
    (state: any) =>
      state.engine.backgroundState.PreferencesController.identities,
  );
  /**
   * A string that represents the selected address
   */
  const selectedAddress = useSelector(
    (state: any) =>
      state.engine.backgroundState.PreferencesController.selectedAddress,
  );
  /**
   * An array that represents the user tokens
   */
  const tokens = useSelector(
    (state: any) => state.engine.backgroundState.TokensController.tokens,
  );
  /**
   * Current provider ticker
   */
  const ticker = useSelector(selectTicker);
  /**
   * Current onboarding wizard step
   */
  const wizardStep = useSelector((state: any) => state.wizard.step);
  /**
   * Current network
   */
  const networkProvider = useSelector(selectProviderConfig);
  const dispatch = useDispatch();
  const networkName = useMemo(
    () => getNetworkNameFromProvider(networkProvider),
    [networkProvider],
  );

  const networkImageSource = useMemo(
    () =>
      getNetworkImageSource({
        networkType: networkProvider.type,
        chainId: networkProvider.chainId,
      }),
    [networkProvider],
  );

  /**
   * Callback to trigger when pressing the navigation title.
   */
  const onTitlePress = () => dispatch(toggleNetworkModal());

  const { colors: themeColors } = useTheme();

  /**
   * Check to see if we need to show What's New modal
   */
  useEffect(() => {
    if (wizardStep > 0) {
      // Do not check since it will conflict with the onboarding wizard
      return;
    }
    const checkWhatsNewModal = async () => {
      try {
        const shouldShowWhatsNew = await shouldShowWhatsNewModal();
        if (shouldShowWhatsNew) {
          navigation.navigate(Routes.MODAL.ROOT_MODAL_FLOW, {
            screen: Routes.MODAL.WHATS_NEW,
          });
        }
      } catch (error) {
        Logger.log(error, "Error while checking What's New modal!");
      }
    };
    checkWhatsNewModal();
  }, [wizardStep, navigation]);

  useEffect(
    () => {
      requestAnimationFrame(async () => {
        const {
          TokenDetectionController,
          NftDetectionController,
          AccountTrackerController,
        } = Engine.context as any;
        TokenDetectionController.detectTokens();
        NftDetectionController.detectNfts();
        AccountTrackerController.refresh();
      });
    },
    /* eslint-disable-next-line */
    [navigation],
  );

  useEffect(() => {
    // const ens = await doENSReverseLookup(account.address, network);
    // const title = isDefaultAccountName(name) && ens ? ens : name;
    const accountLabel = renderAccountName(selectedAddress, identities);
    navigation.setOptions(
      getWalletNavbarOptions(
        networkName,
        networkImageSource,
        accountLabel,
        navigation,
        drawerRef,
        onTitlePress,
        themeColors,
      ),
    );

    // navigation.setOptions(getNoneHeaderNavbarOptions());
    /* eslint-disable-next-line */
  }, [
    navigation,
    themeColors,
    networkName,
    networkImageSource,
    onTitlePress,
    selectedAddress,
    identities,
  ]);

  // Refesh: Token, Nft, Account Tracker, Currency Rate, Token Rates
  const onRefresh = useCallback(async () => {
    requestAnimationFrame(async () => {
      setRefreshing(true);
      const {
        TokenDetectionController,
        NftDetectionController,
        AccountTrackerController,
        CurrencyRateController,
        TokenRatesController,
      } = Engine.context as any;
      const actions = [
        TokenDetectionController.detectTokens(),
        NftDetectionController.detectNfts(),
        AccountTrackerController.refresh(),
        CurrencyRateController.start(),
        TokenRatesController.poll(),
      ];
      await Promise.all(actions);
      setRefreshing(false);
    });
  }, [setRefreshing]);

  const renderTab = (
    name: any,
    page: any,
    isTabActive: any,
    onPressHandler: any,
  ) => {
    // const { activeTextColor, inactiveTextColor, textStyle, } = this.props;
    const textColor = isTabActive ? colors.tText.default : colors.tText.third;
    const fontWeight = isTabActive ? 'bold' : 'normal';

    // console.log('#### name: ', name);

    // Frist Tab
    const RenderTokens = () => (
      <View style={styles.tabStyleFirst}>
        <Text style={[{ color: textColor, fontWeight }, styles.textStyle]}>
          {name}
        </Text>
      </View>
    );

    // From Sencond Tab
    const RenderNFTs = () => (
      <View style={styles.tabStyleSecond}>
        <Text style={styles.splitTab}>\</Text>
        <Text style={[{ color: textColor, fontWeight }, styles.textStyle]}>
          {name}
        </Text>
        <TouchableOpacity
          onPress={tokensRef.current?.goToAddToken}
          style={styles.addIconWrapper}
        >
          {/* <ButtonIcon
            variant={ButtonIconVariants.Primary}
            iconName={IconName.AddPlusCircleAddBlack}
            style={styles.infoRightButton}
            size={IconSize.Xl}
            iconColor={'red'}
            // disabled={!tokensRef.current?.state.isAddTokenEnabled}
          /> */}
          <Image source={add_plus_circle} style={styles.iconPlus} />
        </TouchableOpacity>
      </View>
    );

    const isTokens = name === 'Tokens';

    return (
      <TouchableOpacity
        style={isTokens ? styles.tabWrapper : styles.tabWrapperFinal}
        key={name}
        accessible={true}
        accessibilityLabel={name}
        onPress={() => onPressHandler(page)}
      >
        {isTokens ? <RenderTokens /> : <RenderNFTs />}
      </TouchableOpacity>
    );
  };

  const renderTabBar = useCallback(
    () => (
      <DefaultTabBar
        underlineStyle={styles.tabUnderlineStyle}
        style={styles.tabBar}
        renderTab={renderTab}
      />
    ),
    [styles, colors, tokensRef],
  );

  const onChangeTab = useCallback((obj) => {
    InteractionManager.runAfterInteractions(() => {
      if (obj.ref.props.tabLabel === strings('wallet.tokens')) {
        trackLegacyEvent(MetaMetricsEvents.WALLET_TOKENS);
      } else {
        trackLegacyEvent(MetaMetricsEvents.WALLET_COLLECTIBLES);
      }
    });
  }, []);

  const onRef = useCallback((ref) => {
    accountOverviewRef.current = ref;
  }, []);

  const onTokensRef = useCallback((ref) => {
    tokensRef.current = ref;
  }, []);

  const renderAccount = useCallback(() => {
    let balance: any = 0;
    let assets = tokens;
    if (accounts[selectedAddress]) {
      balance = renderFromWei(accounts[selectedAddress].balance);
      assets = [
        {
          name: 'Ether', // FIXME: use 'Ether' for mainnet only, what should it be for custom networks?
          symbol: getTicker(ticker),
          isETH: true,
          balance,
          balanceFiat: weiToFiat(
            hexToBN(accounts[selectedAddress].balance) as any,
            conversionRate,
            currentCurrency,
          ),
          logo: '../images/eth-logo-new.png',
        },
        ...(tokens || []),
      ];
    } else {
      assets = tokens;
    }
    const account = {
      address: selectedAddress,
      ...identities[selectedAddress],
      ...accounts[selectedAddress],
    };

    return (
      <View style={{ flex: 1, marginTop: 50 }}>
        <AccountOverview
          account={account}
          navigation={navigation}
          onRef={onRef}
          // props token for received crypto
          token={assets}
        />
      </View>
    );
  }, [
    renderTabBar,
    accounts,
    conversionRate,
    currentCurrency,
    identities,
    navigation,
    onChangeTab,
    onRef,
    selectedAddress,
    ticker,
    tokens,
    styles,
  ]);

  const renderContent = useCallback(() => {
    let balance: any = 0;
    let assets = tokens;
    if (accounts[selectedAddress]) {
      balance = renderFromWei(accounts[selectedAddress].balance);
      assets = [
        {
          name: 'Ether', // FIXME: use 'Ether' for mainnet only, what should it be for custom networks?
          symbol: getTicker(ticker),
          isETH: true,
          balance,
          balanceFiat: weiToFiat(
            hexToBN(accounts[selectedAddress].balance) as any,
            conversionRate,
            currentCurrency,
          ),
          logo: '../images/eth-logo-new.png',
        },
        ...(tokens || []),
      ];
    } else {
      assets = tokens;
    }
    const account = {
      address: selectedAddress,
      ...identities[selectedAddress],
      ...accounts[selectedAddress],
    };

    return (
      <View style={styles.wrapperContent}>
        <ScrollableTabView
          renderTabBar={renderTabBar}
          // eslint-disable-next-line react/jsx-no-bind
          onChangeTab={onChangeTab}
        >
          <Tokens
            tabLabel={strings('wallet.tokens')}
            key={'tokens-tab'}
            navigation={navigation}
            tokens={assets}
            onRef={onTokensRef}
          />
          <CollectibleContracts
            tabLabel={strings('wallet.collectibles')}
            key={'nfts-tab'}
            navigation={navigation}
          />
        </ScrollableTabView>
      </View>
    );
  }, [
    renderTabBar,
    accounts,
    conversionRate,
    currentCurrency,
    identities,
    navigation,
    onChangeTab,
    onRef,
    selectedAddress,
    ticker,
    tokens,
    styles,
  ]);

  const renderLoader = useCallback(
    () => (
      <View style={styles.loader}>
        <ActivityIndicator size="small" />
      </View>
    ),
    [styles],
  );

  /**
   * Return current step of onboarding wizard if not step 5 nor 0
   */
  const renderOnboardingWizard = useCallback(
    () =>
      [1, 2, 3, 4].includes(wizardStep) && (
        <OnboardingWizard
          navigation={navigation}
          coachmarkRef={accountOverviewRef.current}
        />
      ),
    [navigation, wizardStep],
  );

  return (
    <ErrorBoundary view="Wallet">
      <SafeAreaView edges={['top']} style={{ height: 362 }}>
        {selectedAddress ? renderAccount() : renderLoader()}
        <LinearGradient
          start={{ x: 0.75, y: 0.75 }}
          end={{ x: 0.25, y: 0 }}
          colors={colors.tGradient.wallet}
          style={styles.bgGradient}
        />
      </SafeAreaView>
      <View style={{ flex: 1 }}>
        <ScrollView
          refreshControl={
            <RefreshControl
              colors={[colors.tPrimary.default]}
              tintColor={colors.tIcon.default}
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
        >
          {selectedAddress ? renderContent() : renderLoader()}
        </ScrollView>
      </View>
      {renderOnboardingWizard()}
    </ErrorBoundary>
  );
};

export default Wallet;
