import {
  check_box_blue,
  check_box_empty,
  check_box_empty_dark,
} from 'images/index';
import _ from 'lodash';
import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ReactNativeModal from 'react-native-modal';
import { useToggle } from 'react-use';
import HStack from '../../Base/HStack';
import { strings } from '../../../../locales/i18n';
import { CustomTheme, useTheme } from '../../../util/theme';
import StyledButton from '../../UI/StyledButton';
import {wallet_start} from '../../../images/index'

const NOTES = [
  `${strings('secret_phrase.title1')}`,
  `${strings('secret_phrase.title2')}`,
  `${strings('secret_phrase.title3')}`,
];

interface Props {
  onNext: () => void;
}

interface RefHandle {
  toggle: () => void;
}

const SuccessBackupModal = forwardRef<RefHandle, Props>(({ onNext }, ref) => {
  const [toggle, setToggle] = useToggle(true);
  const { colors } = useTheme();
  const styles = createStyles(colors);

  useImperativeHandle(ref, () => ({
    toggle: setToggle,
  }));

  const handlePress = () => {
    setToggle(false);
    setTimeout(() => {
      onNext();
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
        <Image source={wallet_start} style={styles.walletImg} />
        <Text style={styles.title}>{strings('wallet_restored.wallet_restored_title')}</Text>
        <Text style={styles.title2}>{strings('wallet_restored.wallet_restored_subtitle')}</Text>
        <StyledButton
          testID={'manual-backup-step-1-continue-button'}
          type={'confirm'}
          onPress={handlePress}
          containerStyle={{ width: '100%', marginBottom: 36 }}
        >
          {strings('wallet_restored.start')}
        </StyledButton>
      </View>
    </ReactNativeModal>
  );
});

type SuccessBackupModal = RefHandle;

export default SuccessBackupModal;



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
    walletImg : {
      marginBottom :  20,
    },
    text: {
      fontSize: 14,
      fontWeight: '400',
      color: colors.tText.default,
    },
    title: {
      marginBottom: 20,
      fontSize: 24,
      fontWeight: '600',
      textAlign: 'center',
      textTransform: 'capitalize',
      color: colors.tText.default,
    },
    title2: {
      marginBottom: 30,
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
    noteWrap: {
      alignItems: 'flex-start',
      marginBottom: 16,
    },
    wrapItem: {
      backgroundColor: colors.tBackground.alternative,
      width: '100%',
      borderRadius: 18,
      paddingHorizontal: 16,
      paddingVertical: 32,
      paddingBottom: 16,
      marginTop: 32,
      marginBottom: 64,
    },
  });
