import * as React from 'react';
import { Searchbar } from 'react-native-paper';

const SearchComp = (props) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const onChangeSearch = query => {
    setSearchQuery(query);
    props.getSearch(query);
  }

  return (
    <Searchbar
      placeholder="Search"
      onChangeText={onChangeSearch}
      value={searchQuery}
    />
  );
};

export default SearchComp;