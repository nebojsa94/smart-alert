const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const config = {
  entry: [
    'react-hot-loader/patch',
    'webpack/hot/only-dev-server',
    'webpack-dev-server/client?http://127.0.0.1:3300',
    './src/',
    './src/index.jsx',
  ],
  devtool: 'inline-source-map',
  devServer: {
    contentBase: path.join(__dirname, './dist/'),
    hot: true,
    headers: { 'Access-Control-Allow-Origin': '*' },
    historyApiFallback: true,
  },
  output: {
    path: path.join(__dirname, './dist'),
    filename: 'bundle.js',
    publicPath: '/',
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
            query:
              {
                presets: ['es2015', 'react'],
              },
          }
        ],

      },
      {
        test: /\.(scss|css)$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.(png|jpg|gif|jpeg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              name: 'images/[name].[ext]',
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
              name: 'fonts/[name].[ext]',
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
              name: 'fonts/[name].[ext]',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: 'body',
      template: path.join(__dirname, 'src/index.html'),
      filename: 'index.html',
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
  ],
};

module.exports = config;
