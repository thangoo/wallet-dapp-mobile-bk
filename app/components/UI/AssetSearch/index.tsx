import React, { memo, useEffect, useState, useCallback } from 'react';
import { TextInput, View, StyleSheet, Platform } from 'react-native';
import { fontStyles } from '../../../styles/common';
import { strings } from '../../../../locales/i18n';
import Fuse from 'fuse.js';
import Icon from 'react-native-vector-icons/FontAwesome';
import { toLowerCaseEquals } from '../../../util/general';
import { useSelector } from 'react-redux';
import { getTokenListArray } from '../../../reducers/tokens';
import { TokenListToken } from '@metamask/assets-controllers';
import { useTheme } from '../../../util/theme';
import generateTestId from '../../../../wdio/utils/generateTestId';
import { TOKEN_INPUT_BOX_ID } from '../../../../wdio/screen-objects/testIDs/Screens/AssetSearch.testIds';

const createStyles = (colors: any) =>
  StyleSheet.create({
    searchSection: {
      margin: 20,
      marginBottom: 0,
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderRadius: 12,
      borderColor: colors['tvn.gray.04'],
      color: colors.text.default,
    },
    textInput: {
      ...fontStyles.normal,
      color: colors.text.default,
    } as StyleSheet.NamedStyles<any>,
    icon: {
      padding: 12,
      color: colors.icon.alternative,
    },
  });

const fuse = new Fuse<TokenListToken>([], {
  shouldSort: true,
  threshold: 0.45,
  location: 0,
  distance: 100,
  maxPatternLength: 32,
  minMatchCharLength: 1,
  keys: [
    { name: 'name', weight: 0.5 },
    { name: 'symbol', weight: 0.5 },
  ],
});

interface Props {
  onSearch: ({
    results,
    searchQuery,
  }: {
    results: TokenListToken[];
    searchQuery: string;
  }) => void;
  /**
   * Callback that is called when the text input is focused
   */
  onFocus: () => void;
  /**
   * Callback that is called when the text input is blurred
   */
  onBlur: () => void;
}

// eslint-disable-next-line react/display-name
const AssetSearch = memo(({ onSearch, onFocus, onBlur }: Props) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [inputDimensions, setInputDimensions] = useState('85%');
  const tokenList = useSelector<any, TokenListToken[]>(getTokenListArray);
  const { colors, themeAppearance } = useTheme();
  const styles = createStyles(colors);

  useEffect(() => {
    setTimeout(() => {
      setInputDimensions('86%');
    }, 100);
  }, []);

  // Update fuse list
  useEffect(() => {
    fuse.setCollection(tokenList);
    // Show all result when opening Import Tokens
    const results = [...tokenList];
    onSearch({ searchQuery, results });
  }, [tokenList]);

  // Search Token list
  const handleSearch = useCallback(
    (searchText: string) => {
      setSearchQuery(searchText);
      const fuseSearchResult = searchText ? fuse.search(searchText) : tokenList;
      const addressSearchResult = tokenList.filter((token) =>
        toLowerCaseEquals(token.address, searchText),
      );
      const results = [...addressSearchResult, ...fuseSearchResult];
      // Return result search to SearchTokenAutocomplete
      onSearch({ searchQuery: searchText, results });
    },
    [setSearchQuery, onSearch, tokenList],
  );

  // useEffect(() => {
  //   console.log('### useEffect handleSearch ###: ', searchQuery);

  //   handleSearch(searchQuery);
  // }, [handleSearch]);

  return (
    <View style={styles.searchSection} testID={'add-searched-token-screen'}>
      <Icon name="search" size={18} style={styles.icon} />
      <TextInput
        style={[
          styles.textInput,
          { height: inputDimensions, width: inputDimensions },
        ]}
        value={searchQuery}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder={strings('token.search_tokens_placeholder')}
        placeholderTextColor={colors.text.muted}
        onChangeText={handleSearch}
        {...generateTestId(Platform, TOKEN_INPUT_BOX_ID)}
        keyboardAppearance={themeAppearance}
      />
    </View>
  );
});

export default AssetSearch;
