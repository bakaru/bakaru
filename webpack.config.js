var webpack = require('webpack');
var path = require('path');

var ExtractTextPlugin = require("extract-text-webpack-plugin");
var Clean = require('clean-webpack-plugin');

var config = [];

config.push({
  entry: {
    gui: './gui/app/main.js'
  },
  output: {
    path: './gui/build/',
    filename: '[name].js'
  },
  resolve: {
    root: [path.join(__dirname, "bower_components")]
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: ["babel"]
      },
      // {
      //   test: /\.css$/,
      //   loader: ExtractTextPlugin.extract("style", "css?sourceMap", "resolve-url")
      // },
      {
        test: /\.(scss|css)$/,
        loader: ExtractTextPlugin.extract("style", "css!sass?sourceMap", "resolve-url")
      },
      {
        test: /\.(otf|eot|svg|ttf|woff|png)/,
        loader: 'url-loader?limit=8192'
      }
    ]
  },
  plugins: [
    new webpack.ResolverPlugin(
      new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin("bower.json", ["main"])
    ),
    new ExtractTextPlugin("[name].css"),
    new Clean(['./gui/build'])
  ],
  externals: {
    electron: 'commonjs electron'
  }
});

module.exports = config;
