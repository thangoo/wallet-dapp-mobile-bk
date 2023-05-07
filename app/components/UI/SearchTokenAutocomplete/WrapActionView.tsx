import React, { FC, PropsWithChildren } from 'react';
import StyledButton from '../StyledButton';
import {
  Keyboard,
  StyleSheet,
  View,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from 'react-native';
import { baseStyles } from '../../../styles/common';
import { strings } from '../../../../locales/i18n';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useTheme } from '../../../util/theme';

const createStyles = (colors: any) =>
  StyleSheet.create({
    wrapper: {
      flex: 1,
    },
    actionContainer: {
      flex: 0,
      flexDirection: 'row',
      paddingVertical: 16,
      paddingHorizontal: 24,
      borderTopWidth: 1,
      borderTopColor: colors.tBorder.fourth,
    },
    button: {
      flex: 1,
    },
    cancel: {
      marginRight: 8,
      borderColor: colors.tPrimary.default,
    },
    confirm: {
      marginLeft: 8,
    },
    containerFullScreen: {
      ...baseStyles.flexGrow,
      marginBottom: 30,
    },
  });

interface Props {
  cancelTestID?: string;
  confirmTestID?: string;
  cancelText?: string;
  children?: React.ReactNode;
  confirmButtonMode?: ['normal', 'confirm', 'sign'] | string;
  confirmText?: string;
  confirmed?: boolean;
  confirmDisabled?: boolean;
  onCancelPress?: () => void;
  onConfirmPress?: () => void;
  onTouchablePress?: () => void;
  showCancelButton?: boolean;
  showConfirmButton?: boolean;
  keyboardShouldPersistTaps?: string | boolean;
  style?: object;
  styledButtonProps?: object;
  containerStyle?: object;
  isFullScreen?: boolean;
}
const WrapActionView: FC<PropsWithChildren<Props>> = (props) => {
  const {
    cancelTestID = '',
    confirmTestID = '',
    cancelText = strings('action_view.cancel'),
    children,
    confirmText = strings('action_view.confirm'),
    confirmButtonMode = 'normal',
    onCancelPress,
    onConfirmPress,
    onTouchablePress,
    showCancelButton = true,
    showConfirmButton = true,
    confirmed = false,
    confirmDisabled,
    keyboardShouldPersistTaps = 'never',
    style = undefined,
    containerStyle = undefined,
    styledButtonProps = undefined,
    isFullScreen = false,
  } = props;
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <View style={styles.wrapper}>
      <KeyboardAwareScrollView
        style={[baseStyles.flexGrow, style]}
        contentContainerStyle={[
          isFullScreen ? styles.containerFullScreen : {},
          containerStyle,
        ]}
        resetScrollToCoords={{ x: 0, y: 0 }}
        keyboardShouldPersistTaps={keyboardShouldPersistTaps}
      >
        <TouchableWithoutFeedback
          style={baseStyles.flexGrow}
          // eslint-disable-next-line react/jsx-no-bind
          onPress={() => {
            if (keyboardShouldPersistTaps === 'handled') {
              Keyboard.dismiss();
            }
            onTouchablePress && onTouchablePress();
          }}
        >
          {children}
        </TouchableWithoutFeedback>

        <View style={styles.actionContainer}>
          {showCancelButton && (
            <StyledButton
              testID={cancelTestID}
              type={confirmButtonMode === 'sign' ? 'signingCancel' : 'normal'}
              onPress={onCancelPress}
              containerStyle={[styles.button, styles.cancel]}
              disabled={confirmed}
              {...styledButtonProps}
            >
              {cancelText}
            </StyledButton>
          )}
          {showConfirmButton && (
            <StyledButton
              testID={confirmTestID}
              type={confirmButtonMode}
              onPress={onConfirmPress}
              containerStyle={[styles.button, styles.confirm]}
              disabled={confirmed || confirmDisabled}
              {...styledButtonProps}
            >
              {confirmed ? (
                <ActivityIndicator
                  size="small"
                  color={colors.primary.inverse}
                />
              ) : (
                confirmText
              )}
            </StyledButton>
          )}
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};
export default WrapActionView;
