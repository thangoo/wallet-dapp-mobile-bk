import HStack from '../../../../app/components/Base/HStack';
import { shield_warning_2_icon } from 'images/index';
import React, { forwardRef, useImperativeHandle } from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import ReactNativeModal from 'react-native-modal';
import { useToggle } from 'react-use';
import { CustomTheme, useTheme } from '../../../util/theme';
import StyledButton from '../../UI/StyledButton';
import { strings } from '../../../../locales/i18n';

const NOTES = [
  'Your 12-word secret phrase is the master key to your wallet. Anyone that has your secret phrase can access and take your crypto.',
  'Payme Wallet does not keep a copy of your secret phrase.',
  'Unencrypted digital copies of your secret phrase are NOT recommended. Examples include saving copies on computer, in email, on online accounts, or by taking screenshots.',
  'Write down your secret phrase, and store it in a secure offline location!',
];

interface Props {
  onNext: () => void;
}

interface RefHandle {
  toggle: () => void;
}

const ReadMoreModal = forwardRef<RefHandle, Props>(({ onNext }, ref) => {
  const [toggle, setToggle] = useToggle(false);
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

  return (
    <ReactNativeModal
      swipeDirection="down"
      propagateSwipe
      style={styles.modal}
      backdropTransitionOutTiming={0}
      isVisible={toggle}
      onBackdropPress={setToggle}
      onBackButtonPress={setToggle}
      onSwipeComplete={setToggle}
    >
      <View style={styles.body}>
        <View style={styles.dragger} />
        <Image
          source={shield_warning_2_icon}
          style={{ width: 56, height: 56 }}
        />
        <Text style={styles.title}>
          {'Never share your secret phrase with anyone'}
        </Text>

        {NOTES.map((t, index) => (
          <NoteItem key={index} index={index} content={t} />
        ))}

        <HStack style={{ marginTop: 32, marginBottom: 24 }}>
          <Image
            source={shield_warning_2_icon}
            style={{ width: 24, height: 24, marginRight: 16 }}
          />
          <Text style={[styles.text, { color: colors.tWarning.default }]}>
            {
              'Your 12-word secret phrase is only way to recover your wallet. Please store it securely!'
            }
          </Text>
        </HStack>

        <StyledButton
          testID={'manual-backup-step-1-continue-button'}
          type={'confirm'}
          onPress={handlePress}
          containerStyle={{ width: '100%', marginBottom: 20 }}
        >
          {strings('manual_backup_step_1.continue')}
        </StyledButton>
      </View>
    </ReactNativeModal>
  );
});

type ReadMoreModal = RefHandle;

export default ReadMoreModal;

const NoteItem = ({ index, content }: { index: number; content: string }) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <HStack style={styles.noteWrap}>
      <View style={styles.indexText}>
        <Text style={[styles.text, { color: colors.gray01 }]}>{index}</Text>
      </View>
      <View style={{ flex: 1, marginLeft: 16 }}>
        <Text style={styles.text}>{content}</Text>
      </View>
    </HStack>
  );
};

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
      color: colors.tText.default,
    },
    dragger: {
      width: 36,
      height: 5,
      borderRadius: 2.5,
      backgroundColor: colors.tBorder.default,
      marginTop: 6,
      marginBottom: 32,
    },
    noteWrap: {
      borderBottomWidth: 1,
      marginTop: 16,
      paddingBottom: 16,
      borderBottomColor: colors.tBorder.default,
      alignItems: 'flex-start',
    },
    indexText: {
      width: 32,
      height: 32,
      backgroundColor: colors.tWarning.default,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
