import React, { PureComponent, useState } from 'react';
import { SafeAreaView, View, StyleSheet } from 'react-native';
import { fontStyles } from '../../../styles/common';
import { connect } from 'react-redux';
import DefaultTabBar from 'react-native-scrollable-tab-view/DefaultTabBar';
import AddCustomToken from '../../UI/AddCustomToken';
import SearchTokenAutocomplete from '../../UI/SearchTokenAutocomplete';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import PropTypes from 'prop-types';
import { strings } from '../../../../locales/i18n';
import AddCustomCollectible from '../../UI/AddCustomCollectible';
import { getScreenNavbarOptions } from '../../UI/Navbar';
import CollectibleDetectionModal from '../../UI/CollectibleDetectionModal';
import { isTokenDetectionSupportedForNetwork } from '@metamask/assets-controllers/dist/assetsUtil';
import { ThemeContext, mockTheme } from '../../../util/theme';
import { MAINNET } from '../../../constants/network';
import {
  selectChainId,
  selectProviderType,
} from '../../../selectors/networkController';
import { tHeaderOptions } from '../../../../app/components/UI/Navbar/index.thango';

const createStyles = (colors) =>
  StyleSheet.create({
    wrapper: {
      flex: 1,
      backgroundColor: colors.background.default,
    },
    infoWrapper: {
      alignItems: 'center',
      marginTop: 10,
    },
    tabUnderlineStyle: {
      height: 2,
      backgroundColor: colors.primary.default,
    },
    tabBar: {
      borderColor: colors.border.muted,
    },
    tabStyle: {
      paddingBottom: 0,
    },
    textStyle: {
      fontSize: 14,
      ...fontStyles.bold,
    },
  });

/**
 * PureComponent that provides ability to add assets.
 */
class AddAsset extends PureComponent {
  state = {
    address: '',
    symbol: '',
    decimals: '',
    dismissNftInfo: false,
    // isSearchToken: true,
  };

  static propTypes = {
    /**
    /* navigation object required to push new views
    */
    navigation: PropTypes.object,
    /**
     * Network type
     */
    networkType: PropTypes.string,
    /**
     * Chain id
     */
    chainId: PropTypes.string,
    /**
     * Object that represents the current route info like params passed to it
     */
    route: PropTypes.object,
    /**
     * Boolean to show if NFT detection is enabled
     */
    useNftDetection: PropTypes.bool,
  };

  updateNavBar = () => {
    const { navigation, route } = this.props;
    const colors = this.context.colors || mockTheme.colors;
    const title = strings(
      route.params.assetType === 'token'
        ? 'add_asset.title'
        : 'add_asset.title_nft',
    );
    navigation.setOptions(tHeaderOptions(route, colors, { title }));
  };

  componentDidMount = () => {
    this.updateNavBar();
  };

  componentDidUpdate = () => {
    this.updateNavBar();
  };

  renderTabBar() {
    const colors = this.context.colors || mockTheme.colors;
    const styles = createStyles(colors);

    return (
      <DefaultTabBar
        underlineStyle={styles.tabUnderlineStyle}
        activeTextColor={colors.tText.default}
        inactiveTextColor={colors.tText.default}
        backgroundColor={colors.background.default}
        tabStyle={styles.tabStyle}
        textStyle={styles.textStyle}
        style={styles.tabBar}
      />
    );
  }

  dismissNftInfo = async () => {
    this.setState({ dismissNftInfo: true });
  };

  changeToCustomToken = async () => {
    this.setState({ isSearchToken: false });
  };
  render = () => {
    const {
      route: {
        params: { assetType, collectibleContract },
      },
      navigation,
      chainId,
      useNftDetection,
      networkType,
    } = this.props;
    const { dismissNftInfo, isSearchToken } = this.state;
    const isTokenDetectionSupported =
      isTokenDetectionSupportedForNetwork(chainId);
    const colors = this.context.colors || mockTheme.colors;
    const styles = createStyles(colors);

    return (
      <View style={styles.wrapper} testID={`add-${assetType}-screen`}>
        {networkType === MAINNET &&
          assetType !== 'token' &&
          !dismissNftInfo &&
          !useNftDetection && (
            <View style={styles.infoWrapper}>
              <CollectibleDetectionModal
                onDismiss={this.dismissNftInfo}
                navigation={navigation}
              />
            </View>
          )}
        {assetType === 'token' ? (
          <ScrollableTabView
            key={chainId}
            renderTabBar={() => this.renderTabBar()}
          >
            {isTokenDetectionSupported && (
              <SearchTokenAutocomplete
                navigation={navigation}
                // onChangeCustomToken={this.changeToCustomToken}
                tabLabel={strings('add_asset.search_token')}
                testID={'tab-search-token'}
              />
            )}
            <AddCustomToken
              navigation={navigation}
              tabLabel={strings('add_asset.custom_token')}
              testID={'tab-add-custom-token'}
              isTokenDetectionSupported={isTokenDetectionSupported}
            />
          </ScrollableTabView>
        ) : (
          <AddCustomCollectible
            navigation={navigation}
            collectibleContract={collectibleContract}
            testID={'add-custom-collectible'}
          />
        )}
      </View>
    );
  };
}

AddAsset.contextType = ThemeContext;

const mapStateToProps = (state) => ({
  networkType: selectProviderType(state),
  chainId: selectChainId(state),
  useNftDetection:
    state.engine.backgroundState.PreferencesController.useNftDetection,
});

export default connect(mapStateToProps)(AddAsset);
