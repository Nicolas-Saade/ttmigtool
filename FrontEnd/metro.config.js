const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const exclusionList = require('metro-config/src/defaults/exclusionList');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const defaultConfig = getDefaultConfig(__dirname);

const customConfig = {
  resolver: {
    sourceExts: ['js', 'json', 'ts', 'tsx', 'jsx'], // Extensions to process
    blacklistRE: exclusionList([/src\/main\.jsx/]), // Ignore main.jsx inside the src/ directory
  },
};

module.exports = mergeConfig(defaultConfig, customConfig);