var webpack = require('webpack');
var path = require('path');

var ExtractTextPlugin = require("extract-text-webpack-plugin");

var config = [];

config.push({
  entry: {
    gui: './gui/main.js'
  },
  output: {
    path: './gui/build/',
    filename: '[name].js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: ["babel"]
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract("style", "css!sass?sourceMap", "resolve-url")
      },
      {
        test: /\.(otf|eot|svg|ttf|woff|png)/,
        loader: 'url-loader?limit=8192'
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin("[name].css")
  ]
});

module.exports = config;
