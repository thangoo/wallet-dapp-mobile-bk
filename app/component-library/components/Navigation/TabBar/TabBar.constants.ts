/* eslint-disable import/prefer-default-export */

// Third party dependencies.
import {
  icon_tab_01,
  icon_tab_02,
  icon_tab_03,
  icon_tab_04,
} from '../../../../images/index';
import { IconName } from '../../Icons/Icon';

// Internal dependencies.
import { IconByTabBarIconKey, TabBarIconKey } from './TabBar.types';

export const ICON_BY_TAB_BAR_ICON_KEY: IconByTabBarIconKey = {
  [TabBarIconKey.Wallet]: icon_tab_01,
  [TabBarIconKey.Browser]: icon_tab_02,
  [TabBarIconKey.Market]: icon_tab_03,
  [TabBarIconKey.Scan]: icon_tab_03,
  [TabBarIconKey.Settings]: icon_tab_04,
};
