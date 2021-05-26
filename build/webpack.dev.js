const { merge } = require('webpack-merge');
const webpackBaseConfig = require('./webpack.config.js');

const webpackDevConfig = {
  mode: 'development',
  devtool: "source-map",
  devServer: {
    port: 9009,
    hot: true,
    quiet: true
  }
};

module.exports = merge(webpackBaseConfig, webpackDevConfig);
