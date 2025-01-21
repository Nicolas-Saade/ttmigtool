import React, { useState } from 'react';
import { TextInput, View, StyleSheet } from 'react-native';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSearch = (text) => {
    setQuery(text);
    if (onSearch) {
      onSearch(text);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search..."
        value={query}
        onChangeText={handleSearch}
        autoCapitalize="none"
        autoCorrect={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        margin: 10,
        padding: 5,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#ccc',
        backgroundColor: '#fff',
    },
    input: {
        fontSize: 14,
        padding: 8,
    },
});

export default SearchBar;