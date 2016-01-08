var webpack = require('webpack');
var path = require('path');
var fs = require('fs');

var ExtractTextPlugin = require("extract-text-webpack-plugin");
var Clean = require('clean-webpack-plugin');

var nodeModules = {
  electron: 'commonjs electron'
};
fs.readdirSync('node_modules')
  .filter(function(x) {
    return ['.bin'].indexOf(x) === -1;
  })
  .forEach(function(mod) {
    nodeModules[mod] = 'commonjs ' + mod;
  });

var config = [];

config.push({
  entry: {
    main: './app/main.js'
  },
  output: {
    path: './app/build/',
    filename: '[name].js'
  },
  resolve: {
    alias: {
      lib: path.join(__dirname, "app/lib")
    }
  },
  target: "atom",
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: ['babel']
      }
    ]
  },
  externals: nodeModules
});

config.push({
  entry: {
    gui: './app/gui/js/main.js'
  },
  output: {
    path: './app/gui/build/',
    filename: '[name].js'
  },
  resolve: {
    root: [path.join(__dirname, "bower_components")],
    alias: {
      lib: path.join(__dirname, "app/lib"),
      rpc: path.join(__dirname, "app/gui/js/rpc.js"),
      actions: path.join(__dirname, "app/gui/js/actions.js"),
      components: path.join(__dirname, "app/gui/js/components")
    }
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: ["babel"]
      },
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
    new Clean(['./app/gui/build'])
  ],
  externals: {
    electron: 'commonjs electron'
  }
});

module.exports = config;
