import HStack from '../../../../app/components/Base/HStack';
import {
  check_box_blue,
  check_box_empty,
  shield_warning_2_icon,
} from 'images/index';
import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity } from 'react-native';
import ReactNativeModal from 'react-native-modal';
import { useToggle } from 'react-use';
import { CustomTheme, useTheme } from '../../../util/theme';
import StyledButton from '../../UI/StyledButton';
import { strings } from '../../../../locales/i18n';
import { SafeAreaView } from 'react-native-safe-area-context';
import _ from 'lodash';

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

const ConfirmBackupModal = forwardRef<RefHandle, Props>(({ onNext }, ref) => {
  const [toggle, setToggle] = useToggle(false);
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const [selections, setSelections] = useState<number[]>([]);

  useImperativeHandle(ref, () => ({
    toggle: setToggle,
  }));

  const handlePress = () => {
    setToggle(false);
    setSelections([]);
    setTimeout(() => {
      onNext();
    }, 500);
  };

  console.log(selections);
  const handleSelect = (index: number) => {
    console.log(
      _.find(selections, (t) => t === index),
      'f',
    );

    if (_.find(selections, (t) => t === index)) {
      setSelections(_.filter(selections, (t) => t !== index));
    } else {
      setSelections((prev) => [...prev, index]);
    }
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

        <Text style={styles.title}>{strings('secret_phrase.heading')}</Text>
        <Text style={styles.title2}>{strings('secret_phrase.subheading')}</Text>

        <View
          style={{
            backgroundColor: colors['tvn.light_gray_blue'],
            width: '100%',
            borderRadius: 18,
            paddingHorizontal: 16,
            paddingVertical: 32,
            paddingBottom: 16,
            marginTop: 32,
            marginBottom: 64,
          }}
        >
          {[1, 2, 3].map((index) => (
            <CheckItem
              key={index}
              content={strings(`secret_phrase.title${index}`)}
              onPress={() => handleSelect(index + 1)}
              selected={Boolean(_.find(selections, (t) => t === index + 1))}
            />
          ))}
        </View>

        <SafeAreaView edges={['bottom']} style={{ width: '100%' }}>
          <StyledButton
            testID={'manual-backup-step-1-continue-button'}
            type={'confirm'}
            onPress={handlePress}
            containerStyle={{ width: '100%' }}
            disabled={_.size(selections) < 3}
          >
            {strings('manual_backup_step_1.continue')}
          </StyledButton>
        </SafeAreaView>
      </View>
    </ReactNativeModal>
  );
});

type ConfirmBackupModal = RefHandle;

export default ConfirmBackupModal;

const CheckItem = ({
  selected,
  content,
  onPress,
}: {
  selected: boolean;
  content: string;
  onPress: () => void;
}) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <TouchableOpacity onPress={onPress}>
      <HStack style={styles.noteWrap}>
        <Image
          source={selected ? check_box_blue : check_box_empty}
          style={{ width: 24, height: 24 }}
        />
        <View style={{ flex: 1, marginLeft: 16 }}>
          <Text style={[styles.text, { color: colors['tvn.gray.10'] }]}>
            {content}
          </Text>
        </View>
      </HStack>
    </TouchableOpacity>
  );
};

const createStyles = (colors: CustomTheme['colors']) =>
  StyleSheet.create({
    body: {
      backgroundColor: 'white',
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
      color: colors['tvn.white'],
    },
    title: {
      marginBottom: 16,
      fontSize: 24,
      fontWeight: '600',
      textAlign: 'center',
      textTransform: 'capitalize',
    },
    title2: {
      marginBottom: 16,
      fontSize: 14,
      fontWeight: '400',
      textAlign: 'center',
    },
    dragger: {
      width: 36,
      height: 5,
      borderRadius: 2.5,
      backgroundColor: colors['tvn.gray.04'],
      marginTop: 6,
      marginBottom: 32,
    },
    noteWrap: {
      alignItems: 'flex-start',
      marginBottom: 16,
    },
    indexText: {
      width: 32,
      height: 32,
      backgroundColor: colors['tvn.status.orange'],
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
