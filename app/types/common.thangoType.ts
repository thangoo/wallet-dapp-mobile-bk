export interface ThangoThemeColors {
  ['tvn.black']?: string;
  ['tvn.blue']?: string;
  ['tvn.white']?: string;
  ['tvn.grayLight']?: string;
  ['tvn.grayDark']?: string;
  ['tvn.background.default']?: string; // colors.background.default
  ['tvn.primary.default']?: string;
  ['tvn.innerBackground.default']?: string; // colors.innerBackground.default
  ['tvn.text.muted']?: string;
  ['tvn.text.default']?: string;

  // COLOR NAME FIGMA
  ['tvn.gray.01']?: string;
  ['tvn.gray.02']?: string;
  ['tvn.gray.04']?: string;
  ['tvn.gray.05']?: string;
  ['tvn.gray.06']?: string;
  ['tvn.gray.10']?: string;
  ['tvn.light_gray_blue']?: string;
  ['tvn.dark_gray_blue']?: string;
  ['tvn.primary.blue']?: string;
  ['tvn.status.orange']?: string;
  ['tvn.status.red']?: string;

  gray01: string;
  gray04: string;
  // DEFINE CONSTANT
  tBackground: {
    /**
     * {string} background.default - For default neutral backgrounds
     */
    default: string;
    /**
     * {string} background.secondary - For default secondary backgrounds
     */
    secondary: string;
    /**
     * {string} background.defaultHover - For component hover states that use background/default
     */
    defaultHover: string;
    /**
     * {string} background.defaultPressed - For component pressed states that use background/default.
     */
    defaultPressed: string;
    /**
     * {string} background.alternative - For a subtle contrast option for neutral backgrounds. (Example: backdrop, header background)
     */
    alternative: string;
    /**
     * {string} background.alternativeHover - For component hover states that use background/alternative
     */
    alternativeHover: string;
    /**
     * {string} background.alternativePressed - For component pressed states that use background/alternative
     */
    alternativePressed: string;

    third: string;

    /**
     * {string} background.fourth - for background circle
     */
    fourth: string;
    fifth: string;
  };
  tText: {
    /**
     * {string} text.default - For general text that takes main priority in the information hierarchy
     */
    default: string;
    /**
     * {string} text.secondary - For general text that takes main priority in the information hierarchy
     */
    secondary: string;
    /**
     * {string} text.alternative - For a weaker contrast option for neutral text
     */
    alternative: string;
    /**
     * {string} text.muted - For inactive or lowest priority text. (Example: placeholder)
     */
    muted: string;
    /**
     * {string} text.address - For address
     */
    address: string;
    button: string;
    third: string;
  };
  tIcon: {
    /**
     * {string} icon.default - For default neutral icons
     */
    default: string;
    /**
     * {string} icon.alternative - For a weaker contrast option for neutral icons
     */
    alternative: string;
    /**
     * {string} icon.muted - For inactive or lowest priority icons
     */
    muted: string;
  };
  tBorder: {
    /**
     * {string} border.default - For default neutral borders with visible contrast. (Example: text inputs)
     */
    default: string;
    /**
     * {string} border.muted - For a weaker contrast option for neutral borders.
     */
    muted: string;
    secondary: string;
    third: string;
  };
  tOverlay: {
    /**
     * {string} overlay.default - For shading layers behind modality screens
     */
    default: string;
    /**
     * {string} overlay.alternative - For a stronger shading layer option behind modality screens
     */
    inverse: string;
    /**
     * {string} overlay.inverse - [DEPRECATED] Should be used for elements over an overlay
     */
    alternative: string;
  };
  tShadow: {
    /**
     * {string} shadow.default - For neutral shadows
     */
    default: string;
  };
  tPrimary: {
    /**
     * {string} primary.default - For primary user action related elements
     */
    default: string;
    /**
     * {string} primary.alternative - For the \"pressed\" state of interactive primary elements
     */
    alternative: string;
    /**
     * {string} primary.muted - For lowest contrast background used in primary elements
     */
    muted: string;
    /**
     * {string} primary.inverse - For elements used on top of primary/default. (Example: label of primary button, check in a checkbox)disabled state
     */
    inverse: string;
    /**
     * {string} primary.disabled - [DEPRECATED] Should be used for disabled state
     */
    disabled: string;
    /**
     * {string} primary.shadow - For primary button hover
     */
    shadow: string;
  };
  tSecondary: {
    /**
     * {string} secondary.default - [DEPRECATED] Should be used for any secondary actions. It should not be used for any negative connotations such as warnings or errors as it is quite closely tied to the MetaMask Fox
     */
    default: string;
    /**
     * {string} secondary.alternative - [DEPRECATED] Should be used as an alternative to secondary.default for things such as hover states
     */
    alternative: string;
    /**
     * {string} secondary.muted - [DEPRECATED] It’s a very low contrasting secondary variant for things such as alert backgrounds. secondary.muted and secondary.inverse should not be used together in a foreground and background combination
     */
    muted: string;
    /**
     * {string} secondary.inverse - [DEPRECATED] Should be used only as the foreground element on top of primary/default and primary/alternative. It is intended to be the most contrasting color to primary/default. It should meet all AA and AAA accessibility standards such as the text or icon of a primary button
     */
    inverse: string;
    /**
     * {string} secondary.disabled - [DEPRECATED] Should be used for all disabled secondary action components
     */
    disabled: string;
  };
  tError: {
    /**
     * {string} error.default - For high-level alert danger/critical elements. Used for text, background, icon or border
     */
    default: string;
    /**
     * {string} error.alternative - For the \"pressed\" state of interactive danger/critical elements
     */
    alternative: string;
    /**
     * {string} error.muted - For lowest contrast background used in high-level alert danger/critical elements. (Example: notification background)
     */
    muted: string;
    /**
     * {string} error.inverse - For elements used on top of error/default (Example: label of danger/critical button)
     */
    inverse: string;
    /**
     * {string} error.disabled - [DEPRECATED] Should be used for disabled state
     */
    disabled: string;
    /**
     * {string} error.shadow - For error danger/critical button hover
     */
    shadow: string;
  };
  tWarning: {
    /**
     * {string} warning.muted - For lowest contrast background used in warning elements. (Example: notification background)
     */
    default: string;
    /**
     * {string} warning.alternative - [DEPRECATED] Should be used as an alternative to warning/default for things like hover or pressed states
     */
    alternative: string;
    /**
     * {string} warning.muted - For lowest contrast background used in warning elements. (Example: notification background)
     */
    muted: string;
    /**
     * {string} warning.inverse - For elements used on top of warning/default. Used for text, icon or border
     */
    inverse: string;
    /**
     * {string} warning.disabled - [DEPRECATED] Should be used for disabled state
     */
    disabled: string;
  };
  tSuccess: {
    /**
     * {string} success.default - For positive & good semantic elements. Used for text, background, icon or border
     */
    default: string;
    /**
     * {string} success.alternative - [DEPRECATED] Should be used as an alternative to success/default for things like hover or pressed states
     */
    alternative: string;
    /**
     * {string} success.muted - For lowest contrast background used in success semantic. (Example: notification background)
     */
    muted: string;
    /**
     * {string} success.inverse -  For elements used on top of success/default. Used for text, icon or border
     */
    inverse: string;
    /**
     * {string} success.disabled - [DEPRECATED] Should be used for disabled state
     */
    disabled: string;
  };
  tInfo: {
    /**
     * {string} info.default - For informational semantic elements. Used for text, background, icon or border
     */
    default: string;
    /**
     * {string} info.alternative - [DEPRECATED] Should be used as an alternative to info/default for things like hover or pressed states
     */
    alternative: string;
    /**
     * {string} info.muted - For lowest contrast background used in informational semantic. (Example: notification background)
     */
    muted: string;
    /**
     * {string} info.inverse - For elements used on top of info/default. Used for text, icon or border
     */
    inverse: string;
    /**
     * {string} info.disabled - [DEPRECATED] Should be used for disabled state
     */
    disabled: string;
  };
  tNetworks: {
    goerli: {
      /**
       * {string} networks.goerli.default - For goerli test network colored elements
       */
      default: string;
      /**
       * {string} networks.goerli.inverse - For elements used on top of networks/goerli/default
       */
      inverse: string;
    };
    localhost: {
      /**
       * {string} networks.localhost.default - For localhost test network colored elements
       */
      default: string;
      /**
       * {string} networks.localhost.inverse - For elements used on top of networks/localhost/default
       */
      inverse: string;
    };
    sepolia: {
      /**
       * {string} networks.sepolia.default - For sepolia test network colored elements
       */
      default: string;
      /**
       * {string} networks.sepolia.inverse - For elements used on top of networks/sepolia/default
       */
      inverse: string;
    };
  };
  flask: {
    /**
     * {string} flask.default - For Flask colored elements
     */
    default: string;
    /**
     * {string} flask.inverse - For elements used on top of flask/default
     */
    inverse: string;
  };
  tGradient: {
    /**
     * {string[]}  For background gradient
     */
    onBoarding: string[];
    transaction: string[];
    receive: string[];
    wallet: string[];
  };
  tSwitch: {
    default: string;
    token: object;
  };
  tButton: {
    disable: string;
    secondary: string;
  };
}
