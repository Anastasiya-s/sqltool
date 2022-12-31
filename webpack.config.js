const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: 'development',
  entry: path.join(__dirname, './src', 'index.tsx'),
  output: {
    path: path.resolve(__dirname, './public'),
    filename: 'bundle.js'
  },
  devServer: {
    static: {       
      directory: path.resolve(__dirname, './public')
    },
    compress: true,
    port: 9000,
  },
  module: {
    rules: [
      {
        test: /\.(js|ts)x?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js'],
  },
}