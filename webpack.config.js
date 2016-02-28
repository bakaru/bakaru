var webpack = require('webpack');
var path = require('path');
var fs = require('fs');

var ExtractTextPlugin = require("extract-text-webpack-plugin");
var Clean = require('clean-webpack-plugin');

var config = [];

var GUI_BUILD = './gui/build/';

if (process.env.GUI_BUILD && process.env.GUI_BUILD.trim().length > 0) {
  GUI_BUILD = process.env.GUI_BUILD.trim();
}

config.push({
  entry: {
    gui: './gui/js/main.js'
  },
  output: {
    path: GUI_BUILD,
    filename: 'gui.js'
  },
  resolve: {
    root: [path.join(__dirname, "bower_components")],
    alias: {
      lib: path.join(__dirname, "app/lib"),
      ipc: path.join(__dirname, "gui/js/ipcRenderer.js"),
      utils: path.join(__dirname, 'gui/js/utils'),
      'ipc-events': path.join(__dirname, "app/events.js"),
      actions: path.join(__dirname, "gui/js/actions.js"),
      components: path.join(__dirname, "gui/js/components")
    }
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: ["babel"]
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
  }
});

module.exports = config;
