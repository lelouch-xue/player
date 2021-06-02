const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackBar = require('webpackbar');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const webpack = require('webpack');
const version = require('../package.json').version;

module.exports = {
  entry: {
    main: './src/test/index.js',
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].bundle.js',
  },
  target: 'web',
  resolve: {
    extensions: ['.ts', '.js'],
    preferRelative: true,
    alias: {
      '~': path.resolve(__dirname, '../src'),
      '~assets': path.resolve(__dirname, '../src/assets/'),
      '~css': path.resolve(__dirname, '../src/css/'),
      '~art': path.resolve(__dirname, '../src/art/'),
      '@': path.resolve(__dirname, '../src/'),
      '@assets': path.resolve(__dirname, '../src/assets/'),
      '@css': path.resolve(__dirname, '../src/css/'),
      '@art': path.resolve(__dirname, '../src/art/'),
    },
  },
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
        exclude: /node_modules/,
      },
      {
        test: /\.(png|jpg)$/,
        loader: 'url-loader',
        options: {
          limit: 40000,
        },
      },
      {
        test: /\.svg$/,
        loader: 'svg-inline-loader',
      },
      {
        test: /\.art$/,
        loader: 'art-template-loader',
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      GLOBAL_VERSION: `${version}`,
    }),
    new WebpackBar(),
    new FriendlyErrorsPlugin({
      // clearConsole: true,
    }),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../src/test/index.html'),
    }),
  ],
};
