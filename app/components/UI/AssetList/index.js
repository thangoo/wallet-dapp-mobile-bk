import React, { PureComponent, useState } from 'react';
import { connect, useSelector } from 'react-redux';
import { View, StyleSheet, Platform, ScrollView } from 'react-native';
import PropTypes from 'prop-types';
import SwitchToggle from 'react-native-switch-toggle';
import { strings } from '../../../../locales/i18n';
import StyledButton from '../StyledButton'; // eslint-disable-line  import/no-unresolved
import AssetIcon from '../AssetIcon';
import { colors as importedColors, fontStyles } from '../../../styles/common';
import Text from '../../Base/Text';
import generateTestId from '../../../../wdio/utils/generateTestId';
import { ThemeContext, mockTheme, useTheme } from '../../../util/theme';
import { TOKEN_RESULTS_LIST_ID } from '../../../../wdio/screen-objects/testIDs/Screens/AssetSearch.testIds';

const createStyles = (colors) =>
  StyleSheet.create({
    rowWrapper: {
      paddingTop: 10,
      paddingLeft: 20,
      paddingRight: 20,
      paddingBottom: 20,
      flex: 1,
    },
    item: {
      marginBottom: 5,
      padding: 8,
      borderRadius: 16,
      height: 75,
      backgroundColor: colors.tBackground.third,
    },
    assetListElement: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      height: 40,
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
      color: colors.tText.default,
      ...fontStyles.bold,
    },
    symbol: {
      // padding: 16,
      fontSize: 12,
      color: colors.tText.address,
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
        borderColor: colors.gray01,
        borderWidth: 1,
      },
      circleStyle: {
        width: 19,
        height: 19,
        borderRadius: 20,
      },
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
    handleToggleAsset: PropTypes.func,
    /**
     * Object of the currently-selected token
     */
    selectedAsset: PropTypes.object,
    /**
     * Search query that generated "searchResults"
     */
    searchQuery: PropTypes.string,
    /**
     * An array that represents the user tokens
     */
    tokens: PropTypes.array,
  };

  toggleToken = (key) => {
    const { searchResults, handleSelectAsset } = this.props;
    onToggleAsset(searchResults[key]);
  };

  render = () => {
    const { searchResults = [], handleSelectAsset, selectedAsset } = this.props;
    const colors = this.context.colors || mockTheme.colors;
    const styles = createStyles(colors);

    checkExist = (item) => {
      const { tokens } = this.props;
      return tokens.some(
        (element) =>
          element.address.toUpperCase() == item.address.toUpperCase(),
      );
    };

    const { searchQuery, handleToggleAsset } = this.props;

    return (
      <ScrollView
        style={styles.rowWrapper}
        testID={'add-searched-token-screen'}
      >
        {/* {searchResults.length > 0 ? (
          <Text style={styles.normalText} testID={'select-token-title'}>
            {strings('token.select_token')}
          </Text>
        ) : null} */}
        {searchResults.length === 0 && searchQuery.length ? (
          <Text style={styles.normalText}>
            {strings('token.no_tokens_found')}
          </Text>
        ) : null}
        {searchResults.slice(0, 6).map((item, i) => {
          const isExist = checkExist(item);
          return (
            <StyledButton
              type={'tokenList'}
              containerStyle={styles.item}
              // onPress={() => handleSelectAsset(searchResults[i])} // eslint-disable-line
              key={i}
              {...generateTestId(Platform, TOKEN_RESULTS_LIST_ID)}
            >
              <TokenItem
                item={item}
                id={i}
                onToggleAsset={handleToggleAsset}
                selectedAsset={isExist}
              />
            </StyledButton>
          );
        })}
      </ScrollView>
    );
  };
}

const TokenItem = ({ item, id, onToggleAsset, selectedAsset }) => {
  const { colors } = useTheme();
  const [isSelected, setIsSelected] = useState(selectedAsset);
  const { symbol, name, address, iconUrl } = item || {};
  const styles = createStyles(colors);

  const toggleSwitch = (item) => {
    setIsSelected(!isSelected);
    onToggleAsset(item, isSelected);
  };

  return (
    <View key={id} style={styles.assetListElement}>
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
        onPress={() => toggleSwitch(item)}
        circleColorOff={colors.tSwitch.default}
        circleColorOn={colors.tPrimary.default}
        backgroundColorOn={colors.tBackground.fifth}
        backgroundColorOff={colors.tBackground.fifth}
        containerStyle={styles.switch.containerStyle}
        circleStyle={styles.switch.circleStyle}
      />
    </View>
  );
};

const mapStateToProps = (state) => ({
  tokens: state.engine.backgroundState.TokensController.tokens,
});

AssetList.contextType = ThemeContext;

export default connect(mapStateToProps)(AssetList);
