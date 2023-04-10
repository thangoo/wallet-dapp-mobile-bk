import { Theme } from '../../app/util/theme/models';
import { ThangoThemeColors } from '../../app/types/common.thangoType';
import colorThango from './color.thango';
import { thangoLight } from './light.thango';
import { darkTheme } from '@metamask/design-tokens';

export const thangoDark: ThangoThemeColors & Theme['colors'] = {
  ...thangoLight,
  ...darkTheme.colors,
  // OVERRIDE
  tBackground: {
    default: colorThango.dark,
    secondary: colorThango.dark02,
    defaultHover: '#FAFBFC',
    defaultPressed: '#FAFBFC',
    alternative: colorThango.darkGrayBlue,
    alternativeHover: '#D6D9DC',
    alternativePressed: '#D6D9DC',
  },
  tText: {
    default: colorThango.light,
    alternative: '#535A61',
    muted: '#BBC0C5',
  },
  tBorder: {
    default: colorThango.dark05,
    muted: '#D6D9DC',
  },
  tIcon: {
    default: colorThango.gray01,
    alternative: '#6A737D',
    muted: '#BBC0C5',
  },
  tInput: {
    backgroundColor: {
      default: colorThango.gray02,
    }
  },
  background: {
    ...darkTheme.colors['background'],
    default: colorThango.dark,
  },
};
