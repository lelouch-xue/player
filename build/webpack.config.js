const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackBar = require('webpackbar');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');

module.exports = {
  entry: {
    player: './src/index.ts',
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].bundle.js',
    library: 'Player',
    libraryTarget: 'iife',
    libraryExport: 'default',
    umdNamedDefine: true,
    publicPath: '/',
  },
  target: 'web',
  resolve: {
    extensions: ['.ts', '.js'],
    preferRelative: true,
    alias: {
      '~': path.resolve(__dirname, '../src'),
      '~assets': path.resolve(__dirname, '../src/assets/'),
      '~css': path.resolve(__dirname, '../src/css/'),
      '~tpl': path.resolve(__dirname, '../src/template/'),
      '@': path.resolve(__dirname, '../src/'),
      '@assets': path.resolve(__dirname, '../src/assets/'),
      '@css': path.resolve(__dirname, '../src/css/'),
      '@tpl': path.resolve(__dirname, '../src/template/'),
    },
  },
  module: {
    rules: [
      {
        test: /\.ts/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
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
    new WebpackBar(),
    new FriendlyErrorsPlugin({
      clearConsole: true,
    }),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: '测试页面',
      template: path.resolve(__dirname, '../public/index.html'),
      filename: 'index.html',
      inject: 'head',
      scriptLoading: 'blocking',
    }),
  ],
};
