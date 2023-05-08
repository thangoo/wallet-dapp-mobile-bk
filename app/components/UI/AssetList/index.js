import React, { PureComponent } from 'react';
import {
  View,
  StyleSheet,
  Platform,
  Image,
  TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
import { strings } from '../../../../locales/i18n';
import StyledButton from '../StyledButton'; // eslint-disable-line  import/no-unresolved
import AssetIcon from '../AssetIcon';
import { fontStyles } from '../../../styles/common';
import Text from '../../Base/Text';
import generateTestId from '../../../../wdio/utils/generateTestId';
import { TOKEN_RESULTS_LIST_ID } from '../../../../wdio/screen-objects/testIDs/Screens/AssetSearch.testIds';
import { ThemeContext, mockTheme } from '../../../util/theme';
import { check_blue_none_bg } from '../../../images/index';
import _ from 'lodash';
import { ScrollView } from 'react-native-gesture-handler';

const createStyles = (colors) =>
  StyleSheet.create({
    rowWrapper: {
      marginTop: 16,
    },
    item: {
      marginHorizontal: 16,
      marginBottom: 12,
      borderRadius: 12,
      borderWidth: 1,
      backgroundColor: colors.tBackground.third,
      paddingHorizontal: 16,
      paddingVertical: 8,
    },
    unselectBackground: {
      borderColor: 'transparent',
    },
    selectBackground: {
      borderColor: colors.tPrimary.default,
    },
    assetListElement: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    textName: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.tText.default,
    },
    textSymbol: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.tText.address,
    },
    normalText: {
      ...fontStyles.normal,
    },
    errorImage: {
      width: 50,
      height: 50,
      marginTop: 24,
    },
    disabled: {
      backgroundColor: colors.tBackground.third,
    },
  });

/**
 * PureComponent that provides ability to search assets.
 */
class AssetList extends PureComponent {
  static propTypes = {
    /**
     * Array of assets objects returned from the search
     */
    searchResults: PropTypes.array,
    /**
     * Callback triggered when a token is selected
     */
    handleSelectAsset: PropTypes.func,
    /**
     * Object of the currently-selected token
     */
    selectedAsset: PropTypes.array,
    /**
     * Search query that generated "searchResults"
     */
    searchQuery: PropTypes.string,
    tokens: PropTypes.array,
    selected: PropTypes.bool,
  };

  onToggleAsset = (key) => {
    const { searchResults, handleSelectAsset } = this.props;
    handleSelectAsset(searchResults[key]);
  };

  render = () => {
    const colors = this.context.colors || mockTheme.colors;
    const styles = createStyles(colors);
    const {
      searchResults = [],
      handleSelectAsset,
      selectedAsset,
      tokens,
    } = this.props;

    // const dataTokens = [...searchResults];
    // _.forEach(tokens, (tk) => {
    //   _.remove(dataTokens, (opt) => opt.symbol === tk.symbol);
    // });

    // Disabled token imported
    const compareTokenList = (obj1, obj2) => obj1.symbol === obj2.symbol;
    const handleResult = _.map(searchResults.slice(0, 7), (obj) => ({
      ...obj,
      selected: false,
    }));
    handleResult.forEach((obj2) => {
      const obj1 = _.find(tokens, _.partial(compareTokenList, obj2));
      if (obj1) {
        obj2.selected = true;
      }
    });

    return (
      <ScrollView
        style={styles.rowWrapper}
        testID={'add-searched-token-screen'}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        {/* {searchResults.length > 0 ? (
          <Text style={styles.normalText} testID={'select-token-title'}>
            {strings('token.select_token')}
          </Text>
        ) : null} */}
        {searchResults.length === 0 && this.props.searchQuery.length ? (
          <Text style={styles.normalText}>
            {strings('token.no_tokens_found')}
          </Text>
        ) : null}
        {handleResult.map((_, i) => {
          const { symbol, name, address, iconUrl, selected } =
            handleResult[i] || {};
          const isSelected = selectedAsset.some(
            (element) => element.address.toUpperCase() == address.toUpperCase(),
          );
          return (
            <TouchableOpacity
              key={i}
              style={[
                styles.item,
                isSelected
                  ? styles.selectBackground
                  : styles.unselectBackground,
              ]}
              onPress={() => handleSelectAsset(searchResults[i])}
              disabled={selected}
            >
              <View style={styles.assetListElement}>
                <AssetIcon
                  address={address}
                  logo={iconUrl}
                  customStyle={{ height: 40, width: 40, marginRight: 16 }}
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.textName}>{name}</Text>
                  <Text style={styles.textSymbol}>{symbol}</Text>
                </View>
                {isSelected && (
                  <View>
                    <Image
                      source={check_blue_none_bg}
                      style={{ width: 24, height: 24 }}
                    />
                  </View>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    );
  };
}
AssetList.contextType = ThemeContext;

export default AssetList;
