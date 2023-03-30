import React, { PureComponent, useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import PropTypes from 'prop-types';
import SwitchToggle from "react-native-switch-toggle";
import { strings } from '../../../../locales/i18n';
import StyledButton from '../StyledButton'; // eslint-disable-line  import/no-unresolved
import AssetIcon from '../AssetIcon';
import { colors as importedColors, fontStyles } from '../../../styles/common';
import Text from '../../Base/Text';
import generateTestId from '../../../../wdio/utils/generateTestId';
import { useTheme } from '../../../util/theme';
import { TOKEN_RESULTS_LIST_ID } from '../../../../wdio/screen-objects/testIDs/Screens/AssetSearch.testIds';

const styles = StyleSheet.create({
  rowWrapper: {
    paddingTop: 10,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 20,
  },
  item: {
    marginBottom: 5,
    padding: 8,
    borderRadius: 16,
  },
  assetListElement: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tokenIcon: {
    width: 32,
    height: 32,
  },
  textWrapper: {
    flex: 1,
    flexDirection: 'column',
    marginLeft: 12,
  },
  text: {
    // padding: 16,
    fontSize: 14,
    color: importedColors.gray,
    ...fontStyles.bold,
  },
  symbol: {
    // padding: 16,
    fontSize: 12,
    color: importedColors.lgray,
    ...fontStyles.normal,
  },
  normalText: {
    ...fontStyles.normal,
  },
  switch: {
    containerStyle: {
      width: 44,
      height: 24,
      borderRadius: 25,
      padding: 5,
    },
    circleStyle: {
      width: 19,
      height: 19,
      borderRadius: 20,
    }
  }
});

/**
 * PureComponent that provides ability to search assets.
 */
export default class AssetList extends PureComponent {
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
    selectedAsset: PropTypes.object,
    /**
     * Search query that generated "searchResults"
     */
    searchQuery: PropTypes.string,
  };



  onToggleAsset = (key) => {
    const { searchResults, handleSelectAsset } = this.props;
    handleSelectAsset(searchResults[key]);
  };




  render = () => {
    const { searchResults = [], handleSelectAsset, selectedAsset } = this.props;

    toggleToken = (key) => {
      // console.log('### searchResults[key]: ', searchResults[key]);
      handleSelectAsset(searchResults[key]);
    }

    return (
      <View style={styles.rowWrapper} testID={'add-searched-token-screen'}>
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
        {searchResults.slice(0, 6).map((_, i) => {
          return (
            <StyledButton
              type={'tokenList'}
              containerStyle={styles.item}
              // onPress={() => handleSelectAsset(searchResults[i])} // eslint-disable-line
              key={i}
              {...generateTestId(Platform, TOKEN_RESULTS_LIST_ID)}
            >
              <TokenItem item={searchResults[i]} key={i} toggleToken={toggleToken} selectedAsset={selectedAsset} />
            </StyledButton>
          );
        })}
      </View>
    );
  };
}

const TokenItem = ({ item, key, toggleToken, selectedAsset }) => {
  const { colors } = useTheme();
  const [isSelected, setIsSelected] = useState(selectedAsset && selectedAsset.address === address);
  const { symbol, name, address, iconUrl } = item || {};

  const toggleSwitch = (key) => {
    // isSelected = !isSelected;
    setIsSelected(!isSelected);
    toggleToken(key);
  }

  return (
    <View style={styles.assetListElement}>
      <AssetIcon
        address={address}
        logo={iconUrl}
        customStyle={styles.tokenIcon}
      />
      <View style={styles.textWrapper}>
        <Text style={styles.text}>{name}</Text>
        <Text style={styles.symbol}>{symbol}</Text>
      </View>
      <SwitchToggle
        switchOn={isSelected}
        onPress={() => toggleSwitch(key)}
        circleColorOff={colors['tvn.gray.06']}
        circleColorOn={colors['tvn.primary.blue']}
        backgroundColorOn={colors['tvn.white']}
        backgroundColorOff={colors['tvn.white']}
        containerStyle={styles.switch.containerStyle}
        circleStyle={styles.switch.circleStyle}
      />
    </View>)
}
