const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');

const config = {
  entry: [
    './src/',
  ],
  output: {
    path: path.join(__dirname, './public'),
    filename: 'bundle.js',
  },
  resolve: {
    extensions: ['.jsx', '.js', '.scss', '.eot', '.svg', '.ttf', '.woff', '.woff2', '.png', '.jpg'],
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: path.join(__dirname, 'src'),
        use: [
          {
            loader: 'babel-loader',
            options:
              {
                presets: ['es2015', 'react', 'babel-preset-es2015'],
                plugins: [
                  'transform-object-rest-spread',
                ],
              },
          },
        ],
      },
      {
        test: /\.(scss|css)$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            'css-loader',
            'resolve-url-loader',
            'sass-loader',
          ],
        }),
      },
      {
        test: /\.(png|jpg|gif|jpeg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              name: 'dist/images/[name].[ext]',
            },
          },
        ],
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              mimetype: 'application/font-woff',
              name: './fonts/[name].[ext]',
            },
          },
        ],
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'dist/fonts/[name].[ext]',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new ExtractTextPlugin({
      filename: 'style.css',
      allChunks: true,
    }),
    new HtmlWebpackPlugin({
      inject: true,
      template: 'src/index.html',
      filename: 'index.html',
      favicon: 'src/favicon.ico',
      hash: true,
    }),
};

module.exports = config;
