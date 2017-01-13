const webpack = require('webpack');
const path = require('path');
const fs = require('fs');

const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  target: 'electron',
  devtool: 'cheap-module-source-map',
  entry: {
    gui: './src/gui/index.tsx'
  },
  output: {
    path: path.join(__dirname, 'dist/gui'),
    filename: 'gui.js'
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
    alias: {
      app: path.join(__dirname, 'src/app'),
      gui: path.join(__dirname, "src/gui")
    }
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        loader: 'ts-loader'
      },
      {
        test: /\.(css)$/,
        loader: ExtractTextPlugin.extract({
          fallbackLoader: "style-loader",
          loader: "css-loader!resolve-url-loader"
        })
      },
      {
        test: /\.(otf|eot|svg|ttf|woff|png|woff2)/,
        loader: 'url-loader?limit=8096'
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      }
    ],
    // noParse: /ws/
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      chunks: ['gui'],
      filename: 'index.html',
      template: path.join(__dirname, 'src/gui/index.html')
    }),
    new ExtractTextPlugin({
      filename: "[name].css"
    }),
  ],
  externals: {
    electron: 'commonjs electron'
  },
  node: {
    __dirname: false,
    __filename: false,
  }
};
