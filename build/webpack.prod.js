const { merge } = require('webpack-merge');
const webpackBaseConfig = require('./webpack.common.js');

const webpackProdConfig = {
  mode: 'development',
};

module.exports = merge(webpackBaseConfig, webpackProdConfig);
