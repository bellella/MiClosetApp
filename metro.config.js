const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const { withStorybook } = require('@storybook/react-native/metro/withStorybook');

let config = getDefaultConfig(__dirname);

config.resolver = {
    ...config.resolver,
    // Prioritize CommonJS modules over ESM, bypassing `import.meta` checks
    unstable_conditionNames: ['browser', 'require', 'react-native'],
}

config = withStorybook(config);

config = withNativeWind(config, { input: './global.css' });

module.exports = config;
