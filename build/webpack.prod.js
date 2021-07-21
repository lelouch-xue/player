const { merge } = require('webpack-merge');
const webpackBaseConfig = require('./webpack.config.js');

const webpackProdConfig = {
  mode: 'production',
};

module.exports = merge(webpackBaseConfig, webpackProdConfig);
