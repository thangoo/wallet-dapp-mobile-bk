import { icon_tab_01 } from 'images/index';
import React, { forwardRef, useImperativeHandle } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import ReactNativeModal from 'react-native-modal';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useToggle } from 'react-use';
import { CustomTheme, useTheme } from '../../../util/theme';
import StyledButton from '../../UI/StyledButton';

interface Props {
  onConfirm: () => void;
}

interface RefHandle {
  toggle: () => void;
}

const WalletReadyModal = forwardRef<RefHandle, Props>(({ onConfirm }, ref) => {
  const [toggle, setToggle] = useToggle(false);
  const { colors } = useTheme();
  const styles = createStyles(colors);

  useImperativeHandle(ref, () => ({
    toggle: setToggle,
  }));

  const handlePress = () => {
    setToggle(false);
    setTimeout(() => {
      onConfirm();
    }, 500);
  };

  const close = () => {
    setToggle(false);
  };
  return (
    <ReactNativeModal
      swipeDirection="down"
      propagateSwipe
      style={styles.modal}
      backdropTransitionOutTiming={0}
      isVisible={toggle}
      onBackdropPress={close}
      onBackButtonPress={close}
      onSwipeComplete={close}
    >
      <View style={styles.body}>
        <View style={styles.dragger} />
        <Image source={icon_tab_01} style={styles.icWallet} />
        <Text style={styles.title}>{'Your Wallet is ready!'}</Text>
        <Text style={styles.title2}>
          {
            'Your secret phrase is successfully backed up, and your wallet is ready to use.'
          }
        </Text>

        <SafeAreaView
          style={{ width: '100%', paddingBottom: 32 }}
          edges={['bottom']}
        >
          <StyledButton
            testID={'manual-backup-step-1-continue-button'}
            type={'confirm'}
            onPress={handlePress}
          >
            {'Start'}
          </StyledButton>
        </SafeAreaView>
      </View>
    </ReactNativeModal>
  );
});

type WalletReadyModal = RefHandle;

export default WalletReadyModal;

const createStyles = (colors: CustomTheme['colors']) =>
  StyleSheet.create({
    body: {
      backgroundColor: colors.tBackground.secondary,
      paddingHorizontal: 32,
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
    modal: {
      margin: 0,
      justifyContent: 'flex-end',
    },
    text: {
      fontSize: 14,
      fontWeight: '400',
      color: colors.tText.default,
    },
    title: {
      marginBottom: 16,
      fontSize: 24,
      fontWeight: '600',
      textAlign: 'center',
      textTransform: 'capitalize',
      color: colors.tText.default,
    },
    title2: {
      marginBottom: 32,
      fontSize: 14,
      fontWeight: '400',
      textAlign: 'center',
      color: colors.tText.default,
    },
    dragger: {
      width: 36,
      height: 5,
      borderRadius: 2.5,
      backgroundColor: colors.gray04,
      marginTop: 6,
      marginBottom: 32,
    },
    icWallet: {
      width: 56,
      height: 56,
      tintColor: colors.tPrimary.default,
      marginBottom: 16,
    },
  });
