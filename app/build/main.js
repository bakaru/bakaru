/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/*!*********************!*\
  !*** ./app/main.js ***!
  \*********************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _electron = __webpack_require__(/*! electron */ 1);
	
	var _electron2 = _interopRequireDefault(_electron);
	
	var _App = __webpack_require__(/*! ./App */ 2);
	
	var _App2 = _interopRequireDefault(_App);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var app = new _App2.default(_electron2.default);

/***/ },
/* 1 */
/*!***************************!*\
  !*** external "electron" ***!
  \***************************/
/***/ function(module, exports) {

	module.exports = require("electron");

/***/ },
/* 2 */
/*!********************!*\
  !*** ./app/App.js ***!
  \********************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _ipcListener = __webpack_require__(/*! lib/ipcListener */ 3);
	
	var _ipcListener2 = _interopRequireDefault(_ipcListener);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var App = (function () {
	  function App(electron, rootDir) {
	    var _this = this;
	
	    _classCallCheck(this, App);
	
	    this.electron = electron;
	    this.rootDir = rootDir;
	    this.app = electron.app;
	    this.ipc = electron.ipcMain;
	
	    this.mainWindow = null;
	
	    (0, _ipcListener2.default)(this.ipc, function () {
	      return _this.mainWindow;
	    });
	    this._setupAppEvenetListeners();
	  }
	
	  _createClass(App, [{
	    key: 'createMainWindow',
	    value: function createMainWindow() {
	      this.mainWindow = new this.electron.BrowserWindow({
	        width: 850,
	        height: 720,
	        title: 'Bakaru',
	        frame: false
	      });
	
	      // and load the index.html of the app.
	      this.mainWindow.loadURL('file:///app/gui/index.html');
	
	      // Open the DevTools.
	      this.mainWindow.webContents.openDevTools();
	
	      // Emitted when the window is closed.
	      this.mainWindow.on('closed', function () {
	        // Dereference the window object, usually you would store windows
	        // in an array if your app supports multi windows, this is the time
	        // when you should delete the corresponding element.
	        this.mainWindow = null;
	      });
	    }
	  }, {
	    key: '_setupAppEvenetListeners',
	    value: function _setupAppEvenetListeners() {
	      var _this2 = this;
	
	      this.app.on('ready', this.createMainWindow.bind(this));
	
	      this.app.on('window-all-closed', function () {
	        // On OS X it is common for applications and their menu bar
	        // to stay active until the user quits explicitly with Cmd + Q
	        if (process.platform !== 'darwin') {
	          _this2.app.quit();
	        }
	      });
	
	      this.app.on('activate', function () {
	        // On OS X it's common to re-create a window in the app when the
	        // dock icon is clicked and there are no other windows open.
	        if (_this2.mainWindow === null) {
	          createWindow();
	        }
	      });
	    }
	  }]);
	
	  return App;
	})();
	
	exports.default = App;

/***/ },
/* 3 */
/*!****************************!*\
  !*** ./lib/ipcListener.js ***!
  \****************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _events = __webpack_require__(/*! lib/events */ 5);
	
	exports.default = function (ipc, getMainWindow) {
	  ipc.on(_events.main.minimizeMainWindow, function (event, arg) {
	    getMainWindow().minimize();
	  });
	};

/***/ },
/* 4 */,
/* 5 */
/*!***********************!*\
  !*** ./lib/events.js ***!
  \***********************/
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var main = exports.main = {
	  minimizeMainWindow: 'main:minimizeMainWindow'
	};
	
	var renderer = exports.renderer = {
	  folderRead: 'renderer:folderRead'
	};

/***/ }
/******/ ]);
//# sourceMappingURL=main.js.map