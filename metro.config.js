const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const { withStorybook } = require('@storybook/react-native/metro/withStorybook');

let config = getDefaultConfig(__dirname);

config = withStorybook(config);

config = withNativeWind(config, { input: './global.css' });

module.exports = config;
