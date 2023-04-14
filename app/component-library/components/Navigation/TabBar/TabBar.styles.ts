// Third party dependencies.
import { StyleSheet } from 'react-native';

// External dependencies.
import { Theme } from '../../../../util/theme/models';

// Internal dependencies.
import { TabBarStyleSheetVars } from './TabBar.types';
import { CustomTheme } from '../../../..//util/theme';

/**
 * Style sheet function for TabBar component.
 *
 * @param params Style sheet params.
 * @param params.theme App theme from ThemeContext.
 * @param params.vars Inputs that the style sheet depends on.
 * @returns StyleSheet object.
 */
const styleSheet = (params: {
  vars: TabBarStyleSheetVars;
  theme: CustomTheme;
}) => {
  const {
    vars: { bottomInset },
    theme: { colors },
  } = params;
  return StyleSheet.create({
    base: {
      flexDirection: 'row',
      alignItems: 'center',
      height: 82,
      paddingHorizontal: 16,
      marginBottom: bottomInset,
      borderTopWidth: 0.5,
      borderColor: colors.border.muted,
      backgroundColor: colors.tBackground.default,
    },
  });
};

export default styleSheet;
