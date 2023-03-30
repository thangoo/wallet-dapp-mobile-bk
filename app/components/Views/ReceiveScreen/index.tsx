import { useNavigation, useRoute } from '@react-navigation/native';
import _ from 'lodash';
import React, { FC, useEffect } from 'react';
import {
  Alert,
  Image,
  ImageSourcePropType,
  InteractionManager,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import Share from 'react-native-share';
import { connect } from 'react-redux';
import { showAlert } from '../../../../app/actions/alert';
import { protectWalletModalVisible } from '../../../../app/actions/user';
import HStack from '../../../../app/components/Base/HStack';
import EthereumAddress from '../../../../app/components/UI/EthereumAddress';
import { allowedToBuy } from '../../../../app/components/UI/FiatOnRampAggregator';
import GlobalAlert from '../../../../app/components/UI/GlobalAlert';
import { getReceiveNavbar } from '../../../../app/components/UI/Navbar';
import StyledButton from '../../../../app/components/UI/StyledButton';
import Routes from '../../../../app/constants/navigation/Routes';
import {
  selectChainId,
  selectNetwork,
  selectTicker,
} from '../../../../app/selectors/networkController';
import { CustomTheme, mockTheme, useTheme } from '../../../../app/util/theme';
import { getTicker } from '../../../../app/util/transactions';
import { strings } from '../../../../locales/i18n';
import { MetaMetricsEvents } from '../../../core/Analytics';
import ClipboardManager from '../../../core/ClipboardManager';
import {
  copy_icon_02,
  credit_card_icon,
  share_icon,
} from '../../../images/index';
import { trackLegacyEvent } from '../../../util/analyticsV2';
import Logger from '../../../util/Logger';
import { generateUniversalLinkAddress } from '../../../util/payment-link-generator';

const D: {
  icon: ImageSourcePropType;
  name: 'Set Amount' | 'Copy' | 'Share';
}[] = [
  {
    name: 'Set Amount',
    icon: credit_card_icon,
  },
  {
    name: 'Copy',
    icon: copy_icon_02,
  },
  {
    name: 'Share',
    icon: share_icon,
  },
];

type Config = {
  isVisible: boolean;
  autodismiss: number;
  content: string;
  data: { msg: string };
};

interface Props {
  selectedAddress: string;
  chainId: string;
  ticker?: string;
  network: string;
  seedphraseBackedUp: string;
  receiveAsset: object;
  protectWalletModalVisible: () => void;
  showAlert: ({ isVisible, autodismiss, content, data }: Config) => void;
}

const ReceiveScreen: FC<Props> = (props) => {
  const navigation = useNavigation();
  const route = useRoute();
  const { colors } = useTheme();
  const tColors = colors || mockTheme.colors;
  const styles = createStyles(colors);

  useEffect(() => {
    navigation.setOptions(getReceiveNavbar(navigation, 'Receive', tColors));
  }, [navigation, route]);

  /**
   * Shows an alert message with a coming soon message
   */
  const onBuy = async () => {
    if (!allowedToBuy(props.network)) {
      Alert.alert(
        strings('fiat_on_ramp.network_not_supported'),
        strings('fiat_on_ramp.switch_network'),
      );
    } else {
      // toggleReceiveModal();
      navigation.navigate(Routes.FIAT_ON_RAMP_AGGREGATOR.ID);
      InteractionManager.runAfterInteractions(() => {
        trackLegacyEvent(MetaMetricsEvents.BUY_BUTTON_CLICKED, {
          text: 'Buy Native Token',
          location: 'Receive Modal',
          chain_id_destination: props.chainId,
        });
      });
    }
  };

  /**
   * Share current account public address
   */
  const onShare = () => {
    Share.open({
      message: generateUniversalLinkAddress(props.selectedAddress),
    })
      .then(() => {
        // this.props.hideModal();
        setTimeout(() => props.protectWalletModalVisible(), 1000);
      })
      .catch((err) => {
        Logger.log('Error while trying to share address', err);
      });
    InteractionManager.runAfterInteractions(() => {
      trackLegacyEvent(MetaMetricsEvents.RECEIVE_OPTIONS_SHARE_ADDRESS);
    });
  };

  const copyAccountToClipboard = async () => {
    ClipboardManager.setString(props.selectedAddress);
    props.showAlert({
      isVisible: true,
      autodismiss: 1500,
      content: 'clipboard-alert',
      data: { msg: strings('account_details.account_copied_to_clipboard') },
    });
    if (!props.seedphraseBackedUp) {
      // setTimeout(() => props.hideModal(), 1000);
      setTimeout(() => props.protectWalletModalVisible(), 2000);
    }
  };

  const onReceive = () => {
    // this.props.toggleReceiveModal();
    navigation.navigate('PaymentRequestView', {
      screen: 'PaymentRequest',
      params: { receiveAsset: props.receiveAsset },
    });
    InteractionManager.runAfterInteractions(() => {
      trackLegacyEvent(MetaMetricsEvents.RECEIVE_OPTIONS_PAYMENT_REQUEST);
    });
  };

  const handlePress = (name: 'Set Amount' | 'Copy' | 'Share') => {
    if (name === 'Set Amount') {
      return onReceive();
    }
    if (name === 'Copy') {
      return copyAccountToClipboard();
    }
    if (name === 'Share') {
      return onShare();
    }
  };

  return (
    <View style={{ flex: 1, paddingHorizontal: 32 }}>
      <View style={{ alignSelf: 'center', marginTop: 32 }}>
        <QRCode
          value={`ethereum:${props.selectedAddress}@${props.chainId}`}
          size={240}
        />
        <View style={styles.wrapQRText}>
          <Text>
            <EthereumAddress address={props.selectedAddress} type={'short'} />
          </Text>
        </View>
      </View>

      <HStack style={{ justifyContent: 'space-around' }}>
        {_.map(D, ({ icon, name }, index) => (
          <TouchableOpacity
            key={index}
            style={{ alignItems: 'center' }}
            onPress={() => handlePress(name)}
          >
            <View style={styles.wrapIcon}>
              <Image source={icon} style={{ width: 24, height: 24 }} />
            </View>
            <Text style={styles.nameText}>{name}</Text>
          </TouchableOpacity>
        ))}
      </HStack>

      <View style={{ flex: 1 }} />

      <Text onPress={() => {}} style={styles.howText}>
        {'How this work?'}
      </Text>

      {allowedToBuy(props.network) && (
        <StyledButton
          testID={'manual-backup-step-1-continue-button'}
          type={'confirm'}
          onPress={onBuy}
          containerStyle={{ width: '100%', marginBottom: 16 }}
        >
          {strings('fiat_on_ramp.buy', {
            ticker: getTicker(props.ticker),
          })}
        </StyledButton>
      )}

      <GlobalAlert />
    </View>
  );
};

const mapStateToProps = (state: any) => ({
  chainId: selectChainId(state),
  network: selectNetwork(state),
  ticker: selectTicker(state),
  selectedAddress:
    state.engine.backgroundState.PreferencesController.selectedAddress,
  receiveAsset: state.modals.receiveAsset,
  seedphraseBackedUp: state.user.seedphraseBackedUp,
});

const mapDispatchToProps = (dispatch: any) => ({
  // toggleReceiveModal: () => dispatch(toggleReceiveModal()),
  showAlert: (config: Config) => dispatch(showAlert(config)),
  protectWalletModalVisible: () => dispatch(protectWalletModalVisible()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ReceiveScreen);

const createStyles = (colors: CustomTheme['colors']) =>
  StyleSheet.create({
    wrapIcon: {
      backgroundColor: colors['tvn.primary.blue'],
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 12,
      width: 48,
      height: 48,
      marginBottom: 8,
    },
    howText: {
      fontSize: 14,
      fontWeight: '600',
      color: colors['tvn.primary.blue'],
      textAlign: 'center',
      marginBottom: 24,
    },
    nameText: {
      fontSize: 14,
      color: colors['tvn.gray.10'],
      fontWeight: '400',
    },
    wrapQRText: {
      backgroundColor: colors['tvn.light_gray_blue'],
      paddingVertical: 16,
      alignItems: 'center',
      marginVertical: 32,
      borderRadius: 12,
    },
  });
