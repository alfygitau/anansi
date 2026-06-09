module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Find the rule handling ESM/MJS files and tell Webpack to look for missing extensions
      webpackConfig.module.rules.push({
        test: /\.m?js/,
        resolve: {
          fullySpecified: false,
        },
      });
      return webpackConfig;
    },
  },
};