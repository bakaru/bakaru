var webpack = require('webpack');
var path = require('path');
var fs = require('fs');

var ExtractTextPlugin = require("extract-text-webpack-plugin");
var Clean = require('clean-webpack-plugin');

var nodeModules = {
  electron: 'commonjs electron'
};
//fs.readdirSync('node_modules')
//  .filter(function(x) {
//    return ['.bin'].indexOf(x) === -1;
//  })
//  .forEach(function(mod) {
//    nodeModules[mod] = 'commonjs ' + mod;
//  });

var config = [];

var APP_BUILD = './app/build/';
var GUI_BUILD = './app/gui/build/';

if (process.env.APP_BUILD && process.env.APP_BUILD.trim().length > 0) {
  APP_BUILD = process.env.APP_BUILD.trim();
}
if (process.env.GUI_BUILD && process.env.GUI_BUILD.trim().length > 0) {
  GUI_BUILD = process.env.GUI_BUILD.trim();
}

config.push({
  entry: {
    main: './app/main.js'
  },
  output: {
    path: APP_BUILD,
    filename: 'main.js'
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
    path: GUI_BUILD,
    filename: 'gui.js'
  },
  resolve: {
    root: [path.join(__dirname, "bower_components")],
    alias: {
      lib: path.join(__dirname, "app/lib"),
      ipc: path.join(__dirname, "app/gui/js/ipcRenderer.js"),
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
    new Clean(['./app/gui/build'])
  ],
  externals: {
    electron: 'commonjs electron'
  }
});

module.exports = config;
