const { merge } = require('webpack-merge');
const webpackBaseConfig = require('./webpack.common.js');

const webpackDevConfig = {
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
  devServer: {
    port: 9009,
    hot: true,
    quiet: true,
  },
};

module.exports = merge(webpackBaseConfig, webpackDevConfig);
