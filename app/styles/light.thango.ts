import { ThangoThemeColors } from '../../app/types/common.thangoType';
import colorThango from './color.thango';

export const thangoLight: ThangoThemeColors = {
  ['tvn.black']: '#222222',
  ['tvn.blue']: '#277EFF', // colors.primary.default
  ['tvn.white']: '#FFFFFF',
  ['tvn.grayLight']: '#999999',
  ['tvn.grayDark']: ' #333333',
  ['tvn.primary.default']: '#277EFF',
  ['tvn.innerBackground.default']: '#222222', // colors.innerBackground.default
  ['tvn.text.muted']: '#FFFFFF',
  ['tvn.text.default']: '#FFFFFF',

  // COLOR NAME FIGMA
  ['tvn.gray.01']: '#FFFFFF',
  ['tvn.gray.02']: '#F8F8F8',
  ['tvn.gray.04']: '#DCDCDC',
  ['tvn.gray.05']: '#CECECE',
  ['tvn.gray.06']: '#BABABA',
  ['tvn.gray.10']: '#333333',
  ['tvn.light_gray_blue']: '#F3F6FB',
  ['tvn.address']: '#AFAFAF',
  ['tvn.dark_gray_blue']: '#97A8C1',
  ['tvn.primary.blue']: '#277EFF',
  ['tvn.background.linear1']: '#7EDDFE',
  ['tvn.background.linear2']: '#92A0FE',
  ['tvn.orange.linear1']: '#DF7B1F',
  ['tvn.orange.linear2']: '#F3BA2F',
  ['tvn.main.wallet.linear1']: '#7EDDFE',
  ['tvn.main.wallet.linear2']: '#92A0FE',
  ['tvn.status.orange']: '#FF8717',
  ['tvn.status.red']: '#FF2517',
  ['tvn.background.asset.action.button']: '#ffffff33',

  // DEFINE CONSTANT
  tBackground: {
    default: colorThango.light,
    defaultHover: '#FAFBFC',
    defaultPressed: '#FAFBFC',
    alternative: '#F2F4F6',
    alternativeHover: '#D6D9DC',
    alternativePressed: '#D6D9DC',
  },
  tText: {
    default: colorThango.gray10,
    alternative: '#535A61',
    muted: '#BBC0C5',
  },
  tIcon: {
    default: colorThango.gray10,
    alternative: '#6A737D',
    muted: '#BBC0C5',
  },
  tBorder: {
    default: colorThango.gray06,
    muted: '#D6D9DC',
  },
  tOverlay: {
    default: '#00000099',
    inverse: '#FCFCFC',
    alternative: '#000000CC',
  },
  tShadow: {
    default: '#0000001A',
  },
  tPrimary: {
    default: colorThango.primary,
    alternative: '#0260A4',
    muted: '#0376C919',
    inverse: '#FCFCFC',
    disabled: '#0376C980',
    shadow: '#0376C933',
  },
  tSecondary: {
    default: '#F66A0A',
    alternative: '#C65507',
    muted: '#F66A0A19',
    inverse: '#FCFCFC',
    disabled: '#F66A0A80',
  },
  tError: {
    default: '#D73847',
    alternative: '#B92534',
    muted: '#D7384719',
    inverse: '#FCFCFC',
    disabled: '#D7384780',
    shadow: '#D7384766',
  },
  tWarning: {
    default: '#F66A0A',
    alternative: '#FFC70A',
    muted: '#FFD33D19',
    inverse: '#FCFCFC',
    disabled: '#FFD33D80',
  },
  tSuccess: {
    default: '#28A745',
    alternative: '#1E7E34',
    muted: '#28A74519',
    inverse: '#FCFCFC',
    disabled: '#28A74580',
  },
  tInfo: {
    default: '#0376C9',
    alternative: '#0260A4',
    muted: '#0376C919',
    inverse: '#FCFCFC',
    disabled: '#0376C980',
  },
  tNetworks: {
    goerli: {
      default: '#1098FC',
      inverse: '#FCFCFC',
    },
    localhost: {
      default: '#BBC0C5',
      inverse: '#FCFCFC',
    },
    sepolia: {
      default: '#CFB5F0',
      inverse: '#FCFCFC',
    },
  },
  flask: {
    default: '#8B45B6',
    inverse: '#FCFCFC',
  },
};
