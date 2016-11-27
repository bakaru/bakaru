const webpack = require('webpack');
const path = require('path');
const fs = require('fs');

const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  target: 'electron',
  entry: {
    gui: './src/gui/index.tsx'
  },
  output: {
    path: path.join(__dirname, 'dist/gui'),
    filename: 'gui.js'
  },
  resolve: {
    extensions: ["", ".webpack.js", ".web.js", ".ts", ".tsx", ".js"],
    alias: {
      app: path.join(__dirname, 'src/app'),
      gui: path.join(__dirname, "src/gui")
    }
  },
  module: {
    loaders: [
      {
        test: /\.(ts|tsx)$/,
        loader: 'ts-loader'
      },
      {
        test: /\.(css)$/,
        loader: ExtractTextPlugin.extract("style", "css", "resolve-url")
      },
      {
        test: /\.(otf|eot|svg|ttf|woff|png|woff2)/,
        loader: 'url-loader?limit=8096'
      },
      {
        test: /\.json$/,
        loader: 'json'
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      chunks: ['gui'],
      filename: 'index.html',
      template: path.join(__dirname, 'src/gui/index.html')
    }),
    new ExtractTextPlugin("[name].css"),
  ],
  externals: {
    electron: 'commonjs electron'
  },
  node: {
    __dirname: false,
    __filename: false,
  }
};
