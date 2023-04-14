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
    third: colorThango.gray10,
    fourth: colorThango.gray10,
    defaultHover: '#FAFBFC',
    defaultPressed: '#FAFBFC',
    alternative: colorThango.dark03,
    alternativeHover: '#D6D9DC',
    alternativePressed: '#D6D9DC',
  },
  tText: {
    default: colorThango.light,
    secondary: colorThango.dark05,
    alternative: '#535A61',
    muted: '#BBC0C5',
    address: colorThango.gray09,
    button: colorThango.dark07,
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
  background: {
    ...darkTheme.colors['background'],
    default: colorThango.dark,
  },
  tGradient: {
    onBoarding: colorThango.backgroundOnboarding,
    transaction: colorThango.orangeLinear,
    receive: colorThango.receiveLinearBackground,
    wallet: colorThango.maiWalletLinear,
  },
  tSwitch: {
    default: colorThango.dark07,
  },
  tButton: {
    disable: colorThango.dark03,
    secondary: colorThango.gray09,
  },
};
