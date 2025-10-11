const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Aggressively reduce file watchers to prevent EMFILE error
config.watchFolders = [];
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// Only watch essential file types
config.resolver.sourceExts = ['js', 'jsx', 'ts', 'tsx'];

// Disable file watching for node_modules and other large directories
config.watcher = {
  additionalExts: [],
  ignorePattern: /^(.*\/)?(node_modules|\.git|\.expo|android|ios|\.vscode|\.idea|\.DS_Store)(\/.*)?$/,
  healthCheck: {
    enabled: false
  }
};

// Reduce the number of workers
config.maxWorkers = 1;

module.exports = config;
