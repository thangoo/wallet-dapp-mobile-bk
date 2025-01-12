import React, { ReactNode } from 'react';
import { Image, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Alert, { AlertType } from '../../../Base/Alert';
import { useTheme } from '../../../../util/theme';
import { shield_warning_icon } from '../../../../images/index';

interface Props {
  /**
   * Warning message to display (Plain text or JSX)
   */
  warningMessage: ReactNode;
  style?: StyleProp<ViewStyle>;
}

const styles = StyleSheet.create({
  icon: {
    paddingTop: 4,
    paddingRight: 8,
  },
});

const WarningMessage = ({ warningMessage, style }: Props) => {
  const { colors } = useTheme();

  return (
    <Alert
      type={AlertType.Warning}
      style={style}
      renderIcon={() => (
        // <FontAwesome
        //   style={styles.icon}
        //   name={'exclamation-circle'}
        //   color={colors.warning.default}
        //   size={18}
        // />
        <Image
          source={shield_warning_icon}
          style={{ width: 24, height: 24, marginRight: 16 }}
          resizeMode="contain"
        />
      )}
    >
      {warningMessage}
    </Alert>
  );
};

export default WarningMessage;
