var webpack = require('webpack');
var path = require('path');
var fs = require('fs');

var ExtractTextPlugin = require("extract-text-webpack-plugin");
var Clean = require('clean-webpack-plugin');

var config = [];

var GUI_BUILD = './src/gui/build/';

if (process.env.GUI_BUILD && process.env.GUI_BUILD.trim().length > 0) {
  GUI_BUILD = process.env.GUI_BUILD.trim();
}

config.push({
  target: 'electron',
  entry: {
    gui: './src/gui/index.js'
  },
  output: {
    path: GUI_BUILD,
    filename: 'gui.js'
  },
  resolve: {
    root: [path.join(__dirname, "bower_components")],
    alias: {
      app: path.join(__dirname, 'app'),
      gui: path.join(__dirname, "src/gui")
    }
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: ["babel"],
        exclude: /(node_modules|bower_components)/
      },
      {
        test: /\.(css)$/,
        loader: ExtractTextPlugin.extract("style", "css", "resolve-url")
      },
      {
        test: /\.(scss)$/,
        loader: ExtractTextPlugin.extract("style", "css!sass?sourceMap", "resolve-url")
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
    new webpack.ResolverPlugin(
      new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin("bower.json", ["main"])
    ),
    new ExtractTextPlugin("[name].css"),
    new Clean([GUI_BUILD])
  ],
  externals: {
    electron: 'commonjs electron'
  },
  node: {
    __dirname: false,
    __filename: false,
  }
});

module.exports = config;
