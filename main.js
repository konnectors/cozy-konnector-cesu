/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(2);
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
Object.defineProperty(exports, "ContentScript", ({
  enumerable: true,
  get: function get() {
    return _ContentScript.default;
  }
}));
Object.defineProperty(exports, "RequestInterceptor", ({
  enumerable: true,
  get: function get() {
    return _RequestInterceptor.default;
  }
}));
var _ContentScript = _interopRequireDefault(__webpack_require__(3));
var _RequestInterceptor = _interopRequireDefault(__webpack_require__(49));

/***/ }),
/* 2 */
/***/ ((module) => {

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
}

module.exports = _interopRequireDefault, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 3 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(2);
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = exports.WORKER_TYPE = exports.PILOT_TYPE = void 0;
var _regenerator = _interopRequireDefault(__webpack_require__(4));
var _toConsumableArray2 = _interopRequireDefault(__webpack_require__(6));
var _asyncToGenerator2 = _interopRequireDefault(__webpack_require__(12));
var _classCallCheck2 = _interopRequireDefault(__webpack_require__(13));
var _createClass2 = _interopRequireDefault(__webpack_require__(14));
var _minilog = _interopRequireDefault(__webpack_require__(15));
var _umd = _interopRequireDefault(__webpack_require__(27));
var _pTimeout = _interopRequireDefault(__webpack_require__(28));
var _pWaitFor = _interopRequireWildcard(__webpack_require__(29));
var _utils = __webpack_require__(30);
var _package = _interopRequireDefault(__webpack_require__(31));
var _LauncherBridge = _interopRequireDefault(__webpack_require__(32));
var _utils2 = __webpack_require__(42);
var _wrapTimer = __webpack_require__(47);
var _window; // @ts-check
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
var _log = (0, _minilog.default)('ContentScript class');
var s = 1000;
var m = 60 * s;
var DEFAULT_LOGIN_TIMEOUT = 5 * m;
var DEFAULT_WAIT_FOR_ELEMENT_TIMEOUT = 30 * s;
var DEFAULT_WAIT_FOR_ELEMENT_ACCROSS_PAGES_TIMEOUT = 60 * s;
var PILOT_TYPE = exports.PILOT_TYPE = 'pilot';
var WORKER_TYPE = exports.WORKER_TYPE = 'worker';
if ((_window = window) !== null && _window !== void 0 && _window.addEventListener) {
  // allows cozy-clisk to be embedded in other envs (react-native, jest)
  window.addEventListener('load', function () {
    sendPageMessage('load');
  });
  window.addEventListener('DOMContentLoaded', function () {
    sendPageMessage('DOMContentLoaded');
  });
}
var ContentScript = exports["default"] = /*#__PURE__*/function () {
  function ContentScript() {
    var _this = this;
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck2.default)(this, ContentScript);
    sendPageMessage('NEW_WORKER_INITIALIZING');
    var logDebug = function logDebug(message) {
      return _this.log('debug', message);
    };
    var wrapTimerDebug = (0, _wrapTimer.wrapTimerFactory)({
      logFn: logDebug
    });
    var logInfo = function logInfo(message) {
      return _this.log('info', message);
    };
    var wrapTimerInfo = (0, _wrapTimer.wrapTimerFactory)({
      logFn: logInfo
    });
    this.ensureAuthenticated = wrapTimerInfo(this, 'ensureAuthenticated');
    this.ensureNotAuthenticated = wrapTimerInfo(this, 'ensureNotAuthenticated');
    this.getUserDataFromWebsite = wrapTimerInfo(this, 'getUserDataFromWebsite');
    this.fetch = wrapTimerInfo(this, 'fetch');
    this.waitForAuthenticated = wrapTimerDebug(this, 'waitForAuthenticated');
    this.waitForNotAuthenticated = wrapTimerDebug(this, 'waitForNotAuthenticated');
    this.runInWorker = wrapTimerDebug(this, 'runInWorker', {
      suffixFn: function suffixFn(args) {
        return args === null || args === void 0 ? void 0 : args[0];
      }
    });
    this.runInWorkerUntilTrue = wrapTimerDebug(this, 'runInWorkerUntilTrue', {
      suffixFn: function suffixFn(args) {
        var _args$;
        return (_args$ = args[0]) === null || _args$ === void 0 ? void 0 : _args$.method;
      }
    });
    this.waitForElementInWorker = wrapTimerDebug(this, 'waitForElementInWorker', {
      suffixFn: function suffixFn(args) {
        return args === null || args === void 0 ? void 0 : args[0];
      }
    });
    this.clickAndWait = wrapTimerDebug(this, 'clickAndWait', {
      suffixFn: function suffixFn(args) {
        return "".concat(args === null || args === void 0 ? void 0 : args[0], " ").concat(args === null || args === void 0 ? void 0 : args[1]);
      }
    });
    this.saveFiles = wrapTimerDebug(this, 'saveFiles', {
      suffixFn: function suffixFn(args) {
        return "".concat(args === null || args === void 0 ? void 0 : args[0].length, " files");
      }
    });
    this.saveBills = wrapTimerDebug(this, 'saveBills');
    this.getCredentials = wrapTimerDebug(this, 'getCredentials');
    this.saveCredentials = wrapTimerDebug(this, 'saveCredentials');
    this.saveIdentity = wrapTimerDebug(this, 'saveIdentity');
    this.getCookiesByDomain = wrapTimerDebug(this, 'getCookiesByDomain', {
      suffixFn: function suffixFn(args) {
        return args === null || args === void 0 ? void 0 : args[0];
      }
    });
    this.getCookieFromKeychainByName = wrapTimerDebug(this, 'getCookieFromKeychainByName', {
      suffixFn: function suffixFn(args) {
        return args === null || args === void 0 ? void 0 : args[0];
      }
    });
    this.saveCookieToKeychain = wrapTimerDebug(this, 'saveCookieToKeychain', {
      suffixFn: function suffixFn(args) {
        return args === null || args === void 0 ? void 0 : args[0];
      }
    });
    this.getCookieByDomainAndName = wrapTimerDebug(this, 'getCookieByDomainAndName', {
      suffixFn: function suffixFn(args) {
        return "".concat(args === null || args === void 0 ? void 0 : args[0], " ").concat(args === null || args === void 0 ? void 0 : args[1]);
      }
    });
    this.goto = wrapTimerDebug(this, 'goto', {
      suffixFn: function suffixFn(args) {
        return args === null || args === void 0 ? void 0 : args[0];
      }
    });
    this.downloadFileInWorker = wrapTimerDebug(this, 'downloadFileInWorker', {
      suffixFn: function suffixFn(args) {
        var _args$2;
        return args === null || args === void 0 || (_args$2 = args[0]) === null || _args$2 === void 0 ? void 0 : _args$2.fileurl;
      }
    });
    this.waitForRequestInterception = wrapTimerDebug(this, 'waitForRequestInterception', {
      suffixFn: function suffixFn(args) {
        return args === null || args === void 0 ? void 0 : args[0];
      }
    });
    if (options.requestInterceptor) {
      this.requestInterceptor = options.requestInterceptor;
      this.requestInterceptor.setLogger(this.log.bind(this));
    }
  }
  /**
   * Init the bridge communication with the launcher.
   * It also exposes the methods which will be callable by the launcher
   *
   * @param {object} options : options object
   * @param {Array<string>} [options.additionalExposedMethodsNames] : list of additional method of the
   * content script to expose. To make it callable via the worker.
   */
  (0, _createClass2.default)(ContentScript, [{
    key: "init",
    value: (function () {
      var _init = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee() {
        var _this2 = this;
        var options,
          exposedMethodsNames,
          exposedMethods,
          _i,
          _exposedMethodsNames,
          method,
          _args = arguments;
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              options = _args.length > 0 && _args[0] !== undefined ? _args[0] : {};
              this.bridge = new _LauncherBridge.default({
                localWindow: window
              });
              exposedMethodsNames = ['setContentScriptType', 'ensureAuthenticated', 'ensureNotAuthenticated', 'checkAuthenticated', 'waitForAuthenticated', 'waitForNotAuthenticated', 'waitForElementNoReload', 'getUserDataFromWebsite', 'fetch', 'click', 'fillText', 'storeFromWorker', 'clickAndWait', 'getCookiesByDomain', 'getCookieByDomainAndName', 'downloadFileInWorker', 'getDebugData', 'getCliskVersion', 'checkForElement', 'evaluate'];
              if (options.additionalExposedMethodsNames) {
                exposedMethodsNames.push.apply(exposedMethodsNames, options.additionalExposedMethodsNames);
              }
              exposedMethods = {}; // TODO error handling
              // should catch and call onError on the launcher to let it handle the job update
              for (_i = 0, _exposedMethodsNames = exposedMethodsNames; _i < _exposedMethodsNames.length; _i++) {
                method = _exposedMethodsNames[_i];
                exposedMethods[method] = this[method].bind(this);
              }
              this.store = {};
              _context.next = 9;
              return this.bridge.init({
                exposedMethods: exposedMethods
              });
            case 9:
              window.onbeforeunload = function () {
                return _this2.log('debug', "window.beforeunload detected with previous url : ".concat(document.location));
              };
            case 10:
            case "end":
              return _context.stop();
          }
        }, _callee, this);
      }));
      function init() {
        return _init.apply(this, arguments);
      }
      return init;
    }()
    /**
     * This method is called when the worker is ready on the current page. This is a good place to
     * subscribe to dom events for examples. These subscriptions will be replayed on each worker page
     * reload
     */
    )
  }, {
    key: "onWorkerReady",
    value: function onWorkerReady() {}

    /**
     * This method is called fon the pilot when the worker sends workerEvent events to the bridge
     */
  }, {
    key: "onWorkerEvent",
    value: function onWorkerEvent() {}

    /**
     * Set the ContentScript type. This is usefull to know which webview is the pilot or the worker
     *
     * @param {string} contentScriptType - ("pilot" | "worker")
     */
  }, {
    key: "setContentScriptType",
    value: (function () {
      var _setContentScriptType = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2(contentScriptType) {
        var _this3 = this;
        var _this$requestIntercep;
        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              this.contentScriptType = contentScriptType;
              _log.info("I am the ".concat(contentScriptType));
              if (this.bridge) {
                _context2.next = 4;
                break;
              }
              throw new Error('No bridge is defined, you should call ContentScript.init before using this method');
            case 4:
              if (contentScriptType === WORKER_TYPE) {
                this.onWorkerReady();
                (_this$requestIntercep = this.requestInterceptor) === null || _this$requestIntercep === void 0 || _this$requestIntercep.on('response', function (response) {
                  var _this3$bridge;
                  (_this3$bridge = _this3.bridge) === null || _this3$bridge === void 0 || _this3$bridge.emit('workerEvent', {
                    event: 'requestResponse',
                    payload: response
                  });
                });
              } else if (contentScriptType === PILOT_TYPE) {
                this.bridge.addEventListener('workerEvent', this.onWorkerEvent.bind(this));
              }
            case 5:
            case "end":
              return _context2.stop();
          }
        }, _callee2, this);
      }));
      function setContentScriptType(_x) {
        return _setContentScriptType.apply(this, arguments);
      }
      return setContentScriptType;
    }()
    /**
     * Check if the user is authenticated or not. This method is made to be overloaded by the child class
     *
     * @returns {Promise.<boolean>} : true if authenticated or false in other case
     */
    )
  }, {
    key: "checkAuthenticated",
    value: (function () {
      var _checkAuthenticated = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee3() {
        return _regenerator.default.wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              return _context3.abrupt("return", false);
            case 1:
            case "end":
              return _context3.stop();
          }
        }, _callee3);
      }));
      function checkAuthenticated() {
        return _checkAuthenticated.apply(this, arguments);
      }
      return checkAuthenticated;
    }()
    /**
     * This method is made to run in the worker and will resolve as true when
     * the user is authenticated
     *
     * @param {object} options        - options object
     * @param {number} [options.timeout] - number of miliseconds before the function sends a timeout error. Default 5m
     * @param {number} [options.interval] - interval in ms between checkAuthenticated calls. Default 1s
     * @returns {Promise.<true>} : if authenticated
     * @throws {TimeoutError}: TimeoutError from p-wait-for package if timeout expired
     */
    )
  }, {
    key: "waitForAuthenticated",
    value: (function () {
      var _waitForAuthenticated = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee4() {
        var options,
          timeout,
          interval,
          _args4 = arguments;
        return _regenerator.default.wrap(function _callee4$(_context4) {
          while (1) switch (_context4.prev = _context4.next) {
            case 0:
              options = _args4.length > 0 && _args4[0] !== undefined ? _args4[0] : {};
              this.onlyIn(WORKER_TYPE, 'waitForAuthenticated');
              timeout = options.timeout || DEFAULT_LOGIN_TIMEOUT;
              interval = options.interval || 1000;
              _context4.next = 6;
              return (0, _pWaitFor.default)(this.checkAuthenticated.bind(this), {
                interval: interval,
                timeout: {
                  milliseconds: timeout,
                  message: new _pWaitFor.TimeoutError("waitForAuthenticated timed out after ".concat(timeout, "ms"))
                }
              });
            case 6:
              return _context4.abrupt("return", true);
            case 7:
            case "end":
              return _context4.stop();
          }
        }, _callee4, this);
      }));
      function waitForAuthenticated() {
        return _waitForAuthenticated.apply(this, arguments);
      }
      return waitForAuthenticated;
    }()
    /**
     * Resolves when the dom is ready (DOMContentLoaded event)
     *
     * @returns {Promise<void>}
     */
    )
  }, {
    key: "waitForDomReady",
    value: (function () {
      var _waitForDomReady = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee5() {
        var self, domReadyPromise;
        return _regenerator.default.wrap(function _callee5$(_context5) {
          while (1) switch (_context5.prev = _context5.next) {
            case 0:
              self = this;
              domReadyPromise = new Promise(function (resolve) {
                var _document, _document2, _document3;
                // first check if the DOMContentLoad has already been called
                if (((_document = document) === null || _document === void 0 ? void 0 : _document.readyState) === 'complete' || ((_document2 = document) === null || _document2 === void 0 ? void 0 : _document2.readyState) === 'loaded' || ((_document3 = document) === null || _document3 === void 0 ? void 0 : _document3.readyState) === 'interactive') {
                  resolve();
                } else {
                  window.addEventListener('DOMContentLoaded', function () {
                    resolve();
                  });
                }
              });
              return _context5.abrupt("return", (0, _pTimeout.default)(domReadyPromise, {
                milliseconds: 10000,
                fallback: function fallback() {
                  return self.log('warn', 'waitForDomReady timed out after 10s, we may have missed the DOMContentLoad event');
                }
              }));
            case 3:
            case "end":
              return _context5.stop();
          }
        }, _callee5, this);
      }));
      function waitForDomReady() {
        return _waitForDomReady.apply(this, arguments);
      }
      return waitForDomReady;
    }()
    /**
     * This method is made to run in the worker and will resolve as true when
     * the user is not authenticated
     *
     * @param {object} options        - options object
     * @param {number} [options.timeout] - number of miliseconds before the function sends a timeout error. Default 30s
     * @param {number} [options.interval] - interval in ms between checkAuthenticated calls. Default 1s
     * @returns {Promise.<true>} : if not authenticated
     * @throws {TimeoutError}: TimeoutError from p-wait-for package if timeout expired
     */
    )
  }, {
    key: "waitForNotAuthenticated",
    value: (function () {
      var _waitForNotAuthenticated = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee7() {
        var _this4 = this;
        var options,
          timeout,
          interval,
          _args7 = arguments;
        return _regenerator.default.wrap(function _callee7$(_context7) {
          while (1) switch (_context7.prev = _context7.next) {
            case 0:
              options = _args7.length > 0 && _args7[0] !== undefined ? _args7[0] : {};
              this.onlyIn(WORKER_TYPE, 'waitForNotAuthenticated');
              timeout = options.timeout || DEFAULT_WAIT_FOR_ELEMENT_TIMEOUT;
              interval = options.interval || 1000;
              _context7.next = 6;
              return (0, _pWaitFor.default)( /*#__PURE__*/(0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee6() {
                var authenticated;
                return _regenerator.default.wrap(function _callee6$(_context6) {
                  while (1) switch (_context6.prev = _context6.next) {
                    case 0:
                      _context6.next = 2;
                      return _this4.checkAuthenticated.bind(_this4)();
                    case 2:
                      authenticated = _context6.sent;
                      return _context6.abrupt("return", !authenticated);
                    case 4:
                    case "end":
                      return _context6.stop();
                  }
                }, _callee6);
              })), {
                interval: interval,
                timeout: {
                  milliseconds: timeout,
                  message: new _pWaitFor.TimeoutError("waitForNotAuthenticated timed out after ".concat(timeout, "ms"))
                }
              });
            case 6:
              return _context7.abrupt("return", true);
            case 7:
            case "end":
              return _context7.stop();
          }
        }, _callee7, this);
      }));
      function waitForNotAuthenticated() {
        return _waitForNotAuthenticated.apply(this, arguments);
      }
      return waitForNotAuthenticated;
    }()
    /**
     * Wait for the given identified request to be intercepted. The identified request must be defined and
     * sent to the ContentScript constructor
     *
     * @param {string} identifier - any identifier string defined in the RequestInterceptor
     * @param {object} [options] - options object
     * @param {number} [options.timeout] - number of miliseconds before the function sends a timeout error. Default 60000ms
     */
    )
  }, {
    key: "waitForRequestInterception",
    value: function waitForRequestInterception(identifier) {
      var _options$timeout,
        _this5 = this;
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      this.onlyIn(PILOT_TYPE, 'waitForRequestInterception');
      var timeout = (_options$timeout = options === null || options === void 0 ? void 0 : options.timeout) !== null && _options$timeout !== void 0 ? _options$timeout : 60000;
      var interceptionPromise = new Promise(function (resolve) {
        var listener = function listener(_ref2) {
          var event = _ref2.event,
            payload = _ref2.payload;
          if (event === 'requestResponse' && payload.identifier === identifier) {
            if (!_this5.bridge) {
              throw new Error('No bridge is defined, you should call ContentScript.init before using this method');
            }
            _this5.bridge.removeEventListener('workerEvent', listener);
            resolve(payload);
          }
        };
        if (!_this5.bridge) {
          throw new Error('No bridge is defined, you should call ContentScript.init before using this method');
        }
        _this5.bridge.addEventListener('workerEvent', listener);
      });
      return (0, _pTimeout.default)(interceptionPromise, {
        milliseconds: timeout,
        message: "Timed out after waiting ".concat(timeout, "ms for interception of ").concat(identifier)
      });
    }

    /**
     * Run a specified method in the worker webview
     *
     * @param {string} method : name of the method to run
     */
  }, {
    key: "runInWorker",
    value: (function () {
      var _runInWorker = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee8(method) {
        var _this$bridge;
        var _len,
          args,
          _key,
          _args8 = arguments;
        return _regenerator.default.wrap(function _callee8$(_context8) {
          while (1) switch (_context8.prev = _context8.next) {
            case 0:
              this.onlyIn(PILOT_TYPE, 'runInWorker');
              if (this.bridge) {
                _context8.next = 3;
                break;
              }
              throw new Error('No bridge is defined, you should call ContentScript.init before using this method');
            case 3:
              for (_len = _args8.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                args[_key - 1] = _args8[_key];
              }
              _context8.next = 6;
              return (_this$bridge = this.bridge).call.apply(_this$bridge, ['runInWorker', method].concat(args));
            case 6:
              return _context8.abrupt("return", _context8.sent);
            case 7:
            case "end":
              return _context8.stop();
          }
        }, _callee8, this);
      }));
      function runInWorker(_x2) {
        return _runInWorker.apply(this, arguments);
      }
      return runInWorker;
    }()
    /**
     * Wait for a method to resolve as true on worker
     *
     * @param {object} options        - options object
     * @param {string} options.method - name of the method to run
     * @param {number} [options.timeout] - number of miliseconds before the function sends a timeout error. Default Infinity
     * @param {string} [options.suffix] - suffix used in timeout error message, to better identify error source
     * @param {Array} [options.args] - array of args to pass to the method
     * @returns {Promise<boolean>} - true
     * @throws {TimeoutError} - if timeout expired
     */
    )
  }, {
    key: "runInWorkerUntilTrue",
    value: (function () {
      var _runInWorkerUntilTrue = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee9(_ref3) {
        var method, _ref3$timeout, timeout, _ref3$suffix, suffix, _ref3$args, args, result, start, isTimeout;
        return _regenerator.default.wrap(function _callee9$(_context9) {
          while (1) switch (_context9.prev = _context9.next) {
            case 0:
              method = _ref3.method, _ref3$timeout = _ref3.timeout, timeout = _ref3$timeout === void 0 ? Infinity : _ref3$timeout, _ref3$suffix = _ref3.suffix, suffix = _ref3$suffix === void 0 ? '' : _ref3$suffix, _ref3$args = _ref3.args, args = _ref3$args === void 0 ? [] : _ref3$args;
              this.onlyIn(PILOT_TYPE, 'runInWorkerUntilTrue');
              _log.debug('runInWorkerUntilTrue', method);
              result = false;
              start = Date.now();
              isTimeout = function isTimeout() {
                return Date.now() - start >= timeout;
              };
            case 6:
              if (result) {
                _context9.next = 16;
                break;
              }
              if (!isTimeout()) {
                _context9.next = 9;
                break;
              }
              throw new _pWaitFor.TimeoutError("runInWorkerUntilTrue ".concat(method).concat(suffix, " Timeout error after ").concat(timeout));
            case 9:
              _log.debug('runInWorker call', method);
              _context9.next = 12;
              return this.runInWorker.apply(this, [method].concat((0, _toConsumableArray2.default)(args)));
            case 12:
              result = _context9.sent;
              _log.debug('runInWorker result', result);
              _context9.next = 6;
              break;
            case 16:
              return _context9.abrupt("return", result);
            case 17:
            case "end":
              return _context9.stop();
          }
        }, _callee9, this);
      }));
      function runInWorkerUntilTrue(_x3) {
        return _runInWorkerUntilTrue.apply(this, arguments);
      }
      return runInWorkerUntilTrue;
    }()
    /**
     * Wait for a dom element to be present on the page, even if there are page redirects or page
     * reloads
     *
     * @param {string} selector - css selector we are waiting for
     * @param {object} options - options object
     * @param {number} [options.timeout] - timeout in ms. Will default to 30s
     * @param {string} [options.includesText] - only select elements with the given text as innerText
     */
    )
  }, {
    key: "waitForElementInWorker",
    value: (function () {
      var _waitForElementInWorker = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee10(selector) {
        var _options$timeout2;
        var options,
          _args10 = arguments;
        return _regenerator.default.wrap(function _callee10$(_context10) {
          while (1) switch (_context10.prev = _context10.next) {
            case 0:
              options = _args10.length > 1 && _args10[1] !== undefined ? _args10[1] : {};
              this.onlyIn(PILOT_TYPE, 'waitForElementInWorker');
              _context10.next = 4;
              return this.runInWorkerUntilTrue({
                method: 'waitForElementNoReload',
                suffix: selector,
                timeout: (_options$timeout2 = options === null || options === void 0 ? void 0 : options.timeout) !== null && _options$timeout2 !== void 0 ? _options$timeout2 : DEFAULT_WAIT_FOR_ELEMENT_ACCROSS_PAGES_TIMEOUT,
                args: [selector, {
                  includesText: options.includesText
                }]
              });
            case 4:
            case "end":
              return _context10.stop();
          }
        }, _callee10, this);
      }));
      function waitForElementInWorker(_x4) {
        return _waitForElementInWorker.apply(this, arguments);
      }
      return waitForElementInWorker;
    }()
    /**
     * Check if dom element is present on the page.
     *
     * @param {string} selector - css selector we are checking for
     * @returns {Promise<boolean>}  - Returns true or false
     */
    )
  }, {
    key: "isElementInWorker",
    value: (function () {
      var _isElementInWorker = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee11(selector) {
        var options,
          _args11 = arguments;
        return _regenerator.default.wrap(function _callee11$(_context11) {
          while (1) switch (_context11.prev = _context11.next) {
            case 0:
              options = _args11.length > 1 && _args11[1] !== undefined ? _args11[1] : {};
              this.onlyIn(PILOT_TYPE, 'isElementInWorker');
              _context11.next = 4;
              return this.runInWorker('checkForElement', selector, options);
            case 4:
              return _context11.abrupt("return", _context11.sent);
            case 5:
            case "end":
              return _context11.stop();
          }
        }, _callee11, this);
      }));
      function isElementInWorker(_x5) {
        return _isElementInWorker.apply(this, arguments);
      }
      return isElementInWorker;
    }()
    /**
     * Wait for a dom element to be present on the page. This won't resolve if the page reloads
     *
     * @param {string} selector - css selector we are waiting for
     * @param {object} [options] - options object
     * @param {string} [options.includesText] - only select elements wich include the given text as innerText
     * @returns {Promise.<true>} - Returns true when ready
     */
    )
  }, {
    key: "waitForElementNoReload",
    value: (function () {
      var _waitForElementNoReload = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee12(selector) {
        var _this6 = this;
        var options,
          _args12 = arguments;
        return _regenerator.default.wrap(function _callee12$(_context12) {
          while (1) switch (_context12.prev = _context12.next) {
            case 0:
              options = _args12.length > 1 && _args12[1] !== undefined ? _args12[1] : {};
              this.onlyIn(WORKER_TYPE, 'waitForElementNoReload');
              _log.debug('waitForElementNoReload', selector);
              _context12.next = 5;
              return (0, _pWaitFor.default)(function () {
                return _this6.checkForElement(selector, options);
              }, {
                timeout: {
                  milliseconds: DEFAULT_WAIT_FOR_ELEMENT_TIMEOUT,
                  message: new _pWaitFor.TimeoutError("waitForElementNoReload ".concat(selector).concat(options !== null && options !== void 0 && options.includesText ? ' "' + options.includesText + '"' : '', " timed out after ").concat(DEFAULT_WAIT_FOR_ELEMENT_TIMEOUT, "ms"))
                }
              });
            case 5:
              return _context12.abrupt("return", true);
            case 6:
            case "end":
              return _context12.stop();
          }
        }, _callee12, this);
      }));
      function waitForElementNoReload(_x6) {
        return _waitForElementNoReload.apply(this, arguments);
      }
      return waitForElementNoReload;
    }()
    /**
     * Check if a dom element is present on the page.
     *
     * @param {string} selector - css selector we are checking for
     * @param {object} [options] - options object
     * @param {string} [options.includesText] - only select elements with the given text as innerText
     * @returns {Promise<boolean>} - Returns true or false
     */
    )
  }, {
    key: "checkForElement",
    value: (function () {
      var _checkForElement = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee13(selector) {
        var options,
          _args13 = arguments;
        return _regenerator.default.wrap(function _callee13$(_context13) {
          while (1) switch (_context13.prev = _context13.next) {
            case 0:
              options = _args13.length > 1 && _args13[1] !== undefined ? _args13[1] : {};
              this.onlyIn(WORKER_TYPE, 'checkForElement');
              return _context13.abrupt("return", Boolean(this.selectElement(selector, options)));
            case 3:
            case "end":
              return _context13.stop();
          }
        }, _callee13, this);
      }));
      function checkForElement(_x7) {
        return _checkForElement.apply(this, arguments);
      }
      return checkForElement;
    }()
    /**
     * Select a dom element with given selector and options
     *
     * @param {string} selector - css selector of the element
     * @param {object} [options] - options object
     * @param {string} [options.includesText] - only select element with the given text as innerText
     * @returns {object|null} - Returns the selected dom element or null
     */
    )
  }, {
    key: "selectElement",
    value: function selectElement(selector) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      this.onlyIn(WORKER_TYPE, 'selectElement');
      if (options !== null && options !== void 0 && options.includesText && typeof options.includesText === 'string' && options.includesText !== undefined) {
        return Array.from(document.querySelectorAll(selector)).find(function (element) {
          var _element$innerHTML;
          return (// @ts-ignore Argument of type 'string | undefined' is not assignable to parameter of type 'string'.  Type 'undefined' is not assignable to type 'string'.ts(2345)
            (_element$innerHTML = element.innerHTML) === null || _element$innerHTML === void 0 ? void 0 : _element$innerHTML.includes(options.includesText)
          );
        });
      } else {
        return document.querySelector(selector);
      }
    }

    /**
     * Click on a given element
     *
     * @param {string} selector - css selector of the element
     * @param {object} [options] - options object
     * @param {string} [options.includesText] - only select element with the given text as innerText
     * @returns {Promise<void>}
     */
  }, {
    key: "click",
    value: (function () {
      var _click = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee14(selector) {
        var options,
          elem,
          _args14 = arguments;
        return _regenerator.default.wrap(function _callee14$(_context14) {
          while (1) switch (_context14.prev = _context14.next) {
            case 0:
              options = _args14.length > 1 && _args14[1] !== undefined ? _args14[1] : {};
              this.onlyIn(WORKER_TYPE, 'click');
              elem = this.selectElement(selector, options);
              if (elem) {
                _context14.next = 5;
                break;
              }
              throw new Error("click: No DOM element is matched with the ".concat(selector, " selector"));
            case 5:
              elem.click();
            case 6:
            case "end":
              return _context14.stop();
          }
        }, _callee14, this);
      }));
      function click(_x8) {
        return _click.apply(this, arguments);
      }
      return click;
    }()
    /**
     * Click on a given element and wait for another given element to be displayed on screen
     *
     * @param {string} elementToClick - css selector of the dom element to click in worker
     * @param {string} elementToWait - css selector of the dom element to wait in worker
     * @returns {Promise<void>}
     */
    )
  }, {
    key: "clickAndWait",
    value: (function () {
      var _clickAndWait = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee15(elementToClick, elementToWait) {
        return _regenerator.default.wrap(function _callee15$(_context15) {
          while (1) switch (_context15.prev = _context15.next) {
            case 0:
              this.onlyIn(PILOT_TYPE, 'clickAndWait');
              _log.debug('clicking ' + elementToClick);
              _context15.next = 4;
              return this.runInWorker('click', elementToClick);
            case 4:
              _log.debug('waiting for ' + elementToWait);
              _context15.next = 7;
              return this.waitForElementInWorker(elementToWait);
            case 7:
              _log.debug('done waiting ' + elementToWait);
            case 8:
            case "end":
              return _context15.stop();
          }
        }, _callee15, this);
      }));
      function clickAndWait(_x9, _x10) {
        return _clickAndWait.apply(this, arguments);
      }
      return clickAndWait;
    }())
  }, {
    key: "fillText",
    value: function () {
      var _fillText = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee16(selector, text) {
        var elem;
        return _regenerator.default.wrap(function _callee16$(_context16) {
          while (1) switch (_context16.prev = _context16.next) {
            case 0:
              this.onlyIn(WORKER_TYPE, 'fillText');
              elem = this.selectElement(selector);
              if (elem) {
                _context16.next = 4;
                break;
              }
              throw new Error("fillText: No DOM element is matched with the ".concat(selector, " selector"));
            case 4:
              elem.focus();
              elem.value = text;
              elem.dispatchEvent(new Event('input', {
                bubbles: true
              }));
              elem.dispatchEvent(new Event('change', {
                bubbles: true
              }));
            case 8:
            case "end":
              return _context16.stop();
          }
        }, _callee16, this);
      }));
      function fillText(_x11, _x12) {
        return _fillText.apply(this, arguments);
      }
      return fillText;
    }()
    /**
     * Download the file send by the launcher in the worker context
     *
     * @param {object} entry The entry to download with fileurl attribute
     */
  }, {
    key: "downloadFileInWorker",
    value: (function () {
      var _downloadFileInWorker = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee17(entry) {
        var errorMessage, errorToLog;
        return _regenerator.default.wrap(function _callee17$(_context17) {
          while (1) switch (_context17.prev = _context17.next) {
            case 0:
              this.onlyIn(WORKER_TYPE, 'downloadFileInWorker');
              this.log('debug', 'downloading file in worker');
              if (!entry.fileurl) {
                _context17.next = 24;
                break;
              }
              _context17.prev = 3;
              _context17.next = 6;
              return _umd.default.get(entry.fileurl, entry.requestOptions).blob();
            case 6:
              entry.blob = _context17.sent;
              _context17.next = 9;
              return (0, _utils.blobToBase64)(entry.blob);
            case 9:
              entry.dataUri = _context17.sent;
              _context17.next = 24;
              break;
            case 12:
              _context17.prev = 12;
              _context17.t0 = _context17["catch"](3);
              this.log('debug', "Full error : ".concat(JSON.stringify(_context17.t0)));
              errorMessage = _context17.t0.message;
              errorToLog = '';
              if (!errorMessage.includes(/404|403|500|502|503/g)) {
                _context17.next = 23;
                break;
              }
              if (errorMessage.includes('404')) errorToLog = 'Website cannot find the wanted url';else if (errorMessage.includes('403')) errorToLog = 'User is not allowed to access the wanted URL';else errorToLog = 'Website server error accessing the wanted URL';
              this.log('error', errorToLog);
              throw new Error('VENDOR_DOWN');
            case 23:
              throw new Error('UNKNOWN_ERROR');
            case 24:
              return _context17.abrupt("return", entry.dataUri);
            case 25:
            case "end":
              return _context17.stop();
          }
        }, _callee17, this, [[3, 12]]);
      }));
      function downloadFileInWorker(_x13) {
        return _downloadFileInWorker.apply(this, arguments);
      }
      return downloadFileInWorker;
    }())
  }, {
    key: "getDebugData",
    value: function () {
      var _getDebugData = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee18() {
        return _regenerator.default.wrap(function _callee18$(_context18) {
          while (1) switch (_context18.prev = _context18.next) {
            case 0:
              return _context18.abrupt("return", {
                url: window.location.href,
                html: window.document.documentElement.outerHTML
              });
            case 1:
            case "end":
              return _context18.stop();
          }
        }, _callee18);
      }));
      function getDebugData() {
        return _getDebugData.apply(this, arguments);
      }
      return getDebugData;
    }()
    /**
     * Bridge to the saveFiles method from the launcher.
     * - it prefilters files according to the context comming from the launcher
     * - download files when not filtered out
     * - converts blob files to base64 uri to be serializable
     *
     * @param {Array<import('../launcher/saveFiles').saveFilesEntry & {shouldReplaceFile: Function}>} entries : list of file entries to save
     * @param {import('../launcher/saveFiles').saveFileOptions & {context: object, shouldReplaceFile: Function}} options : saveFiles options
     */
  }, {
    key: "saveFiles",
    value: (function () {
      var _saveFiles = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee19(entries, options) {
        var context, updatedEntries;
        return _regenerator.default.wrap(function _callee19$(_context19) {
          while (1) switch (_context19.prev = _context19.next) {
            case 0:
              this.onlyIn(PILOT_TYPE, 'saveFiles');
              this.log('debug', "saveFiles ".concat(entries.length, " input entries"));
              context = options.context;
              _log.debug(context, 'saveFiles input context');
              if (this.bridge) {
                _context19.next = 6;
                break;
              }
              throw new Error('No bridge is defined, you should call ContentScript.init before using this method');
            case 6:
              updatedEntries = this.prepareSaveFileEntries(entries, options);
              _context19.next = 9;
              return this.bridge.call('saveFiles', updatedEntries, options);
            case 9:
              return _context19.abrupt("return", _context19.sent);
            case 10:
            case "end":
              return _context19.stop();
          }
        }, _callee19, this);
      }));
      function saveFiles(_x14, _x15) {
        return _saveFiles.apply(this, arguments);
      }
      return saveFiles;
    }()
    /**
     * Prepare entries to be given to launcher saveFiles. Especially function attributes which will not be serialized to the launcher
     *
     * @param {Array<import('../launcher/saveFiles').saveFilesEntry & {shouldReplaceFile?: Function}>} entries
     * @param {import('../launcher/saveFiles').saveFileOptions & {context: object, shouldReplaceFile?: Function}} options
     */
    )
  }, {
    key: "prepareSaveFileEntries",
    value: function prepareSaveFileEntries(entries, options) {
      var _options$context;
      var existingFilesIndex = (options === null || options === void 0 || (_options$context = options.context) === null || _options$context === void 0 ? void 0 : _options$context.existingFilesIndex) || {};
      var updatedEntries = (0, _toConsumableArray2.default)(entries);
      var _iterator = _createForOfIteratorHelper(updatedEntries),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var entry = _step.value;
          if (entry.forceReplaceFile === true || entry.forceReplaceFile === false) {
            // entry.forceReplaceFile has priority over shouldReplaceFile function
            continue;
          }
          var shouldReplaceFileFn = entry.shouldReplaceFile || options.shouldReplaceFile;
          if (shouldReplaceFileFn) {
            var existingFile = existingFilesIndex[(0, _utils2.calculateFileKey)(entry, options.fileIdAttributes)];
            entry.forceReplaceFile = shouldReplaceFileFn(existingFile, entry, options);
            entry === null || entry === void 0 || delete entry.shouldReplaceFile;
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      options === null || options === void 0 || delete options.shouldReplaceFile;
      return updatedEntries;
    }

    /**
     * Query all the documents corresponding to the given query object. The client with permissions corresponding
     * to the current konnector manifest will be used.
     *
     * @param {import("cozy-client").QueryDefinition} queryDefinition - CozyClient query definition object
     * @param {import('cozy-client/types/types').QueryOptions} options - CozyClient query options
     * @returns {Promise<import('cozy-client/types/types').QueryResult>} Returns the list of documents
     */
  }, {
    key: "queryAll",
    value: (function () {
      var _queryAll = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee20(queryDefinition, options) {
        return _regenerator.default.wrap(function _callee20$(_context20) {
          while (1) switch (_context20.prev = _context20.next) {
            case 0:
              this.onlyIn(PILOT_TYPE, 'queryAll');
              if (this.bridge) {
                _context20.next = 3;
                break;
              }
              throw new Error('No bridge is defined, you should call ContentScript.init before using this method');
            case 3:
              _context20.next = 5;
              return this.bridge.call('queryAll', queryDefinition.toDefinition(), options);
            case 5:
              return _context20.abrupt("return", _context20.sent);
            case 6:
            case "end":
              return _context20.stop();
          }
        }, _callee20, this);
      }));
      function queryAll(_x16, _x17) {
        return _queryAll.apply(this, arguments);
      }
      return queryAll;
    }()
    /**
     * Bridge to the saveBills method from the launcher.
     * - it first saves the files
     * - then saves bills linked to corresponding files
     *
     * @param {Array} entries : list of file entries to save
     * @param {object} options : saveFiles options
     */
    )
  }, {
    key: "saveBills",
    value: (function () {
      var _saveBills = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee21(entries, options) {
        var files;
        return _regenerator.default.wrap(function _callee21$(_context21) {
          while (1) switch (_context21.prev = _context21.next) {
            case 0:
              this.onlyIn(PILOT_TYPE, 'saveBills');
              _context21.next = 3;
              return this.saveFiles(entries, options);
            case 3:
              files = _context21.sent;
              if (this.bridge) {
                _context21.next = 6;
                break;
              }
              throw new Error('No bridge is defined, you should call ContentScript.init before using this method');
            case 6:
              _context21.next = 8;
              return this.bridge.call('saveBills', files, options);
            case 8:
              return _context21.abrupt("return", _context21.sent);
            case 9:
            case "end":
              return _context21.stop();
          }
        }, _callee21, this);
      }));
      function saveBills(_x18, _x19) {
        return _saveBills.apply(this, arguments);
      }
      return saveBills;
    }()
    /**
     * Bridge to the getCredentials method from the launcher.
     */
    )
  }, {
    key: "getCredentials",
    value: (function () {
      var _getCredentials = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee22() {
        return _regenerator.default.wrap(function _callee22$(_context22) {
          while (1) switch (_context22.prev = _context22.next) {
            case 0:
              this.onlyIn(PILOT_TYPE, 'getCredentials');
              if (this.bridge) {
                _context22.next = 3;
                break;
              }
              throw new Error('No bridge is defined, you should call ContentScript.init before using this method');
            case 3:
              _context22.next = 5;
              return this.bridge.call('getCredentials');
            case 5:
              return _context22.abrupt("return", _context22.sent);
            case 6:
            case "end":
              return _context22.stop();
          }
        }, _callee22, this);
      }));
      function getCredentials() {
        return _getCredentials.apply(this, arguments);
      }
      return getCredentials;
    }()
    /**
     * Bridge to the saveCredentials method from the launcher.
     *
     * @param {object} credentials : object with credentials specific to the current connector
     */
    )
  }, {
    key: "saveCredentials",
    value: (function () {
      var _saveCredentials = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee23(credentials) {
        return _regenerator.default.wrap(function _callee23$(_context23) {
          while (1) switch (_context23.prev = _context23.next) {
            case 0:
              this.onlyIn(PILOT_TYPE, 'saveCredentials');
              if (this.bridge) {
                _context23.next = 3;
                break;
              }
              throw new Error('No bridge is defined, you should call ContentScript.init before using this method');
            case 3:
              _context23.next = 5;
              return this.bridge.call('saveCredentials', credentials);
            case 5:
              return _context23.abrupt("return", _context23.sent);
            case 6:
            case "end":
              return _context23.stop();
          }
        }, _callee23, this);
      }));
      function saveCredentials(_x20) {
        return _saveCredentials.apply(this, arguments);
      }
      return saveCredentials;
    }()
    /**
     * Bridge to the saveIdentity method from the launcher.
     *
     * @param {object} identity : io.cozy.contacts object
     */
    )
  }, {
    key: "saveIdentity",
    value: (function () {
      var _saveIdentity = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee24(identity) {
        return _regenerator.default.wrap(function _callee24$(_context24) {
          while (1) switch (_context24.prev = _context24.next) {
            case 0:
              this.onlyIn(PILOT_TYPE, 'saveIdentity');
              if (this.bridge) {
                _context24.next = 3;
                break;
              }
              throw new Error('No bridge is defined, you should call ContentScript.init before using this method');
            case 3:
              _context24.next = 5;
              return this.bridge.call('saveIdentity', identity);
            case 5:
              return _context24.abrupt("return", _context24.sent);
            case 6:
            case "end":
              return _context24.stop();
          }
        }, _callee24, this);
      }));
      function saveIdentity(_x21) {
        return _saveIdentity.apply(this, arguments);
      }
      return saveIdentity;
    }()
    /**
     * Bridge to the getCookiesByDomain method from the RNlauncher.
     *
     * @param {string} domain : domain name
     */
    )
  }, {
    key: "getCookiesByDomain",
    value: (function () {
      var _getCookiesByDomain = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee25(domain) {
        return _regenerator.default.wrap(function _callee25$(_context25) {
          while (1) switch (_context25.prev = _context25.next) {
            case 0:
              if (this.bridge) {
                _context25.next = 2;
                break;
              }
              throw new Error('No bridge is defined, you should call ContentScript.init before using this method');
            case 2:
              _context25.next = 4;
              return this.bridge.call('getCookiesByDomain', domain);
            case 4:
              return _context25.abrupt("return", _context25.sent);
            case 5:
            case "end":
              return _context25.stop();
          }
        }, _callee25, this);
      }));
      function getCookiesByDomain(_x22) {
        return _getCookiesByDomain.apply(this, arguments);
      }
      return getCookiesByDomain;
    }()
    /**
     * Bridge to the getCookieFromKeychainByName method from the RNlauncher.
     *
     * @param {string} cookieName : cookie name
     */
    )
  }, {
    key: "getCookieFromKeychainByName",
    value: (function () {
      var _getCookieFromKeychainByName = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee26(cookieName) {
        return _regenerator.default.wrap(function _callee26$(_context26) {
          while (1) switch (_context26.prev = _context26.next) {
            case 0:
              if (this.bridge) {
                _context26.next = 2;
                break;
              }
              throw new Error('No bridge is defined, you should call ContentScript.init before using this method');
            case 2:
              _context26.next = 4;
              return this.bridge.call('getCookieFromKeychainByName', cookieName);
            case 4:
              return _context26.abrupt("return", _context26.sent);
            case 5:
            case "end":
              return _context26.stop();
          }
        }, _callee26, this);
      }));
      function getCookieFromKeychainByName(_x23) {
        return _getCookieFromKeychainByName.apply(this, arguments);
      }
      return getCookieFromKeychainByName;
    }()
    /**
     * Bridge to the saveCookieToKeychain method from the RNlauncher.
     *
     * @param {string} cookieValue : cookie value
     */
    )
  }, {
    key: "saveCookieToKeychain",
    value: (function () {
      var _saveCookieToKeychain = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee27(cookieValue) {
        return _regenerator.default.wrap(function _callee27$(_context27) {
          while (1) switch (_context27.prev = _context27.next) {
            case 0:
              this.onlyIn(PILOT_TYPE, 'saveCookieToKeychain');
              if (this.bridge) {
                _context27.next = 3;
                break;
              }
              throw new Error('No bridge is defined, you should call ContentScript.init before using this method');
            case 3:
              _context27.next = 5;
              return this.bridge.call('saveCookieToKeychain', cookieValue);
            case 5:
              return _context27.abrupt("return", _context27.sent);
            case 6:
            case "end":
              return _context27.stop();
          }
        }, _callee27, this);
      }));
      function saveCookieToKeychain(_x24) {
        return _saveCookieToKeychain.apply(this, arguments);
      }
      return saveCookieToKeychain;
    }())
  }, {
    key: "getCookieByDomainAndName",
    value: function () {
      var _getCookieByDomainAndName = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee28(cookieDomain, cookieName) {
        var expectedCookie;
        return _regenerator.default.wrap(function _callee28$(_context28) {
          while (1) switch (_context28.prev = _context28.next) {
            case 0:
              this.onlyIn(WORKER_TYPE, 'getCookieByDomainAndName');
              if (this.bridge) {
                _context28.next = 3;
                break;
              }
              throw new Error('No bridge is defined, you should call ContentScript.init before using this method');
            case 3:
              _context28.next = 5;
              return this.bridge.call('getCookieByDomainAndName', cookieDomain, cookieName);
            case 5:
              expectedCookie = _context28.sent;
              return _context28.abrupt("return", expectedCookie);
            case 7:
            case "end":
              return _context28.stop();
          }
        }, _callee28, this);
      }));
      function getCookieByDomainAndName(_x25, _x26) {
        return _getCookieByDomainAndName.apply(this, arguments);
      }
      return getCookieByDomainAndName;
    }()
    /**
     * Send log message to the launcher
     *
     * @param {"debug"|"info"|"warn"|"error"} level : the log level
     * @param {string} message : the log message
     */
  }, {
    key: "log",
    value: function log(level, message) {
      var _this$bridge2;
      if (!message) {
        _log.warn("you are calling log without message, use log(level,message) instead");
        return;
      }
      var now = new Date().toISOString();
      (_this$bridge2 = this.bridge) === null || _this$bridge2 === void 0 || _this$bridge2.emit('log', {
        timestamp: now,
        level: level,
        msg: message
      });
    }

    /**
     * @typedef SetWorkerStateOptions
     * @property {string} [url]      : url displayed by the worker webview for the login
     * @property {boolean} [visible] : will the worker be visible or not
     */

    /**
     * This is a proxy to the "setWorkerState" command in the launcher
     *
     * @param {SetWorkerStateOptions} options : worker state options
     */
  }, {
    key: "setWorkerState",
    value: (function () {
      var _setWorkerState = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee29() {
        var options,
          _args29 = arguments;
        return _regenerator.default.wrap(function _callee29$(_context29) {
          while (1) switch (_context29.prev = _context29.next) {
            case 0:
              options = _args29.length > 0 && _args29[0] !== undefined ? _args29[0] : {};
              this.onlyIn(PILOT_TYPE, 'setWorkerState');
              if (this.bridge) {
                _context29.next = 4;
                break;
              }
              throw new Error('No bridge is defined, you should call ContentScript.init before using this method');
            case 4:
              _context29.next = 6;
              return this.bridge.call('setWorkerState', options);
            case 6:
            case "end":
              return _context29.stop();
          }
        }, _callee29, this);
      }));
      function setWorkerState() {
        return _setWorkerState.apply(this, arguments);
      }
      return setWorkerState;
    }()
    /**
     * Set the current url of the worker
     *
     * @param {string} url : the url
     */
    )
  }, {
    key: "goto",
    value: (function () {
      var _goto = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee30(url) {
        return _regenerator.default.wrap(function _callee30$(_context30) {
          while (1) switch (_context30.prev = _context30.next) {
            case 0:
              this.onlyIn(PILOT_TYPE, 'goto');
              _context30.next = 3;
              return this.setWorkerState({
                url: url
              });
            case 3:
            case "end":
              return _context30.stop();
          }
        }, _callee30, this);
      }));
      function goto(_x27) {
        return _goto.apply(this, arguments);
      }
      return goto;
    }())
  }, {
    key: "blockWorkerInteractions",
    value: function () {
      var _blockWorkerInteractions = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee31() {
        return _regenerator.default.wrap(function _callee31$(_context31) {
          while (1) switch (_context31.prev = _context31.next) {
            case 0:
              this.onlyIn(PILOT_TYPE, 'blockWorkerInteractions');
              if (this.bridge) {
                _context31.next = 3;
                break;
              }
              throw new Error('No bridge is defined, you should call ContentScript.init before using this method');
            case 3:
              _context31.next = 5;
              return this.bridge.call('blockWorkerInteractions');
            case 5:
            case "end":
              return _context31.stop();
          }
        }, _callee31, this);
      }));
      function blockWorkerInteractions() {
        return _blockWorkerInteractions.apply(this, arguments);
      }
      return blockWorkerInteractions;
    }()
  }, {
    key: "unblockWorkerInteractions",
    value: function () {
      var _unblockWorkerInteractions = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee32() {
        return _regenerator.default.wrap(function _callee32$(_context32) {
          while (1) switch (_context32.prev = _context32.next) {
            case 0:
              this.onlyIn(PILOT_TYPE, 'unblockWorkerInteractions');
              if (this.bridge) {
                _context32.next = 3;
                break;
              }
              throw new Error('No bridge is defined, you should call ContentScript.init before using this method');
            case 3:
              _context32.next = 5;
              return this.bridge.call('unblockWorkerInteractions');
            case 5:
            case "end":
              return _context32.stop();
          }
        }, _callee32, this);
      }));
      function unblockWorkerInteractions() {
        return _unblockWorkerInteractions.apply(this, arguments);
      }
      return unblockWorkerInteractions;
    }()
    /**
     * Evaluates a given function in worker context
     *
     * @param {Function} fn - the function to evaluate
     * @returns {Promise<any>} - function evaluation result
     */
  }, {
    key: "evaluateInWorker",
    value: (function () {
      var _evaluateInWorker = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee33(fn) {
        var _len2,
          args,
          _key2,
          _args33 = arguments;
        return _regenerator.default.wrap(function _callee33$(_context33) {
          while (1) switch (_context33.prev = _context33.next) {
            case 0:
              this.onlyIn(PILOT_TYPE, 'evaluateInWorker');
              for (_len2 = _args33.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                args[_key2 - 1] = _args33[_key2];
              }
              _context33.next = 4;
              return this.runInWorker.apply(this, ['evaluate', fn.toString()].concat(args));
            case 4:
              return _context33.abrupt("return", _context33.sent);
            case 5:
            case "end":
              return _context33.stop();
          }
        }, _callee33, this);
      }));
      function evaluateInWorker(_x28) {
        return _evaluateInWorker.apply(this, arguments);
      }
      return evaluateInWorker;
    }()
    /**
     * Evaluates a given function string
     *
     * @param {string} fnString - the function string to evaluate
     * @returns {Promise<any>} - function evaluation result
     */
    )
  }, {
    key: "evaluate",
    value: (function () {
      var _evaluate = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee34(fnString) {
        var _len3,
          args,
          _key3,
          _args34 = arguments;
        return _regenerator.default.wrap(function _callee34$(_context34) {
          while (1) switch (_context34.prev = _context34.next) {
            case 0:
              this.onlyIn(WORKER_TYPE, 'evaluate');
              for (_len3 = _args34.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
                args[_key3 - 1] = _args34[_key3];
              }
              _context34.next = 4;
              return _utils.callStringFunction.apply(void 0, [fnString].concat(args));
            case 4:
              return _context34.abrupt("return", _context34.sent);
            case 5:
            case "end":
              return _context34.stop();
          }
        }, _callee34, this);
      }));
      function evaluate(_x29) {
        return _evaluate.apply(this, arguments);
      }
      return evaluate;
    }()
    /**
     * Make sure that the connector is authenticated to the website.
     * If not, show the login webview to the user to let her/him authenticated.
     * Resolve the promise when authenticated
     *
     * @throws LOGIN_FAILED
     * @returns {Promise.<boolean>} : true if the user is authenticated
     */
    )
  }, {
    key: "ensureAuthenticated",
    value: (function () {
      var _ensureAuthenticated = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee35() {
        return _regenerator.default.wrap(function _callee35$(_context35) {
          while (1) switch (_context35.prev = _context35.next) {
            case 0:
              return _context35.abrupt("return", true);
            case 1:
            case "end":
              return _context35.stop();
          }
        }, _callee35);
      }));
      function ensureAuthenticated() {
        return _ensureAuthenticated.apply(this, arguments);
      }
      return ensureAuthenticated;
    }()
    /**
     * Make sure that the connector is not authenticated anymore to the website.
     *
     * @returns {Promise.<boolean>} : true if the user is not authenticated
     */
    )
  }, {
    key: "ensureNotAuthenticated",
    value: (function () {
      var _ensureNotAuthenticated = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee36() {
        return _regenerator.default.wrap(function _callee36$(_context36) {
          while (1) switch (_context36.prev = _context36.next) {
            case 0:
              return _context36.abrupt("return", true);
            case 1:
            case "end":
              return _context36.stop();
          }
        }, _callee36);
      }));
      function ensureNotAuthenticated() {
        return _ensureNotAuthenticated.apply(this, arguments);
      }
      return ensureNotAuthenticated;
    }()
    /**
     * Returns whatever unique information on the authenticated user which will be usefull
     * to identify fetched data : destination folder name, fetched data metadata
     *
     * @returns {Promise.<object>}  : user data object
     */
    )
  }, {
    key: "getUserDataFromWebsite",
    value: (function () {
      var _getUserDataFromWebsite = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee37() {
        return _regenerator.default.wrap(function _callee37$(_context37) {
          while (1) switch (_context37.prev = _context37.next) {
            case 0:
            case "end":
              return _context37.stop();
          }
        }, _callee37);
      }));
      function getUserDataFromWebsite() {
        return _getUserDataFromWebsite.apply(this, arguments);
      }
      return getUserDataFromWebsite;
    }()
    /**
     * In worker context, send the given data to the pilot to be stored in its own store
     *
     * @param {object} obj : any object with data to store
     */
    )
  }, {
    key: "sendToPilot",
    value: (function () {
      var _sendToPilot = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee38(obj) {
        return _regenerator.default.wrap(function _callee38$(_context38) {
          while (1) switch (_context38.prev = _context38.next) {
            case 0:
              this.onlyIn(WORKER_TYPE, 'sendToPilot');
              if (this.bridge) {
                _context38.next = 3;
                break;
              }
              throw new Error('No bridge is defined, you should call ContentScript.init before using this method');
            case 3:
              return _context38.abrupt("return", this.bridge.call('sendToPilot', obj));
            case 4:
            case "end":
              return _context38.stop();
          }
        }, _callee38, this);
      }));
      function sendToPilot(_x30) {
        return _sendToPilot.apply(this, arguments);
      }
      return sendToPilot;
    }()
    /**
     * Store data sent from worker with sendToPilot method
     *
     * @param {object} obj : any object with data to store
     */
    )
  }, {
    key: "storeFromWorker",
    value: (function () {
      var _storeFromWorker = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee39(obj) {
        return _regenerator.default.wrap(function _callee39$(_context39) {
          while (1) switch (_context39.prev = _context39.next) {
            case 0:
              // @ts-ignore Aucune surcharge ne correspond à cet appel.
              Object.assign(this.store, obj);
            case 1:
            case "end":
              return _context39.stop();
          }
        }, _callee39, this);
      }));
      function storeFromWorker(_x31) {
        return _storeFromWorker.apply(this, arguments);
      }
      return storeFromWorker;
    }())
  }, {
    key: "onlyIn",
    value: function onlyIn(csType, method) {
      if (this.contentScriptType !== csType) {
        throw new Error("Use ".concat(method, " only from the ").concat(csType));
      }
    }

    /**
     * Determine if the konnector must fetch all or parts of the data.
     *
     * @param {object} options - All the data already fetched by the connector in a previous execution.
     *                                   Useful to optimize connector execution by not fetching data we already have.
     * @returns {Promise<object>} - Promise that resolves to an object with the following properties:
     * @property {boolean} shouldFullSync - Indicates if a full synchronization is needed.
     * @property {number|NaN} distanceInDays - The number of days since the last sync, or NaN if not applicable.
     */
  }, {
    key: "shouldFullSync",
    value: (function () {
      var _shouldFullSync = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee40(options) {
        var _trigger$current_stat, _trigger$current_stat2, _trigger$current_stat3, _trigger$current_stat4, _trigger$current_stat5;
        var trigger, flags, forceFullSync, flagFullSync, isFirstJob, isLastJobError, hasLastExecution, distanceInDays, _trigger$current_stat6;
        return _regenerator.default.wrap(function _callee40$(_context40) {
          while (1) switch (_context40.prev = _context40.next) {
            case 0:
              this.onlyIn(PILOT_TYPE, 'shouldFullSync');
              trigger = options.trigger, flags = options.flags;
              forceFullSync = false;
              flagFullSync = false;
              if (flags['clisk.force-full-sync'] === true) {
                this.log('info', 'User forces full sync');
                flagFullSync = true;
              }
              isFirstJob = !((_trigger$current_stat = trigger.current_state) !== null && _trigger$current_stat !== void 0 && _trigger$current_stat.last_failure) && !((_trigger$current_stat2 = trigger.current_state) !== null && _trigger$current_stat2 !== void 0 && _trigger$current_stat2.last_success);
              isLastJobError = !isFirstJob && ((_trigger$current_stat3 = trigger.current_state) === null || _trigger$current_stat3 === void 0 ? void 0 : _trigger$current_stat3.last_failure) > ((_trigger$current_stat4 = trigger.current_state) === null || _trigger$current_stat4 === void 0 ? void 0 : _trigger$current_stat4.last_success);
              hasLastExecution = Boolean((_trigger$current_stat5 = trigger.current_state) === null || _trigger$current_stat5 === void 0 ? void 0 : _trigger$current_stat5.last_execution);
              distanceInDays = 0;
              if (hasLastExecution) {
                distanceInDays = getDateDistanceInDays((_trigger$current_stat6 = trigger.current_state) === null || _trigger$current_stat6 === void 0 ? void 0 : _trigger$current_stat6.last_execution);
              }
              this.log('debug', "distanceInDays: ".concat(distanceInDays));
              if (flagFullSync || !hasLastExecution || isLastJobError || distanceInDays >= 30) {
                this.log('info', '🐢️ Long execution');
                this.log('debug', "isLastJobError: ".concat(isLastJobError, " | hasLastExecution: ").concat(hasLastExecution));
                forceFullSync = true;
              } else {
                this.log('info', '🐇️ Quick execution');
              }
              return _context40.abrupt("return", {
                forceFullSync: forceFullSync,
                distanceInDays: distanceInDays
              });
            case 13:
            case "end":
              return _context40.stop();
          }
        }, _callee40, this);
      }));
      function shouldFullSync(_x32) {
        return _shouldFullSync.apply(this, arguments);
      }
      return shouldFullSync;
    }()
    /**
     * Main function, fetches all connector data and save it to the cozy
     *
     * @param {object} options : options object
     * @param {object} options.context : all the data already fetched by the connector in a previous execution. Will be usefull to optimize
     * connector execution by not fetching data we already have.
     * @returns {Promise.<object>} : Connector execution result. TBD
     */
    // eslint-disable-next-line no-unused-vars
    )
  }, {
    key: "fetch",
    value: (function () {
      var _fetch = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee41(options) {
        return _regenerator.default.wrap(function _callee41$(_context41) {
          while (1) switch (_context41.prev = _context41.next) {
            case 0:
            case "end":
              return _context41.stop();
          }
        }, _callee41);
      }));
      function fetch(_x33) {
        return _fetch.apply(this, arguments);
      }
      return fetch;
    }()
    /**
     * Returns the current clisk version number in package.json file
     */
    )
  }, {
    key: "getCliskVersion",
    value: (function () {
      var _getCliskVersion = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee42() {
        return _regenerator.default.wrap(function _callee42$(_context42) {
          while (1) switch (_context42.prev = _context42.next) {
            case 0:
              return _context42.abrupt("return", _package.default.version);
            case 1:
            case "end":
              return _context42.stop();
          }
        }, _callee42);
      }));
      function getCliskVersion() {
        return _getCliskVersion.apply(this, arguments);
      }
      return getCliskVersion;
    }())
  }]);
  return ContentScript;
}();
function sendPageMessage(message) {
  var _window$ReactNativeWe;
  // @ts-ignore La propriété 'ReactNativeWebView' n'existe pas sur le type 'Window & typeof globalThis'.
  if ((_window$ReactNativeWe = window.ReactNativeWebView) !== null && _window$ReactNativeWe !== void 0 && _window$ReactNativeWe.postMessage) {
    var _window$ReactNativeWe2;
    // @ts-ignore La propriété 'ReactNativeWebView' n'existe pas sur le type 'Window & typeof globalThis'.
    (_window$ReactNativeWe2 = window.ReactNativeWebView) === null || _window$ReactNativeWe2 === void 0 || _window$ReactNativeWe2.postMessage(JSON.stringify({
      message: message
    }));
  } else {
    _log.error('No window.ReactNativeWebView.postMessage available');
  }
}
function getDateDistanceInDays(dateString) {
  var distanceMs = Date.now() - new Date(dateString).getTime();
  var days = 1000 * 60 * 60 * 24;
  return Math.floor(distanceMs / days);
}

/***/ }),
/* 4 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__(5);


/***/ }),
/* 5 */
/***/ ((module) => {

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var runtime = (function (exports) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function define(obj, key, value) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
    return obj[key];
  }
  try {
    // IE 8 has a broken Object.defineProperty that only works on DOM objects.
    define({}, "");
  } catch (err) {
    define = function(obj, key, value) {
      return obj[key] = value;
    };
  }

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  exports.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunction.displayName = define(
    GeneratorFunctionPrototype,
    toStringTagSymbol,
    "GeneratorFunction"
  );

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      define(prototype, method, function(arg) {
        return this._invoke(method, arg);
      });
    });
  }

  exports.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  exports.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      define(genFun, toStringTagSymbol, "GeneratorFunction");
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  exports.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return PromiseImpl.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return PromiseImpl.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new PromiseImpl(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  exports.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    if (PromiseImpl === void 0) PromiseImpl = Promise;

    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList),
      PromiseImpl
    );

    return exports.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        // Note: ["return"] must be used for ES3 parsing compatibility.
        if (delegate.iterator["return"]) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  define(Gp, toStringTagSymbol, "Generator");

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  exports.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  exports.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };

  // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.
  return exports;

}(
  // If this script is executing as a CommonJS module, use module.exports
  // as the regeneratorRuntime namespace. Otherwise create a new empty
  // object. Either way, the resulting object will be used to initialize
  // the regeneratorRuntime variable at the top of this file.
   true ? module.exports : 0
));

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  Function("r", "regeneratorRuntime = r")(runtime);
}


/***/ }),
/* 6 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var arrayWithoutHoles = __webpack_require__(7);

var iterableToArray = __webpack_require__(9);

var unsupportedIterableToArray = __webpack_require__(10);

var nonIterableSpread = __webpack_require__(11);

function _toConsumableArray(arr) {
  return arrayWithoutHoles(arr) || iterableToArray(arr) || unsupportedIterableToArray(arr) || nonIterableSpread();
}

module.exports = _toConsumableArray, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 7 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var arrayLikeToArray = __webpack_require__(8);

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return arrayLikeToArray(arr);
}

module.exports = _arrayWithoutHoles, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 8 */
/***/ ((module) => {

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }

  return arr2;
}

module.exports = _arrayLikeToArray, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 9 */
/***/ ((module) => {

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}

module.exports = _iterableToArray, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 10 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var arrayLikeToArray = __webpack_require__(8);

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return arrayLikeToArray(o, minLen);
}

module.exports = _unsupportedIterableToArray, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 11 */
/***/ ((module) => {

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

module.exports = _nonIterableSpread, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 12 */
/***/ ((module) => {

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

module.exports = _asyncToGenerator, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 13 */
/***/ ((module) => {

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

module.exports = _classCallCheck, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 14 */
/***/ ((module) => {

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}

module.exports = _createClass, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 15 */
/***/ ((module, exports, __webpack_require__) => {

var Minilog = __webpack_require__(16);

var oldEnable = Minilog.enable,
    oldDisable = Minilog.disable,
    isChrome = (typeof navigator != 'undefined' && /chrome/i.test(navigator.userAgent)),
    console = __webpack_require__(20);

// Use a more capable logging backend if on Chrome
Minilog.defaultBackend = (isChrome ? console.minilog : console);

// apply enable inputs from localStorage and from the URL
if(typeof window != 'undefined') {
  try {
    Minilog.enable(JSON.parse(window.localStorage['minilogSettings']));
  } catch(e) {}
  if(window.location && window.location.search) {
    var match = RegExp('[?&]minilog=([^&]*)').exec(window.location.search);
    match && Minilog.enable(decodeURIComponent(match[1]));
  }
}

// Make enable also add to localStorage
Minilog.enable = function() {
  oldEnable.call(Minilog, true);
  try { window.localStorage['minilogSettings'] = JSON.stringify(true); } catch(e) {}
  return this;
};

Minilog.disable = function() {
  oldDisable.call(Minilog);
  try { delete window.localStorage.minilogSettings; } catch(e) {}
  return this;
};

exports = module.exports = Minilog;

exports.backends = {
  array: __webpack_require__(24),
  browser: Minilog.defaultBackend,
  localStorage: __webpack_require__(25),
  jQuery: __webpack_require__(26)
};


/***/ }),
/* 16 */
/***/ ((module, exports, __webpack_require__) => {

var Transform = __webpack_require__(17),
    Filter = __webpack_require__(19);

var log = new Transform(),
    slice = Array.prototype.slice;

exports = module.exports = function create(name) {
  var o   = function() { log.write(name, undefined, slice.call(arguments)); return o; };
  o.debug = function() { log.write(name, 'debug', slice.call(arguments)); return o; };
  o.info  = function() { log.write(name, 'info',  slice.call(arguments)); return o; };
  o.warn  = function() { log.write(name, 'warn',  slice.call(arguments)); return o; };
  o.error = function() { log.write(name, 'error', slice.call(arguments)); return o; };
  o.group = function() { log.write(name, 'group', slice.call(arguments)); return o; };
  o.groupEnd = function() { log.write(name, 'groupEnd', slice.call(arguments)); return o; };
  o.log   = o.debug; // for interface compliance with Node and browser consoles
  o.suggest = exports.suggest;
  o.format = log.format;
  return o;
};

// filled in separately
exports.defaultBackend = exports.defaultFormatter = null;

exports.pipe = function(dest) {
  return log.pipe(dest);
};

exports.end = exports.unpipe = exports.disable = function(from) {
  return log.unpipe(from);
};

exports.Transform = Transform;
exports.Filter = Filter;
// this is the default filter that's applied when .enable() is called normally
// you can bypass it completely and set up your own pipes
exports.suggest = new Filter();

exports.enable = function() {
  if(exports.defaultFormatter) {
    return log.pipe(exports.suggest) // filter
              .pipe(exports.defaultFormatter) // formatter
              .pipe(exports.defaultBackend); // backend
  }
  return log.pipe(exports.suggest) // filter
            .pipe(exports.defaultBackend); // formatter
};



/***/ }),
/* 17 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var microee = __webpack_require__(18);

// Implements a subset of Node's stream.Transform - in a cross-platform manner.
function Transform() {}

microee.mixin(Transform);

// The write() signature is different from Node's
// --> makes it much easier to work with objects in logs.
// One of the lessons from v1 was that it's better to target
// a good browser rather than the lowest common denominator
// internally.
// If you want to use external streams, pipe() to ./stringify.js first.
Transform.prototype.write = function(name, level, args) {
  this.emit('item', name, level, args);
};

Transform.prototype.end = function() {
  this.emit('end');
  this.removeAllListeners();
};

Transform.prototype.pipe = function(dest) {
  var s = this;
  // prevent double piping
  s.emit('unpipe', dest);
  // tell the dest that it's being piped to
  dest.emit('pipe', s);

  function onItem() {
    dest.write.apply(dest, Array.prototype.slice.call(arguments));
  }
  function onEnd() { !dest._isStdio && dest.end(); }

  s.on('item', onItem);
  s.on('end', onEnd);

  s.when('unpipe', function(from) {
    var match = (from === dest) || typeof from == 'undefined';
    if(match) {
      s.removeListener('item', onItem);
      s.removeListener('end', onEnd);
      dest.emit('unpipe');
    }
    return match;
  });

  return dest;
};

Transform.prototype.unpipe = function(from) {
  this.emit('unpipe', from);
  return this;
};

Transform.prototype.format = function(dest) {
  throw new Error([
    'Warning: .format() is deprecated in Minilog v2! Use .pipe() instead. For example:',
    'var Minilog = require(\'minilog\');',
    'Minilog',
    '  .pipe(Minilog.backends.console.formatClean)',
    '  .pipe(Minilog.backends.console);'].join('\n'));
};

Transform.mixin = function(dest) {
  var o = Transform.prototype, k;
  for (k in o) {
    o.hasOwnProperty(k) && (dest.prototype[k] = o[k]);
  }
};

module.exports = Transform;


/***/ }),
/* 18 */
/***/ ((module) => {

function M() { this._events = {}; }
M.prototype = {
  on: function(ev, cb) {
    this._events || (this._events = {});
    var e = this._events;
    (e[ev] || (e[ev] = [])).push(cb);
    return this;
  },
  removeListener: function(ev, cb) {
    var e = this._events[ev] || [], i;
    for(i = e.length-1; i >= 0 && e[i]; i--){
      if(e[i] === cb || e[i].cb === cb) { e.splice(i, 1); }
    }
  },
  removeAllListeners: function(ev) {
    if(!ev) { this._events = {}; }
    else { this._events[ev] && (this._events[ev] = []); }
  },
  listeners: function(ev) {
    return (this._events ? this._events[ev] || [] : []);
  },
  emit: function(ev) {
    this._events || (this._events = {});
    var args = Array.prototype.slice.call(arguments, 1), i, e = this._events[ev] || [];
    for(i = e.length-1; i >= 0 && e[i]; i--){
      e[i].apply(this, args);
    }
    return this;
  },
  when: function(ev, cb) {
    return this.once(ev, cb, true);
  },
  once: function(ev, cb, when) {
    if(!cb) return this;
    function c() {
      if(!when) this.removeListener(ev, c);
      if(cb.apply(this, arguments) && when) this.removeListener(ev, c);
    }
    c.cb = cb;
    this.on(ev, c);
    return this;
  }
};
M.mixin = function(dest) {
  var o = M.prototype, k;
  for (k in o) {
    o.hasOwnProperty(k) && (dest.prototype[k] = o[k]);
  }
};
module.exports = M;


/***/ }),
/* 19 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// default filter
var Transform = __webpack_require__(17);

var levelMap = { debug: 1, info: 2, warn: 3, error: 4 };

function Filter() {
  this.enabled = true;
  this.defaultResult = true;
  this.clear();
}

Transform.mixin(Filter);

// allow all matching, with level >= given level
Filter.prototype.allow = function(name, level) {
  this._white.push({ n: name, l: levelMap[level] });
  return this;
};

// deny all matching, with level <= given level
Filter.prototype.deny = function(name, level) {
  this._black.push({ n: name, l: levelMap[level] });
  return this;
};

Filter.prototype.clear = function() {
  this._white = [];
  this._black = [];
  return this;
};

function test(rule, name) {
  // use .test for RegExps
  return (rule.n.test ? rule.n.test(name) : rule.n == name);
};

Filter.prototype.test = function(name, level) {
  var i, len = Math.max(this._white.length, this._black.length);
  for(i = 0; i < len; i++) {
    if(this._white[i] && test(this._white[i], name) && levelMap[level] >= this._white[i].l) {
      return true;
    }
    if(this._black[i] && test(this._black[i], name) && levelMap[level] <= this._black[i].l) {
      return false;
    }
  }
  return this.defaultResult;
};

Filter.prototype.write = function(name, level, args) {
  if(!this.enabled || this.test(name, level)) {
    return this.emit('item', name, level, args);
  }
};

module.exports = Filter;


/***/ }),
/* 20 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Transform = __webpack_require__(17);

var newlines = /\n+$/,
    logger = new Transform();

logger.write = function(name, level, args) {
  var i = args.length-1;
  if (typeof console === 'undefined' || !console.log) {
    return;
  }
  if(console.log.apply) {
    return console.log.apply(console, [name, level].concat(args));
  } else if(JSON && JSON.stringify) {
    // console.log.apply is undefined in IE8 and IE9
    // for IE8/9: make console.log at least a bit less awful
    if(args[i] && typeof args[i] == 'string') {
      args[i] = args[i].replace(newlines, '');
    }
    try {
      for(i = 0; i < args.length; i++) {
        args[i] = JSON.stringify(args[i]);
      }
    } catch(e) {}
    console.log(args.join(' '));
  }
};

logger.formatters = ['color', 'minilog'];
logger.color = __webpack_require__(21);
logger.minilog = __webpack_require__(23);

module.exports = logger;


/***/ }),
/* 21 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Transform = __webpack_require__(17),
    color = __webpack_require__(22);

var colors = { debug: ['cyan'], info: ['purple' ], warn: [ 'yellow', true ], error: [ 'red', true ] },
    logger = new Transform();

logger.write = function(name, level, args) {
  var fn = console.log;
  if(console[level] && console[level].apply) {
    fn = console[level];
    fn.apply(console, [ '%c'+name+' %c'+level, color('gray'), color.apply(color, colors[level])].concat(args));
  }
};

// NOP, because piping the formatted logs can only cause trouble.
logger.pipe = function() { };

module.exports = logger;


/***/ }),
/* 22 */
/***/ ((module) => {

var hex = {
  black: '#000',
  red: '#c23621',
  green: '#25bc26',
  yellow: '#bbbb00',
  blue:  '#492ee1',
  magenta: '#d338d3',
  cyan: '#33bbc8',
  gray: '#808080',
  purple: '#708'
};
function color(fg, isInverse) {
  if(isInverse) {
    return 'color: #fff; background: '+hex[fg]+';';
  } else {
    return 'color: '+hex[fg]+';';
  }
}

module.exports = color;


/***/ }),
/* 23 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Transform = __webpack_require__(17),
    color = __webpack_require__(22),
    colors = { debug: ['gray'], info: ['purple' ], warn: [ 'yellow', true ], error: [ 'red', true ] },
    logger = new Transform();

logger.write = function(name, level, args) {
  var fn = console.log;
  if(level != 'debug' && console[level]) {
    fn = console[level];
  }

  var subset = [], i = 0;
  if(level != 'info') {
    for(; i < args.length; i++) {
      if(typeof args[i] != 'string') break;
    }
    fn.apply(console, [ '%c'+name +' '+ args.slice(0, i).join(' '), color.apply(color, colors[level]) ].concat(args.slice(i)));
  } else {
    fn.apply(console, [ '%c'+name, color.apply(color, colors[level]) ].concat(args));
  }
};

// NOP, because piping the formatted logs can only cause trouble.
logger.pipe = function() { };

module.exports = logger;


/***/ }),
/* 24 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Transform = __webpack_require__(17),
    cache = [ ];

var logger = new Transform();

logger.write = function(name, level, args) {
  cache.push([ name, level, args ]);
};

// utility functions
logger.get = function() { return cache; };
logger.empty = function() { cache = []; };

module.exports = logger;


/***/ }),
/* 25 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Transform = __webpack_require__(17),
    cache = false;

var logger = new Transform();

logger.write = function(name, level, args) {
  if(typeof window == 'undefined' || typeof JSON == 'undefined' || !JSON.stringify || !JSON.parse) return;
  try {
    if(!cache) { cache = (window.localStorage.minilog ? JSON.parse(window.localStorage.minilog) : []); }
    cache.push([ new Date().toString(), name, level, args ]);
    window.localStorage.minilog = JSON.stringify(cache);
  } catch(e) {}
};

module.exports = logger;

/***/ }),
/* 26 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Transform = __webpack_require__(17);

var cid = new Date().valueOf().toString(36);

function AjaxLogger(options) {
  this.url = options.url || '';
  this.cache = [];
  this.timer = null;
  this.interval = options.interval || 30*1000;
  this.enabled = true;
  this.jQuery = window.jQuery;
  this.extras = {};
}

Transform.mixin(AjaxLogger);

AjaxLogger.prototype.write = function(name, level, args) {
  if(!this.timer) { this.init(); }
  this.cache.push([name, level].concat(args));
};

AjaxLogger.prototype.init = function() {
  if(!this.enabled || !this.jQuery) return;
  var self = this;
  this.timer = setTimeout(function() {
    var i, logs = [], ajaxData, url = self.url;
    if(self.cache.length == 0) return self.init();
    // Test each log line and only log the ones that are valid (e.g. don't have circular references).
    // Slight performance hit but benefit is we log all valid lines.
    for(i = 0; i < self.cache.length; i++) {
      try {
        JSON.stringify(self.cache[i]);
        logs.push(self.cache[i]);
      } catch(e) { }
    }
    if(self.jQuery.isEmptyObject(self.extras)) {
        ajaxData = JSON.stringify({ logs: logs });
        url = self.url + '?client_id=' + cid;
    } else {
        ajaxData = JSON.stringify(self.jQuery.extend({logs: logs}, self.extras));
    }

    self.jQuery.ajax(url, {
      type: 'POST',
      cache: false,
      processData: false,
      data: ajaxData,
      contentType: 'application/json',
      timeout: 10000
    }).success(function(data, status, jqxhr) {
      if(data.interval) {
        self.interval = Math.max(1000, data.interval);
      }
    }).error(function() {
      self.interval = 30000;
    }).always(function() {
      self.init();
    });
    self.cache = [];
  }, this.interval);
};

AjaxLogger.prototype.end = function() {};

// wait until jQuery is defined. Useful if you don't control the load order.
AjaxLogger.jQueryWait = function(onDone) {
  if(typeof window !== 'undefined' && (window.jQuery || window.$)) {
    return onDone(window.jQuery || window.$);
  } else if (typeof window !== 'undefined') {
    setTimeout(function() { AjaxLogger.jQueryWait(onDone); }, 200);
  }
};

module.exports = AjaxLogger;


/***/ }),
/* 27 */
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

(function (global, factory) {
	 true ? module.exports = factory() :
	0;
}(this, (function () { 'use strict';

	/*! MIT License © Sindre Sorhus */

	const globals = {};

	const getGlobal = property => {
		/* istanbul ignore next */
		if (typeof self !== 'undefined' && self && property in self) {
			return self;
		}

		/* istanbul ignore next */
		if (typeof window !== 'undefined' && window && property in window) {
			return window;
		}

		if (typeof __webpack_require__.g !== 'undefined' && __webpack_require__.g && property in __webpack_require__.g) {
			return __webpack_require__.g;
		}

		/* istanbul ignore next */
		if (typeof globalThis !== 'undefined' && globalThis) {
			return globalThis;
		}
	};

	const globalProperties = [
		'Headers',
		'Request',
		'Response',
		'ReadableStream',
		'fetch',
		'AbortController',
		'FormData'
	];

	for (const property of globalProperties) {
		Object.defineProperty(globals, property, {
			get() {
				const globalObject = getGlobal(property);
				const value = globalObject && globalObject[property];
				return typeof value === 'function' ? value.bind(globalObject) : value;
			}
		});
	}

	const isObject = value => value !== null && typeof value === 'object';
	const supportsAbortController = typeof globals.AbortController === 'function';
	const supportsStreams = typeof globals.ReadableStream === 'function';
	const supportsFormData = typeof globals.FormData === 'function';

	const mergeHeaders = (source1, source2) => {
		const result = new globals.Headers(source1 || {});
		const isHeadersInstance = source2 instanceof globals.Headers;
		const source = new globals.Headers(source2 || {});

		for (const [key, value] of source) {
			if ((isHeadersInstance && value === 'undefined') || value === undefined) {
				result.delete(key);
			} else {
				result.set(key, value);
			}
		}

		return result;
	};

	const deepMerge = (...sources) => {
		let returnValue = {};
		let headers = {};

		for (const source of sources) {
			if (Array.isArray(source)) {
				if (!(Array.isArray(returnValue))) {
					returnValue = [];
				}

				returnValue = [...returnValue, ...source];
			} else if (isObject(source)) {
				for (let [key, value] of Object.entries(source)) {
					if (isObject(value) && (key in returnValue)) {
						value = deepMerge(returnValue[key], value);
					}

					returnValue = {...returnValue, [key]: value};
				}

				if (isObject(source.headers)) {
					headers = mergeHeaders(headers, source.headers);
				}
			}

			returnValue.headers = headers;
		}

		return returnValue;
	};

	const requestMethods = [
		'get',
		'post',
		'put',
		'patch',
		'head',
		'delete'
	];

	const responseTypes = {
		json: 'application/json',
		text: 'text/*',
		formData: 'multipart/form-data',
		arrayBuffer: '*/*',
		blob: '*/*'
	};

	const retryMethods = [
		'get',
		'put',
		'head',
		'delete',
		'options',
		'trace'
	];

	const retryStatusCodes = [
		408,
		413,
		429,
		500,
		502,
		503,
		504
	];

	const retryAfterStatusCodes = [
		413,
		429,
		503
	];

	const stop = Symbol('stop');

	class HTTPError extends Error {
		constructor(response) {
			// Set the message to the status text, such as Unauthorized,
			// with some fallbacks. This message should never be undefined.
			super(
				response.statusText ||
				String(
					(response.status === 0 || response.status) ?
						response.status : 'Unknown response error'
				)
			);
			this.name = 'HTTPError';
			this.response = response;
		}
	}

	class TimeoutError extends Error {
		constructor(request) {
			super('Request timed out');
			this.name = 'TimeoutError';
			this.request = request;
		}
	}

	const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

	// `Promise.race()` workaround (#91)
	const timeout = (request, abortController, options) =>
		new Promise((resolve, reject) => {
			const timeoutID = setTimeout(() => {
				if (abortController) {
					abortController.abort();
				}

				reject(new TimeoutError(request));
			}, options.timeout);

			/* eslint-disable promise/prefer-await-to-then */
			options.fetch(request)
				.then(resolve)
				.catch(reject)
				.then(() => {
					clearTimeout(timeoutID);
				});
			/* eslint-enable promise/prefer-await-to-then */
		});

	const normalizeRequestMethod = input => requestMethods.includes(input) ? input.toUpperCase() : input;

	const defaultRetryOptions = {
		limit: 2,
		methods: retryMethods,
		statusCodes: retryStatusCodes,
		afterStatusCodes: retryAfterStatusCodes
	};

	const normalizeRetryOptions = (retry = {}) => {
		if (typeof retry === 'number') {
			return {
				...defaultRetryOptions,
				limit: retry
			};
		}

		if (retry.methods && !Array.isArray(retry.methods)) {
			throw new Error('retry.methods must be an array');
		}

		if (retry.statusCodes && !Array.isArray(retry.statusCodes)) {
			throw new Error('retry.statusCodes must be an array');
		}

		return {
			...defaultRetryOptions,
			...retry,
			afterStatusCodes: retryAfterStatusCodes
		};
	};

	// The maximum value of a 32bit int (see issue #117)
	const maxSafeTimeout = 2147483647;

	class Ky {
		constructor(input, options = {}) {
			this._retryCount = 0;
			this._input = input;
			this._options = {
				// TODO: credentials can be removed when the spec change is implemented in all browsers. Context: https://www.chromestatus.com/feature/4539473312350208
				credentials: this._input.credentials || 'same-origin',
				...options,
				headers: mergeHeaders(this._input.headers, options.headers),
				hooks: deepMerge({
					beforeRequest: [],
					beforeRetry: [],
					afterResponse: []
				}, options.hooks),
				method: normalizeRequestMethod(options.method || this._input.method),
				prefixUrl: String(options.prefixUrl || ''),
				retry: normalizeRetryOptions(options.retry),
				throwHttpErrors: options.throwHttpErrors !== false,
				timeout: typeof options.timeout === 'undefined' ? 10000 : options.timeout,
				fetch: options.fetch || globals.fetch
			};

			if (typeof this._input !== 'string' && !(this._input instanceof URL || this._input instanceof globals.Request)) {
				throw new TypeError('`input` must be a string, URL, or Request');
			}

			if (this._options.prefixUrl && typeof this._input === 'string') {
				if (this._input.startsWith('/')) {
					throw new Error('`input` must not begin with a slash when using `prefixUrl`');
				}

				if (!this._options.prefixUrl.endsWith('/')) {
					this._options.prefixUrl += '/';
				}

				this._input = this._options.prefixUrl + this._input;
			}

			if (supportsAbortController) {
				this.abortController = new globals.AbortController();
				if (this._options.signal) {
					this._options.signal.addEventListener('abort', () => {
						this.abortController.abort();
					});
				}

				this._options.signal = this.abortController.signal;
			}

			this.request = new globals.Request(this._input, this._options);

			if (this._options.searchParams) {
				const searchParams = '?' + new URLSearchParams(this._options.searchParams).toString();
				const url = this.request.url.replace(/(?:\?.*?)?(?=#|$)/, searchParams);

				// To provide correct form boundary, Content-Type header should be deleted each time when new Request instantiated from another one
				if (((supportsFormData && this._options.body instanceof globals.FormData) || this._options.body instanceof URLSearchParams) && !(this._options.headers && this._options.headers['content-type'])) {
					this.request.headers.delete('content-type');
				}

				this.request = new globals.Request(new globals.Request(url, this.request), this._options);
			}

			if (this._options.json !== undefined) {
				this._options.body = JSON.stringify(this._options.json);
				this.request.headers.set('content-type', 'application/json');
				this.request = new globals.Request(this.request, {body: this._options.body});
			}

			const fn = async () => {
				if (this._options.timeout > maxSafeTimeout) {
					throw new RangeError(`The \`timeout\` option cannot be greater than ${maxSafeTimeout}`);
				}

				await delay(1);
				let response = await this._fetch();

				for (const hook of this._options.hooks.afterResponse) {
					// eslint-disable-next-line no-await-in-loop
					const modifiedResponse = await hook(
						this.request,
						this._options,
						this._decorateResponse(response.clone())
					);

					if (modifiedResponse instanceof globals.Response) {
						response = modifiedResponse;
					}
				}

				this._decorateResponse(response);

				if (!response.ok && this._options.throwHttpErrors) {
					throw new HTTPError(response);
				}

				// If `onDownloadProgress` is passed, it uses the stream API internally
				/* istanbul ignore next */
				if (this._options.onDownloadProgress) {
					if (typeof this._options.onDownloadProgress !== 'function') {
						throw new TypeError('The `onDownloadProgress` option must be a function');
					}

					if (!supportsStreams) {
						throw new Error('Streams are not supported in your environment. `ReadableStream` is missing.');
					}

					return this._stream(response.clone(), this._options.onDownloadProgress);
				}

				return response;
			};

			const isRetriableMethod = this._options.retry.methods.includes(this.request.method.toLowerCase());
			const result = isRetriableMethod ? this._retry(fn) : fn();

			for (const [type, mimeType] of Object.entries(responseTypes)) {
				result[type] = async () => {
					this.request.headers.set('accept', this.request.headers.get('accept') || mimeType);

					const response = (await result).clone();

					if (type === 'json') {
						if (response.status === 204) {
							return '';
						}

						if (options.parseJson) {
							return options.parseJson(await response.text());
						}
					}

					return response[type]();
				};
			}

			return result;
		}

		_calculateRetryDelay(error) {
			this._retryCount++;

			if (this._retryCount < this._options.retry.limit && !(error instanceof TimeoutError)) {
				if (error instanceof HTTPError) {
					if (!this._options.retry.statusCodes.includes(error.response.status)) {
						return 0;
					}

					const retryAfter = error.response.headers.get('Retry-After');
					if (retryAfter && this._options.retry.afterStatusCodes.includes(error.response.status)) {
						let after = Number(retryAfter);
						if (Number.isNaN(after)) {
							after = Date.parse(retryAfter) - Date.now();
						} else {
							after *= 1000;
						}

						if (typeof this._options.retry.maxRetryAfter !== 'undefined' && after > this._options.retry.maxRetryAfter) {
							return 0;
						}

						return after;
					}

					if (error.response.status === 413) {
						return 0;
					}
				}

				const BACKOFF_FACTOR = 0.3;
				return BACKOFF_FACTOR * (2 ** (this._retryCount - 1)) * 1000;
			}

			return 0;
		}

		_decorateResponse(response) {
			if (this._options.parseJson) {
				response.json = async () => {
					return this._options.parseJson(await response.text());
				};
			}

			return response;
		}

		async _retry(fn) {
			try {
				return await fn();
			} catch (error) {
				const ms = Math.min(this._calculateRetryDelay(error), maxSafeTimeout);
				if (ms !== 0 && this._retryCount > 0) {
					await delay(ms);

					for (const hook of this._options.hooks.beforeRetry) {
						// eslint-disable-next-line no-await-in-loop
						const hookResult = await hook({
							request: this.request,
							options: this._options,
							error,
							retryCount: this._retryCount
						});

						// If `stop` is returned from the hook, the retry process is stopped
						if (hookResult === stop) {
							return;
						}
					}

					return this._retry(fn);
				}

				if (this._options.throwHttpErrors) {
					throw error;
				}
			}
		}

		async _fetch() {
			for (const hook of this._options.hooks.beforeRequest) {
				// eslint-disable-next-line no-await-in-loop
				const result = await hook(this.request, this._options);

				if (result instanceof Request) {
					this.request = result;
					break;
				}

				if (result instanceof Response) {
					return result;
				}
			}

			if (this._options.timeout === false) {
				return this._options.fetch(this.request.clone());
			}

			return timeout(this.request.clone(), this.abortController, this._options);
		}

		/* istanbul ignore next */
		_stream(response, onDownloadProgress) {
			const totalBytes = Number(response.headers.get('content-length')) || 0;
			let transferredBytes = 0;

			return new globals.Response(
				new globals.ReadableStream({
					start(controller) {
						const reader = response.body.getReader();

						if (onDownloadProgress) {
							onDownloadProgress({percent: 0, transferredBytes: 0, totalBytes}, new Uint8Array());
						}

						async function read() {
							const {done, value} = await reader.read();
							if (done) {
								controller.close();
								return;
							}

							if (onDownloadProgress) {
								transferredBytes += value.byteLength;
								const percent = totalBytes === 0 ? 0 : transferredBytes / totalBytes;
								onDownloadProgress({percent, transferredBytes, totalBytes}, value);
							}

							controller.enqueue(value);
							read();
						}

						read();
					}
				})
			);
		}
	}

	const validateAndMerge = (...sources) => {
		for (const source of sources) {
			if ((!isObject(source) || Array.isArray(source)) && typeof source !== 'undefined') {
				throw new TypeError('The `options` argument must be an object');
			}
		}

		return deepMerge({}, ...sources);
	};

	const createInstance = defaults => {
		const ky = (input, options) => new Ky(input, validateAndMerge(defaults, options));

		for (const method of requestMethods) {
			ky[method] = (input, options) => new Ky(input, validateAndMerge(defaults, options, {method}));
		}

		ky.HTTPError = HTTPError;
		ky.TimeoutError = TimeoutError;
		ky.create = newDefaults => createInstance(validateAndMerge(newDefaults));
		ky.extend = newDefaults => createInstance(validateAndMerge(defaults, newDefaults));
		ky.stop = stop;

		return ky;
	};

	var index = createInstance();

	return index;

})));


/***/ }),
/* 28 */
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AbortError": () => (/* binding */ AbortError),
/* harmony export */   "TimeoutError": () => (/* binding */ TimeoutError),
/* harmony export */   "default": () => (/* binding */ pTimeout)
/* harmony export */ });
class TimeoutError extends Error {
	constructor(message) {
		super(message);
		this.name = 'TimeoutError';
	}
}

/**
An error to be thrown when the request is aborted by AbortController.
DOMException is thrown instead of this Error when DOMException is available.
*/
class AbortError extends Error {
	constructor(message) {
		super();
		this.name = 'AbortError';
		this.message = message;
	}
}

/**
TODO: Remove AbortError and just throw DOMException when targeting Node 18.
*/
const getDOMException = errorMessage => globalThis.DOMException === undefined
	? new AbortError(errorMessage)
	: new DOMException(errorMessage);

/**
TODO: Remove below function and just 'reject(signal.reason)' when targeting Node 18.
*/
const getAbortedReason = signal => {
	const reason = signal.reason === undefined
		? getDOMException('This operation was aborted.')
		: signal.reason;

	return reason instanceof Error ? reason : getDOMException(reason);
};

function pTimeout(promise, options) {
	const {
		milliseconds,
		fallback,
		message,
		customTimers = {setTimeout, clearTimeout},
	} = options;

	let timer;

	const wrappedPromise = new Promise((resolve, reject) => {
		if (typeof milliseconds !== 'number' || Math.sign(milliseconds) !== 1) {
			throw new TypeError(`Expected \`milliseconds\` to be a positive number, got \`${milliseconds}\``);
		}

		if (options.signal) {
			const {signal} = options;
			if (signal.aborted) {
				reject(getAbortedReason(signal));
			}

			signal.addEventListener('abort', () => {
				reject(getAbortedReason(signal));
			});
		}

		if (milliseconds === Number.POSITIVE_INFINITY) {
			promise.then(resolve, reject);
			return;
		}

		// We create the error outside of `setTimeout` to preserve the stack trace.
		const timeoutError = new TimeoutError();

		timer = customTimers.setTimeout.call(undefined, () => {
			if (fallback) {
				try {
					resolve(fallback());
				} catch (error) {
					reject(error);
				}

				return;
			}

			if (typeof promise.cancel === 'function') {
				promise.cancel();
			}

			if (message === false) {
				resolve();
			} else if (message instanceof Error) {
				reject(message);
			} else {
				timeoutError.message = message ?? `Promise timed out after ${milliseconds} milliseconds`;
				reject(timeoutError);
			}
		}, milliseconds);

		(async () => {
			try {
				resolve(await promise);
			} catch (error) {
				reject(error);
			}
		})();
	});

	const cancelablePromise = wrappedPromise.finally(() => {
		cancelablePromise.clear();
	});

	cancelablePromise.clear = () => {
		customTimers.clearTimeout.call(undefined, timer);
		timer = undefined;
	};

	return cancelablePromise;
}


/***/ }),
/* 29 */
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TimeoutError": () => (/* reexport safe */ p_timeout__WEBPACK_IMPORTED_MODULE_0__.TimeoutError),
/* harmony export */   "default": () => (/* binding */ pWaitFor)
/* harmony export */ });
/* harmony import */ var p_timeout__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(28);


const resolveValue = Symbol('resolveValue');

async function pWaitFor(condition, options = {}) {
	const {
		interval = 20,
		timeout = Number.POSITIVE_INFINITY,
		before = true,
	} = options;

	let retryTimeout;
	let abort = false;

	const promise = new Promise((resolve, reject) => {
		const check = async () => {
			try {
				const value = await condition();

				if (typeof value === 'object' && value[resolveValue]) {
					resolve(value[resolveValue]);
				} else if (typeof value !== 'boolean') {
					throw new TypeError('Expected condition to return a boolean');
				} else if (value === true) {
					resolve();
				} else if (!abort) {
					retryTimeout = setTimeout(check, interval);
				}
			} catch (error) {
				reject(error);
			}
		};

		if (before) {
			check();
		} else {
			retryTimeout = setTimeout(check, interval);
		}
	});

	if (timeout === Number.POSITIVE_INFINITY) {
		return promise;
	}

	try {
		return await (0,p_timeout__WEBPACK_IMPORTED_MODULE_0__["default"])(promise, typeof timeout === 'number' ? {milliseconds: timeout} : timeout);
	} finally {
		abort = true;
		clearTimeout(retryTimeout);
	}
}

pWaitFor.resolveWith = value => ({[resolveValue]: value});




/***/ }),
/* 30 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(2);
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.blobToBase64 = blobToBase64;
exports.callStringFunction = callStringFunction;
exports.deserializeStringFunction = deserializeStringFunction;
var _regenerator = _interopRequireDefault(__webpack_require__(4));
var _asyncToGenerator2 = _interopRequireDefault(__webpack_require__(12));
/**
 * Convert a blob object to a base64 uri
 *
 * @param {Blob} blob : blob object
 * @returns {Promise.<string>} : base64 form of the blob
 */
function blobToBase64(_x) {
  return _blobToBase.apply(this, arguments);
}
/**
 * Convert a string function to the corresponding function.
 *
 * @param {string} fnString - function string to convert
 * @returns {Function} - the resulting function
 */
function _blobToBase() {
  _blobToBase = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(blob) {
    var reader;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          reader = new window.FileReader();
          _context.next = 3;
          return new Promise(function (resolve, reject) {
            reader.onload = resolve;
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          });
        case 3:
          return _context.abrupt("return", reader.result);
        case 4:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return _blobToBase.apply(this, arguments);
}
function deserializeStringFunction(fnString) {
  return eval('(' + fnString.trim() + ')');
}

/**
 * Calls and awaits the given string function with given arguments
 *
 * @param {string} fnString - function string to convert
 * @returns {Promise<any>} - the result of the execution of the string function
 */
function callStringFunction(_x2) {
  return _callStringFunction.apply(this, arguments);
}
function _callStringFunction() {
  _callStringFunction = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2(fnString) {
    var fn,
      _len,
      args,
      _key,
      _args2 = arguments;
    return _regenerator.default.wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          fn = deserializeStringFunction(fnString);
          for (_len = _args2.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            args[_key - 1] = _args2[_key];
          }
          _context2.next = 4;
          return fn.apply(void 0, args);
        case 4:
          return _context2.abrupt("return", _context2.sent);
        case 5:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return _callStringFunction.apply(this, arguments);
}

/***/ }),
/* 31 */
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"name":"cozy-clisk","version":"0.38.2","description":"All the libs needed to run a cozy client connector","repository":{"type":"git","url":"git+https://github.com/konnectors/libs.git"},"files":["dist"],"keywords":["konnector"],"main":"dist/index.js","author":"doubleface <christophe@cozycloud.cc>","license":"MIT","bugs":{"url":"https://github.com/konnectors/libs/issues"},"homepage":"https://github.com/konnectors/libs#readme","scripts":{"lint":"eslint \'src/**/*.js\'","prepublishOnly":"yarn run build","build":"babel --root-mode upward src/ -d dist/ --copy-files --verbose --ignore \'**/*.spec.js\',\'**/*.spec.jsx\'","test":"jest src"},"devDependencies":{"@babel/core":"7.24.0","babel-jest":"29.7.0","babel-preset-cozy-app":"2.1.0","eslint-plugin-import":"^2.29.1","eslint-plugin-jest":"^27.9.0","eslint-plugin-prettier":"^5.1.3","jest":"29.7.0","jest-environment-jsdom":"29.7.0","prettier":"^3.2.5","typescript":"4.9.5"},"dependencies":{"@cozy/minilog":"^1.0.0","bluebird-retry":"^0.11.0","ky":"^0.25.1","lodash":"^4.17.21","microee":"^0.0.6","p-timeout":"^6.0.0","p-wait-for":"^5.0.2","post-me":"^0.4.5"},"peerDependencies":{"cozy-client":">=41.2.0"},"gitHead":"9842e5b91d6df4b059dc691f5c3ace2ebf498759"}');

/***/ }),
/* 32 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(2);
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _regenerator = _interopRequireDefault(__webpack_require__(4));
var _asyncToGenerator2 = _interopRequireDefault(__webpack_require__(12));
var _classCallCheck2 = _interopRequireDefault(__webpack_require__(13));
var _createClass2 = _interopRequireDefault(__webpack_require__(14));
var _possibleConstructorReturn2 = _interopRequireDefault(__webpack_require__(33));
var _getPrototypeOf2 = _interopRequireDefault(__webpack_require__(36));
var _inherits2 = _interopRequireDefault(__webpack_require__(37));
var _postMe = __webpack_require__(39);
var _ContentScriptMessenger = _interopRequireDefault(__webpack_require__(40));
var _bridgeInterfaces = __webpack_require__(41);
function _callSuper(t, o, e) { return o = (0, _getPrototypeOf2.default)(o), (0, _possibleConstructorReturn2.default)(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], (0, _getPrototypeOf2.default)(t).constructor) : o.apply(t, e)); }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
/**
 * Bridge to the Launcher object via post-me
 */
var LauncherBridge = exports["default"] = /*#__PURE__*/function (_Bridge) {
  (0, _inherits2.default)(LauncherBridge, _Bridge);
  /**
   * Init the window which will be used to communicate with the launcher
   *
   * @param {object} options             : option object
   * @param {object} options.localWindow : The window used to communicate with the launcher
   */
  function LauncherBridge(_ref) {
    var _this;
    var localWindow = _ref.localWindow;
    (0, _classCallCheck2.default)(this, LauncherBridge);
    _this = _callSuper(this, LauncherBridge);
    _this.localWindow = localWindow;
    return _this;
  }
  (0, _createClass2.default)(LauncherBridge, [{
    key: "init",
    value: function () {
      var _init = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee() {
        var _ref2,
          _ref2$exposedMethods,
          exposedMethods,
          messenger,
          _args = arguments;
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              _ref2 = _args.length > 0 && _args[0] !== undefined ? _args[0] : {}, _ref2$exposedMethods = _ref2.exposedMethods, exposedMethods = _ref2$exposedMethods === void 0 ? {} : _ref2$exposedMethods;
              messenger = new _ContentScriptMessenger.default({
                localWindow: this.localWindow
              });
              _context.next = 4;
              return (0, _postMe.ChildHandshake)(messenger, exposedMethods);
            case 4:
              this.connection = _context.sent;
              this.localHandle = this.connection.localHandle();
              this.remoteHandle = this.connection.remoteHandle();
            case 7:
            case "end":
              return _context.stop();
          }
        }, _callee, this);
      }));
      function init() {
        return _init.apply(this, arguments);
      }
      return init;
    }()
  }]);
  return LauncherBridge;
}(_bridgeInterfaces.Bridge);

/***/ }),
/* 33 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var _typeof = (__webpack_require__(34)["default"]);

var assertThisInitialized = __webpack_require__(35);

function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }

  return assertThisInitialized(self);
}

module.exports = _possibleConstructorReturn, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 34 */
/***/ ((module) => {

function _typeof(obj) {
  "@babel/helpers - typeof";

  return (module.exports = _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  }, module.exports.__esModule = true, module.exports["default"] = module.exports), _typeof(obj);
}

module.exports = _typeof, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 35 */
/***/ ((module) => {

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

module.exports = _assertThisInitialized, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 36 */
/***/ ((module) => {

function _getPrototypeOf(o) {
  module.exports = _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  }, module.exports.__esModule = true, module.exports["default"] = module.exports;
  return _getPrototypeOf(o);
}

module.exports = _getPrototypeOf, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 37 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var setPrototypeOf = __webpack_require__(38);

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  Object.defineProperty(subClass, "prototype", {
    writable: false
  });
  if (superClass) setPrototypeOf(subClass, superClass);
}

module.exports = _inherits, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 38 */
/***/ ((module) => {

function _setPrototypeOf(o, p) {
  module.exports = _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  }, module.exports.__esModule = true, module.exports["default"] = module.exports;
  return _setPrototypeOf(o, p);
}

module.exports = _setPrototypeOf, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 39 */
/***/ (function(module, exports) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

(function (global, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
		__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
		(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else { var mod; }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.ChildHandshake = ChildHandshake;
  _exports.DebugMessenger = DebugMessenger;
  _exports.ParentHandshake = ParentHandshake;
  _exports.debug = debug;
  _exports.WorkerMessenger = _exports.WindowMessenger = _exports.PortMessenger = _exports.ConcreteEmitter = _exports.BareMessenger = void 0;

  function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

  function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

  function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

  function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

  function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

  function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  var MARKER = '@post-me';

  function createUniqueIdFn() {
    var __id = 0;
    return function () {
      var id = __id;
      __id += 1;
      return id;
    };
  }
  /**
   * A concrete implementation of the {@link Emitter} interface
   *
   * @public
   */


  var ConcreteEmitter = /*#__PURE__*/function () {
    function ConcreteEmitter() {
      _classCallCheck(this, ConcreteEmitter);

      this._listeners = {};
    }
    /** {@inheritDoc Emitter.addEventListener} */


    _createClass(ConcreteEmitter, [{
      key: "addEventListener",
      value: function addEventListener(eventName, listener) {
        var listeners = this._listeners[eventName];

        if (!listeners) {
          listeners = new Set();
          this._listeners[eventName] = listeners;
        }

        listeners.add(listener);
      }
      /** {@inheritDoc Emitter.removeEventListener} */

    }, {
      key: "removeEventListener",
      value: function removeEventListener(eventName, listener) {
        var listeners = this._listeners[eventName];

        if (!listeners) {
          return;
        }

        listeners["delete"](listener);
      }
      /** {@inheritDoc Emitter.once} */

    }, {
      key: "once",
      value: function once(eventName) {
        var _this = this;

        return new Promise(function (resolve) {
          var listener = function listener(data) {
            _this.removeEventListener(eventName, listener);

            resolve(data);
          };

          _this.addEventListener(eventName, listener);
        });
      }
      /** @internal */

    }, {
      key: "emit",
      value: function emit(eventName, data) {
        var listeners = this._listeners[eventName];

        if (!listeners) {
          return;
        }

        listeners.forEach(function (listener) {
          listener(data);
        });
      }
      /** @internal */

    }, {
      key: "removeAllListeners",
      value: function removeAllListeners() {
        Object.values(this._listeners).forEach(function (listeners) {
          if (listeners) {
            listeners.clear();
          }
        });
      }
    }]);

    return ConcreteEmitter;
  }();

  _exports.ConcreteEmitter = ConcreteEmitter;
  var MessageType;

  (function (MessageType) {
    MessageType["HandshakeRequest"] = "handshake-request";
    MessageType["HandshakeResponse"] = "handshake-response";
    MessageType["Call"] = "call";
    MessageType["Response"] = "response";
    MessageType["Error"] = "error";
    MessageType["Event"] = "event";
    MessageType["Callback"] = "callback";
  })(MessageType || (MessageType = {})); // Message Creators


  function createHandshakeRequestMessage(sessionId) {
    return {
      type: MARKER,
      action: MessageType.HandshakeRequest,
      sessionId: sessionId
    };
  }

  function createHandshakeResponseMessage(sessionId) {
    return {
      type: MARKER,
      action: MessageType.HandshakeResponse,
      sessionId: sessionId
    };
  }

  function createCallMessage(sessionId, requestId, methodName, args) {
    return {
      type: MARKER,
      action: MessageType.Call,
      sessionId: sessionId,
      requestId: requestId,
      methodName: methodName,
      args: args
    };
  }

  function createResponsMessage(sessionId, requestId, result, error) {
    var message = {
      type: MARKER,
      action: MessageType.Response,
      sessionId: sessionId,
      requestId: requestId
    };

    if (result !== undefined) {
      message.result = result;
    }

    if (error !== undefined) {
      message.error = error;
    }

    return message;
  }

  function createCallbackMessage(sessionId, requestId, callbackId, args) {
    return {
      type: MARKER,
      action: MessageType.Callback,
      sessionId: sessionId,
      requestId: requestId,
      callbackId: callbackId,
      args: args
    };
  }

  function createEventMessage(sessionId, eventName, payload) {
    return {
      type: MARKER,
      action: MessageType.Event,
      sessionId: sessionId,
      eventName: eventName,
      payload: payload
    };
  } // Type Guards


  function isMessage(m) {
    return m && m.type === MARKER;
  }

  function isHandshakeRequestMessage(m) {
    return isMessage(m) && m.action === MessageType.HandshakeRequest;
  }

  function isHandshakeResponseMessage(m) {
    return isMessage(m) && m.action === MessageType.HandshakeResponse;
  }

  function isCallMessage(m) {
    return isMessage(m) && m.action === MessageType.Call;
  }

  function isResponseMessage(m) {
    return isMessage(m) && m.action === MessageType.Response;
  }

  function isCallbackMessage(m) {
    return isMessage(m) && m.action === MessageType.Callback;
  }

  function isEventMessage(m) {
    return isMessage(m) && m.action === MessageType.Event;
  }

  function makeCallbackEvent(requestId) {
    return "callback_".concat(requestId);
  }

  function makeResponseEvent(requestId) {
    return "response_".concat(requestId);
  }

  var Dispatcher = /*#__PURE__*/function (_ConcreteEmitter) {
    _inherits(Dispatcher, _ConcreteEmitter);

    var _super = _createSuper(Dispatcher);

    function Dispatcher(messenger, sessionId) {
      var _this2;

      _classCallCheck(this, Dispatcher);

      _this2 = _super.call(this);
      _this2.uniqueId = createUniqueIdFn();
      _this2.messenger = messenger;
      _this2.sessionId = sessionId;
      _this2.removeMessengerListener = _this2.messenger.addMessageListener(_this2.messengerListener.bind(_assertThisInitialized(_this2)));
      return _this2;
    }

    _createClass(Dispatcher, [{
      key: "messengerListener",
      value: function messengerListener(event) {
        var data = event.data;

        if (!isMessage(data)) {
          return;
        }

        if (this.sessionId !== data.sessionId) {
          return;
        }

        if (isCallMessage(data)) {
          this.emit(MessageType.Call, data);
        } else if (isResponseMessage(data)) {
          this.emit(makeResponseEvent(data.requestId), data);
        } else if (isEventMessage(data)) {
          this.emit(MessageType.Event, data);
        } else if (isCallbackMessage(data)) {
          this.emit(makeCallbackEvent(data.requestId), data);
        }
      }
    }, {
      key: "callOnRemote",
      value: function callOnRemote(methodName, args, transfer) {
        var requestId = this.uniqueId();
        var callbackEvent = makeCallbackEvent(requestId);
        var responseEvent = makeResponseEvent(requestId);
        var message = createCallMessage(this.sessionId, requestId, methodName, args);
        this.messenger.postMessage(message, transfer);
        return {
          callbackEvent: callbackEvent,
          responseEvent: responseEvent
        };
      }
    }, {
      key: "respondToRemote",
      value: function respondToRemote(requestId, value, error, transfer) {
        if (error instanceof Error) {
          error = {
            name: error.name,
            message: error.message
          };
        }

        var message = createResponsMessage(this.sessionId, requestId, value, error);
        this.messenger.postMessage(message, transfer);
      }
    }, {
      key: "callbackToRemote",
      value: function callbackToRemote(requestId, callbackId, args) {
        var message = createCallbackMessage(this.sessionId, requestId, callbackId, args);
        this.messenger.postMessage(message);
      }
    }, {
      key: "emitToRemote",
      value: function emitToRemote(eventName, payload, transfer) {
        var message = createEventMessage(this.sessionId, eventName, payload);
        this.messenger.postMessage(message, transfer);
      }
    }, {
      key: "close",
      value: function close() {
        this.removeMessengerListener();
        this.removeAllListeners();
      }
    }]);

    return Dispatcher;
  }(ConcreteEmitter);

  var ParentHandshakeDispatcher = /*#__PURE__*/function (_ConcreteEmitter2) {
    _inherits(ParentHandshakeDispatcher, _ConcreteEmitter2);

    var _super2 = _createSuper(ParentHandshakeDispatcher);

    function ParentHandshakeDispatcher(messenger, sessionId) {
      var _this3;

      _classCallCheck(this, ParentHandshakeDispatcher);

      _this3 = _super2.call(this);
      _this3.messenger = messenger;
      _this3.sessionId = sessionId;
      _this3.removeMessengerListener = _this3.messenger.addMessageListener(_this3.messengerListener.bind(_assertThisInitialized(_this3)));
      return _this3;
    }

    _createClass(ParentHandshakeDispatcher, [{
      key: "messengerListener",
      value: function messengerListener(event) {
        var data = event.data;

        if (!isMessage(data)) {
          return;
        }

        if (this.sessionId !== data.sessionId) {
          return;
        }

        if (isHandshakeResponseMessage(data)) {
          this.emit(data.sessionId, data);
        }
      }
    }, {
      key: "initiateHandshake",
      value: function initiateHandshake() {
        var message = createHandshakeRequestMessage(this.sessionId);
        this.messenger.postMessage(message);
        return this.sessionId;
      }
    }, {
      key: "close",
      value: function close() {
        this.removeMessengerListener();
        this.removeAllListeners();
      }
    }]);

    return ParentHandshakeDispatcher;
  }(ConcreteEmitter);

  var ChildHandshakeDispatcher = /*#__PURE__*/function (_ConcreteEmitter3) {
    _inherits(ChildHandshakeDispatcher, _ConcreteEmitter3);

    var _super3 = _createSuper(ChildHandshakeDispatcher);

    function ChildHandshakeDispatcher(messenger) {
      var _this4;

      _classCallCheck(this, ChildHandshakeDispatcher);

      _this4 = _super3.call(this);
      _this4.messenger = messenger;
      _this4.removeMessengerListener = _this4.messenger.addMessageListener(_this4.messengerListener.bind(_assertThisInitialized(_this4)));
      return _this4;
    }

    _createClass(ChildHandshakeDispatcher, [{
      key: "messengerListener",
      value: function messengerListener(event) {
        var data = event.data;

        if (isHandshakeRequestMessage(data)) {
          this.emit(MessageType.HandshakeRequest, data);
        }
      }
    }, {
      key: "acceptHandshake",
      value: function acceptHandshake(sessionId) {
        var message = createHandshakeResponseMessage(sessionId);
        this.messenger.postMessage(message);
      }
    }, {
      key: "close",
      value: function close() {
        this.removeMessengerListener();
        this.removeAllListeners();
      }
    }]);

    return ChildHandshakeDispatcher;
  }(ConcreteEmitter);

  var ProxyType;

  (function (ProxyType) {
    ProxyType["Callback"] = "callback";
  })(ProxyType || (ProxyType = {}));

  function createCallbackProxy(callbackId) {
    return {
      type: MARKER,
      proxy: ProxyType.Callback,
      callbackId: callbackId
    };
  }

  function isCallbackProxy(p) {
    return p && p.type === MARKER && p.proxy === ProxyType.Callback;
  }

  var ConcreteRemoteHandle = /*#__PURE__*/function (_ConcreteEmitter4) {
    _inherits(ConcreteRemoteHandle, _ConcreteEmitter4);

    var _super4 = _createSuper(ConcreteRemoteHandle);

    function ConcreteRemoteHandle(dispatcher) {
      var _this5;

      _classCallCheck(this, ConcreteRemoteHandle);

      _this5 = _super4.call(this);
      _this5._dispatcher = dispatcher;
      _this5._callTransfer = {};

      _this5._dispatcher.addEventListener(MessageType.Event, _this5._handleEvent.bind(_assertThisInitialized(_this5)));

      return _this5;
    }

    _createClass(ConcreteRemoteHandle, [{
      key: "close",
      value: function close() {
        this.removeAllListeners();
      }
    }, {
      key: "setCallTransfer",
      value: function setCallTransfer(methodName, transfer) {
        this._callTransfer[methodName] = transfer;
      }
    }, {
      key: "call",
      value: function call(methodName) {
        for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }

        return this.customCall(methodName, args);
      }
    }, {
      key: "customCall",
      value: function customCall(methodName, args) {
        var _this6 = this;

        var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
        return new Promise(function (resolve, reject) {
          var sanitizedArgs = [];
          var callbacks = [];
          var callbackId = 0;
          args.forEach(function (arg) {
            if (typeof arg === 'function') {
              callbacks.push(arg);
              sanitizedArgs.push(createCallbackProxy(callbackId));
              callbackId += 1;
            } else {
              sanitizedArgs.push(arg);
            }
          });
          var hasCallbacks = callbacks.length > 0;
          var callbackListener = undefined;

          if (hasCallbacks) {
            callbackListener = function callbackListener(data) {
              var callbackId = data.callbackId,
                  args = data.args;
              callbacks[callbackId].apply(callbacks, _toConsumableArray(args));
            };
          }

          var transfer = options.transfer;

          if (transfer === undefined && _this6._callTransfer[methodName]) {
            var _this6$_callTransfer;

            transfer = (_this6$_callTransfer = _this6._callTransfer)[methodName].apply(_this6$_callTransfer, sanitizedArgs);
          }

          var _this6$_dispatcher$ca = _this6._dispatcher.callOnRemote(methodName, sanitizedArgs, transfer),
              callbackEvent = _this6$_dispatcher$ca.callbackEvent,
              responseEvent = _this6$_dispatcher$ca.responseEvent;

          if (hasCallbacks) {
            _this6._dispatcher.addEventListener(callbackEvent, callbackListener);
          }

          _this6._dispatcher.once(responseEvent).then(function (response) {
            if (callbackListener) {
              _this6._dispatcher.removeEventListener(callbackEvent, callbackListener);
            }

            var result = response.result,
                error = response.error;

            if (error !== undefined) {
              reject(error);
            } else {
              resolve(result);
            }
          });
        });
      }
    }, {
      key: "_handleEvent",
      value: function _handleEvent(data) {
        var eventName = data.eventName,
            payload = data.payload;
        this.emit(eventName, payload);
      }
    }]);

    return ConcreteRemoteHandle;
  }(ConcreteEmitter);

  var ConcreteLocalHandle = /*#__PURE__*/function () {
    function ConcreteLocalHandle(dispatcher, localMethods) {
      _classCallCheck(this, ConcreteLocalHandle);

      this._dispatcher = dispatcher;
      this._methods = localMethods;
      this._returnTransfer = {};
      this._emitTransfer = {};

      this._dispatcher.addEventListener(MessageType.Call, this._handleCall.bind(this));
    }

    _createClass(ConcreteLocalHandle, [{
      key: "emit",
      value: function emit(eventName, payload) {
        var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
        var transfer = options.transfer;

        if (transfer === undefined && this._emitTransfer[eventName]) {
          transfer = this._emitTransfer[eventName](payload);
        }

        this._dispatcher.emitToRemote(eventName, payload, transfer);
      }
    }, {
      key: "setMethods",
      value: function setMethods(methods) {
        this._methods = methods;
      }
    }, {
      key: "setMethod",
      value: function setMethod(methodName, method) {
        this._methods[methodName] = method;
      }
    }, {
      key: "setReturnTransfer",
      value: function setReturnTransfer(methodName, transfer) {
        this._returnTransfer[methodName] = transfer;
      }
    }, {
      key: "setEmitTransfer",
      value: function setEmitTransfer(eventName, transfer) {
        this._emitTransfer[eventName] = transfer;
      }
    }, {
      key: "_handleCall",
      value: function _handleCall(data) {
        var _this7 = this;

        var requestId = data.requestId,
            methodName = data.methodName,
            args = data.args;
        var callMethod = new Promise(function (resolve, reject) {
          var _this7$_methods;

          var method = _this7._methods[methodName];

          if (typeof method !== 'function') {
            reject(new Error("The method \"".concat(methodName, "\" has not been implemented.")));
            return;
          }

          var desanitizedArgs = args.map(function (arg) {
            if (isCallbackProxy(arg)) {
              var callbackId = arg.callbackId;
              return function () {
                for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                  args[_key2] = arguments[_key2];
                }

                _this7._dispatcher.callbackToRemote(requestId, callbackId, args);
              };
            } else {
              return arg;
            }
          });
          Promise.resolve((_this7$_methods = _this7._methods)[methodName].apply(_this7$_methods, _toConsumableArray(desanitizedArgs))).then(resolve)["catch"](reject);
        });
        callMethod.then(function (result) {
          var transfer;

          if (_this7._returnTransfer[methodName]) {
            transfer = _this7._returnTransfer[methodName](result);
          }

          _this7._dispatcher.respondToRemote(requestId, result, undefined, transfer);
        })["catch"](function (error) {
          _this7._dispatcher.respondToRemote(requestId, undefined, error);
        });
      }
    }]);

    return ConcreteLocalHandle;
  }();

  var ConcreteConnection = /*#__PURE__*/function () {
    function ConcreteConnection(dispatcher, localMethods) {
      _classCallCheck(this, ConcreteConnection);

      this._dispatcher = dispatcher;
      this._localHandle = new ConcreteLocalHandle(dispatcher, localMethods);
      this._remoteHandle = new ConcreteRemoteHandle(dispatcher);
    }

    _createClass(ConcreteConnection, [{
      key: "close",
      value: function close() {
        this._dispatcher.close();

        this.remoteHandle().close();
      }
    }, {
      key: "localHandle",
      value: function localHandle() {
        return this._localHandle;
      }
    }, {
      key: "remoteHandle",
      value: function remoteHandle() {
        return this._remoteHandle;
      }
    }]);

    return ConcreteConnection;
  }();

  var uniqueSessionId = createUniqueIdFn();

  var runUntil = function runUntil(worker, condition, unfulfilled, maxAttempts, attemptInterval) {
    var attempt = 0;

    var fn = function fn() {
      if (!condition() && (attempt < maxAttempts || maxAttempts < 1)) {
        worker();
        attempt += 1;
        setTimeout(fn, attemptInterval);
      } else if (!condition() && attempt >= maxAttempts && maxAttempts >= 1) {
        unfulfilled();
      }
    };

    fn();
  };
  /**
   * Initiate the handshake from the Parent side
   *
   * @param messenger - The Messenger used to send and receive messages from the other end
   * @param localMethods - The methods that will be exposed to the other end
   * @param maxAttempts - The maximum number of handshake attempts
   * @param attemptsInterval - The interval between handshake attempts
   * @returns A Promise to an active {@link Connection} to the other end
   *
   * @public
   */


  function ParentHandshake(messenger) {
    var localMethods = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var maxAttempts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 5;
    var attemptsInterval = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 100;
    var thisSessionId = uniqueSessionId();
    var connected = false;
    return new Promise(function (resolve, reject) {
      var handshakeDispatcher = new ParentHandshakeDispatcher(messenger, thisSessionId);
      handshakeDispatcher.once(thisSessionId).then(function (response) {
        connected = true;
        handshakeDispatcher.close();
        var sessionId = response.sessionId;
        var dispatcher = new Dispatcher(messenger, sessionId);
        var connection = new ConcreteConnection(dispatcher, localMethods);
        resolve(connection);
      });
      runUntil(function () {
        return handshakeDispatcher.initiateHandshake();
      }, function () {
        return connected;
      }, function () {
        return reject(new Error("Handshake failed, reached maximum number of attempts"));
      }, maxAttempts, attemptsInterval);
    });
  }
  /**
   * Initiate the handshake from the Child side
   *
   * @param messenger - The Messenger used to send and receive messages from the other end
   * @param localMethods - The methods that will be exposed to the other end
   * @returns A Promise to an active {@link Connection} to the other end
   *
   * @public
   */


  function ChildHandshake(messenger) {
    var localMethods = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return new Promise(function (resolve, reject) {
      var handshakeDispatcher = new ChildHandshakeDispatcher(messenger);
      handshakeDispatcher.once(MessageType.HandshakeRequest).then(function (response) {
        var sessionId = response.sessionId;
        handshakeDispatcher.acceptHandshake(sessionId);
        handshakeDispatcher.close();
        var dispatcher = new Dispatcher(messenger, sessionId);
        var connection = new ConcreteConnection(dispatcher, localMethods);
        resolve(connection);
      });
    });
  }

  var acceptableMessageEvent = function acceptableMessageEvent(event, remoteWindow, acceptedOrigin) {
    var source = event.source,
        origin = event.origin;

    if (source !== remoteWindow) {
      return false;
    }

    if (origin !== acceptedOrigin && acceptedOrigin !== '*') {
      return false;
    }

    return true;
  };
  /**
   * A concrete implementation of {@link Messenger} used to communicate with another Window.
   *
   * @public
   *
   */


  var WindowMessenger = function WindowMessenger(_ref) {
    var localWindow = _ref.localWindow,
        remoteWindow = _ref.remoteWindow,
        remoteOrigin = _ref.remoteOrigin;

    _classCallCheck(this, WindowMessenger);

    localWindow = localWindow || window;

    this.postMessage = function (message, transfer) {
      remoteWindow.postMessage(message, remoteOrigin, transfer);
    };

    this.addMessageListener = function (listener) {
      var outerListener = function outerListener(event) {
        if (acceptableMessageEvent(event, remoteWindow, remoteOrigin)) {
          listener(event);
        }
      };

      localWindow.addEventListener('message', outerListener);

      var removeListener = function removeListener() {
        localWindow.removeEventListener('message', outerListener);
      };

      return removeListener;
    };
  };
  /** @public */


  _exports.WindowMessenger = WindowMessenger;

  var BareMessenger = function BareMessenger(postable) {
    _classCallCheck(this, BareMessenger);

    this.postMessage = function (message) {
      var transfer = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
      postable.postMessage(message, transfer);
    };

    this.addMessageListener = function (listener) {
      var outerListener = function outerListener(event) {
        listener(event);
      };

      postable.addEventListener('message', outerListener);

      var removeListener = function removeListener() {
        postable.removeEventListener('message', outerListener);
      };

      return removeListener;
    };
  };
  /**
   * A concrete implementation of {@link Messenger} used to communicate with a Worker.
   *
   * Takes a {@link Postable} representing the `Worker` (when calling from
   * the parent context) or the `self` `DedicatedWorkerGlobalScope` object
   * (when calling from the child context).
   *
   * @public
   *
   */


  _exports.BareMessenger = BareMessenger;

  var WorkerMessenger = /*#__PURE__*/function (_BareMessenger) {
    _inherits(WorkerMessenger, _BareMessenger);

    var _super5 = _createSuper(WorkerMessenger);

    function WorkerMessenger(_ref2) {
      var worker = _ref2.worker;

      _classCallCheck(this, WorkerMessenger);

      return _super5.call(this, worker);
    }

    return WorkerMessenger;
  }(BareMessenger);
  /**
   * A concrete implementation of {@link Messenger} used to communicate with a MessagePort.
   *
   * @public
   *
   */


  _exports.WorkerMessenger = WorkerMessenger;

  var PortMessenger = /*#__PURE__*/function (_BareMessenger2) {
    _inherits(PortMessenger, _BareMessenger2);

    var _super6 = _createSuper(PortMessenger);

    function PortMessenger(_ref3) {
      var port = _ref3.port;

      _classCallCheck(this, PortMessenger);

      port.start();
      return _super6.call(this, port);
    }

    return PortMessenger;
  }(BareMessenger);
  /**
   * Create a logger function with a specific namespace
   *
   * @param namespace - The namespace will be prepended to all the arguments passed to the logger function
   * @param log - The underlying logger (`console.log` by default)
   *
   * @public
   *
   */


  _exports.PortMessenger = PortMessenger;

  function debug(namespace, log) {
    log = log || console.debug || console.log || function () {};

    return function () {
      for (var _len3 = arguments.length, data = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        data[_key3] = arguments[_key3];
      }

      log.apply(void 0, [namespace].concat(data));
    };
  }
  /**
   * Decorate a {@link Messenger} so that it will log any message exchanged
   * @param messenger - The Messenger that will be decorated
   * @param log - The logger function that will receive each message
   * @returns A decorated Messenger
   *
   * @public
   *
   */


  function DebugMessenger(messenger, log) {
    log = log || debug('post-me');

    var debugListener = function debugListener(event) {
      var data = event.data;
      log('⬅️ received message', data);
    };

    messenger.addMessageListener(debugListener);
    return {
      postMessage: function postMessage(message, transfer) {
        log('➡️ sending message', message);
        messenger.postMessage(message, transfer);
      },
      addMessageListener: function addMessageListener(listener) {
        return messenger.addMessageListener(listener);
      }
    };
  }
});


/***/ }),
/* 40 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(2);
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _classCallCheck2 = _interopRequireDefault(__webpack_require__(13));
var _createClass2 = _interopRequireDefault(__webpack_require__(14));
var _possibleConstructorReturn2 = _interopRequireDefault(__webpack_require__(33));
var _getPrototypeOf2 = _interopRequireDefault(__webpack_require__(36));
var _inherits2 = _interopRequireDefault(__webpack_require__(37));
var _bridgeInterfaces = __webpack_require__(41);
function _callSuper(t, o, e) { return o = (0, _getPrototypeOf2.default)(o), (0, _possibleConstructorReturn2.default)(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], (0, _getPrototypeOf2.default)(t).constructor) : o.apply(t, e)); }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); } // @ts-check
/**
 * post-me messenger implementation for a content script implanted in a react native webview
 */
var ReactNativeWebviewMessenger = exports["default"] = /*#__PURE__*/function (_MessengerInterface) {
  (0, _inherits2.default)(ReactNativeWebviewMessenger, _MessengerInterface);
  /**
   * Init the window which will be used to post messages and listen to messages
   *
   * @param  {object} options             : options object
   * @param  {object} options.localWindow : The window object
   */
  function ReactNativeWebviewMessenger(_ref) {
    var _this;
    var localWindow = _ref.localWindow;
    (0, _classCallCheck2.default)(this, ReactNativeWebviewMessenger);
    _this = _callSuper(this, ReactNativeWebviewMessenger);
    _this.localWindow = localWindow;
    return _this;
  }
  (0, _createClass2.default)(ReactNativeWebviewMessenger, [{
    key: "postMessage",
    value: function postMessage(message) {
      this.localWindow.ReactNativeWebView.postMessage(JSON.stringify(message));
    }
  }, {
    key: "addMessageListener",
    value: function addMessageListener(listener) {
      var _this2 = this;
      var outerListener = function outerListener(event) {
        listener(event);
      };
      this.localWindow.addEventListener('message', outerListener);
      var removeMessageListener = function removeMessageListener() {
        _this2.localWindow.removeEventListener('message', outerListener);
      };
      return removeMessageListener;
    }
  }]);
  return ReactNativeWebviewMessenger;
}(_bridgeInterfaces.MessengerInterface);

/***/ }),
/* 41 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(2);
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.MessengerInterface = exports.Bridge = void 0;
var _regenerator = _interopRequireDefault(__webpack_require__(4));
var _asyncToGenerator2 = _interopRequireDefault(__webpack_require__(12));
var _classCallCheck2 = _interopRequireDefault(__webpack_require__(13));
var _createClass2 = _interopRequireDefault(__webpack_require__(14));
/* eslint-disable no-unused-vars */
/**
 * @typedef PostMeConnection
 * @property {Function} localHandle  : get handle to the local end of the connection
 * @property {Function} remoteHandle : get handle to the remote end of the connection
 * @property {Function} close        : stop listening to incoming message from the other side
 */
/**
 * All bridges are supposed to implement this interface
 */
var Bridge = exports.Bridge = /*#__PURE__*/function () {
  function Bridge() {
    (0, _classCallCheck2.default)(this, Bridge);
  }
  (0, _createClass2.default)(Bridge, [{
    key: "init",
    value: (
    /**
     * Initialize the communication between the parent and the child via post-me protocol
     * https://github.com/alesgenova/post-me
     *
     * @param  {object} options                             : Options object
     * @param  {object} options.root                        : The object which will contain the exposed method names
     * @param  {Array.<string>} options.exposedMethodNames  : The list of method names of the root object, which will be exposed via the post-me interface to the content script
     * @param  {Array.<string>} options.listenedEventsNames : The list of method names of the root object, which will be call on given event name via the post-me interface to the content script
     * @param  {object} options.webViewRef                  : Reference to the webview obect containing the content script
     * @returns {Promise.<PostMeConnection>} : the resulting post-me connection
     */
    function () {
      var _init = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(options) {
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
            case "end":
              return _context.stop();
          }
        }, _callee);
      }));
      function init(_x) {
        return _init.apply(this, arguments);
      }
      return init;
    }()
    /**
     * Shortcut to remoteHandle.call method
     *
     * @param  {string} method : The remote method name
     * @param  {Array} args    : Any number of parameters which will be given to the remote method.
     * It is also possible to pass callback functions (which must support serialization). post-me
     * will wait the the remote method end before resolving the promise
     * @returns {Promise.<any>} remote method return value
     */
    )
  }, {
    key: "call",
    value: (function () {
      var _call = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2(method) {
        var _this$remoteHandle;
        var _len,
          args,
          _key,
          _args2 = arguments;
        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              for (_len = _args2.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                args[_key - 1] = _args2[_key];
              }
              return _context2.abrupt("return", (_this$remoteHandle = this.remoteHandle).call.apply(_this$remoteHandle, [method].concat(args)));
            case 2:
            case "end":
              return _context2.stop();
          }
        }, _callee2, this);
      }));
      function call(_x2) {
        return _call.apply(this, arguments);
      }
      return call;
    }()
    /**
     * Shortcut to localHandle.emit method. Will emit an event which could be listened by the remote
     * object
     *
     * @param  {string} eventName : Name of the event
     * @param  {Array} args       : Any number of parameters.
     */
    )
  }, {
    key: "emit",
    value: function emit(eventName) {
      var _this$localHandle;
      for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
      }
      (_this$localHandle = this.localHandle).emit.apply(_this$localHandle, [eventName].concat(args));
    }

    /**
     * Shortcut to remoteHandle.addEventListener method. Will listen to the given event on the remote
     * object and call the listener function
     *
     * @param  {string} remoteEventName : Name of the remove event
     * @param  {Function} listener      : Listener function
     */
  }, {
    key: "addEventListener",
    value: function addEventListener(remoteEventName, listener) {
      this.remoteHandle.addEventListener(remoteEventName, listener);
    }

    /**
     * Shortcut to remoteHandle.removeEventListener method. Will stop listening to the given event
     * on the remote object.
     *
     * @param  {string} remoteEventName : Name of the remote event
     * @param  {Function} listener      : Previously defined listener function
     */
  }, {
    key: "removeEventListener",
    value: function removeEventListener(remoteEventName, listener) {
      this.remoteHandle.removeEventListener(remoteEventName, listener);
    }
  }]);
  return Bridge;
}();
/**
 * All messengers are supposed to implement this interface
 *
 * @interface
 */
var MessengerInterface = exports.MessengerInterface = /*#__PURE__*/function () {
  function MessengerInterface() {
    (0, _classCallCheck2.default)(this, MessengerInterface);
  }
  (0, _createClass2.default)(MessengerInterface, [{
    key: "postMessage",
    value:
    /**
     * Send a message to the other context
     *
     * @param {string} message : The payload of the message
     */
    function postMessage(message) {}

    /**
     * Add a listener to messages received by the other context
     *
     * @param {Function} listener : A listener that will receive the MessageEvent
     * @returns {Function} A function that can be invoked to remove the listener
     */
  }, {
    key: "addMessageListener",
    value: function addMessageListener(listener) {}
  }]);
  return MessengerInterface;
}();

/***/ }),
/* 42 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(2);
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.dataUriToArrayBuffer = exports.calculateFileKey = void 0;
var _slicedToArray2 = _interopRequireDefault(__webpack_require__(43));
/**
 * @typedef ArrayBufferWithContentType
 * @property {string} contentType - dataUri included content type
 * @property {ArrayBuffer} arrayBuffer - resulting decoded data
 */

/**
 * Converts a data URI string to an Array Buffer with its content Type
 *
 * @param {string} dataURI - data URI string containing content type and base64 encoded data
 * @returns {ArrayBufferWithContentType} : array buffer with content type
 */
var dataUriToArrayBuffer = exports.dataUriToArrayBuffer = function dataUriToArrayBuffer(dataURI) {
  var parsed = dataURI.match(/^data:(.*);base64,(.*)$/);
  if (parsed === null) {
    throw new Error('dataUriToArrayBuffer: dataURI is malformed. Should be in the form data:...;base64,...');
  }
  var _parsed$slice = parsed.slice(1),
    _parsed$slice2 = (0, _slicedToArray2.default)(_parsed$slice, 2),
    contentType = _parsed$slice2[0],
    base64String = _parsed$slice2[1];
  var byteString = __webpack_require__.g.atob(base64String);
  var arrayBuffer = new ArrayBuffer(byteString.length);
  var ia = new Uint8Array(arrayBuffer);
  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return {
    contentType: contentType,
    arrayBuffer: arrayBuffer
  };
};

/**
 * Calculate the file key from an entry given to saveFiles
 *
 * @param {import('../launcher/saveFiles').saveFilesEntry} entry - a savefiles entry
 * @param {Array<string>} fileIdAttributes - list of entry attributes which will be used to identify the entry in a unique way
 * @returns {string} - The resulting file key
 */
var calculateFileKey = exports.calculateFileKey = function calculateFileKey(entry, fileIdAttributes) {
  return fileIdAttributes.sort().map(function (key) {
    return entry === null || entry === void 0 ? void 0 : entry[key];
  }).join('####');
};

/***/ }),
/* 43 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var arrayWithHoles = __webpack_require__(44);

var iterableToArrayLimit = __webpack_require__(45);

var unsupportedIterableToArray = __webpack_require__(10);

var nonIterableRest = __webpack_require__(46);

function _slicedToArray(arr, i) {
  return arrayWithHoles(arr) || iterableToArrayLimit(arr, i) || unsupportedIterableToArray(arr, i) || nonIterableRest();
}

module.exports = _slicedToArray, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 44 */
/***/ ((module) => {

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

module.exports = _arrayWithHoles, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 45 */
/***/ ((module) => {

function _iterableToArrayLimit(arr, i) {
  var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];

  if (_i == null) return;
  var _arr = [];
  var _n = true;
  var _d = false;

  var _s, _e;

  try {
    for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

module.exports = _iterableToArrayLimit, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 46 */
/***/ ((module) => {

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

module.exports = _nonIterableRest, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 47 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(2);
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.wrapTimerFactory = exports.wrapTimer = void 0;
var _regenerator = _interopRequireDefault(__webpack_require__(4));
var _asyncToGenerator2 = _interopRequireDefault(__webpack_require__(12));
var _defineProperty2 = _interopRequireDefault(__webpack_require__(48));
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { (0, _defineProperty2.default)(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
/**
 * Create a wrapTimer function with given defaults as options
 *
 * @param {WrapTimerOptions} defaults
 * @returns {Function} - wrapTimer function
 */
var wrapTimerFactory = exports.wrapTimerFactory = function wrapTimerFactory(defaults) {
  return function (obj, name) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    return wrapTimer(obj, name, _objectSpread(_objectSpread({}, defaults), options));
  };
};

/**
 * Wrap any async method of an object to display it's time of execution
 *
 * @param {object} obj - The object which will be considered as `this`
 * @param {string} name - The name of the method to wrap
 * @param {WrapTimerOptions} [options] - Options object
 * @returns {Function} - Wrapped async function
 */
var wrapTimer = exports.wrapTimer = function wrapTimer(obj, name) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var _options$displayName = options.displayName,
    displayName = _options$displayName === void 0 ? name : _options$displayName,
    _options$logFn = options.logFn,
    logFn = _options$logFn === void 0 ? console.log.bind(console) : _options$logFn,
    _options$suffixFn = options.suffixFn,
    suffixFn = _options$suffixFn === void 0 ? null : _options$suffixFn;
  var fn = obj[name];
  if (!fn) {
    throw new Error("".concat(name, " cannot be found on ").concat(obj.name || obj.constructor.name));
  }
  return /*#__PURE__*/(0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee() {
    var start,
      res,
      end,
      suffix,
      _args = arguments;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          start = Date.now();
          _context.next = 3;
          return fn.apply(this, _args);
        case 3:
          res = _context.sent;
          end = Date.now();
          suffix = suffixFn ? ' ' + suffixFn(_args) : '';
          logFn("\u231B ".concat(displayName).concat(suffix, " took ").concat(Math.round((end - start) / 10) / 100, "s"));
          return _context.abrupt("return", res);
        case 8:
        case "end":
          return _context.stop();
      }
    }, _callee, this);
  }));
};

/**
 * @typedef WrapTimerOptions
 * @property {string} [options.displayName] - Name which will be displayed in the final log
 * @property {Function} [options.logFn] - logging function. Defaults to console.log
 * @property {Function} [options.suffixFn] - function which will be called with method arguments which return a suffix to the name of the method
 */

/***/ }),
/* 48 */
/***/ ((module) => {

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

module.exports = _defineProperty, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 49 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(2);
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _regenerator = _interopRequireDefault(__webpack_require__(4));
var _asyncToGenerator2 = _interopRequireDefault(__webpack_require__(12));
var _slicedToArray2 = _interopRequireDefault(__webpack_require__(43));
var _classCallCheck2 = _interopRequireDefault(__webpack_require__(13));
var _createClass2 = _interopRequireDefault(__webpack_require__(14));
var _microee = _interopRequireDefault(__webpack_require__(18));
var _utils = __webpack_require__(30);
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; } /* eslint no-console: off */
/**
 * Intercept any xhr or fetch request corresponding to the given interception list
 */
var RequestInterceptor = /*#__PURE__*/function () {
  /**
   * @function Object() { [native code] }
   * @param {Array<InterceptionDocument>} interceptions - the list of url to intercept
   */
  function RequestInterceptor(interceptions) {
    (0, _classCallCheck2.default)(this, RequestInterceptor);
    this.interceptions = interceptions;
    this.savedSetRequestHeader = window.XMLHttpRequest.prototype.setRequestHeader;
    this.savedOpen = window.XMLHttpRequest.prototype.open;
    this.savedFetch = window.fetch;
  }

  /**
   * Restore original request function to default values
   */
  (0, _createClass2.default)(RequestInterceptor, [{
    key: "restore",
    value: function restore() {
      window.XMLHttpRequest.prototype.setRequestHeader = this.savedSetRequestHeader;
      window.XMLHttpRequest.prototype.open = this.savedOpen;
      window.fetch = this.savedFetch;
    }

    /**
     * Init the replacemenet of xhr and fetch function to be able to intercept requests
     */
  }, {
    key: "init",
    value: function init() {
      try {
        var self = this;
        window.XMLHttpRequest.prototype.setRequestHeader = function (key, value) {
          try {
            var newValue = this._requestHeaders[key] ? this._requestHeaders[key] += ', ' + value : value;
            this._requestHeaders[key] = newValue;
            return self.savedSetRequestHeader.apply(this, [].slice.call(arguments));
          } catch (err) {
            this.log('error', '❌❌❌ xhr setRequestHeader interception error ' + err.message);
          }
        };
        window.XMLHttpRequest.prototype.open = function (method, url) {
          try {
            var response = this;
            response._requestHeaders = {};
            response.addEventListener('readystatechange', function () {
              if (response.readyState === 4) {
                var responseHeaders = {};
                var allResponseHeaders = response.getAllResponseHeaders() ? response.getAllResponseHeaders().split('\r\n') : [];
                var _iterator = _createForOfIteratorHelper(allResponseHeaders),
                  _step;
                try {
                  for (_iterator.s(); !(_step = _iterator.n()).done;) {
                    var header = _step.value;
                    var _header$split = header.split(': '),
                      _header$split2 = (0, _slicedToArray2.default)(_header$split, 2),
                      key = _header$split2[0],
                      value = _header$split2[1];
                    responseHeaders[key] = value;
                  }
                } catch (err) {
                  _iterator.e(err);
                } finally {
                  _iterator.f();
                }
                self.serializeAndEmitResponse({
                  method: method,
                  url: url,
                  response: response,
                  responseHeaders: responseHeaders,
                  requestHeaders: response._requestHeaders
                });
              }
              return response;
            });
            return self.savedOpen.apply(response, [].slice.call(arguments));
          } catch (err) {
            this.log('error', '❌❌❌ xhr interception error ' + err.message);
          }
        };
        window.fetch = /*#__PURE__*/(0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee() {
          var _len,
            args,
            _key,
            response,
            input,
            options,
            url,
            method,
            responseHeaders,
            _iterator2,
            _step2,
            _step2$value,
            key,
            value,
            _args = arguments;
          return _regenerator.default.wrap(function _callee$(_context) {
            while (1) switch (_context.prev = _context.next) {
              case 0:
                for (_len = _args.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
                  args[_key] = _args[_key];
                }
                _context.next = 3;
                return self.savedFetch.apply(window, args);
              case 3:
                response = _context.sent;
                _context.prev = 4;
                input = args[0], options = args[1];
                url = typeof input === 'string' ? input : (input === null || input === void 0 ? void 0 : input.url) || (input === null || input === void 0 ? void 0 : input.toString());
                method = (options === null || options === void 0 ? void 0 : options.method) || (input === null || input === void 0 ? void 0 : input.method) || 'GET';
                responseHeaders = {};
                _iterator2 = _createForOfIteratorHelper(response.headers.entries());
                try {
                  for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                    _step2$value = (0, _slicedToArray2.default)(_step2.value, 2), key = _step2$value[0], value = _step2$value[1];
                    responseHeaders[key] = value;
                  }
                } catch (err) {
                  _iterator2.e(err);
                } finally {
                  _iterator2.f();
                }
                self.serializeAndEmitResponse({
                  method: method,
                  url: url,
                  response: response,
                  responseHeaders: responseHeaders,
                  requestHeaders: options === null || options === void 0 ? void 0 : options.headers
                });
                return _context.abrupt("return", response);
              case 15:
                _context.prev = 15;
                _context.t0 = _context["catch"](4);
                this.log('error', '❌❌❌ fetch interception error ' + _context.t0.message);
              case 18:
              case "end":
                return _context.stop();
            }
          }, _callee, this, [[4, 15]]);
        }));
      } catch (err) {
        this.log('error', '❌❌❌ interceptor init error ' + err.message);
      }
    }
    /**
     * Serialize the intercepted response according to the "serialize" attribute given in the
     * interception list and emit it as a "response" event
     *
     * @param {Response} resp - HTTP response
     */
  }, {
    key: "serializeAndEmitResponse",
    value: (function () {
      var _serializeAndEmitResponse = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2(resp) {
        var interception;
        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              interception = this.interceptions.find(function (doc) {
                return resp.method === doc.method && doc.exact ? resp.url === doc.url : resp.url.includes(doc.url);
              });
              if (interception) {
                _context2.next = 3;
                break;
              }
              return _context2.abrupt("return");
            case 3:
              if (interception.label) {
                this.log('warn', "RequestInterceptor: interception.label is deprecated, you should use interception.identifier");
              }
              resp.identifier = interception.identifier || interception.label;

              // response serialization, to be able to transfer to the pilot
              if (!(interception.serialization === 'json')) {
                _context2.next = 15;
                break;
              }
              if (!(resp.response instanceof Response)) {
                _context2.next = 12;
                break;
              }
              _context2.next = 9;
              return resp.response.clone().json();
            case 9:
              resp.response = _context2.sent;
              _context2.next = 13;
              break;
            case 12:
              resp.response = JSON.parse(resp.response.responseText);
            case 13:
              _context2.next = 38;
              break;
            case 15:
              if (!(interception.serialization === 'text')) {
                _context2.next = 25;
                break;
              }
              if (!(resp.response instanceof Response)) {
                _context2.next = 22;
                break;
              }
              _context2.next = 19;
              return resp.response.clone().text();
            case 19:
              resp.response = _context2.sent;
              _context2.next = 23;
              break;
            case 22:
              resp.response = resp.response.responseText;
            case 23:
              _context2.next = 38;
              break;
            case 25:
              if (!(interception.serialization === 'dataUri')) {
                _context2.next = 37;
                break;
              }
              if (!(resp.response instanceof Response)) {
                _context2.next = 34;
                break;
              }
              _context2.t0 = _utils.blobToBase64;
              _context2.next = 30;
              return resp.response.clone().blob();
            case 30:
              _context2.t1 = _context2.sent;
              resp.response = (0, _context2.t0)(_context2.t1);
              _context2.next = 35;
              break;
            case 34:
              resp.response = (0, _utils.blobToBase64)(resp.response.response);
            case 35:
              _context2.next = 38;
              break;
            case 37:
              this.log('error', '❌❌❌ wrong serialization method : ' + interception.serialization);
            case 38:
              this.emit('response', resp);
              this.log('debug', "RequestInterceptor: intercepted ".concat(resp.method, " ").concat(resp.url, " response"));
            case 40:
            case "end":
              return _context2.stop();
          }
        }, _callee2, this);
      }));
      function serializeAndEmitResponse(_x) {
        return _serializeAndEmitResponse.apply(this, arguments);
      }
      return serializeAndEmitResponse;
    }())
  }, {
    key: "setLogger",
    value: function setLogger(logger) {
      this.log = logger;
    }
  }]);
  return RequestInterceptor;
}();
_microee.default.mixin(RequestInterceptor);
var _default = exports["default"] = RequestInterceptor;
/**
 * @typedef EmittedResponse
 * @property {string} [label] - a name given to the interception (deprecated in favor of identifier)
 * @property {string} identifier - an identifier given to the interception
 * @property {'GET'|'POST'|'PUT'|'DELETE'} method - the method of the intercepted request
 * @property {string} url - the url intercepted request url
 * @property {Response} response - raw response of the intercepted request
 * @property {object} responseHeaders - response headers
 * @property {object} requestHeaders - request headers
 */
/**
 * @typedef InterceptionDocument
 * @property {string} [label] - a name given to the interception, will be found in the response later (deprecated in favor of identifier)
 * @property {string} identifier - an identifier given to the interception
 * @property {string} url - the url to intercept
 * @property {'GET'|'POST'|'PUT'|'DELETE'} method - the method of the url to intercept
 * @property {boolean} exact - true if the intercepted url must exactly correspond to the given url
 */

/***/ }),
/* 50 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _index = __webpack_require__(51);
Object.keys(_index).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index[key];
    },
  });
});
var _index2 = __webpack_require__(56);
Object.keys(_index2).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index2[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index2[key];
    },
  });
});
var _index3 = __webpack_require__(52);
Object.keys(_index3).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index3[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index3[key];
    },
  });
});
var _index4 = __webpack_require__(60);
Object.keys(_index4).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index4[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index4[key];
    },
  });
});
var _index5 = __webpack_require__(63);
Object.keys(_index5).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index5[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index5[key];
    },
  });
});
var _index6 = __webpack_require__(61);
Object.keys(_index6).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index6[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index6[key];
    },
  });
});
var _index7 = __webpack_require__(73);
Object.keys(_index7).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index7[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index7[key];
    },
  });
});
var _index8 = __webpack_require__(55);
Object.keys(_index8).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index8[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index8[key];
    },
  });
});
var _index9 = __webpack_require__(74);
Object.keys(_index9).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index9[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index9[key];
    },
  });
});
var _index10 = __webpack_require__(75);
Object.keys(_index10).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index10[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index10[key];
    },
  });
});
var _index11 = __webpack_require__(76);
Object.keys(_index11).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index11[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index11[key];
    },
  });
});
var _index12 = __webpack_require__(77);
Object.keys(_index12).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index12[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index12[key];
    },
  });
});
var _index13 = __webpack_require__(78);
Object.keys(_index13).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index13[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index13[key];
    },
  });
});
var _index14 = __webpack_require__(79);
Object.keys(_index14).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index14[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index14[key];
    },
  });
});
var _index15 = __webpack_require__(82);
Object.keys(_index15).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index15[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index15[key];
    },
  });
});
var _index16 = __webpack_require__(83);
Object.keys(_index16).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index16[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index16[key];
    },
  });
});
var _index17 = __webpack_require__(84);
Object.keys(_index17).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index17[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index17[key];
    },
  });
});
var _index18 = __webpack_require__(85);
Object.keys(_index18).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index18[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index18[key];
    },
  });
});
var _index19 = __webpack_require__(54);
Object.keys(_index19).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index19[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index19[key];
    },
  });
});
var _index20 = __webpack_require__(86);
Object.keys(_index20).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index20[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index20[key];
    },
  });
});
var _index21 = __webpack_require__(87);
Object.keys(_index21).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index21[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index21[key];
    },
  });
});
var _index22 = __webpack_require__(88);
Object.keys(_index22).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index22[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index22[key];
    },
  });
});
var _index23 = __webpack_require__(69);
Object.keys(_index23).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index23[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index23[key];
    },
  });
});
var _index24 = __webpack_require__(92);
Object.keys(_index24).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index24[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index24[key];
    },
  });
});
var _index25 = __webpack_require__(93);
Object.keys(_index25).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index25[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index25[key];
    },
  });
});
var _index26 = __webpack_require__(94);
Object.keys(_index26).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index26[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index26[key];
    },
  });
});
var _index27 = __webpack_require__(95);
Object.keys(_index27).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index27[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index27[key];
    },
  });
});
var _index28 = __webpack_require__(97);
Object.keys(_index28).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index28[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index28[key];
    },
  });
});
var _index29 = __webpack_require__(98);
Object.keys(_index29).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index29[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index29[key];
    },
  });
});
var _index30 = __webpack_require__(99);
Object.keys(_index30).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index30[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index30[key];
    },
  });
});
var _index31 = __webpack_require__(100);
Object.keys(_index31).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index31[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index31[key];
    },
  });
});
var _index32 = __webpack_require__(103);
Object.keys(_index32).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index32[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index32[key];
    },
  });
});
var _index33 = __webpack_require__(102);
Object.keys(_index33).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index33[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index33[key];
    },
  });
});
var _index34 = __webpack_require__(105);
Object.keys(_index34).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index34[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index34[key];
    },
  });
});
var _index35 = __webpack_require__(106);
Object.keys(_index35).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index35[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index35[key];
    },
  });
});
var _index36 = __webpack_require__(110);
Object.keys(_index36).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index36[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index36[key];
    },
  });
});
var _index37 = __webpack_require__(111);
Object.keys(_index37).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index37[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index37[key];
    },
  });
});
var _index38 = __webpack_require__(112);
Object.keys(_index38).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index38[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index38[key];
    },
  });
});
var _index39 = __webpack_require__(113);
Object.keys(_index39).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index39[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index39[key];
    },
  });
});
var _index40 = __webpack_require__(114);
Object.keys(_index40).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index40[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index40[key];
    },
  });
});
var _index41 = __webpack_require__(115);
Object.keys(_index41).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index41[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index41[key];
    },
  });
});
var _index42 = __webpack_require__(116);
Object.keys(_index42).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index42[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index42[key];
    },
  });
});
var _index43 = __webpack_require__(118);
Object.keys(_index43).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index43[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index43[key];
    },
  });
});
var _index44 = __webpack_require__(119);
Object.keys(_index44).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index44[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index44[key];
    },
  });
});
var _index45 = __webpack_require__(121);
Object.keys(_index45).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index45[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index45[key];
    },
  });
});
var _index46 = __webpack_require__(122);
Object.keys(_index46).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index46[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index46[key];
    },
  });
});
var _index47 = __webpack_require__(123);
Object.keys(_index47).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index47[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index47[key];
    },
  });
});
var _index48 = __webpack_require__(125);
Object.keys(_index48).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index48[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index48[key];
    },
  });
});
var _index49 = __webpack_require__(128);
Object.keys(_index49).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index49[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index49[key];
    },
  });
});
var _index50 = __webpack_require__(108);
Object.keys(_index50).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index50[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index50[key];
    },
  });
});
var _index51 = __webpack_require__(129);
Object.keys(_index51).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index51[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index51[key];
    },
  });
});
var _index52 = __webpack_require__(130);
Object.keys(_index52).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index52[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index52[key];
    },
  });
});
var _index53 = __webpack_require__(131);
Object.keys(_index53).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index53[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index53[key];
    },
  });
});
var _index54 = __webpack_require__(133);
Object.keys(_index54).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index54[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index54[key];
    },
  });
});
var _index55 = __webpack_require__(134);
Object.keys(_index55).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index55[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index55[key];
    },
  });
});
var _index56 = __webpack_require__(109);
Object.keys(_index56).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index56[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index56[key];
    },
  });
});
var _index57 = __webpack_require__(135);
Object.keys(_index57).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index57[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index57[key];
    },
  });
});
var _index58 = __webpack_require__(136);
Object.keys(_index58).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index58[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index58[key];
    },
  });
});
var _index59 = __webpack_require__(137);
Object.keys(_index59).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index59[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index59[key];
    },
  });
});
var _index60 = __webpack_require__(138);
Object.keys(_index60).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index60[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index60[key];
    },
  });
});
var _index61 = __webpack_require__(132);
Object.keys(_index61).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index61[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index61[key];
    },
  });
});
var _index62 = __webpack_require__(126);
Object.keys(_index62).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index62[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index62[key];
    },
  });
});
var _index63 = __webpack_require__(139);
Object.keys(_index63).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index63[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index63[key];
    },
  });
});
var _index64 = __webpack_require__(140);
Object.keys(_index64).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index64[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index64[key];
    },
  });
});
var _index65 = __webpack_require__(162);
Object.keys(_index65).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index65[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index65[key];
    },
  });
});
var _index66 = __webpack_require__(163);
Object.keys(_index66).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index66[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index66[key];
    },
  });
});
var _index67 = __webpack_require__(164);
Object.keys(_index67).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index67[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index67[key];
    },
  });
});
var _index68 = __webpack_require__(165);
Object.keys(_index68).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index68[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index68[key];
    },
  });
});
var _index69 = __webpack_require__(166);
Object.keys(_index69).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index69[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index69[key];
    },
  });
});
var _index70 = __webpack_require__(167);
Object.keys(_index70).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index70[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index70[key];
    },
  });
});
var _index71 = __webpack_require__(168);
Object.keys(_index71).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index71[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index71[key];
    },
  });
});
var _index72 = __webpack_require__(169);
Object.keys(_index72).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index72[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index72[key];
    },
  });
});
var _index73 = __webpack_require__(170);
Object.keys(_index73).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index73[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index73[key];
    },
  });
});
var _index74 = __webpack_require__(171);
Object.keys(_index74).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index74[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index74[key];
    },
  });
});
var _index75 = __webpack_require__(172);
Object.keys(_index75).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index75[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index75[key];
    },
  });
});
var _index76 = __webpack_require__(173);
Object.keys(_index76).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index76[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index76[key];
    },
  });
});
var _index77 = __webpack_require__(174);
Object.keys(_index77).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index77[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index77[key];
    },
  });
});
var _index78 = __webpack_require__(175);
Object.keys(_index78).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index78[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index78[key];
    },
  });
});
var _index79 = __webpack_require__(153);
Object.keys(_index79).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index79[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index79[key];
    },
  });
});
var _index80 = __webpack_require__(176);
Object.keys(_index80).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index80[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index80[key];
    },
  });
});
var _index81 = __webpack_require__(177);
Object.keys(_index81).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index81[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index81[key];
    },
  });
});
var _index82 = __webpack_require__(179);
Object.keys(_index82).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index82[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index82[key];
    },
  });
});
var _index83 = __webpack_require__(180);
Object.keys(_index83).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index83[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index83[key];
    },
  });
});
var _index84 = __webpack_require__(181);
Object.keys(_index84).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index84[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index84[key];
    },
  });
});
var _index85 = __webpack_require__(182);
Object.keys(_index85).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index85[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index85[key];
    },
  });
});
var _index86 = __webpack_require__(154);
Object.keys(_index86).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index86[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index86[key];
    },
  });
});
var _index87 = __webpack_require__(64);
Object.keys(_index87).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index87[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index87[key];
    },
  });
});
var _index88 = __webpack_require__(183);
Object.keys(_index88).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index88[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index88[key];
    },
  });
});
var _index89 = __webpack_require__(184);
Object.keys(_index89).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index89[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index89[key];
    },
  });
});
var _index90 = __webpack_require__(185);
Object.keys(_index90).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index90[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index90[key];
    },
  });
});
var _index91 = __webpack_require__(186);
Object.keys(_index91).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index91[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index91[key];
    },
  });
});
var _index92 = __webpack_require__(187);
Object.keys(_index92).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index92[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index92[key];
    },
  });
});
var _index93 = __webpack_require__(96);
Object.keys(_index93).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index93[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index93[key];
    },
  });
});
var _index94 = __webpack_require__(188);
Object.keys(_index94).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index94[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index94[key];
    },
  });
});
var _index95 = __webpack_require__(189);
Object.keys(_index95).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index95[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index95[key];
    },
  });
});
var _index96 = __webpack_require__(190);
Object.keys(_index96).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index96[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index96[key];
    },
  });
});
var _index97 = __webpack_require__(155);
Object.keys(_index97).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index97[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index97[key];
    },
  });
});
var _index98 = __webpack_require__(191);
Object.keys(_index98).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index98[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index98[key];
    },
  });
});
var _index99 = __webpack_require__(157);
Object.keys(_index99).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index99[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index99[key];
    },
  });
});
var _index100 = __webpack_require__(192);
Object.keys(_index100).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index100[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index100[key];
    },
  });
});
var _index101 = __webpack_require__(194);
Object.keys(_index101).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index101[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index101[key];
    },
  });
});
var _index102 = __webpack_require__(195);
Object.keys(_index102).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index102[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index102[key];
    },
  });
});
var _index103 = __webpack_require__(196);
Object.keys(_index103).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index103[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index103[key];
    },
  });
});
var _index104 = __webpack_require__(197);
Object.keys(_index104).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index104[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index104[key];
    },
  });
});
var _index105 = __webpack_require__(198);
Object.keys(_index105).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index105[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index105[key];
    },
  });
});
var _index106 = __webpack_require__(199);
Object.keys(_index106).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index106[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index106[key];
    },
  });
});
var _index107 = __webpack_require__(200);
Object.keys(_index107).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index107[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index107[key];
    },
  });
});
var _index108 = __webpack_require__(201);
Object.keys(_index108).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index108[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index108[key];
    },
  });
});
var _index109 = __webpack_require__(202);
Object.keys(_index109).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index109[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index109[key];
    },
  });
});
var _index110 = __webpack_require__(203);
Object.keys(_index110).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index110[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index110[key];
    },
  });
});
var _index111 = __webpack_require__(91);
Object.keys(_index111).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index111[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index111[key];
    },
  });
});
var _index112 = __webpack_require__(204);
Object.keys(_index112).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index112[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index112[key];
    },
  });
});
var _index113 = __webpack_require__(205);
Object.keys(_index113).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index113[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index113[key];
    },
  });
});
var _index114 = __webpack_require__(206);
Object.keys(_index114).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index114[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index114[key];
    },
  });
});
var _index115 = __webpack_require__(207);
Object.keys(_index115).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index115[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index115[key];
    },
  });
});
var _index116 = __webpack_require__(208);
Object.keys(_index116).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index116[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index116[key];
    },
  });
});
var _index117 = __webpack_require__(107);
Object.keys(_index117).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index117[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index117[key];
    },
  });
});
var _index118 = __webpack_require__(178);
Object.keys(_index118).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index118[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index118[key];
    },
  });
});
var _index119 = __webpack_require__(209);
Object.keys(_index119).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index119[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index119[key];
    },
  });
});
var _index120 = __webpack_require__(252);
Object.keys(_index120).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index120[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index120[key];
    },
  });
});
var _index121 = __webpack_require__(253);
Object.keys(_index121).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index121[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index121[key];
    },
  });
});
var _index122 = __webpack_require__(89);
Object.keys(_index122).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index122[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index122[key];
    },
  });
});
var _index123 = __webpack_require__(254);
Object.keys(_index123).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index123[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index123[key];
    },
  });
});
var _index124 = __webpack_require__(256);
Object.keys(_index124).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index124[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index124[key];
    },
  });
});
var _index125 = __webpack_require__(258);
Object.keys(_index125).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index125[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index125[key];
    },
  });
});
var _index126 = __webpack_require__(259);
Object.keys(_index126).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index126[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index126[key];
    },
  });
});
var _index127 = __webpack_require__(260);
Object.keys(_index127).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index127[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index127[key];
    },
  });
});
var _index128 = __webpack_require__(261);
Object.keys(_index128).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index128[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index128[key];
    },
  });
});
var _index129 = __webpack_require__(262);
Object.keys(_index129).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index129[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index129[key];
    },
  });
});
var _index130 = __webpack_require__(257);
Object.keys(_index130).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index130[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index130[key];
    },
  });
});
var _index131 = __webpack_require__(264);
Object.keys(_index131).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index131[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index131[key];
    },
  });
});
var _index132 = __webpack_require__(57);
Object.keys(_index132).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index132[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index132[key];
    },
  });
});
var _index133 = __webpack_require__(58);
Object.keys(_index133).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index133[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index133[key];
    },
  });
});
var _index134 = __webpack_require__(265);
Object.keys(_index134).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index134[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index134[key];
    },
  });
});
var _index135 = __webpack_require__(266);
Object.keys(_index135).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index135[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index135[key];
    },
  });
});
var _index136 = __webpack_require__(267);
Object.keys(_index136).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index136[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index136[key];
    },
  });
});
var _index137 = __webpack_require__(268);
Object.keys(_index137).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index137[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index137[key];
    },
  });
});
var _index138 = __webpack_require__(269);
Object.keys(_index138).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index138[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index138[key];
    },
  });
});
var _index139 = __webpack_require__(270);
Object.keys(_index139).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index139[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index139[key];
    },
  });
});
var _index140 = __webpack_require__(271);
Object.keys(_index140).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index140[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index140[key];
    },
  });
});
var _index141 = __webpack_require__(272);
Object.keys(_index141).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index141[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index141[key];
    },
  });
});
var _index142 = __webpack_require__(273);
Object.keys(_index142).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index142[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index142[key];
    },
  });
});
var _index143 = __webpack_require__(274);
Object.keys(_index143).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index143[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index143[key];
    },
  });
});
var _index144 = __webpack_require__(275);
Object.keys(_index144).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index144[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index144[key];
    },
  });
});
var _index145 = __webpack_require__(276);
Object.keys(_index145).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index145[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index145[key];
    },
  });
});
var _index146 = __webpack_require__(90);
Object.keys(_index146).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index146[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index146[key];
    },
  });
});
var _index147 = __webpack_require__(277);
Object.keys(_index147).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index147[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index147[key];
    },
  });
});
var _index148 = __webpack_require__(59);
Object.keys(_index148).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index148[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index148[key];
    },
  });
});
var _index149 = __webpack_require__(278);
Object.keys(_index149).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index149[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index149[key];
    },
  });
});
var _index150 = __webpack_require__(279);
Object.keys(_index150).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index150[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index150[key];
    },
  });
});
var _index151 = __webpack_require__(281);
Object.keys(_index151).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index151[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index151[key];
    },
  });
});
var _index152 = __webpack_require__(282);
Object.keys(_index152).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index152[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index152[key];
    },
  });
});
var _index153 = __webpack_require__(284);
Object.keys(_index153).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index153[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index153[key];
    },
  });
});
var _index154 = __webpack_require__(193);
Object.keys(_index154).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index154[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index154[key];
    },
  });
});
var _index155 = __webpack_require__(285);
Object.keys(_index155).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index155[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index155[key];
    },
  });
});
var _index156 = __webpack_require__(283);
Object.keys(_index156).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index156[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index156[key];
    },
  });
});
var _index157 = __webpack_require__(286);
Object.keys(_index157).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index157[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index157[key];
    },
  });
});
var _index158 = __webpack_require__(287);
Object.keys(_index158).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index158[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index158[key];
    },
  });
});
var _index159 = __webpack_require__(80);
Object.keys(_index159).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index159[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index159[key];
    },
  });
});
var _index160 = __webpack_require__(288);
Object.keys(_index160).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index160[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index160[key];
    },
  });
});
var _index161 = __webpack_require__(289);
Object.keys(_index161).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index161[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index161[key];
    },
  });
});
var _index162 = __webpack_require__(290);
Object.keys(_index162).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index162[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index162[key];
    },
  });
});
var _index163 = __webpack_require__(291);
Object.keys(_index163).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index163[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index163[key];
    },
  });
});
var _index164 = __webpack_require__(81);
Object.keys(_index164).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index164[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index164[key];
    },
  });
});
var _index165 = __webpack_require__(292);
Object.keys(_index165).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index165[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index165[key];
    },
  });
});
var _index166 = __webpack_require__(293);
Object.keys(_index166).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index166[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index166[key];
    },
  });
});
var _index167 = __webpack_require__(294);
Object.keys(_index167).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index167[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index167[key];
    },
  });
});
var _index168 = __webpack_require__(295);
Object.keys(_index168).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index168[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index168[key];
    },
  });
});
var _index169 = __webpack_require__(296);
Object.keys(_index169).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index169[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index169[key];
    },
  });
});
var _index170 = __webpack_require__(297);
Object.keys(_index170).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index170[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index170[key];
    },
  });
});
var _index171 = __webpack_require__(298);
Object.keys(_index171).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index171[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index171[key];
    },
  });
});
var _index172 = __webpack_require__(299);
Object.keys(_index172).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index172[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index172[key];
    },
  });
});
var _index173 = __webpack_require__(300);
Object.keys(_index173).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index173[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index173[key];
    },
  });
});
var _index174 = __webpack_require__(301);
Object.keys(_index174).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index174[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index174[key];
    },
  });
});
var _index175 = __webpack_require__(302);
Object.keys(_index175).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index175[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index175[key];
    },
  });
});
var _index176 = __webpack_require__(303);
Object.keys(_index176).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index176[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index176[key];
    },
  });
});
var _index177 = __webpack_require__(304);
Object.keys(_index177).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index177[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index177[key];
    },
  });
});
var _index178 = __webpack_require__(210);
Object.keys(_index178).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index178[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index178[key];
    },
  });
});
var _index179 = __webpack_require__(305);
Object.keys(_index179).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index179[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index179[key];
    },
  });
});
var _index180 = __webpack_require__(306);
Object.keys(_index180).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index180[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index180[key];
    },
  });
});
var _index181 = __webpack_require__(307);
Object.keys(_index181).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index181[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index181[key];
    },
  });
});
var _index182 = __webpack_require__(308);
Object.keys(_index182).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index182[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index182[key];
    },
  });
});
var _index183 = __webpack_require__(309);
Object.keys(_index183).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index183[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index183[key];
    },
  });
});
var _index184 = __webpack_require__(310);
Object.keys(_index184).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index184[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index184[key];
    },
  });
});
var _index185 = __webpack_require__(311);
Object.keys(_index185).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index185[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index185[key];
    },
  });
});
var _index186 = __webpack_require__(312);
Object.keys(_index186).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index186[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index186[key];
    },
  });
});
var _index187 = __webpack_require__(313);
Object.keys(_index187).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index187[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index187[key];
    },
  });
});
var _index188 = __webpack_require__(314);
Object.keys(_index188).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index188[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index188[key];
    },
  });
});
var _index189 = __webpack_require__(315);
Object.keys(_index189).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index189[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index189[key];
    },
  });
});
var _index190 = __webpack_require__(316);
Object.keys(_index190).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index190[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index190[key];
    },
  });
});
var _index191 = __webpack_require__(317);
Object.keys(_index191).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index191[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index191[key];
    },
  });
});
var _index192 = __webpack_require__(318);
Object.keys(_index192).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index192[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index192[key];
    },
  });
});
var _index193 = __webpack_require__(319);
Object.keys(_index193).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index193[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index193[key];
    },
  });
});
var _index194 = __webpack_require__(320);
Object.keys(_index194).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index194[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index194[key];
    },
  });
});
var _index195 = __webpack_require__(321);
Object.keys(_index195).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index195[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index195[key];
    },
  });
});
var _index196 = __webpack_require__(322);
Object.keys(_index196).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index196[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index196[key];
    },
  });
});
var _index197 = __webpack_require__(324);
Object.keys(_index197).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index197[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index197[key];
    },
  });
});
var _index198 = __webpack_require__(233);
Object.keys(_index198).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index198[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index198[key];
    },
  });
});
var _index199 = __webpack_require__(325);
Object.keys(_index199).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index199[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index199[key];
    },
  });
});
var _index200 = __webpack_require__(326);
Object.keys(_index200).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index200[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index200[key];
    },
  });
});
var _index201 = __webpack_require__(327);
Object.keys(_index201).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index201[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index201[key];
    },
  });
});
var _index202 = __webpack_require__(237);
Object.keys(_index202).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index202[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index202[key];
    },
  });
});
var _index203 = __webpack_require__(229);
Object.keys(_index203).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index203[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index203[key];
    },
  });
});
var _index204 = __webpack_require__(68);
Object.keys(_index204).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index204[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index204[key];
    },
  });
});
var _index205 = __webpack_require__(328);
Object.keys(_index205).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index205[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index205[key];
    },
  });
});
var _index206 = __webpack_require__(329);
Object.keys(_index206).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index206[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index206[key];
    },
  });
});
var _index207 = __webpack_require__(323);
Object.keys(_index207).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index207[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index207[key];
    },
  });
});
var _index208 = __webpack_require__(330);
Object.keys(_index208).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index208[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index208[key];
    },
  });
});
var _index209 = __webpack_require__(331);
Object.keys(_index209).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index209[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index209[key];
    },
  });
});
var _index210 = __webpack_require__(227);
Object.keys(_index210).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index210[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index210[key];
    },
  });
});
var _index211 = __webpack_require__(332);
Object.keys(_index211).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index211[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index211[key];
    },
  });
});
var _index212 = __webpack_require__(333);
Object.keys(_index212).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index212[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index212[key];
    },
  });
});
var _index213 = __webpack_require__(70);
Object.keys(_index213).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index213[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index213[key];
    },
  });
});
var _index214 = __webpack_require__(334);
Object.keys(_index214).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index214[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index214[key];
    },
  });
});
var _index215 = __webpack_require__(255);
Object.keys(_index215).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index215[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index215[key];
    },
  });
});
var _index216 = __webpack_require__(65);
Object.keys(_index216).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index216[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index216[key];
    },
  });
});
var _index217 = __webpack_require__(72);
Object.keys(_index217).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index217[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index217[key];
    },
  });
});
var _index218 = __webpack_require__(117);
Object.keys(_index218).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index218[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index218[key];
    },
  });
});
var _index219 = __webpack_require__(124);
Object.keys(_index219).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index219[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index219[key];
    },
  });
});
var _index220 = __webpack_require__(120);
Object.keys(_index220).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index220[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index220[key];
    },
  });
});
var _index221 = __webpack_require__(263);
Object.keys(_index221).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index221[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index221[key];
    },
  });
});
var _index222 = __webpack_require__(335);
Object.keys(_index222).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index222[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index222[key];
    },
  });
});
var _index223 = __webpack_require__(336);
Object.keys(_index223).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index223[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index223[key];
    },
  });
});
var _index224 = __webpack_require__(66);
Object.keys(_index224).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index224[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index224[key];
    },
  });
});
var _index225 = __webpack_require__(156);
Object.keys(_index225).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index225[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index225[key];
    },
  });
});
var _index226 = __webpack_require__(127);
Object.keys(_index226).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index226[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index226[key];
    },
  });
});
var _index227 = __webpack_require__(337);
Object.keys(_index227).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index227[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index227[key];
    },
  });
});
var _index228 = __webpack_require__(338);
Object.keys(_index228).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index228[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index228[key];
    },
  });
});
var _index229 = __webpack_require__(340);
Object.keys(_index229).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index229[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index229[key];
    },
  });
});
var _index230 = __webpack_require__(280);
Object.keys(_index230).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index230[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index230[key];
    },
  });
});
var _index231 = __webpack_require__(341);
Object.keys(_index231).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index231[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index231[key];
    },
  });
});
var _index232 = __webpack_require__(104);
Object.keys(_index232).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index232[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index232[key];
    },
  });
});
var _index233 = __webpack_require__(342);
Object.keys(_index233).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index233[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index233[key];
    },
  });
});
var _index234 = __webpack_require__(343);
Object.keys(_index234).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index234[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index234[key];
    },
  });
});
var _index235 = __webpack_require__(339);
Object.keys(_index235).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index235[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index235[key];
    },
  });
});
var _index236 = __webpack_require__(344);
Object.keys(_index236).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index236[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index236[key];
    },
  });
});
var _index237 = __webpack_require__(345);
Object.keys(_index237).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index237[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index237[key];
    },
  });
});
var _index238 = __webpack_require__(346);
Object.keys(_index238).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index238[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index238[key];
    },
  });
});
var _index239 = __webpack_require__(347);
Object.keys(_index239).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index239[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index239[key];
    },
  });
});
var _index240 = __webpack_require__(53);
Object.keys(_index240).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index240[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index240[key];
    },
  });
});
var _index241 = __webpack_require__(215);
Object.keys(_index241).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index241[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index241[key];
    },
  });
});
var _index242 = __webpack_require__(348);
Object.keys(_index242).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index242[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index242[key];
    },
  });
});
var _index243 = __webpack_require__(349);
Object.keys(_index243).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index243[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index243[key];
    },
  });
});
var _index244 = __webpack_require__(350);
Object.keys(_index244).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index244[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index244[key];
    },
  });
});
var _index245 = __webpack_require__(351);
Object.keys(_index245).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _index245[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index245[key];
    },
  });
});


/***/ }),
/* 51 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.add = add;
var _index = __webpack_require__(52);
var _index2 = __webpack_require__(55);
var _index3 = __webpack_require__(54);
var _index4 = __webpack_require__(53);

/**
 * @name add
 * @category Common Helpers
 * @summary Add the specified years, months, weeks, days, hours, minutes and seconds to the given date.
 *
 * @description
 * Add the specified years, months, weeks, days, hours, minutes and seconds to the given date.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The date to be changed
 * @param duration - The object with years, months, weeks, days, hours, minutes and seconds to be added.
 *
 * | Key            | Description                        |
 * |----------------|------------------------------------|
 * | years          | Amount of years to be added        |
 * | months         | Amount of months to be added       |
 * | weeks          | Amount of weeks to be added        |
 * | days           | Amount of days to be added         |
 * | hours          | Amount of hours to be added        |
 * | minutes        | Amount of minutes to be added      |
 * | seconds        | Amount of seconds to be added      |
 *
 * All values default to 0
 *
 * @returns The new date with the seconds added
 *
 * @example
 * // Add the following duration to 1 September 2014, 10:19:50
 * const result = add(new Date(2014, 8, 1, 10, 19, 50), {
 *   years: 2,
 *   months: 9,
 *   weeks: 1,
 *   days: 7,
 *   hours: 5,\\-7
 *   minutes: 9,
 *   seconds: 30,
 * })
 * //=> Thu Jun 15 2017 15:29:20
 */
function add(date, duration) {
  const {
    years = 0,
    months = 0,
    weeks = 0,
    days = 0,
    hours = 0,
    minutes = 0,
    seconds = 0,
  } = duration;

  // Add years and months
  const _date = (0, _index4.toDate)(date);
  const dateWithMonths =
    months || years
      ? (0, _index2.addMonths)(_date, months + years * 12)
      : _date;

  // Add weeks and days
  const dateWithDays =
    days || weeks
      ? (0, _index.addDays)(dateWithMonths, days + weeks * 7)
      : dateWithMonths;

  // Add days, hours, minutes and seconds
  const minutesToAdd = minutes + hours * 60;
  const secondsToAdd = seconds + minutesToAdd * 60;
  const msToAdd = secondsToAdd * 1000;
  const finalDate = (0, _index3.constructFrom)(
    date,
    dateWithDays.getTime() + msToAdd,
  );

  return finalDate;
}


/***/ }),
/* 52 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.addDays = addDays;
var _index = __webpack_require__(53);
var _index2 = __webpack_require__(54);

/**
 * @name addDays
 * @category Day Helpers
 * @summary Add the specified number of days to the given date.
 *
 * @description
 * Add the specified number of days to the given date.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The date to be changed
 * @param amount - The amount of days to be added.
 *
 * @returns The new date with the days added
 *
 * @example
 * // Add 10 days to 1 September 2014:
 * const result = addDays(new Date(2014, 8, 1), 10)
 * //=> Thu Sep 11 2014 00:00:00
 */
function addDays(date, amount) {
  const _date = (0, _index.toDate)(date);
  if (isNaN(amount)) return (0, _index2.constructFrom)(date, NaN);
  if (!amount) {
    // If 0 days, no-op to avoid changing times in the hour before end of DST
    return _date;
  }
  _date.setDate(_date.getDate() + amount);
  return _date;
}


/***/ }),
/* 53 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

exports.toDate = toDate;

/**
 * @name toDate
 * @category Common Helpers
 * @summary Convert the given argument to an instance of Date.
 *
 * @description
 * Convert the given argument to an instance of Date.
 *
 * If the argument is an instance of Date, the function returns its clone.
 *
 * If the argument is a number, it is treated as a timestamp.
 *
 * If the argument is none of the above, the function returns Invalid Date.
 *
 * **Note**: *all* Date arguments passed to any *date-fns* function is processed by `toDate`.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param argument - The value to convert
 *
 * @returns The parsed date in the local time zone
 *
 * @example
 * // Clone the date:
 * const result = toDate(new Date(2014, 1, 11, 11, 30, 30))
 * //=> Tue Feb 11 2014 11:30:30
 *
 * @example
 * // Convert the timestamp to date:
 * const result = toDate(1392098430000)
 * //=> Tue Feb 11 2014 11:30:30
 */
function toDate(argument) {
  const argStr = Object.prototype.toString.call(argument);

  // Clone the date
  if (
    argument instanceof Date ||
    (typeof argument === "object" && argStr === "[object Date]")
  ) {
    // Prevent the date to lose the milliseconds when passed to new Date() in IE10
    return new argument.constructor(+argument);
  } else if (
    typeof argument === "number" ||
    argStr === "[object Number]" ||
    typeof argument === "string" ||
    argStr === "[object String]"
  ) {
    // TODO: Can we get rid of as?
    return new Date(argument);
  } else {
    // TODO: Can we get rid of as?
    return new Date(NaN);
  }
}


/***/ }),
/* 54 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

exports.constructFrom = constructFrom;

/**
 * @name constructFrom
 * @category Generic Helpers
 * @summary Constructs a date using the reference date and the value
 *
 * @description
 * The function constructs a new date using the constructor from the reference
 * date and the given value. It helps to build generic functions that accept
 * date extensions.
 *
 * It defaults to `Date` if the passed reference date is a number or a string.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The reference date to take constructor from
 * @param value - The value to create the date
 *
 * @returns Date initialized using the given date and value
 *
 * @example
 * import { constructFrom } from 'date-fns'
 *
 * // A function that clones a date preserving the original type
 * function cloneDate<DateType extends Date(date: DateType): DateType {
 *   return constructFrom(
 *     date, // Use contrustor from the given date
 *     date.getTime() // Use the date value to create a new date
 *   )
 * }
 */
function constructFrom(date, value) {
  if (date instanceof Date) {
    return new date.constructor(value);
  } else {
    return new Date(value);
  }
}


/***/ }),
/* 55 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.addMonths = addMonths;
var _index = __webpack_require__(53);
var _index2 = __webpack_require__(54);

/**
 * @name addMonths
 * @category Month Helpers
 * @summary Add the specified number of months to the given date.
 *
 * @description
 * Add the specified number of months to the given date.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The date to be changed
 * @param amount - The amount of months to be added.
 *
 * @returns The new date with the months added
 *
 * @example
 * // Add 5 months to 1 September 2014:
 * const result = addMonths(new Date(2014, 8, 1), 5)
 * //=> Sun Feb 01 2015 00:00:00
 *
 * // Add one month to 30 January 2023:
 * const result = addMonths(new Date(2023, 0, 30), 1)
 * //=> Tue Feb 28 2023 00:00:00
 */
function addMonths(date, amount) {
  const _date = (0, _index.toDate)(date);
  if (isNaN(amount)) return (0, _index2.constructFrom)(date, NaN);
  if (!amount) {
    // If 0 months, no-op to avoid changing times in the hour before end of DST
    return _date;
  }
  const dayOfMonth = _date.getDate();

  // The JS Date object supports date math by accepting out-of-bounds values for
  // month, day, etc. For example, new Date(2020, 0, 0) returns 31 Dec 2019 and
  // new Date(2020, 13, 1) returns 1 Feb 2021.  This is *almost* the behavior we
  // want except that dates will wrap around the end of a month, meaning that
  // new Date(2020, 13, 31) will return 3 Mar 2021 not 28 Feb 2021 as desired. So
  // we'll default to the end of the desired month by adding 1 to the desired
  // month and using a date of 0 to back up one day to the end of the desired
  // month.
  const endOfDesiredMonth = (0, _index2.constructFrom)(date, _date.getTime());
  endOfDesiredMonth.setMonth(_date.getMonth() + amount + 1, 0);
  const daysInMonth = endOfDesiredMonth.getDate();
  if (dayOfMonth >= daysInMonth) {
    // If we're already at the end of the month, then this is the correct date
    // and we're done.
    return endOfDesiredMonth;
  } else {
    // Otherwise, we now know that setting the original day-of-month value won't
    // cause an overflow, so set the desired day-of-month. Note that we can't
    // just set the date of `endOfDesiredMonth` because that object may have had
    // its time changed in the unusual case where where a DST transition was on
    // the last day of the month and its local time was in the hour skipped or
    // repeated next to a DST transition.  So we use `date` instead which is
    // guaranteed to still have the original time.
    _date.setFullYear(
      endOfDesiredMonth.getFullYear(),
      endOfDesiredMonth.getMonth(),
      dayOfMonth,
    );
    return _date;
  }
}


/***/ }),
/* 56 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.addBusinessDays = addBusinessDays;
var _index = __webpack_require__(54);
var _index2 = __webpack_require__(57);
var _index3 = __webpack_require__(58);
var _index4 = __webpack_require__(59);
var _index5 = __webpack_require__(53);

/**
 * @name addBusinessDays
 * @category Date Extension Helpers
 * @summary Add the specified number of business days (mon - fri) to the given date.
 *
 * @description
 * Add the specified number of business days (mon - fri) to the given date, ignoring weekends.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The date to be changed
 * @param amount - The amount of business days to be added.
 *
 * @returns The new date with the business days added
 *
 * @example
 * // Add 10 business days to 1 September 2014:
 * const result = addBusinessDays(new Date(2014, 8, 1), 10)
 * //=> Mon Sep 15 2014 00:00:00 (skipped weekend days)
 */
function addBusinessDays(date, amount) {
  const _date = (0, _index5.toDate)(date);
  const startedOnWeekend = (0, _index4.isWeekend)(_date);

  if (isNaN(amount)) return (0, _index.constructFrom)(date, NaN);

  const hours = _date.getHours();
  const sign = amount < 0 ? -1 : 1;
  const fullWeeks = Math.trunc(amount / 5);

  _date.setDate(_date.getDate() + fullWeeks * 7);

  // Get remaining days not part of a full week
  let restDays = Math.abs(amount % 5);

  // Loops over remaining days
  while (restDays > 0) {
    _date.setDate(_date.getDate() + sign);
    if (!(0, _index4.isWeekend)(_date)) restDays -= 1;
  }

  // If the date is a weekend day and we reduce a dividable of
  // 5 from it, we land on a weekend date.
  // To counter this, we add days accordingly to land on the next business day
  if (startedOnWeekend && (0, _index4.isWeekend)(_date) && amount !== 0) {
    // If we're reducing days, we want to add days until we land on a weekday
    // If we're adding days we want to reduce days until we land on a weekday
    if ((0, _index2.isSaturday)(_date))
      _date.setDate(_date.getDate() + (sign < 0 ? 2 : -1));
    if ((0, _index3.isSunday)(_date))
      _date.setDate(_date.getDate() + (sign < 0 ? 1 : -2));
  }

  // Restore hours to avoid DST lag
  _date.setHours(hours);

  return _date;
}


/***/ }),
/* 57 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.isSaturday = isSaturday;
var _index = __webpack_require__(53);

/**
 * @name isSaturday
 * @category Weekday Helpers
 * @summary Is the given date Saturday?
 *
 * @description
 * Is the given date Saturday?
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The date to check
 *
 * @returns The date is Saturday
 *
 * @example
 * // Is 27 September 2014 Saturday?
 * const result = isSaturday(new Date(2014, 8, 27))
 * //=> true
 */
function isSaturday(date) {
  return (0, _index.toDate)(date).getDay() === 6;
}


/***/ }),
/* 58 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.isSunday = isSunday;
var _index = __webpack_require__(53);

/**
 * @name isSunday
 * @category Weekday Helpers
 * @summary Is the given date Sunday?
 *
 * @description
 * Is the given date Sunday?
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The date to check
 *
 * @returns The date is Sunday
 *
 * @example
 * // Is 21 September 2014 Sunday?
 * const result = isSunday(new Date(2014, 8, 21))
 * //=> true
 */
function isSunday(date) {
  return (0, _index.toDate)(date).getDay() === 0;
}


/***/ }),
/* 59 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.isWeekend = isWeekend;
var _index = __webpack_require__(53);

/**
 * @name isWeekend
 * @category Weekday Helpers
 * @summary Does the given date fall on a weekend?
 *
 * @description
 * Does the given date fall on a weekend?
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The date to check
 *
 * @returns The date falls on a weekend
 *
 * @example
 * // Does 5 October 2014 fall on a weekend?
 * const result = isWeekend(new Date(2014, 9, 5))
 * //=> true
 */
function isWeekend(date) {
  const day = (0, _index.toDate)(date).getDay();
  return day === 0 || day === 6;
}


/***/ }),
/* 60 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.addHours = addHours;
var _index = __webpack_require__(61);
var _index2 = __webpack_require__(62);

/**
 * @name addHours
 * @category Hour Helpers
 * @summary Add the specified number of hours to the given date.
 *
 * @description
 * Add the specified number of hours to the given date.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The date to be changed
 * @param amount - The amount of hours to be added.
 *
 * @returns The new date with the hours added
 *
 * @example
 * // Add 2 hours to 10 July 2014 23:00:00:
 * const result = addHours(new Date(2014, 6, 10, 23, 0), 2)
 * //=> Fri Jul 11 2014 01:00:00
 */
function addHours(date, amount) {
  return (0, _index.addMilliseconds)(date, amount * _index2.millisecondsInHour);
}


/***/ }),
/* 61 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.addMilliseconds = addMilliseconds;
var _index = __webpack_require__(53);
var _index2 = __webpack_require__(54);

/**
 * @name addMilliseconds
 * @category Millisecond Helpers
 * @summary Add the specified number of milliseconds to the given date.
 *
 * @description
 * Add the specified number of milliseconds to the given date.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The date to be changed
 * @param amount - The amount of milliseconds to be added.
 *
 * @returns The new date with the milliseconds added
 *
 * @example
 * // Add 750 milliseconds to 10 July 2014 12:45:30.000:
 * const result = addMilliseconds(new Date(2014, 6, 10, 12, 45, 30, 0), 750)
 * //=> Thu Jul 10 2014 12:45:30.750
 */
function addMilliseconds(date, amount) {
  const timestamp = +(0, _index.toDate)(date);
  return (0, _index2.constructFrom)(date, timestamp + amount);
}


/***/ }),
/* 62 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

exports.secondsInYear =
  exports.secondsInWeek =
  exports.secondsInQuarter =
  exports.secondsInMonth =
  exports.secondsInMinute =
  exports.secondsInHour =
  exports.secondsInDay =
  exports.quartersInYear =
  exports.monthsInYear =
  exports.monthsInQuarter =
  exports.minutesInYear =
  exports.minutesInMonth =
  exports.minutesInHour =
  exports.minutesInDay =
  exports.minTime =
  exports.millisecondsInWeek =
  exports.millisecondsInSecond =
  exports.millisecondsInMinute =
  exports.millisecondsInHour =
  exports.millisecondsInDay =
  exports.maxTime =
  exports.daysInYear =
  exports.daysInWeek =
    void 0; /**
 * @module constants
 * @summary Useful constants
 * @description
 * Collection of useful date constants.
 *
 * The constants could be imported from `date-fns/constants`:
 *
 * ```ts
 * import { maxTime, minTime } from "date-fns/constants";
 *
 * function isAllowedTime(time) {
 *   return time <= maxTime && time >= minTime;
 * }
 * ```
 */

/**
 * @constant
 * @name daysInWeek
 * @summary Days in 1 week.
 */
const daysInWeek = (exports.daysInWeek = 7);

/**
 * @constant
 * @name daysInYear
 * @summary Days in 1 year.
 *
 * @description
 * How many days in a year.
 *
 * One years equals 365.2425 days according to the formula:
 *
 * > Leap year occures every 4 years, except for years that are divisable by 100 and not divisable by 400.
 * > 1 mean year = (365+1/4-1/100+1/400) days = 365.2425 days
 */
const daysInYear = (exports.daysInYear = 365.2425);

/**
 * @constant
 * @name maxTime
 * @summary Maximum allowed time.
 *
 * @example
 * import { maxTime } from "date-fns/constants";
 *
 * const isValid = 8640000000000001 <= maxTime;
 * //=> false
 *
 * new Date(8640000000000001);
 * //=> Invalid Date
 */
const maxTime = (exports.maxTime = Math.pow(10, 8) * 24 * 60 * 60 * 1000);

/**
 * @constant
 * @name minTime
 * @summary Minimum allowed time.
 *
 * @example
 * import { minTime } from "date-fns/constants";
 *
 * const isValid = -8640000000000001 >= minTime;
 * //=> false
 *
 * new Date(-8640000000000001)
 * //=> Invalid Date
 */
const minTime = (exports.minTime = -maxTime);

/**
 * @constant
 * @name millisecondsInWeek
 * @summary Milliseconds in 1 week.
 */
const millisecondsInWeek = (exports.millisecondsInWeek = 604800000);

/**
 * @constant
 * @name millisecondsInDay
 * @summary Milliseconds in 1 day.
 */
const millisecondsInDay = (exports.millisecondsInDay = 86400000);

/**
 * @constant
 * @name millisecondsInMinute
 * @summary Milliseconds in 1 minute
 */
const millisecondsInMinute = (exports.millisecondsInMinute = 60000);

/**
 * @constant
 * @name millisecondsInHour
 * @summary Milliseconds in 1 hour
 */
const millisecondsInHour = (exports.millisecondsInHour = 3600000);

/**
 * @constant
 * @name millisecondsInSecond
 * @summary Milliseconds in 1 second
 */
const millisecondsInSecond = (exports.millisecondsInSecond = 1000);

/**
 * @constant
 * @name minutesInYear
 * @summary Minutes in 1 year.
 */
const minutesInYear = (exports.minutesInYear = 525600);

/**
 * @constant
 * @name minutesInMonth
 * @summary Minutes in 1 month.
 */
const minutesInMonth = (exports.minutesInMonth = 43200);

/**
 * @constant
 * @name minutesInDay
 * @summary Minutes in 1 day.
 */
const minutesInDay = (exports.minutesInDay = 1440);

/**
 * @constant
 * @name minutesInHour
 * @summary Minutes in 1 hour.
 */
const minutesInHour = (exports.minutesInHour = 60);

/**
 * @constant
 * @name monthsInQuarter
 * @summary Months in 1 quarter.
 */
const monthsInQuarter = (exports.monthsInQuarter = 3);

/**
 * @constant
 * @name monthsInYear
 * @summary Months in 1 year.
 */
const monthsInYear = (exports.monthsInYear = 12);

/**
 * @constant
 * @name quartersInYear
 * @summary Quarters in 1 year
 */
const quartersInYear = (exports.quartersInYear = 4);

/**
 * @constant
 * @name secondsInHour
 * @summary Seconds in 1 hour.
 */
const secondsInHour = (exports.secondsInHour = 3600);

/**
 * @constant
 * @name secondsInMinute
 * @summary Seconds in 1 minute.
 */
const secondsInMinute = (exports.secondsInMinute = 60);

/**
 * @constant
 * @name secondsInDay
 * @summary Seconds in 1 day.
 */
const secondsInDay = (exports.secondsInDay = secondsInHour * 24);

/**
 * @constant
 * @name secondsInWeek
 * @summary Seconds in 1 week.
 */
const secondsInWeek = (exports.secondsInWeek = secondsInDay * 7);

/**
 * @constant
 * @name secondsInYear
 * @summary Seconds in 1 year.
 */
const secondsInYear = (exports.secondsInYear = secondsInDay * daysInYear);

/**
 * @constant
 * @name secondsInMonth
 * @summary Seconds in 1 month
 */
const secondsInMonth = (exports.secondsInMonth = secondsInYear / 12);

/**
 * @constant
 * @name secondsInQuarter
 * @summary Seconds in 1 quarter.
 */
const secondsInQuarter = (exports.secondsInQuarter = secondsInMonth * 3);


/***/ }),
/* 63 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.addISOWeekYears = addISOWeekYears;
var _index = __webpack_require__(64);
var _index2 = __webpack_require__(68);

/**
 * @name addISOWeekYears
 * @category ISO Week-Numbering Year Helpers
 * @summary Add the specified number of ISO week-numbering years to the given date.
 *
 * @description
 * Add the specified number of ISO week-numbering years to the given date.
 *
 * ISO week-numbering year: http://en.wikipedia.org/wiki/ISO_week_date
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The date to be changed
 * @param amount - The amount of ISO week-numbering years to be added.
 *
 * @returns The new date with the ISO week-numbering years added
 *
 * @example
 * // Add 5 ISO week-numbering years to 2 July 2010:
 * const result = addISOWeekYears(new Date(2010, 6, 2), 5)
 * //=> Fri Jn 26 2015 00:00:00
 */
function addISOWeekYears(date, amount) {
  return (0, _index2.setISOWeekYear)(
    date,
    (0, _index.getISOWeekYear)(date) + amount,
  );
}


/***/ }),
/* 64 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.getISOWeekYear = getISOWeekYear;
var _index = __webpack_require__(54);
var _index2 = __webpack_require__(65);
var _index3 = __webpack_require__(53);

/**
 * @name getISOWeekYear
 * @category ISO Week-Numbering Year Helpers
 * @summary Get the ISO week-numbering year of the given date.
 *
 * @description
 * Get the ISO week-numbering year of the given date,
 * which always starts 3 days before the year's first Thursday.
 *
 * ISO week-numbering year: http://en.wikipedia.org/wiki/ISO_week_date
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The given date
 *
 * @returns The ISO week-numbering year
 *
 * @example
 * // Which ISO-week numbering year is 2 January 2005?
 * const result = getISOWeekYear(new Date(2005, 0, 2))
 * //=> 2004
 */
function getISOWeekYear(date) {
  const _date = (0, _index3.toDate)(date);
  const year = _date.getFullYear();

  const fourthOfJanuaryOfNextYear = (0, _index.constructFrom)(date, 0);
  fourthOfJanuaryOfNextYear.setFullYear(year + 1, 0, 4);
  fourthOfJanuaryOfNextYear.setHours(0, 0, 0, 0);
  const startOfNextYear = (0, _index2.startOfISOWeek)(
    fourthOfJanuaryOfNextYear,
  );

  const fourthOfJanuaryOfThisYear = (0, _index.constructFrom)(date, 0);
  fourthOfJanuaryOfThisYear.setFullYear(year, 0, 4);
  fourthOfJanuaryOfThisYear.setHours(0, 0, 0, 0);
  const startOfThisYear = (0, _index2.startOfISOWeek)(
    fourthOfJanuaryOfThisYear,
  );

  if (_date.getTime() >= startOfNextYear.getTime()) {
    return year + 1;
  } else if (_date.getTime() >= startOfThisYear.getTime()) {
    return year;
  } else {
    return year - 1;
  }
}


/***/ }),
/* 65 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.startOfISOWeek = startOfISOWeek;
var _index = __webpack_require__(66);

/**
 * @name startOfISOWeek
 * @category ISO Week Helpers
 * @summary Return the start of an ISO week for the given date.
 *
 * @description
 * Return the start of an ISO week for the given date.
 * The result will be in the local timezone.
 *
 * ISO week-numbering year: http://en.wikipedia.org/wiki/ISO_week_date
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The original date
 *
 * @returns The start of an ISO week
 *
 * @example
 * // The start of an ISO week for 2 September 2014 11:55:00:
 * const result = startOfISOWeek(new Date(2014, 8, 2, 11, 55, 0))
 * //=> Mon Sep 01 2014 00:00:00
 */
function startOfISOWeek(date) {
  return (0, _index.startOfWeek)(date, { weekStartsOn: 1 });
}


/***/ }),
/* 66 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.startOfWeek = startOfWeek;
var _index = __webpack_require__(53);

var _index2 = __webpack_require__(67);

/**
 * The {@link startOfWeek} function options.
 */

/**
 * @name startOfWeek
 * @category Week Helpers
 * @summary Return the start of a week for the given date.
 *
 * @description
 * Return the start of a week for the given date.
 * The result will be in the local timezone.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The original date
 * @param options - An object with options
 *
 * @returns The start of a week
 *
 * @example
 * // The start of a week for 2 September 2014 11:55:00:
 * const result = startOfWeek(new Date(2014, 8, 2, 11, 55, 0))
 * //=> Sun Aug 31 2014 00:00:00
 *
 * @example
 * // If the week starts on Monday, the start of the week for 2 September 2014 11:55:00:
 * const result = startOfWeek(new Date(2014, 8, 2, 11, 55, 0), { weekStartsOn: 1 })
 * //=> Mon Sep 01 2014 00:00:00
 */
function startOfWeek(date, options) {
  const defaultOptions = (0, _index2.getDefaultOptions)();
  const weekStartsOn =
    options?.weekStartsOn ??
    options?.locale?.options?.weekStartsOn ??
    defaultOptions.weekStartsOn ??
    defaultOptions.locale?.options?.weekStartsOn ??
    0;

  const _date = (0, _index.toDate)(date);
  const day = _date.getDay();
  const diff = (day < weekStartsOn ? 7 : 0) + day - weekStartsOn;

  _date.setDate(_date.getDate() - diff);
  _date.setHours(0, 0, 0, 0);
  return _date;
}


/***/ }),
/* 67 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

exports.getDefaultOptions = getDefaultOptions;
exports.setDefaultOptions = setDefaultOptions;

let defaultOptions = {};

function getDefaultOptions() {
  return defaultOptions;
}

function setDefaultOptions(newOptions) {
  defaultOptions = newOptions;
}


/***/ }),
/* 68 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.setISOWeekYear = setISOWeekYear;
var _index = __webpack_require__(54);
var _index2 = __webpack_require__(69);
var _index3 = __webpack_require__(72);
var _index4 = __webpack_require__(53);

/**
 * @name setISOWeekYear
 * @category ISO Week-Numbering Year Helpers
 * @summary Set the ISO week-numbering year to the given date.
 *
 * @description
 * Set the ISO week-numbering year to the given date,
 * saving the week number and the weekday number.
 *
 * ISO week-numbering year: http://en.wikipedia.org/wiki/ISO_week_date
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The date to be changed
 * @param weekYear - The ISO week-numbering year of the new date
 *
 * @returns The new date with the ISO week-numbering year set
 *
 * @example
 * // Set ISO week-numbering year 2007 to 29 December 2008:
 * const result = setISOWeekYear(new Date(2008, 11, 29), 2007)
 * //=> Mon Jan 01 2007 00:00:00
 */
function setISOWeekYear(date, weekYear) {
  let _date = (0, _index4.toDate)(date);
  const diff = (0, _index2.differenceInCalendarDays)(
    _date,
    (0, _index3.startOfISOWeekYear)(_date),
  );
  const fourthOfJanuary = (0, _index.constructFrom)(date, 0);
  fourthOfJanuary.setFullYear(weekYear, 0, 4);
  fourthOfJanuary.setHours(0, 0, 0, 0);
  _date = (0, _index3.startOfISOWeekYear)(fourthOfJanuary);
  _date.setDate(_date.getDate() + diff);
  return _date;
}


/***/ }),
/* 69 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.differenceInCalendarDays = differenceInCalendarDays;
var _index = __webpack_require__(62);
var _index2 = __webpack_require__(70);
var _index3 = __webpack_require__(71);

/**
 * @name differenceInCalendarDays
 * @category Day Helpers
 * @summary Get the number of calendar days between the given dates.
 *
 * @description
 * Get the number of calendar days between the given dates. This means that the times are removed
 * from the dates and then the difference in days is calculated.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param dateLeft - The later date
 * @param dateRight - The earlier date
 *
 * @returns The number of calendar days
 *
 * @example
 * // How many calendar days are between
 * // 2 July 2011 23:00:00 and 2 July 2012 00:00:00?
 * const result = differenceInCalendarDays(
 *   new Date(2012, 6, 2, 0, 0),
 *   new Date(2011, 6, 2, 23, 0)
 * )
 * //=> 366
 * // How many calendar days are between
 * // 2 July 2011 23:59:00 and 3 July 2011 00:01:00?
 * const result = differenceInCalendarDays(
 *   new Date(2011, 6, 3, 0, 1),
 *   new Date(2011, 6, 2, 23, 59)
 * )
 * //=> 1
 */
function differenceInCalendarDays(dateLeft, dateRight) {
  const startOfDayLeft = (0, _index2.startOfDay)(dateLeft);
  const startOfDayRight = (0, _index2.startOfDay)(dateRight);

  const timestampLeft =
    +startOfDayLeft -
    (0, _index3.getTimezoneOffsetInMilliseconds)(startOfDayLeft);
  const timestampRight =
    +startOfDayRight -
    (0, _index3.getTimezoneOffsetInMilliseconds)(startOfDayRight);

  // Round the number of days to the nearest integer because the number of
  // milliseconds in a day is not constant (e.g. it's different in the week of
  // the daylight saving time clock shift).
  return Math.round(
    (timestampLeft - timestampRight) / _index.millisecondsInDay,
  );
}


/***/ }),
/* 70 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.startOfDay = startOfDay;
var _index = __webpack_require__(53);

/**
 * @name startOfDay
 * @category Day Helpers
 * @summary Return the start of a day for the given date.
 *
 * @description
 * Return the start of a day for the given date.
 * The result will be in the local timezone.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The original date
 *
 * @returns The start of a day
 *
 * @example
 * // The start of a day for 2 September 2014 11:55:00:
 * const result = startOfDay(new Date(2014, 8, 2, 11, 55, 0))
 * //=> Tue Sep 02 2014 00:00:00
 */
function startOfDay(date) {
  const _date = (0, _index.toDate)(date);
  _date.setHours(0, 0, 0, 0);
  return _date;
}


/***/ }),
/* 71 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.getTimezoneOffsetInMilliseconds = getTimezoneOffsetInMilliseconds;
var _index = __webpack_require__(53);

/**
 * Google Chrome as of 67.0.3396.87 introduced timezones with offset that includes seconds.
 * They usually appear for dates that denote time before the timezones were introduced
 * (e.g. for 'Europe/Prague' timezone the offset is GMT+00:57:44 before 1 October 1891
 * and GMT+01:00:00 after that date)
 *
 * Date#getTimezoneOffset returns the offset in minutes and would return 57 for the example above,
 * which would lead to incorrect calculations.
 *
 * This function returns the timezone offset in milliseconds that takes seconds in account.
 */
function getTimezoneOffsetInMilliseconds(date) {
  const _date = (0, _index.toDate)(date);
  const utcDate = new Date(
    Date.UTC(
      _date.getFullYear(),
      _date.getMonth(),
      _date.getDate(),
      _date.getHours(),
      _date.getMinutes(),
      _date.getSeconds(),
      _date.getMilliseconds(),
    ),
  );
  utcDate.setUTCFullYear(_date.getFullYear());
  return +date - +utcDate;
}


/***/ }),
/* 72 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.startOfISOWeekYear = startOfISOWeekYear;
var _index = __webpack_require__(64);
var _index2 = __webpack_require__(65);
var _index3 = __webpack_require__(54);

/**
 * @name startOfISOWeekYear
 * @category ISO Week-Numbering Year Helpers
 * @summary Return the start of an ISO week-numbering year for the given date.
 *
 * @description
 * Return the start of an ISO week-numbering year,
 * which always starts 3 days before the year's first Thursday.
 * The result will be in the local timezone.
 *
 * ISO week-numbering year: http://en.wikipedia.org/wiki/ISO_week_date
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The original date
 *
 * @returns The start of an ISO week-numbering year
 *
 * @example
 * // The start of an ISO week-numbering year for 2 July 2005:
 * const result = startOfISOWeekYear(new Date(2005, 6, 2))
 * //=> Mon Jan 03 2005 00:00:00
 */
function startOfISOWeekYear(date) {
  const year = (0, _index.getISOWeekYear)(date);
  const fourthOfJanuary = (0, _index3.constructFrom)(date, 0);
  fourthOfJanuary.setFullYear(year, 0, 4);
  fourthOfJanuary.setHours(0, 0, 0, 0);
  return (0, _index2.startOfISOWeek)(fourthOfJanuary);
}


/***/ }),
/* 73 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.addMinutes = addMinutes;
var _index = __webpack_require__(61);
var _index2 = __webpack_require__(62);

/**
 * @name addMinutes
 * @category Minute Helpers
 * @summary Add the specified number of minutes to the given date.
 *
 * @description
 * Add the specified number of minutes to the given date.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The date to be changed
 * @param amount - The amount of minutes to be added.
 *
 * @returns The new date with the minutes added
 *
 * @example
 * // Add 30 minutes to 10 July 2014 12:00:00:
 * const result = addMinutes(new Date(2014, 6, 10, 12, 0), 30)
 * //=> Thu Jul 10 2014 12:30:00
 */
function addMinutes(date, amount) {
  return (0, _index.addMilliseconds)(
    date,
    amount * _index2.millisecondsInMinute,
  );
}


/***/ }),
/* 74 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.addQuarters = addQuarters;
var _index = __webpack_require__(55);

/**
 * @name addQuarters
 * @category Quarter Helpers
 * @summary Add the specified number of year quarters to the given date.
 *
 * @description
 * Add the specified number of year quarters to the given date.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The date to be changed
 * @param amount - The amount of quarters to be added.
 *
 * @returns The new date with the quarters added
 *
 * @example
 * // Add 1 quarter to 1 September 2014:
 * const result = addQuarters(new Date(2014, 8, 1), 1)
 * //=> Mon Dec 01 2014 00:00:00
 */
function addQuarters(date, amount) {
  const months = amount * 3;
  return (0, _index.addMonths)(date, months);
}


/***/ }),
/* 75 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.addSeconds = addSeconds;
var _index = __webpack_require__(61);

/**
 * @name addSeconds
 * @category Second Helpers
 * @summary Add the specified number of seconds to the given date.
 *
 * @description
 * Add the specified number of seconds to the given date.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The date to be changed
 * @param amount - The amount of seconds to be added.
 *
 * @returns The new date with the seconds added
 *
 * @example
 * // Add 30 seconds to 10 July 2014 12:45:00:
 * const result = addSeconds(new Date(2014, 6, 10, 12, 45, 0), 30)
 * //=> Thu Jul 10 2014 12:45:30
 */
function addSeconds(date, amount) {
  return (0, _index.addMilliseconds)(date, amount * 1000);
}


/***/ }),
/* 76 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.addWeeks = addWeeks;
var _index = __webpack_require__(52);

/**
 * @name addWeeks
 * @category Week Helpers
 * @summary Add the specified number of weeks to the given date.
 *
 * @description
 * Add the specified number of week to the given date.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The date to be changed
 * @param amount - The amount of weeks to be added.
 *
 * @returns The new date with the weeks added
 *
 * @example
 * // Add 4 weeks to 1 September 2014:
 * const result = addWeeks(new Date(2014, 8, 1), 4)
 * //=> Mon Sep 29 2014 00:00:00
 */
function addWeeks(date, amount) {
  const days = amount * 7;
  return (0, _index.addDays)(date, days);
}


/***/ }),
/* 77 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.addYears = addYears;
var _index = __webpack_require__(55);

/**
 * @name addYears
 * @category Year Helpers
 * @summary Add the specified number of years to the given date.
 *
 * @description
 * Add the specified number of years to the given date.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The date to be changed
 * @param amount - The amount of years to be added.
 *
 * @returns The new date with the years added
 *
 * @example
 * // Add 5 years to 1 September 2014:
 * const result = addYears(new Date(2014, 8, 1), 5)
 * //=> Sun Sep 01 2019 00:00:00
 */
function addYears(date, amount) {
  return (0, _index.addMonths)(date, amount * 12);
}


/***/ }),
/* 78 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.areIntervalsOverlapping = areIntervalsOverlapping;
var _index = __webpack_require__(53);

/**
 * The {@link areIntervalsOverlapping} function options.
 */

/**
 * @name areIntervalsOverlapping
 * @category Interval Helpers
 * @summary Is the given time interval overlapping with another time interval?
 *
 * @description
 * Is the given time interval overlapping with another time interval? Adjacent intervals do not count as overlapping unless `inclusive` is set to `true`.
 *
 * @param intervalLeft - The first interval to compare.
 * @param intervalRight - The second interval to compare.
 * @param options - The object with options
 *
 * @returns Whether the time intervals are overlapping
 *
 * @example
 * // For overlapping time intervals:
 * areIntervalsOverlapping(
 *   { start: new Date(2014, 0, 10), end: new Date(2014, 0, 20) },
 *   { start: new Date(2014, 0, 17), end: new Date(2014, 0, 21) }
 * )
 * //=> true
 *
 * @example
 * // For non-overlapping time intervals:
 * areIntervalsOverlapping(
 *   { start: new Date(2014, 0, 10), end: new Date(2014, 0, 20) },
 *   { start: new Date(2014, 0, 21), end: new Date(2014, 0, 22) }
 * )
 * //=> false
 *
 * @example
 * // For adjacent time intervals:
 * areIntervalsOverlapping(
 *   { start: new Date(2014, 0, 10), end: new Date(2014, 0, 20) },
 *   { start: new Date(2014, 0, 20), end: new Date(2014, 0, 30) }
 * )
 * //=> false
 *
 * @example
 * // Using the inclusive option:
 * areIntervalsOverlapping(
 *   { start: new Date(2014, 0, 10), end: new Date(2014, 0, 20) },
 *   { start: new Date(2014, 0, 20), end: new Date(2014, 0, 24) }
 * )
 * //=> false
 *
 * @example
 * areIntervalsOverlapping(
 *   { start: new Date(2014, 0, 10), end: new Date(2014, 0, 20) },
 *   { start: new Date(2014, 0, 20), end: new Date(2014, 0, 24) },
 *   { inclusive: true }
 * )
 * //=> true
 */
function areIntervalsOverlapping(intervalLeft, intervalRight, options) {
  const [leftStartTime, leftEndTime] = [
    +(0, _index.toDate)(intervalLeft.start),
    +(0, _index.toDate)(intervalLeft.end),
  ].sort((a, b) => a - b);
  const [rightStartTime, rightEndTime] = [
    +(0, _index.toDate)(intervalRight.start),
    +(0, _index.toDate)(intervalRight.end),
  ].sort((a, b) => a - b);

  if (options?.inclusive)
    return leftStartTime <= rightEndTime && rightStartTime <= leftEndTime;

  return leftStartTime < rightEndTime && rightStartTime < leftEndTime;
}


/***/ }),
/* 79 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.clamp = clamp;
var _index = __webpack_require__(80);
var _index2 = __webpack_require__(81);

/**
 * @name clamp
 * @category Interval Helpers
 * @summary Return a date bounded by the start and the end of the given interval
 *
 * @description
 * Clamps a date to the lower bound with the start of the interval and the upper
 * bound with the end of the interval.
 *
 * - When the date is less than the start of the interval, the start is returned.
 * - When the date is greater than the end of the interval, the end is returned.
 * - Otherwise the date is returned.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The date to be bounded
 * @param interval - The interval to bound to
 *
 * @returns The date bounded by the start and the end of the interval
 *
 * @example
 * // What is Mar, 21, 2021 bounded to an interval starting at Mar, 22, 2021 and ending at Apr, 01, 2021
 * const result = clamp(new Date(2021, 2, 21), {
 *   start: new Date(2021, 2, 22),
 *   end: new Date(2021, 3, 1),
 * })
 * //=> Mon Mar 22 2021 00:00:00
 */
function clamp(date, interval) {
  return (0, _index2.min)([
    (0, _index.max)([date, interval.start]),
    interval.end,
  ]);
}


/***/ }),
/* 80 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.max = max;
var _index = __webpack_require__(53);

/**
 * @name max
 * @category Common Helpers
 * @summary Return the latest of the given dates.
 *
 * @description
 * Return the latest of the given dates.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param dates - The dates to compare
 *
 * @returns The latest of the dates
 *
 * @example
 * // Which of these dates is the latest?
 * const result = max([
 *   new Date(1989, 6, 10),
 *   new Date(1987, 1, 11),
 *   new Date(1995, 6, 2),
 *   new Date(1990, 0, 1)
 * ])
 * //=> Sun Jul 02 1995 00:00:00
 */
function max(dates) {
  let result;
  dates.forEach(function (dirtyDate) {
    const currentDate = (0, _index.toDate)(dirtyDate);

    if (
      result === undefined ||
      result < currentDate ||
      isNaN(Number(currentDate))
    ) {
      result = currentDate;
    }
  });

  return result || new Date(NaN);
}


/***/ }),
/* 81 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.min = min;
var _index = __webpack_require__(53);

/**
 * @name min
 * @category Common Helpers
 * @summary Returns the earliest of the given dates.
 *
 * @description
 * Returns the earliest of the given dates.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param dates - The dates to compare
 *
 * @returns The earliest of the dates
 *
 * @example
 * // Which of these dates is the earliest?
 * const result = min([
 *   new Date(1989, 6, 10),
 *   new Date(1987, 1, 11),
 *   new Date(1995, 6, 2),
 *   new Date(1990, 0, 1)
 * ])
 * //=> Wed Feb 11 1987 00:00:00
 */
function min(dates) {
  let result;

  dates.forEach((dirtyDate) => {
    const date = (0, _index.toDate)(dirtyDate);
    if (!result || result > date || isNaN(+date)) {
      result = date;
    }
  });

  return result || new Date(NaN);
}


/***/ }),
/* 82 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.closestIndexTo = closestIndexTo;
var _index = __webpack_require__(53);

/**
 * @name closestIndexTo
 * @category Common Helpers
 * @summary Return an index of the closest date from the array comparing to the given date.
 *
 * @description
 * Return an index of the closest date from the array comparing to the given date.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param dateToCompare - The date to compare with
 * @param dates - The array to search
 *
 * @returns An index of the date closest to the given date or undefined if no valid value is given
 *
 * @example
 * // Which date is closer to 6 September 2015?
 * const dateToCompare = new Date(2015, 8, 6)
 * const datesArray = [
 *   new Date(2015, 0, 1),
 *   new Date(2016, 0, 1),
 *   new Date(2017, 0, 1)
 * ]
 * const result = closestIndexTo(dateToCompare, datesArray)
 * //=> 1
 */
function closestIndexTo(dateToCompare, dates) {
  const date = (0, _index.toDate)(dateToCompare);

  if (isNaN(Number(date))) return NaN;

  const timeToCompare = date.getTime();

  let result;
  let minDistance;
  dates.forEach(function (dirtyDate, index) {
    const currentDate = (0, _index.toDate)(dirtyDate);

    if (isNaN(Number(currentDate))) {
      result = NaN;
      minDistance = NaN;
      return;
    }

    const distance = Math.abs(timeToCompare - currentDate.getTime());
    if (result == null || distance < minDistance) {
      result = index;
      minDistance = distance;
    }
  });

  return result;
}


/***/ }),
/* 83 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.closestTo = closestTo;
var _index = __webpack_require__(54);
var _index2 = __webpack_require__(53);

/**
 * @name closestTo
 * @category Common Helpers
 * @summary Return a date from the array closest to the given date.
 *
 * @description
 * Return a date from the array closest to the given date.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param dateToCompare - The date to compare with
 * @param dates - The array to search
 *
 * @returns The date from the array closest to the given date or undefined if no valid value is given
 *
 * @example
 * // Which date is closer to 6 September 2015: 1 January 2000 or 1 January 2030?
 * const dateToCompare = new Date(2015, 8, 6)
 * const result = closestTo(dateToCompare, [
 *   new Date(2000, 0, 1),
 *   new Date(2030, 0, 1)
 * ])
 * //=> Tue Jan 01 2030 00:00:00
 */
function closestTo(dateToCompare, dates) {
  const date = (0, _index2.toDate)(dateToCompare);

  if (isNaN(Number(date))) return (0, _index.constructFrom)(dateToCompare, NaN);

  const timeToCompare = date.getTime();

  let result;
  let minDistance;
  dates.forEach((dirtyDate) => {
    const currentDate = (0, _index2.toDate)(dirtyDate);

    if (isNaN(Number(currentDate))) {
      result = (0, _index.constructFrom)(dateToCompare, NaN);
      minDistance = NaN;
      return;
    }

    const distance = Math.abs(timeToCompare - currentDate.getTime());
    if (result == null || distance < minDistance) {
      result = currentDate;
      minDistance = distance;
    }
  });

  return result;
}


/***/ }),
/* 84 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.compareAsc = compareAsc;
var _index = __webpack_require__(53);

/**
 * @name compareAsc
 * @category Common Helpers
 * @summary Compare the two dates and return -1, 0 or 1.
 *
 * @description
 * Compare the two dates and return 1 if the first date is after the second,
 * -1 if the first date is before the second or 0 if dates are equal.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param dateLeft - The first date to compare
 * @param dateRight - The second date to compare
 *
 * @returns The result of the comparison
 *
 * @example
 * // Compare 11 February 1987 and 10 July 1989:
 * const result = compareAsc(new Date(1987, 1, 11), new Date(1989, 6, 10))
 * //=> -1
 *
 * @example
 * // Sort the array of dates:
 * const result = [
 *   new Date(1995, 6, 2),
 *   new Date(1987, 1, 11),
 *   new Date(1989, 6, 10)
 * ].sort(compareAsc)
 * //=> [
 * //   Wed Feb 11 1987 00:00:00,
 * //   Mon Jul 10 1989 00:00:00,
 * //   Sun Jul 02 1995 00:00:00
 * // ]
 */
function compareAsc(dateLeft, dateRight) {
  const _dateLeft = (0, _index.toDate)(dateLeft);
  const _dateRight = (0, _index.toDate)(dateRight);

  const diff = _dateLeft.getTime() - _dateRight.getTime();

  if (diff < 0) {
    return -1;
  } else if (diff > 0) {
    return 1;
    // Return 0 if diff is 0; return NaN if diff is NaN
  } else {
    return diff;
  }
}


/***/ }),
/* 85 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.compareDesc = compareDesc;
var _index = __webpack_require__(53);

/**
 * @name compareDesc
 * @category Common Helpers
 * @summary Compare the two dates reverse chronologically and return -1, 0 or 1.
 *
 * @description
 * Compare the two dates and return -1 if the first date is after the second,
 * 1 if the first date is before the second or 0 if dates are equal.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param dateLeft - The first date to compare
 * @param dateRight - The second date to compare
 *
 * @returns The result of the comparison
 *
 * @example
 * // Compare 11 February 1987 and 10 July 1989 reverse chronologically:
 * const result = compareDesc(new Date(1987, 1, 11), new Date(1989, 6, 10))
 * //=> 1
 *
 * @example
 * // Sort the array of dates in reverse chronological order:
 * const result = [
 *   new Date(1995, 6, 2),
 *   new Date(1987, 1, 11),
 *   new Date(1989, 6, 10)
 * ].sort(compareDesc)
 * //=> [
 * //   Sun Jul 02 1995 00:00:00,
 * //   Mon Jul 10 1989 00:00:00,
 * //   Wed Feb 11 1987 00:00:00
 * // ]
 */
function compareDesc(dateLeft, dateRight) {
  const _dateLeft = (0, _index.toDate)(dateLeft);
  const _dateRight = (0, _index.toDate)(dateRight);

  const diff = _dateLeft.getTime() - _dateRight.getTime();

  if (diff > 0) {
    return -1;
  } else if (diff < 0) {
    return 1;
    // Return 0 if diff is 0; return NaN if diff is NaN
  } else {
    return diff;
  }
}


/***/ }),
/* 86 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.constructNow = constructNow;
var _index = __webpack_require__(54);

/**
 * @name constructNow
 * @category Generic Helpers
 * @summary Constructs a new current date using the passed value constructor.
 * @pure false
 *
 * @description
 * The function constructs a new current date using the constructor from
 * the reference date. It helps to build generic functions that accept date
 * extensions and use the current date.
 *
 * It defaults to `Date` if the passed reference date is a number or a string.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The reference date to take constructor from
 *
 * @returns Current date initialized using the given date constructor
 *
 * @example
 * import { constructNow, isSameDay } from 'date-fns'
 *
 * function isToday<DateType extends Date>(
 *   date: DateType | number | string,
 * ): boolean {
 *   // If we were to use `new Date()` directly, the function would  behave
 *   // differently in different timezones and return false for the same date.
 *   return isSameDay(date, constructNow(date));
 * }
 */
function constructNow(date) {
  return (0, _index.constructFrom)(date, Date.now());
}


/***/ }),
/* 87 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.daysToWeeks = daysToWeeks;
var _index = __webpack_require__(62);

/**
 * @name daysToWeeks
 * @category Conversion Helpers
 * @summary Convert days to weeks.
 *
 * @description
 * Convert a number of days to a full number of weeks.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param days - The number of days to be converted
 *
 * @returns The number of days converted in weeks
 *
 * @example
 * // Convert 14 days to weeks:
 * const result = daysToWeeks(14)
 * //=> 2
 *
 * @example
 * // It uses trunc rounding:
 * const result = daysToWeeks(13)
 * //=> 1
 */
function daysToWeeks(days) {
  const weeks = days / _index.daysInWeek;
  const result = Math.trunc(weeks);
  // Prevent negative zero
  return result === 0 ? 0 : result;
}


/***/ }),
/* 88 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.differenceInBusinessDays = differenceInBusinessDays;
var _index = __webpack_require__(52);
var _index2 = __webpack_require__(69);
var _index3 = __webpack_require__(89);
var _index4 = __webpack_require__(90);
var _index5 = __webpack_require__(59);
var _index6 = __webpack_require__(53);

/**
 * @name differenceInBusinessDays
 * @category Day Helpers
 * @summary Get the number of business days between the given dates.
 *
 * @description
 * Get the number of business day periods between the given dates.
 * Business days being days that arent in the weekend.
 * Like `differenceInCalendarDays`, the function removes the times from
 * the dates before calculating the difference.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param dateLeft - The later date
 * @param dateRight - The earlier date
 *
 * @returns The number of business days
 *
 * @example
 * // How many business days are between
 * // 10 January 2014 and 20 July 2014?
 * const result = differenceInBusinessDays(
 *   new Date(2014, 6, 20),
 *   new Date(2014, 0, 10)
 * )
 * //=> 136
 *
 * // How many business days are between
 * // 30 November 2021 and 1 November 2021?
 * const result = differenceInBusinessDays(
 *   new Date(2021, 10, 30),
 *   new Date(2021, 10, 1)
 * )
 * //=> 21
 *
 * // How many business days are between
 * // 1 November 2021 and 1 December 2021?
 * const result = differenceInBusinessDays(
 *   new Date(2021, 10, 1),
 *   new Date(2021, 11, 1)
 * )
 * //=> -22
 *
 * // How many business days are between
 * // 1 November 2021 and 1 November 2021 ?
 * const result = differenceInBusinessDays(
 *   new Date(2021, 10, 1),
 *   new Date(2021, 10, 1)
 * )
 * //=> 0
 */
function differenceInBusinessDays(dateLeft, dateRight) {
  const _dateLeft = (0, _index6.toDate)(dateLeft);
  let _dateRight = (0, _index6.toDate)(dateRight);

  if (!(0, _index4.isValid)(_dateLeft) || !(0, _index4.isValid)(_dateRight))
    return NaN;

  const calendarDifference = (0, _index2.differenceInCalendarDays)(
    _dateLeft,
    _dateRight,
  );
  const sign = calendarDifference < 0 ? -1 : 1;

  const weeks = Math.trunc(calendarDifference / 7);

  let result = weeks * 5;
  _dateRight = (0, _index.addDays)(_dateRight, weeks * 7);

  // the loop below will run at most 6 times to account for the remaining days that don't makeup a full week
  while (!(0, _index3.isSameDay)(_dateLeft, _dateRight)) {
    // sign is used to account for both negative and positive differences
    result += (0, _index5.isWeekend)(_dateRight) ? 0 : sign;
    _dateRight = (0, _index.addDays)(_dateRight, sign);
  }

  // Prevent negative zero
  return result === 0 ? 0 : result;
}


/***/ }),
/* 89 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.isSameDay = isSameDay;
var _index = __webpack_require__(70);

/**
 * @name isSameDay
 * @category Day Helpers
 * @summary Are the given dates in the same day (and year and month)?
 *
 * @description
 * Are the given dates in the same day (and year and month)?
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param dateLeft - The first date to check
 * @param dateRight - The second date to check

 * @returns The dates are in the same day (and year and month)
 *
 * @example
 * // Are 4 September 06:00:00 and 4 September 18:00:00 in the same day?
 * const result = isSameDay(new Date(2014, 8, 4, 6, 0), new Date(2014, 8, 4, 18, 0))
 * //=> true
 *
 * @example
 * // Are 4 September and 4 October in the same day?
 * const result = isSameDay(new Date(2014, 8, 4), new Date(2014, 9, 4))
 * //=> false
 *
 * @example
 * // Are 4 September, 2014 and 4 September, 2015 in the same day?
 * const result = isSameDay(new Date(2014, 8, 4), new Date(2015, 8, 4))
 * //=> false
 */
function isSameDay(dateLeft, dateRight) {
  const dateLeftStartOfDay = (0, _index.startOfDay)(dateLeft);
  const dateRightStartOfDay = (0, _index.startOfDay)(dateRight);

  return +dateLeftStartOfDay === +dateRightStartOfDay;
}


/***/ }),
/* 90 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.isValid = isValid;
var _index = __webpack_require__(91);
var _index2 = __webpack_require__(53);

/**
 * @name isValid
 * @category Common Helpers
 * @summary Is the given date valid?
 *
 * @description
 * Returns false if argument is Invalid Date and true otherwise.
 * Argument is converted to Date using `toDate`. See [toDate](https://date-fns.org/docs/toDate)
 * Invalid Date is a Date, whose time value is NaN.
 *
 * Time value of Date: http://es5.github.io/#x15.9.1.1
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The date to check
 *
 * @returns The date is valid
 *
 * @example
 * // For the valid date:
 * const result = isValid(new Date(2014, 1, 31))
 * //=> true
 *
 * @example
 * // For the value, convertable into a date:
 * const result = isValid(1393804800000)
 * //=> true
 *
 * @example
 * // For the invalid date:
 * const result = isValid(new Date(''))
 * //=> false
 */
function isValid(date) {
  if (!(0, _index.isDate)(date) && typeof date !== "number") {
    return false;
  }
  const _date = (0, _index2.toDate)(date);
  return !isNaN(Number(_date));
}


/***/ }),
/* 91 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

exports.isDate = isDate; /**
 * @name isDate
 * @category Common Helpers
 * @summary Is the given value a date?
 *
 * @description
 * Returns true if the given value is an instance of Date. The function works for dates transferred across iframes.
 *
 * @param value - The value to check
 *
 * @returns True if the given value is a date
 *
 * @example
 * // For a valid date:
 * const result = isDate(new Date())
 * //=> true
 *
 * @example
 * // For an invalid date:
 * const result = isDate(new Date(NaN))
 * //=> true
 *
 * @example
 * // For some value:
 * const result = isDate('2014-02-31')
 * //=> false
 *
 * @example
 * // For an object:
 * const result = isDate({})
 * //=> false
 */
function isDate(value) {
  return (
    value instanceof Date ||
    (typeof value === "object" &&
      Object.prototype.toString.call(value) === "[object Date]")
  );
}


/***/ }),
/* 92 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.differenceInCalendarISOWeekYears = differenceInCalendarISOWeekYears;
var _index = __webpack_require__(64);

/**
 * @name differenceInCalendarISOWeekYears
 * @category ISO Week-Numbering Year Helpers
 * @summary Get the number of calendar ISO week-numbering years between the given dates.
 *
 * @description
 * Get the number of calendar ISO week-numbering years between the given dates.
 *
 * ISO week-numbering year: http://en.wikipedia.org/wiki/ISO_week_date
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param dateLeft - The later date
 * @param dateRight - The earlier date
 *
 * @returns The number of calendar ISO week-numbering years
 *
 * @example
 * // How many calendar ISO week-numbering years are 1 January 2010 and 1 January 2012?
 * const result = differenceInCalendarISOWeekYears(
 *   new Date(2012, 0, 1),
 *   new Date(2010, 0, 1)
 * )
 * //=> 2
 */
function differenceInCalendarISOWeekYears(dateLeft, dateRight) {
  return (
    (0, _index.getISOWeekYear)(dateLeft) - (0, _index.getISOWeekYear)(dateRight)
  );
}


/***/ }),
/* 93 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.differenceInCalendarISOWeeks = differenceInCalendarISOWeeks;
var _index = __webpack_require__(62);
var _index2 = __webpack_require__(65);
var _index3 = __webpack_require__(71);

/**
 * @name differenceInCalendarISOWeeks
 * @category ISO Week Helpers
 * @summary Get the number of calendar ISO weeks between the given dates.
 *
 * @description
 * Get the number of calendar ISO weeks between the given dates.
 *
 * ISO week-numbering year: http://en.wikipedia.org/wiki/ISO_week_date
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param dateLeft - The later date
 * @param dateRight - The earlier date
 *
 * @returns The number of calendar ISO weeks
 *
 * @example
 * // How many calendar ISO weeks are between 6 July 2014 and 21 July 2014?
 * const result = differenceInCalendarISOWeeks(
 *   new Date(2014, 6, 21),
 *   new Date(2014, 6, 6)
 * )
 * //=> 3
 */
function differenceInCalendarISOWeeks(dateLeft, dateRight) {
  const startOfISOWeekLeft = (0, _index2.startOfISOWeek)(dateLeft);
  const startOfISOWeekRight = (0, _index2.startOfISOWeek)(dateRight);

  const timestampLeft =
    +startOfISOWeekLeft -
    (0, _index3.getTimezoneOffsetInMilliseconds)(startOfISOWeekLeft);
  const timestampRight =
    +startOfISOWeekRight -
    (0, _index3.getTimezoneOffsetInMilliseconds)(startOfISOWeekRight);

  // Round the number of weeks to the nearest integer because the number of
  // milliseconds in a week is not constant (e.g. it's different in the week of
  // the daylight saving time clock shift).
  return Math.round(
    (timestampLeft - timestampRight) / _index.millisecondsInWeek,
  );
}


/***/ }),
/* 94 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.differenceInCalendarMonths = differenceInCalendarMonths;
var _index = __webpack_require__(53);

/**
 * @name differenceInCalendarMonths
 * @category Month Helpers
 * @summary Get the number of calendar months between the given dates.
 *
 * @description
 * Get the number of calendar months between the given dates.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param dateLeft - The later date
 * @param dateRight - The earlier date
 *
 * @returns The number of calendar months
 *
 * @example
 * // How many calendar months are between 31 January 2014 and 1 September 2014?
 * const result = differenceInCalendarMonths(
 *   new Date(2014, 8, 1),
 *   new Date(2014, 0, 31)
 * )
 * //=> 8
 */
function differenceInCalendarMonths(dateLeft, dateRight) {
  const _dateLeft = (0, _index.toDate)(dateLeft);
  const _dateRight = (0, _index.toDate)(dateRight);

  const yearDiff = _dateLeft.getFullYear() - _dateRight.getFullYear();
  const monthDiff = _dateLeft.getMonth() - _dateRight.getMonth();

  return yearDiff * 12 + monthDiff;
}


/***/ }),
/* 95 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.differenceInCalendarQuarters = differenceInCalendarQuarters;
var _index = __webpack_require__(96);
var _index2 = __webpack_require__(53);

/**
 * @name differenceInCalendarQuarters
 * @category Quarter Helpers
 * @summary Get the number of calendar quarters between the given dates.
 *
 * @description
 * Get the number of calendar quarters between the given dates.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param dateLeft - The later date
 * @param dateRight - The earlier date

 * @returns The number of calendar quarters
 *
 * @example
 * // How many calendar quarters are between 31 December 2013 and 2 July 2014?
 * const result = differenceInCalendarQuarters(
 *   new Date(2014, 6, 2),
 *   new Date(2013, 11, 31)
 * )
 * //=> 3
 */
function differenceInCalendarQuarters(dateLeft, dateRight) {
  const _dateLeft = (0, _index2.toDate)(dateLeft);
  const _dateRight = (0, _index2.toDate)(dateRight);

  const yearDiff = _dateLeft.getFullYear() - _dateRight.getFullYear();
  const quarterDiff =
    (0, _index.getQuarter)(_dateLeft) - (0, _index.getQuarter)(_dateRight);

  return yearDiff * 4 + quarterDiff;
}


/***/ }),
/* 96 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.getQuarter = getQuarter;
var _index = __webpack_require__(53);

/**
 * @name getQuarter
 * @category Quarter Helpers
 * @summary Get the year quarter of the given date.
 *
 * @description
 * Get the year quarter of the given date.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The given date
 *
 * @returns The quarter
 *
 * @example
 * // Which quarter is 2 July 2014?
 * const result = getQuarter(new Date(2014, 6, 2))
 * //=> 3
 */
function getQuarter(date) {
  const _date = (0, _index.toDate)(date);
  const quarter = Math.trunc(_date.getMonth() / 3) + 1;
  return quarter;
}


/***/ }),
/* 97 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.differenceInCalendarWeeks = differenceInCalendarWeeks;
var _index = __webpack_require__(62);
var _index2 = __webpack_require__(66);

var _index3 = __webpack_require__(71);

/**
 * The {@link differenceInCalendarWeeks} function options.
 */

/**
 * @name differenceInCalendarWeeks
 * @category Week Helpers
 * @summary Get the number of calendar weeks between the given dates.
 *
 * @description
 * Get the number of calendar weeks between the given dates.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param dateLeft - The later date
 * @param dateRight - The earlier date
 * @param options - An object with options.
 *
 * @returns The number of calendar weeks
 *
 * @example
 * // How many calendar weeks are between 5 July 2014 and 20 July 2014?
 * const result = differenceInCalendarWeeks(
 *   new Date(2014, 6, 20),
 *   new Date(2014, 6, 5)
 * )
 * //=> 3
 *
 * @example
 * // If the week starts on Monday,
 * // how many calendar weeks are between 5 July 2014 and 20 July 2014?
 * const result = differenceInCalendarWeeks(
 *   new Date(2014, 6, 20),
 *   new Date(2014, 6, 5),
 *   { weekStartsOn: 1 }
 * )
 * //=> 2
 */
function differenceInCalendarWeeks(dateLeft, dateRight, options) {
  const startOfWeekLeft = (0, _index2.startOfWeek)(dateLeft, options);
  const startOfWeekRight = (0, _index2.startOfWeek)(dateRight, options);

  const timestampLeft =
    +startOfWeekLeft -
    (0, _index3.getTimezoneOffsetInMilliseconds)(startOfWeekLeft);
  const timestampRight =
    +startOfWeekRight -
    (0, _index3.getTimezoneOffsetInMilliseconds)(startOfWeekRight);

  // Round the number of days to the nearest integer because the number of
  // milliseconds in a days is not constant (e.g. it's different in the week of
  // the daylight saving time clock shift).
  return Math.round(
    (timestampLeft - timestampRight) / _index.millisecondsInWeek,
  );
}


/***/ }),
/* 98 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.differenceInCalendarYears = differenceInCalendarYears;
var _index = __webpack_require__(53);

/**
 * @name differenceInCalendarYears
 * @category Year Helpers
 * @summary Get the number of calendar years between the given dates.
 *
 * @description
 * Get the number of calendar years between the given dates.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param dateLeft - The later date
 * @param dateRight - The earlier date

 * @returns The number of calendar years
 *
 * @example
 * // How many calendar years are between 31 December 2013 and 11 February 2015?
 * const result = differenceInCalendarYears(
 *   new Date(2015, 1, 11),
 *   new Date(2013, 11, 31)
 * )
 * //=> 2
 */
function differenceInCalendarYears(dateLeft, dateRight) {
  const _dateLeft = (0, _index.toDate)(dateLeft);
  const _dateRight = (0, _index.toDate)(dateRight);

  return _dateLeft.getFullYear() - _dateRight.getFullYear();
}


/***/ }),
/* 99 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.differenceInDays = differenceInDays;
var _index = __webpack_require__(69);
var _index2 = __webpack_require__(53);

/**
 * @name differenceInDays
 * @category Day Helpers
 * @summary Get the number of full days between the given dates.
 *
 * @description
 * Get the number of full day periods between two dates. Fractional days are
 * truncated towards zero.
 *
 * One "full day" is the distance between a local time in one day to the same
 * local time on the next or previous day. A full day can sometimes be less than
 * or more than 24 hours if a daylight savings change happens between two dates.
 *
 * To ignore DST and only measure exact 24-hour periods, use this instead:
 * `Math.trunc(differenceInHours(dateLeft, dateRight)/24)|0`.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param dateLeft - The later date
 * @param dateRight - The earlier date
 *
 * @returns The number of full days according to the local timezone
 *
 * @example
 * // How many full days are between
 * // 2 July 2011 23:00:00 and 2 July 2012 00:00:00?
 * const result = differenceInDays(
 *   new Date(2012, 6, 2, 0, 0),
 *   new Date(2011, 6, 2, 23, 0)
 * )
 * //=> 365
 *
 * @example
 * // How many full days are between
 * // 2 July 2011 23:59:00 and 3 July 2011 00:01:00?
 * const result = differenceInDays(
 *   new Date(2011, 6, 3, 0, 1),
 *   new Date(2011, 6, 2, 23, 59)
 * )
 * //=> 0
 *
 * @example
 * // How many full days are between
 * // 1 March 2020 0:00 and 1 June 2020 0:00 ?
 * // Note: because local time is used, the
 * // result will always be 92 days, even in
 * // time zones where DST starts and the
 * // period has only 92*24-1 hours.
 * const result = differenceInDays(
 *   new Date(2020, 5, 1),
 *   new Date(2020, 2, 1)
 * )
 * //=> 92
 */
function differenceInDays(dateLeft, dateRight) {
  const _dateLeft = (0, _index2.toDate)(dateLeft);
  const _dateRight = (0, _index2.toDate)(dateRight);

  const sign = compareLocalAsc(_dateLeft, _dateRight);
  const difference = Math.abs(
    (0, _index.differenceInCalendarDays)(_dateLeft, _dateRight),
  );

  _dateLeft.setDate(_dateLeft.getDate() - sign * difference);

  // Math.abs(diff in full days - diff in calendar days) === 1 if last calendar day is not full
  // If so, result must be decreased by 1 in absolute value
  const isLastDayNotFull = Number(
    compareLocalAsc(_dateLeft, _dateRight) === -sign,
  );
  const result = sign * (difference - isLastDayNotFull);
  // Prevent negative zero
  return result === 0 ? 0 : result;
}

// Like `compareAsc` but uses local time not UTC, which is needed
// for accurate equality comparisons of UTC timestamps that end up
// having the same representation in local time, e.g. one hour before
// DST ends vs. the instant that DST ends.
function compareLocalAsc(dateLeft, dateRight) {
  const diff =
    dateLeft.getFullYear() - dateRight.getFullYear() ||
    dateLeft.getMonth() - dateRight.getMonth() ||
    dateLeft.getDate() - dateRight.getDate() ||
    dateLeft.getHours() - dateRight.getHours() ||
    dateLeft.getMinutes() - dateRight.getMinutes() ||
    dateLeft.getSeconds() - dateRight.getSeconds() ||
    dateLeft.getMilliseconds() - dateRight.getMilliseconds();

  if (diff < 0) {
    return -1;
  } else if (diff > 0) {
    return 1;
    // Return 0 if diff is 0; return NaN if diff is NaN
  } else {
    return diff;
  }
}


/***/ }),
/* 100 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.differenceInHours = differenceInHours;
var _index = __webpack_require__(101);
var _index2 = __webpack_require__(62);
var _index3 = __webpack_require__(102);

/**
 * The {@link differenceInHours} function options.
 */

/**
 * @name differenceInHours
 * @category Hour Helpers
 * @summary Get the number of hours between the given dates.
 *
 * @description
 * Get the number of hours between the given dates.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param dateLeft - The later date
 * @param dateRight - The earlier date
 * @param options - An object with options.
 *
 * @returns The number of hours
 *
 * @example
 * // How many hours are between 2 July 2014 06:50:00 and 2 July 2014 19:00:00?
 * const result = differenceInHours(
 *   new Date(2014, 6, 2, 19, 0),
 *   new Date(2014, 6, 2, 6, 50)
 * )
 * //=> 12
 */
function differenceInHours(dateLeft, dateRight, options) {
  const diff =
    (0, _index3.differenceInMilliseconds)(dateLeft, dateRight) /
    _index2.millisecondsInHour;
  return (0, _index.getRoundingMethod)(options?.roundingMethod)(diff);
}


/***/ }),
/* 101 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

exports.getRoundingMethod = getRoundingMethod;

function getRoundingMethod(method) {
  return (number) => {
    const round = method ? Math[method] : Math.trunc;
    const result = round(number);
    // Prevent negative zero
    return result === 0 ? 0 : result;
  };
}


/***/ }),
/* 102 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.differenceInMilliseconds = differenceInMilliseconds;
var _index = __webpack_require__(53);

/**
 * @name differenceInMilliseconds
 * @category Millisecond Helpers
 * @summary Get the number of milliseconds between the given dates.
 *
 * @description
 * Get the number of milliseconds between the given dates.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param dateLeft - The later date
 * @param dateRight - The earlier date
 *
 * @returns The number of milliseconds
 *
 * @example
 * // How many milliseconds are between
 * // 2 July 2014 12:30:20.600 and 2 July 2014 12:30:21.700?
 * const result = differenceInMilliseconds(
 *   new Date(2014, 6, 2, 12, 30, 21, 700),
 *   new Date(2014, 6, 2, 12, 30, 20, 600)
 * )
 * //=> 1100
 */
function differenceInMilliseconds(dateLeft, dateRight) {
  return +(0, _index.toDate)(dateLeft) - +(0, _index.toDate)(dateRight);
}


/***/ }),
/* 103 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.differenceInISOWeekYears = differenceInISOWeekYears;
var _index = __webpack_require__(84);
var _index2 = __webpack_require__(92);
var _index3 = __webpack_require__(104);
var _index4 = __webpack_require__(53);

/**
 * @name differenceInISOWeekYears
 * @category ISO Week-Numbering Year Helpers
 * @summary Get the number of full ISO week-numbering years between the given dates.
 *
 * @description
 * Get the number of full ISO week-numbering years between the given dates.
 *
 * ISO week-numbering year: http://en.wikipedia.org/wiki/ISO_week_date
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param dateLeft - The later date
 * @param dateRight - The earlier date
 *
 * @returns The number of full ISO week-numbering years
 *
 * @example
 * // How many full ISO week-numbering years are between 1 January 2010 and 1 January 2012?
 * const result = differenceInISOWeekYears(
 *   new Date(2012, 0, 1),
 *   new Date(2010, 0, 1)
 * )
 * //=> 1
 */
function differenceInISOWeekYears(dateLeft, dateRight) {
  let _dateLeft = (0, _index4.toDate)(dateLeft);
  const _dateRight = (0, _index4.toDate)(dateRight);

  const sign = (0, _index.compareAsc)(_dateLeft, _dateRight);
  const difference = Math.abs(
    (0, _index2.differenceInCalendarISOWeekYears)(_dateLeft, _dateRight),
  );
  _dateLeft = (0, _index3.subISOWeekYears)(_dateLeft, sign * difference);

  // Math.abs(diff in full ISO years - diff in calendar ISO years) === 1
  // if last calendar ISO year is not full
  // If so, result must be decreased by 1 in absolute value
  const isLastISOWeekYearNotFull = Number(
    (0, _index.compareAsc)(_dateLeft, _dateRight) === -sign,
  );
  const result = sign * (difference - isLastISOWeekYearNotFull);
  // Prevent negative zero
  return result === 0 ? 0 : result;
}


/***/ }),
/* 104 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.subISOWeekYears = subISOWeekYears;
var _index = __webpack_require__(63);

/**
 * @name subISOWeekYears
 * @category ISO Week-Numbering Year Helpers
 * @summary Subtract the specified number of ISO week-numbering years from the given date.
 *
 * @description
 * Subtract the specified number of ISO week-numbering years from the given date.
 *
 * ISO week-numbering year: http://en.wikipedia.org/wiki/ISO_week_date
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The date to be changed
 * @param amount - The amount of ISO week-numbering years to be subtracted.
 *
 * @returns The new date with the ISO week-numbering years subtracted
 *
 * @example
 * // Subtract 5 ISO week-numbering years from 1 September 2014:
 * const result = subISOWeekYears(new Date(2014, 8, 1), 5)
 * //=> Mon Aug 31 2009 00:00:00
 */
function subISOWeekYears(date, amount) {
  return (0, _index.addISOWeekYears)(date, -amount);
}


/***/ }),
/* 105 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.differenceInMinutes = differenceInMinutes;
var _index = __webpack_require__(101);
var _index2 = __webpack_require__(62);
var _index3 = __webpack_require__(102);

/**
 * The {@link differenceInMinutes} function options.
 */

/**
 * @name differenceInMinutes
 * @category Minute Helpers
 * @summary Get the number of minutes between the given dates.
 *
 * @description
 * Get the signed number of full (rounded towards 0) minutes between the given dates.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param dateLeft - The later date
 * @param dateRight - The earlier date
 * @param options - An object with options.
 *
 * @returns The number of minutes
 *
 * @example
 * // How many minutes are between 2 July 2014 12:07:59 and 2 July 2014 12:20:00?
 * const result = differenceInMinutes(
 *   new Date(2014, 6, 2, 12, 20, 0),
 *   new Date(2014, 6, 2, 12, 7, 59)
 * )
 * //=> 12
 *
 * @example
 * // How many minutes are between 10:01:59 and 10:00:00
 * const result = differenceInMinutes(
 *   new Date(2000, 0, 1, 10, 0, 0),
 *   new Date(2000, 0, 1, 10, 1, 59)
 * )
 * //=> -1
 */
function differenceInMinutes(dateLeft, dateRight, options) {
  const diff =
    (0, _index3.differenceInMilliseconds)(dateLeft, dateRight) /
    _index2.millisecondsInMinute;
  return (0, _index.getRoundingMethod)(options?.roundingMethod)(diff);
}


/***/ }),
/* 106 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.differenceInMonths = differenceInMonths;
var _index = __webpack_require__(84);
var _index2 = __webpack_require__(94);
var _index3 = __webpack_require__(107);
var _index4 = __webpack_require__(53);

/**
 * @name differenceInMonths
 * @category Month Helpers
 * @summary Get the number of full months between the given dates.
 *
 * @description
 * Get the number of full months between the given dates using trunc as a default rounding method.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param dateLeft - The later date
 * @param dateRight - The earlier date
 *
 * @returns The number of full months
 *
 * @example
 * // How many full months are between 31 January 2014 and 1 September 2014?
 * const result = differenceInMonths(new Date(2014, 8, 1), new Date(2014, 0, 31))
 * //=> 7
 */
function differenceInMonths(dateLeft, dateRight) {
  const _dateLeft = (0, _index4.toDate)(dateLeft);
  const _dateRight = (0, _index4.toDate)(dateRight);

  const sign = (0, _index.compareAsc)(_dateLeft, _dateRight);
  const difference = Math.abs(
    (0, _index2.differenceInCalendarMonths)(_dateLeft, _dateRight),
  );
  let result;

  // Check for the difference of less than month
  if (difference < 1) {
    result = 0;
  } else {
    if (_dateLeft.getMonth() === 1 && _dateLeft.getDate() > 27) {
      // This will check if the date is end of Feb and assign a higher end of month date
      // to compare it with Jan
      _dateLeft.setDate(30);
    }

    _dateLeft.setMonth(_dateLeft.getMonth() - sign * difference);

    // Math.abs(diff in full months - diff in calendar months) === 1 if last calendar month is not full
    // If so, result must be decreased by 1 in absolute value
    let isLastMonthNotFull =
      (0, _index.compareAsc)(_dateLeft, _dateRight) === -sign;

    // Check for cases of one full calendar month
    if (
      (0, _index3.isLastDayOfMonth)((0, _index4.toDate)(dateLeft)) &&
      difference === 1 &&
      (0, _index.compareAsc)(dateLeft, _dateRight) === 1
    ) {
      isLastMonthNotFull = false;
    }

    result = sign * (difference - Number(isLastMonthNotFull));
  }

  // Prevent negative zero
  return result === 0 ? 0 : result;
}


/***/ }),
/* 107 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.isLastDayOfMonth = isLastDayOfMonth;
var _index = __webpack_require__(108);
var _index2 = __webpack_require__(109);
var _index3 = __webpack_require__(53);

/**
 * @name isLastDayOfMonth
 * @category Month Helpers
 * @summary Is the given date the last day of a month?
 *
 * @description
 * Is the given date the last day of a month?
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The date to check

 * @returns The date is the last day of a month
 *
 * @example
 * // Is 28 February 2014 the last day of a month?
 * const result = isLastDayOfMonth(new Date(2014, 1, 28))
 * //=> true
 */
function isLastDayOfMonth(date) {
  const _date = (0, _index3.toDate)(date);
  return +(0, _index.endOfDay)(_date) === +(0, _index2.endOfMonth)(_date);
}


/***/ }),
/* 108 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.endOfDay = endOfDay;
var _index = __webpack_require__(53);

/**
 * @name endOfDay
 * @category Day Helpers
 * @summary Return the end of a day for the given date.
 *
 * @description
 * Return the end of a day for the given date.
 * The result will be in the local timezone.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The original date
 *
 * @returns The end of a day
 *
 * @example
 * // The end of a day for 2 September 2014 11:55:00:
 * const result = endOfDay(new Date(2014, 8, 2, 11, 55, 0))
 * //=> Tue Sep 02 2014 23:59:59.999
 */
function endOfDay(date) {
  const _date = (0, _index.toDate)(date);
  _date.setHours(23, 59, 59, 999);
  return _date;
}


/***/ }),
/* 109 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.endOfMonth = endOfMonth;
var _index = __webpack_require__(53);

/**
 * @name endOfMonth
 * @category Month Helpers
 * @summary Return the end of a month for the given date.
 *
 * @description
 * Return the end of a month for the given date.
 * The result will be in the local timezone.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The original date
 *
 * @returns The end of a month
 *
 * @example
 * // The end of a month for 2 September 2014 11:55:00:
 * const result = endOfMonth(new Date(2014, 8, 2, 11, 55, 0))
 * //=> Tue Sep 30 2014 23:59:59.999
 */
function endOfMonth(date) {
  const _date = (0, _index.toDate)(date);
  const month = _date.getMonth();
  _date.setFullYear(_date.getFullYear(), month + 1, 0);
  _date.setHours(23, 59, 59, 999);
  return _date;
}


/***/ }),
/* 110 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.differenceInQuarters = differenceInQuarters;
var _index = __webpack_require__(101);
var _index2 = __webpack_require__(106);

/**
 * The {@link differenceInQuarters} function options.
 */

/**
 * @name differenceInQuarters
 * @category Quarter Helpers
 * @summary Get the number of quarters between the given dates.
 *
 * @description
 * Get the number of quarters between the given dates.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param dateLeft - The later date
 * @param dateRight - The earlier date
 * @param options - An object with options.
 *
 * @returns The number of full quarters
 *
 * @example
 * // How many full quarters are between 31 December 2013 and 2 July 2014?
 * const result = differenceInQuarters(new Date(2014, 6, 2), new Date(2013, 11, 31))
 * //=> 2
 */
function differenceInQuarters(dateLeft, dateRight, options) {
  const diff = (0, _index2.differenceInMonths)(dateLeft, dateRight) / 3;
  return (0, _index.getRoundingMethod)(options?.roundingMethod)(diff);
}


/***/ }),
/* 111 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.differenceInSeconds = differenceInSeconds;
var _index = __webpack_require__(101);
var _index2 = __webpack_require__(102);

/**
 * The {@link differenceInSeconds} function options.
 */

/**
 * @name differenceInSeconds
 * @category Second Helpers
 * @summary Get the number of seconds between the given dates.
 *
 * @description
 * Get the number of seconds between the given dates.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param dateLeft - The later date
 * @param dateRight - The earlier date
 * @param options - An object with options.
 *
 * @returns The number of seconds
 *
 * @example
 * // How many seconds are between
 * // 2 July 2014 12:30:07.999 and 2 July 2014 12:30:20.000?
 * const result = differenceInSeconds(
 *   new Date(2014, 6, 2, 12, 30, 20, 0),
 *   new Date(2014, 6, 2, 12, 30, 7, 999)
 * )
 * //=> 12
 */
function differenceInSeconds(dateLeft, dateRight, options) {
  const diff =
    (0, _index2.differenceInMilliseconds)(dateLeft, dateRight) / 1000;
  return (0, _index.getRoundingMethod)(options?.roundingMethod)(diff);
}


/***/ }),
/* 112 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.differenceInWeeks = differenceInWeeks;
var _index = __webpack_require__(101);
var _index2 = __webpack_require__(99);

/**
 * The {@link differenceInWeeks} function options.
 */

/**
 * @name differenceInWeeks
 * @category Week Helpers
 * @summary Get the number of full weeks between the given dates.
 *
 * @description
 * Get the number of full weeks between two dates. Fractional weeks are
 * truncated towards zero by default.
 *
 * One "full week" is the distance between a local time in one day to the same
 * local time 7 days earlier or later. A full week can sometimes be less than
 * or more than 7*24 hours if a daylight savings change happens between two dates.
 *
 * To ignore DST and only measure exact 7*24-hour periods, use this instead:
 * `Math.trunc(differenceInHours(dateLeft, dateRight)/(7*24))|0`.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param dateLeft - The later date
 * @param dateRight - The earlier date
 * @param options - An object with options
 *
 * @returns The number of full weeks
 *
 * @example
 * // How many full weeks are between 5 July 2014 and 20 July 2014?
 * const result = differenceInWeeks(new Date(2014, 6, 20), new Date(2014, 6, 5))
 * //=> 2
 *
 * @example
 * // How many full weeks are between
 * // 1 March 2020 0:00 and 6 June 2020 0:00 ?
 * // Note: because local time is used, the
 * // result will always be 8 weeks (54 days),
 * // even if DST starts and the period has
 * // only 54*24-1 hours.
 * const result = differenceInWeeks(
 *   new Date(2020, 5, 1),
 *   new Date(2020, 2, 6)
 * )
 * //=> 8
 */
function differenceInWeeks(dateLeft, dateRight, options) {
  const diff = (0, _index2.differenceInDays)(dateLeft, dateRight) / 7;
  return (0, _index.getRoundingMethod)(options?.roundingMethod)(diff);
}


/***/ }),
/* 113 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.differenceInYears = differenceInYears;
var _index = __webpack_require__(84);
var _index2 = __webpack_require__(98);
var _index3 = __webpack_require__(53);

/**
 * @name differenceInYears
 * @category Year Helpers
 * @summary Get the number of full years between the given dates.
 *
 * @description
 * Get the number of full years between the given dates.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param dateLeft - The later date
 * @param dateRight - The earlier date
 *
 * @returns The number of full years
 *
 * @example
 * // How many full years are between 31 December 2013 and 11 February 2015?
 * const result = differenceInYears(new Date(2015, 1, 11), new Date(2013, 11, 31))
 * //=> 1
 */
function differenceInYears(dateLeft, dateRight) {
  const _dateLeft = (0, _index3.toDate)(dateLeft);
  const _dateRight = (0, _index3.toDate)(dateRight);

  const sign = (0, _index.compareAsc)(_dateLeft, _dateRight);
  const difference = Math.abs(
    (0, _index2.differenceInCalendarYears)(_dateLeft, _dateRight),
  );

  // Set both dates to a valid leap year for accurate comparison when dealing
  // with leap days
  _dateLeft.setFullYear(1584);
  _dateRight.setFullYear(1584);

  // Math.abs(diff in full years - diff in calendar years) === 1 if last calendar year is not full
  // If so, result must be decreased by 1 in absolute value
  const isLastYearNotFull =
    (0, _index.compareAsc)(_dateLeft, _dateRight) === -sign;
  const result = sign * (difference - +isLastYearNotFull);

  // Prevent negative zero
  return result === 0 ? 0 : result;
}


/***/ }),
/* 114 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.eachDayOfInterval = eachDayOfInterval;
var _index = __webpack_require__(53);

/**
 * The {@link eachDayOfInterval} function options.
 */

/**
 * @name eachDayOfInterval
 * @category Interval Helpers
 * @summary Return the array of dates within the specified time interval.
 *
 * @description
 * Return the array of dates within the specified time interval.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param interval - The interval.
 * @param options - An object with options.
 *
 * @returns The array with starts of days from the day of the interval start to the day of the interval end
 *
 * @example
 * // Each day between 6 October 2014 and 10 October 2014:
 * const result = eachDayOfInterval({
 *   start: new Date(2014, 9, 6),
 *   end: new Date(2014, 9, 10)
 * })
 * //=> [
 * //   Mon Oct 06 2014 00:00:00,
 * //   Tue Oct 07 2014 00:00:00,
 * //   Wed Oct 08 2014 00:00:00,
 * //   Thu Oct 09 2014 00:00:00,
 * //   Fri Oct 10 2014 00:00:00
 * // ]
 */
function eachDayOfInterval(interval, options) {
  const startDate = (0, _index.toDate)(interval.start);
  const endDate = (0, _index.toDate)(interval.end);

  let reversed = +startDate > +endDate;
  const endTime = reversed ? +startDate : +endDate;
  const currentDate = reversed ? endDate : startDate;
  currentDate.setHours(0, 0, 0, 0);

  let step = options?.step ?? 1;
  if (!step) return [];
  if (step < 0) {
    step = -step;
    reversed = !reversed;
  }

  const dates = [];

  while (+currentDate <= endTime) {
    dates.push((0, _index.toDate)(currentDate));
    currentDate.setDate(currentDate.getDate() + step);
    currentDate.setHours(0, 0, 0, 0);
  }

  return reversed ? dates.reverse() : dates;
}


/***/ }),
/* 115 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.eachHourOfInterval = eachHourOfInterval;
var _index = __webpack_require__(60);
var _index2 = __webpack_require__(53);

/**
 * The {@link eachHourOfInterval} function options.
 */

/**
 * @name eachHourOfInterval
 * @category Interval Helpers
 * @summary Return the array of hours within the specified time interval.
 *
 * @description
 * Return the array of hours within the specified time interval.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param interval - The interval.
 * @param options - An object with options.
 *
 * @returns The array with starts of hours from the hour of the interval start to the hour of the interval end
 *
 * @example
 * // Each hour between 6 October 2014, 12:00 and 6 October 2014, 15:00
 * const result = eachHourOfInterval({
 *   start: new Date(2014, 9, 6, 12),
 *   end: new Date(2014, 9, 6, 15)
 * })
 * //=> [
 * //   Mon Oct 06 2014 12:00:00,
 * //   Mon Oct 06 2014 13:00:00,
 * //   Mon Oct 06 2014 14:00:00,
 * //   Mon Oct 06 2014 15:00:00
 * // ]
 */
function eachHourOfInterval(interval, options) {
  const startDate = (0, _index2.toDate)(interval.start);
  const endDate = (0, _index2.toDate)(interval.end);

  let reversed = +startDate > +endDate;
  const endTime = reversed ? +startDate : +endDate;
  let currentDate = reversed ? endDate : startDate;
  currentDate.setMinutes(0, 0, 0);

  let step = options?.step ?? 1;
  if (!step) return [];
  if (step < 0) {
    step = -step;
    reversed = !reversed;
  }

  const dates = [];

  while (+currentDate <= endTime) {
    dates.push((0, _index2.toDate)(currentDate));
    currentDate = (0, _index.addHours)(currentDate, step);
  }

  return reversed ? dates.reverse() : dates;
}


/***/ }),
/* 116 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.eachMinuteOfInterval = eachMinuteOfInterval;
var _index = __webpack_require__(73);
var _index2 = __webpack_require__(117);
var _index3 = __webpack_require__(53);

/**
 * The {@link eachMinuteOfInterval} function options.
 */

/**
 * @name eachMinuteOfInterval
 * @category Interval Helpers
 * @summary Return the array of minutes within the specified time interval.
 *
 * @description
 * Returns the array of minutes within the specified time interval.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param interval - The interval.
 * @param options - An object with options.
 *
 * @returns The array with starts of minutes from the minute of the interval start to the minute of the interval end
 *
 * @example
 * // Each minute between 14 October 2020, 13:00 and 14 October 2020, 13:03
 * const result = eachMinuteOfInterval({
 *   start: new Date(2014, 9, 14, 13),
 *   end: new Date(2014, 9, 14, 13, 3)
 * })
 * //=> [
 * //   Wed Oct 14 2014 13:00:00,
 * //   Wed Oct 14 2014 13:01:00,
 * //   Wed Oct 14 2014 13:02:00,
 * //   Wed Oct 14 2014 13:03:00
 * // ]
 */
function eachMinuteOfInterval(interval, options) {
  const startDate = (0, _index2.startOfMinute)(
    (0, _index3.toDate)(interval.start),
  );
  const endDate = (0, _index3.toDate)(interval.end);

  let reversed = +startDate > +endDate;
  const endTime = reversed ? +startDate : +endDate;
  let currentDate = reversed ? endDate : startDate;

  let step = options?.step ?? 1;
  if (!step) return [];
  if (step < 0) {
    step = -step;
    reversed = !reversed;
  }

  const dates = [];

  while (+currentDate <= endTime) {
    dates.push((0, _index3.toDate)(currentDate));
    currentDate = (0, _index.addMinutes)(currentDate, step);
  }

  return reversed ? dates.reverse() : dates;
}


/***/ }),
/* 117 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.startOfMinute = startOfMinute;
var _index = __webpack_require__(53);

/**
 * @name startOfMinute
 * @category Minute Helpers
 * @summary Return the start of a minute for the given date.
 *
 * @description
 * Return the start of a minute for the given date.
 * The result will be in the local timezone.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The original date
 *
 * @returns The start of a minute
 *
 * @example
 * // The start of a minute for 1 December 2014 22:15:45.400:
 * const result = startOfMinute(new Date(2014, 11, 1, 22, 15, 45, 400))
 * //=> Mon Dec 01 2014 22:15:00
 */
function startOfMinute(date) {
  const _date = (0, _index.toDate)(date);
  _date.setSeconds(0, 0);
  return _date;
}


/***/ }),
/* 118 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.eachMonthOfInterval = eachMonthOfInterval;
var _index = __webpack_require__(53);

/**
 * The {@link eachMonthOfInterval} function options.
 */

/**
 * @name eachMonthOfInterval
 * @category Interval Helpers
 * @summary Return the array of months within the specified time interval.
 *
 * @description
 * Return the array of months within the specified time interval.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param interval - The interval
 *
 * @returns The array with starts of months from the month of the interval start to the month of the interval end
 *
 * @example
 * // Each month between 6 February 2014 and 10 August 2014:
 * const result = eachMonthOfInterval({
 *   start: new Date(2014, 1, 6),
 *   end: new Date(2014, 7, 10)
 * })
 * //=> [
 * //   Sat Feb 01 2014 00:00:00,
 * //   Sat Mar 01 2014 00:00:00,
 * //   Tue Apr 01 2014 00:00:00,
 * //   Thu May 01 2014 00:00:00,
 * //   Sun Jun 01 2014 00:00:00,
 * //   Tue Jul 01 2014 00:00:00,
 * //   Fri Aug 01 2014 00:00:00
 * // ]
 */
function eachMonthOfInterval(interval, options) {
  const startDate = (0, _index.toDate)(interval.start);
  const endDate = (0, _index.toDate)(interval.end);

  let reversed = +startDate > +endDate;
  const endTime = reversed ? +startDate : +endDate;
  const currentDate = reversed ? endDate : startDate;
  currentDate.setHours(0, 0, 0, 0);
  currentDate.setDate(1);

  let step = options?.step ?? 1;
  if (!step) return [];
  if (step < 0) {
    step = -step;
    reversed = !reversed;
  }

  const dates = [];

  while (+currentDate <= endTime) {
    dates.push((0, _index.toDate)(currentDate));
    currentDate.setMonth(currentDate.getMonth() + step);
  }

  return reversed ? dates.reverse() : dates;
}


/***/ }),
/* 119 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.eachQuarterOfInterval = eachQuarterOfInterval;
var _index = __webpack_require__(74);
var _index2 = __webpack_require__(120);
var _index3 = __webpack_require__(53);

/**
 * The {@link eachQuarterOfInterval} function options.
 */

/**
 * @name eachQuarterOfInterval
 * @category Interval Helpers
 * @summary Return the array of quarters within the specified time interval.
 *
 * @description
 * Return the array of quarters within the specified time interval.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param interval - The interval
 *
 * @returns The array with starts of quarters from the quarter of the interval start to the quarter of the interval end
 *
 * @example
 * // Each quarter within interval 6 February 2014 - 10 August 2014:
 * const result = eachQuarterOfInterval({
 *   start: new Date(2014, 1, 6),
 *   end: new Date(2014, 7, 10)
 * })
 * //=> [
 * //   Wed Jan 01 2014 00:00:00,
 * //   Tue Apr 01 2014 00:00:00,
 * //   Tue Jul 01 2014 00:00:00,
 * // ]
 */
function eachQuarterOfInterval(interval, options) {
  const startDate = (0, _index3.toDate)(interval.start);
  const endDate = (0, _index3.toDate)(interval.end);

  let reversed = +startDate > +endDate;
  const endTime = reversed
    ? +(0, _index2.startOfQuarter)(startDate)
    : +(0, _index2.startOfQuarter)(endDate);
  let currentDate = reversed
    ? (0, _index2.startOfQuarter)(endDate)
    : (0, _index2.startOfQuarter)(startDate);

  let step = options?.step ?? 1;
  if (!step) return [];
  if (step < 0) {
    step = -step;
    reversed = !reversed;
  }

  const dates = [];

  while (+currentDate <= endTime) {
    dates.push((0, _index3.toDate)(currentDate));
    currentDate = (0, _index.addQuarters)(currentDate, step);
  }

  return reversed ? dates.reverse() : dates;
}


/***/ }),
/* 120 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.startOfQuarter = startOfQuarter;
var _index = __webpack_require__(53);

/**
 * @name startOfQuarter
 * @category Quarter Helpers
 * @summary Return the start of a year quarter for the given date.
 *
 * @description
 * Return the start of a year quarter for the given date.
 * The result will be in the local timezone.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The original date
 *
 * @returns The start of a quarter
 *
 * @example
 * // The start of a quarter for 2 September 2014 11:55:00:
 * const result = startOfQuarter(new Date(2014, 8, 2, 11, 55, 0))
 * //=> Tue Jul 01 2014 00:00:00
 */
function startOfQuarter(date) {
  const _date = (0, _index.toDate)(date);
  const currentMonth = _date.getMonth();
  const month = currentMonth - (currentMonth % 3);
  _date.setMonth(month, 1);
  _date.setHours(0, 0, 0, 0);
  return _date;
}


/***/ }),
/* 121 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.eachWeekOfInterval = eachWeekOfInterval;
var _index = __webpack_require__(76);
var _index2 = __webpack_require__(66);
var _index3 = __webpack_require__(53);

/**
 * The {@link eachWeekOfInterval} function options.
 */

/**
 * @name eachWeekOfInterval
 * @category Interval Helpers
 * @summary Return the array of weeks within the specified time interval.
 *
 * @description
 * Return the array of weeks within the specified time interval.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param interval - The interval.
 * @param options - An object with options.
 *
 * @returns The array with starts of weeks from the week of the interval start to the week of the interval end
 *
 * @example
 * // Each week within interval 6 October 2014 - 23 November 2014:
 * const result = eachWeekOfInterval({
 *   start: new Date(2014, 9, 6),
 *   end: new Date(2014, 10, 23)
 * })
 * //=> [
 * //   Sun Oct 05 2014 00:00:00,
 * //   Sun Oct 12 2014 00:00:00,
 * //   Sun Oct 19 2014 00:00:00,
 * //   Sun Oct 26 2014 00:00:00,
 * //   Sun Nov 02 2014 00:00:00,
 * //   Sun Nov 09 2014 00:00:00,
 * //   Sun Nov 16 2014 00:00:00,
 * //   Sun Nov 23 2014 00:00:00
 * // ]
 */
function eachWeekOfInterval(interval, options) {
  const startDate = (0, _index3.toDate)(interval.start);
  const endDate = (0, _index3.toDate)(interval.end);

  let reversed = +startDate > +endDate;
  const startDateWeek = reversed
    ? (0, _index2.startOfWeek)(endDate, options)
    : (0, _index2.startOfWeek)(startDate, options);
  const endDateWeek = reversed
    ? (0, _index2.startOfWeek)(startDate, options)
    : (0, _index2.startOfWeek)(endDate, options);

  // Some timezones switch DST at midnight, making start of day unreliable in these timezones, 3pm is a safe bet
  startDateWeek.setHours(15);
  endDateWeek.setHours(15);

  const endTime = +endDateWeek.getTime();
  let currentDate = startDateWeek;

  let step = options?.step ?? 1;
  if (!step) return [];
  if (step < 0) {
    step = -step;
    reversed = !reversed;
  }

  const dates = [];

  while (+currentDate <= endTime) {
    currentDate.setHours(0);
    dates.push((0, _index3.toDate)(currentDate));
    currentDate = (0, _index.addWeeks)(currentDate, step);
    currentDate.setHours(15);
  }

  return reversed ? dates.reverse() : dates;
}


/***/ }),
/* 122 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.eachWeekendOfInterval = eachWeekendOfInterval;
var _index = __webpack_require__(114);
var _index2 = __webpack_require__(59);

/**
 * @name eachWeekendOfInterval
 * @category Interval Helpers
 * @summary List all the Saturdays and Sundays in the given date interval.
 *
 * @description
 * Get all the Saturdays and Sundays in the given date interval.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param interval - The given interval
 *
 * @returns An array containing all the Saturdays and Sundays
 *
 * @example
 * // Lists all Saturdays and Sundays in the given date interval
 * const result = eachWeekendOfInterval({
 *   start: new Date(2018, 8, 17),
 *   end: new Date(2018, 8, 30)
 * })
 * //=> [
 * //   Sat Sep 22 2018 00:00:00,
 * //   Sun Sep 23 2018 00:00:00,
 * //   Sat Sep 29 2018 00:00:00,
 * //   Sun Sep 30 2018 00:00:00
 * // ]
 */
function eachWeekendOfInterval(interval) {
  const dateInterval = (0, _index.eachDayOfInterval)(interval);
  const weekends = [];
  let index = 0;
  while (index < dateInterval.length) {
    const date = dateInterval[index++];
    if ((0, _index2.isWeekend)(date)) weekends.push(date);
  }
  return weekends;
}


/***/ }),
/* 123 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.eachWeekendOfMonth = eachWeekendOfMonth;
var _index = __webpack_require__(122);
var _index2 = __webpack_require__(109);
var _index3 = __webpack_require__(124);

/**
 * @name eachWeekendOfMonth
 * @category Month Helpers
 * @summary List all the Saturdays and Sundays in the given month.
 *
 * @description
 * Get all the Saturdays and Sundays in the given month.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The given month
 *
 * @returns An array containing all the Saturdays and Sundays
 *
 * @example
 * // Lists all Saturdays and Sundays in the given month
 * const result = eachWeekendOfMonth(new Date(2022, 1, 1))
 * //=> [
 * //   Sat Feb 05 2022 00:00:00,
 * //   Sun Feb 06 2022 00:00:00,
 * //   Sat Feb 12 2022 00:00:00,
 * //   Sun Feb 13 2022 00:00:00,
 * //   Sat Feb 19 2022 00:00:00,
 * //   Sun Feb 20 2022 00:00:00,
 * //   Sat Feb 26 2022 00:00:00,
 * //   Sun Feb 27 2022 00:00:00
 * // ]
 */
function eachWeekendOfMonth(date) {
  const start = (0, _index3.startOfMonth)(date);
  const end = (0, _index2.endOfMonth)(date);
  return (0, _index.eachWeekendOfInterval)({ start, end });
}


/***/ }),
/* 124 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.startOfMonth = startOfMonth;
var _index = __webpack_require__(53);

/**
 * @name startOfMonth
 * @category Month Helpers
 * @summary Return the start of a month for the given date.
 *
 * @description
 * Return the start of a month for the given date.
 * The result will be in the local timezone.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The original date
 *
 * @returns The start of a month
 *
 * @example
 * // The start of a month for 2 September 2014 11:55:00:
 * const result = startOfMonth(new Date(2014, 8, 2, 11, 55, 0))
 * //=> Mon Sep 01 2014 00:00:00
 */
function startOfMonth(date) {
  const _date = (0, _index.toDate)(date);
  _date.setDate(1);
  _date.setHours(0, 0, 0, 0);
  return _date;
}


/***/ }),
/* 125 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.eachWeekendOfYear = eachWeekendOfYear;
var _index = __webpack_require__(122);
var _index2 = __webpack_require__(126);
var _index3 = __webpack_require__(127);

/**
 * @name eachWeekendOfYear
 * @category Year Helpers
 * @summary List all the Saturdays and Sundays in the year.
 *
 * @description
 * Get all the Saturdays and Sundays in the year.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The given year
 *
 * @returns An array containing all the Saturdays and Sundays
 *
 * @example
 * // Lists all Saturdays and Sundays in the year
 * const result = eachWeekendOfYear(new Date(2020, 1, 1))
 * //=> [
 * //   Sat Jan 03 2020 00:00:00,
 * //   Sun Jan 04 2020 00:00:00,
 * //   ...
 * //   Sun Dec 27 2020 00:00:00
 * // ]
 * ]
 */
function eachWeekendOfYear(date) {
  const start = (0, _index3.startOfYear)(date);
  const end = (0, _index2.endOfYear)(date);
  return (0, _index.eachWeekendOfInterval)({ start, end });
}


/***/ }),
/* 126 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.endOfYear = endOfYear;
var _index = __webpack_require__(53);

/**
 * @name endOfYear
 * @category Year Helpers
 * @summary Return the end of a year for the given date.
 *
 * @description
 * Return the end of a year for the given date.
 * The result will be in the local timezone.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The original date
 *
 * @returns The end of a year
 *
 * @example
 * // The end of a year for 2 September 2014 11:55:00:
 * const result = endOfYear(new Date(2014, 8, 2, 11, 55, 00))
 * //=> Wed Dec 31 2014 23:59:59.999
 */
function endOfYear(date) {
  const _date = (0, _index.toDate)(date);
  const year = _date.getFullYear();
  _date.setFullYear(year + 1, 0, 0);
  _date.setHours(23, 59, 59, 999);
  return _date;
}


/***/ }),
/* 127 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.startOfYear = startOfYear;
var _index = __webpack_require__(53);
var _index2 = __webpack_require__(54);

/**
 * @name startOfYear
 * @category Year Helpers
 * @summary Return the start of a year for the given date.
 *
 * @description
 * Return the start of a year for the given date.
 * The result will be in the local timezone.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The original date
 *
 * @returns The start of a year
 *
 * @example
 * // The start of a year for 2 September 2014 11:55:00:
 * const result = startOfYear(new Date(2014, 8, 2, 11, 55, 00))
 * //=> Wed Jan 01 2014 00:00:00
 */
function startOfYear(date) {
  const cleanDate = (0, _index.toDate)(date);
  const _date = (0, _index2.constructFrom)(date, 0);
  _date.setFullYear(cleanDate.getFullYear(), 0, 1);
  _date.setHours(0, 0, 0, 0);
  return _date;
}


/***/ }),
/* 128 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.eachYearOfInterval = eachYearOfInterval;
var _index = __webpack_require__(53);

/**
 * The {@link eachYearOfInterval} function options.
 */

/**
 * @name eachYearOfInterval
 * @category Interval Helpers
 * @summary Return the array of yearly timestamps within the specified time interval.
 *
 * @description
 * Return the array of yearly timestamps within the specified time interval.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param interval - The interval.
 *
 * @returns The array with starts of yearly timestamps from the month of the interval start to the month of the interval end
 *
 * @example
 * // Each year between 6 February 2014 and 10 August 2017:
 * const result = eachYearOfInterval({
 *   start: new Date(2014, 1, 6),
 *   end: new Date(2017, 7, 10)
 * })
 * //=> [
 * //   Wed Jan 01 2014 00:00:00,
 * //   Thu Jan 01 2015 00:00:00,
 * //   Fri Jan 01 2016 00:00:00,
 * //   Sun Jan 01 2017 00:00:00
 * // ]
 */
function eachYearOfInterval(interval, options) {
  const startDate = (0, _index.toDate)(interval.start);
  const endDate = (0, _index.toDate)(interval.end);

  let reversed = +startDate > +endDate;
  const endTime = reversed ? +startDate : +endDate;
  const currentDate = reversed ? endDate : startDate;
  currentDate.setHours(0, 0, 0, 0);
  currentDate.setMonth(0, 1);

  let step = options?.step ?? 1;
  if (!step) return [];
  if (step < 0) {
    step = -step;
    reversed = !reversed;
  }

  const dates = [];

  while (+currentDate <= endTime) {
    dates.push((0, _index.toDate)(currentDate));
    currentDate.setFullYear(currentDate.getFullYear() + step);
  }

  return reversed ? dates.reverse() : dates;
}


/***/ }),
/* 129 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.endOfDecade = endOfDecade;
var _index = __webpack_require__(53);

/**
 * @name endOfDecade
 * @category Decade Helpers
 * @summary Return the end of a decade for the given date.
 *
 * @description
 * Return the end of a decade for the given date.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The original date
 *
 * @returns The end of a decade
 *
 * @example
 * // The end of a decade for 12 May 1984 00:00:00:
 * const result = endOfDecade(new Date(1984, 4, 12, 00, 00, 00))
 * //=> Dec 31 1989 23:59:59.999
 */
function endOfDecade(date) {
  // TODO: Switch to more technical definition in of decades that start with 1
  // end with 0. I.e. 2001-2010 instead of current 2000-2009. It's a breaking
  // change, so it can only be done in 4.0.
  const _date = (0, _index.toDate)(date);
  const year = _date.getFullYear();
  const decade = 9 + Math.floor(year / 10) * 10;
  _date.setFullYear(decade, 11, 31);
  _date.setHours(23, 59, 59, 999);
  return _date;
}


/***/ }),
/* 130 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.endOfHour = endOfHour;
var _index = __webpack_require__(53);

/**
 * @name endOfHour
 * @category Hour Helpers
 * @summary Return the end of an hour for the given date.
 *
 * @description
 * Return the end of an hour for the given date.
 * The result will be in the local timezone.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The original date
 *
 * @returns The end of an hour
 *
 * @example
 * // The end of an hour for 2 September 2014 11:55:00:
 * const result = endOfHour(new Date(2014, 8, 2, 11, 55))
 * //=> Tue Sep 02 2014 11:59:59.999
 */
function endOfHour(date) {
  const _date = (0, _index.toDate)(date);
  _date.setMinutes(59, 59, 999);
  return _date;
}


/***/ }),
/* 131 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.endOfISOWeek = endOfISOWeek;
var _index = __webpack_require__(132);

/**
 * @name endOfISOWeek
 * @category ISO Week Helpers
 * @summary Return the end of an ISO week for the given date.
 *
 * @description
 * Return the end of an ISO week for the given date.
 * The result will be in the local timezone.
 *
 * ISO week-numbering year: http://en.wikipedia.org/wiki/ISO_week_date
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The original date
 *
 * @returns The end of an ISO week
 *
 * @example
 * // The end of an ISO week for 2 September 2014 11:55:00:
 * const result = endOfISOWeek(new Date(2014, 8, 2, 11, 55, 0))
 * //=> Sun Sep 07 2014 23:59:59.999
 */
function endOfISOWeek(date) {
  return (0, _index.endOfWeek)(date, { weekStartsOn: 1 });
}


/***/ }),
/* 132 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.endOfWeek = endOfWeek;
var _index = __webpack_require__(53);

var _index2 = __webpack_require__(67);

/**
 * The {@link endOfWeek} function options.
 */

/**
 * @name endOfWeek
 * @category Week Helpers
 * @summary Return the end of a week for the given date.
 *
 * @description
 * Return the end of a week for the given date.
 * The result will be in the local timezone.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The original date
 * @param options - An object with options
 *
 * @returns The end of a week
 *
 * @example
 * // The end of a week for 2 September 2014 11:55:00:
 * const result = endOfWeek(new Date(2014, 8, 2, 11, 55, 0))
 * //=> Sat Sep 06 2014 23:59:59.999
 *
 * @example
 * // If the week starts on Monday, the end of the week for 2 September 2014 11:55:00:
 * const result = endOfWeek(new Date(2014, 8, 2, 11, 55, 0), { weekStartsOn: 1 })
 * //=> Sun Sep 07 2014 23:59:59.999
 */
function endOfWeek(date, options) {
  const defaultOptions = (0, _index2.getDefaultOptions)();
  const weekStartsOn =
    options?.weekStartsOn ??
    options?.locale?.options?.weekStartsOn ??
    defaultOptions.weekStartsOn ??
    defaultOptions.locale?.options?.weekStartsOn ??
    0;

  const _date = (0, _index.toDate)(date);
  const day = _date.getDay();
  const diff = (day < weekStartsOn ? -7 : 0) + 6 - (day - weekStartsOn);

  _date.setDate(_date.getDate() + diff);
  _date.setHours(23, 59, 59, 999);
  return _date;
}


/***/ }),
/* 133 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.endOfISOWeekYear = endOfISOWeekYear;
var _index = __webpack_require__(64);
var _index2 = __webpack_require__(65);
var _index3 = __webpack_require__(54);

/**
 * @name endOfISOWeekYear
 * @category ISO Week-Numbering Year Helpers
 * @summary Return the end of an ISO week-numbering year for the given date.
 *
 * @description
 * Return the end of an ISO week-numbering year,
 * which always starts 3 days before the year's first Thursday.
 * The result will be in the local timezone.
 *
 * ISO week-numbering year: http://en.wikipedia.org/wiki/ISO_week_date
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The original date
 *
 * @returns The end of an ISO week-numbering year
 *
 * @example
 * // The end of an ISO week-numbering year for 2 July 2005:
 * const result = endOfISOWeekYear(new Date(2005, 6, 2))
 * //=> Sun Jan 01 2006 23:59:59.999
 */
function endOfISOWeekYear(date) {
  const year = (0, _index.getISOWeekYear)(date);
  const fourthOfJanuaryOfNextYear = (0, _index3.constructFrom)(date, 0);
  fourthOfJanuaryOfNextYear.setFullYear(year + 1, 0, 4);
  fourthOfJanuaryOfNextYear.setHours(0, 0, 0, 0);
  const _date = (0, _index2.startOfISOWeek)(fourthOfJanuaryOfNextYear);
  _date.setMilliseconds(_date.getMilliseconds() - 1);
  return _date;
}


/***/ }),
/* 134 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.endOfMinute = endOfMinute;
var _index = __webpack_require__(53);

/**
 * @name endOfMinute
 * @category Minute Helpers
 * @summary Return the end of a minute for the given date.
 *
 * @description
 * Return the end of a minute for the given date.
 * The result will be in the local timezone.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The original date
 *
 * @returns The end of a minute
 *
 * @example
 * // The end of a minute for 1 December 2014 22:15:45.400:
 * const result = endOfMinute(new Date(2014, 11, 1, 22, 15, 45, 400))
 * //=> Mon Dec 01 2014 22:15:59.999
 */
function endOfMinute(date) {
  const _date = (0, _index.toDate)(date);
  _date.setSeconds(59, 999);
  return _date;
}


/***/ }),
/* 135 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.endOfQuarter = endOfQuarter;
var _index = __webpack_require__(53);

/**
 * @name endOfQuarter
 * @category Quarter Helpers
 * @summary Return the end of a year quarter for the given date.
 *
 * @description
 * Return the end of a year quarter for the given date.
 * The result will be in the local timezone.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The original date
 *
 * @returns The end of a quarter
 *
 * @example
 * // The end of a quarter for 2 September 2014 11:55:00:
 * const result = endOfQuarter(new Date(2014, 8, 2, 11, 55, 0))
 * //=> Tue Sep 30 2014 23:59:59.999
 */
function endOfQuarter(date) {
  const _date = (0, _index.toDate)(date);
  const currentMonth = _date.getMonth();
  const month = currentMonth - (currentMonth % 3) + 3;
  _date.setMonth(month, 0);
  _date.setHours(23, 59, 59, 999);
  return _date;
}


/***/ }),
/* 136 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.endOfSecond = endOfSecond;
var _index = __webpack_require__(53);

/**
 * @name endOfSecond
 * @category Second Helpers
 * @summary Return the end of a second for the given date.
 *
 * @description
 * Return the end of a second for the given date.
 * The result will be in the local timezone.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The original date
 *
 * @returns The end of a second
 *
 * @example
 * // The end of a second for 1 December 2014 22:15:45.400:
 * const result = endOfSecond(new Date(2014, 11, 1, 22, 15, 45, 400))
 * //=> Mon Dec 01 2014 22:15:45.999
 */
function endOfSecond(date) {
  const _date = (0, _index.toDate)(date);
  _date.setMilliseconds(999);
  return _date;
}


/***/ }),
/* 137 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.endOfToday = endOfToday;
var _index = __webpack_require__(108);

/**
 * @name endOfToday
 * @category Day Helpers
 * @summary Return the end of today.
 * @pure false
 *
 * @description
 * Return the end of today.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @returns The end of today
 *
 * @example
 * // If today is 6 October 2014:
 * const result = endOfToday()
 * //=> Mon Oct 6 2014 23:59:59.999
 */
function endOfToday() {
  return (0, _index.endOfDay)(Date.now());
}


/***/ }),
/* 138 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

exports.endOfTomorrow = endOfTomorrow; /**
 * @name endOfTomorrow
 * @category Day Helpers
 * @summary Return the end of tomorrow.
 * @pure false
 *
 * @description
 * Return the end of tomorrow.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @returns The end of tomorrow
 *
 * @example
 * // If today is 6 October 2014:
 * const result = endOfTomorrow()
 * //=> Tue Oct 7 2014 23:59:59.999
 */
function endOfTomorrow() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const day = now.getDate();

  const date = new Date(0);
  date.setFullYear(year, month, day + 1);
  date.setHours(23, 59, 59, 999);
  return date;
}


/***/ }),
/* 139 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

exports.endOfYesterday = endOfYesterday; /**
 * @name endOfYesterday
 * @category Day Helpers
 * @summary Return the end of yesterday.
 * @pure false
 *
 * @description
 * Return the end of yesterday.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @returns The end of yesterday
 *
 * @example
 * // If today is 6 October 2014:
 * const result = endOfYesterday()
 * //=> Sun Oct 5 2014 23:59:59.999
 */
function endOfYesterday() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const day = now.getDate();

  const date = new Date(0);
  date.setFullYear(year, month, day - 1);
  date.setHours(23, 59, 59, 999);
  return date;
}


/***/ }),
/* 140 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.format = exports.formatDate = format;
Object.defineProperty(exports, "formatters", ({
  enumerable: true,
  get: function () {
    return _index3.formatters;
  },
}));
Object.defineProperty(exports, "longFormatters", ({
  enumerable: true,
  get: function () {
    return _index4.longFormatters;
  },
}));
var _index = __webpack_require__(141);
var _index2 = __webpack_require__(67);
var _index3 = __webpack_require__(152);
var _index4 = __webpack_require__(160);
var _index5 = __webpack_require__(161);

var _index6 = __webpack_require__(90);
var _index7 = __webpack_require__(53);

// Rexports of internal for libraries to use.
// See: https://github.com/date-fns/date-fns/issues/3638#issuecomment-1877082874

// This RegExp consists of three parts separated by `|`:
// - [yYQqMLwIdDecihHKkms]o matches any available ordinal number token
//   (one of the certain letters followed by `o`)
// - (\w)\1* matches any sequences of the same letter
// - '' matches two quote characters in a row
// - '(''|[^'])+('|$) matches anything surrounded by two quote characters ('),
//   except a single quote symbol, which ends the sequence.
//   Two quote characters do not end the sequence.
//   If there is no matching single quote
//   then the sequence will continue until the end of the string.
// - . matches any single character unmatched by previous parts of the RegExps
const formattingTokensRegExp =
  /[yYQqMLwIdDecihHKkms]o|(\w)\1*|''|'(''|[^'])+('|$)|./g;

// This RegExp catches symbols escaped by quotes, and also
// sequences of symbols P, p, and the combinations like `PPPPPPPppppp`
const longFormattingTokensRegExp = /P+p+|P+|p+|''|'(''|[^'])+('|$)|./g;

const escapedStringRegExp = /^'([^]*?)'?$/;
const doubleQuoteRegExp = /''/g;
const unescapedLatinCharacterRegExp = /[a-zA-Z]/;

/**
 * The {@link format} function options.
 */

/**
 * @name format
 * @alias formatDate
 * @category Common Helpers
 * @summary Format the date.
 *
 * @description
 * Return the formatted date string in the given format. The result may vary by locale.
 *
 * > ⚠️ Please note that the `format` tokens differ from Moment.js and other libraries.
 * > See: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md
 *
 * The characters wrapped between two single quotes characters (') are escaped.
 * Two single quotes in a row, whether inside or outside a quoted sequence, represent a 'real' single quote.
 * (see the last example)
 *
 * Format of the string is based on Unicode Technical Standard #35:
 * https://www.unicode.org/reports/tr35/tr35-dates.html#Date_Field_Symbol_Table
 * with a few additions (see note 7 below the table).
 *
 * Accepted patterns:
 * | Unit                            | Pattern | Result examples                   | Notes |
 * |---------------------------------|---------|-----------------------------------|-------|
 * | Era                             | G..GGG  | AD, BC                            |       |
 * |                                 | GGGG    | Anno Domini, Before Christ        | 2     |
 * |                                 | GGGGG   | A, B                              |       |
 * | Calendar year                   | y       | 44, 1, 1900, 2017                 | 5     |
 * |                                 | yo      | 44th, 1st, 0th, 17th              | 5,7   |
 * |                                 | yy      | 44, 01, 00, 17                    | 5     |
 * |                                 | yyy     | 044, 001, 1900, 2017              | 5     |
 * |                                 | yyyy    | 0044, 0001, 1900, 2017            | 5     |
 * |                                 | yyyyy   | ...                               | 3,5   |
 * | Local week-numbering year       | Y       | 44, 1, 1900, 2017                 | 5     |
 * |                                 | Yo      | 44th, 1st, 1900th, 2017th         | 5,7   |
 * |                                 | YY      | 44, 01, 00, 17                    | 5,8   |
 * |                                 | YYY     | 044, 001, 1900, 2017              | 5     |
 * |                                 | YYYY    | 0044, 0001, 1900, 2017            | 5,8   |
 * |                                 | YYYYY   | ...                               | 3,5   |
 * | ISO week-numbering year         | R       | -43, 0, 1, 1900, 2017             | 5,7   |
 * |                                 | RR      | -43, 00, 01, 1900, 2017           | 5,7   |
 * |                                 | RRR     | -043, 000, 001, 1900, 2017        | 5,7   |
 * |                                 | RRRR    | -0043, 0000, 0001, 1900, 2017     | 5,7   |
 * |                                 | RRRRR   | ...                               | 3,5,7 |
 * | Extended year                   | u       | -43, 0, 1, 1900, 2017             | 5     |
 * |                                 | uu      | -43, 01, 1900, 2017               | 5     |
 * |                                 | uuu     | -043, 001, 1900, 2017             | 5     |
 * |                                 | uuuu    | -0043, 0001, 1900, 2017           | 5     |
 * |                                 | uuuuu   | ...                               | 3,5   |
 * | Quarter (formatting)            | Q       | 1, 2, 3, 4                        |       |
 * |                                 | Qo      | 1st, 2nd, 3rd, 4th                | 7     |
 * |                                 | QQ      | 01, 02, 03, 04                    |       |
 * |                                 | QQQ     | Q1, Q2, Q3, Q4                    |       |
 * |                                 | QQQQ    | 1st quarter, 2nd quarter, ...     | 2     |
 * |                                 | QQQQQ   | 1, 2, 3, 4                        | 4     |
 * | Quarter (stand-alone)           | q       | 1, 2, 3, 4                        |       |
 * |                                 | qo      | 1st, 2nd, 3rd, 4th                | 7     |
 * |                                 | qq      | 01, 02, 03, 04                    |       |
 * |                                 | qqq     | Q1, Q2, Q3, Q4                    |       |
 * |                                 | qqqq    | 1st quarter, 2nd quarter, ...     | 2     |
 * |                                 | qqqqq   | 1, 2, 3, 4                        | 4     |
 * | Month (formatting)              | M       | 1, 2, ..., 12                     |       |
 * |                                 | Mo      | 1st, 2nd, ..., 12th               | 7     |
 * |                                 | MM      | 01, 02, ..., 12                   |       |
 * |                                 | MMM     | Jan, Feb, ..., Dec                |       |
 * |                                 | MMMM    | January, February, ..., December  | 2     |
 * |                                 | MMMMM   | J, F, ..., D                      |       |
 * | Month (stand-alone)             | L       | 1, 2, ..., 12                     |       |
 * |                                 | Lo      | 1st, 2nd, ..., 12th               | 7     |
 * |                                 | LL      | 01, 02, ..., 12                   |       |
 * |                                 | LLL     | Jan, Feb, ..., Dec                |       |
 * |                                 | LLLL    | January, February, ..., December  | 2     |
 * |                                 | LLLLL   | J, F, ..., D                      |       |
 * | Local week of year              | w       | 1, 2, ..., 53                     |       |
 * |                                 | wo      | 1st, 2nd, ..., 53th               | 7     |
 * |                                 | ww      | 01, 02, ..., 53                   |       |
 * | ISO week of year                | I       | 1, 2, ..., 53                     | 7     |
 * |                                 | Io      | 1st, 2nd, ..., 53th               | 7     |
 * |                                 | II      | 01, 02, ..., 53                   | 7     |
 * | Day of month                    | d       | 1, 2, ..., 31                     |       |
 * |                                 | do      | 1st, 2nd, ..., 31st               | 7     |
 * |                                 | dd      | 01, 02, ..., 31                   |       |
 * | Day of year                     | D       | 1, 2, ..., 365, 366               | 9     |
 * |                                 | Do      | 1st, 2nd, ..., 365th, 366th       | 7     |
 * |                                 | DD      | 01, 02, ..., 365, 366             | 9     |
 * |                                 | DDD     | 001, 002, ..., 365, 366           |       |
 * |                                 | DDDD    | ...                               | 3     |
 * | Day of week (formatting)        | E..EEE  | Mon, Tue, Wed, ..., Sun           |       |
 * |                                 | EEEE    | Monday, Tuesday, ..., Sunday      | 2     |
 * |                                 | EEEEE   | M, T, W, T, F, S, S               |       |
 * |                                 | EEEEEE  | Mo, Tu, We, Th, Fr, Sa, Su        |       |
 * | ISO day of week (formatting)    | i       | 1, 2, 3, ..., 7                   | 7     |
 * |                                 | io      | 1st, 2nd, ..., 7th                | 7     |
 * |                                 | ii      | 01, 02, ..., 07                   | 7     |
 * |                                 | iii     | Mon, Tue, Wed, ..., Sun           | 7     |
 * |                                 | iiii    | Monday, Tuesday, ..., Sunday      | 2,7   |
 * |                                 | iiiii   | M, T, W, T, F, S, S               | 7     |
 * |                                 | iiiiii  | Mo, Tu, We, Th, Fr, Sa, Su        | 7     |
 * | Local day of week (formatting)  | e       | 2, 3, 4, ..., 1                   |       |
 * |                                 | eo      | 2nd, 3rd, ..., 1st                | 7     |
 * |                                 | ee      | 02, 03, ..., 01                   |       |
 * |                                 | eee     | Mon, Tue, Wed, ..., Sun           |       |
 * |                                 | eeee    | Monday, Tuesday, ..., Sunday      | 2     |
 * |                                 | eeeee   | M, T, W, T, F, S, S               |       |
 * |                                 | eeeeee  | Mo, Tu, We, Th, Fr, Sa, Su        |       |
 * | Local day of week (stand-alone) | c       | 2, 3, 4, ..., 1                   |       |
 * |                                 | co      | 2nd, 3rd, ..., 1st                | 7     |
 * |                                 | cc      | 02, 03, ..., 01                   |       |
 * |                                 | ccc     | Mon, Tue, Wed, ..., Sun           |       |
 * |                                 | cccc    | Monday, Tuesday, ..., Sunday      | 2     |
 * |                                 | ccccc   | M, T, W, T, F, S, S               |       |
 * |                                 | cccccc  | Mo, Tu, We, Th, Fr, Sa, Su        |       |
 * | AM, PM                          | a..aa   | AM, PM                            |       |
 * |                                 | aaa     | am, pm                            |       |
 * |                                 | aaaa    | a.m., p.m.                        | 2     |
 * |                                 | aaaaa   | a, p                              |       |
 * | AM, PM, noon, midnight          | b..bb   | AM, PM, noon, midnight            |       |
 * |                                 | bbb     | am, pm, noon, midnight            |       |
 * |                                 | bbbb    | a.m., p.m., noon, midnight        | 2     |
 * |                                 | bbbbb   | a, p, n, mi                       |       |
 * | Flexible day period             | B..BBB  | at night, in the morning, ...     |       |
 * |                                 | BBBB    | at night, in the morning, ...     | 2     |
 * |                                 | BBBBB   | at night, in the morning, ...     |       |
 * | Hour [1-12]                     | h       | 1, 2, ..., 11, 12                 |       |
 * |                                 | ho      | 1st, 2nd, ..., 11th, 12th         | 7     |
 * |                                 | hh      | 01, 02, ..., 11, 12               |       |
 * | Hour [0-23]                     | H       | 0, 1, 2, ..., 23                  |       |
 * |                                 | Ho      | 0th, 1st, 2nd, ..., 23rd          | 7     |
 * |                                 | HH      | 00, 01, 02, ..., 23               |       |
 * | Hour [0-11]                     | K       | 1, 2, ..., 11, 0                  |       |
 * |                                 | Ko      | 1st, 2nd, ..., 11th, 0th          | 7     |
 * |                                 | KK      | 01, 02, ..., 11, 00               |       |
 * | Hour [1-24]                     | k       | 24, 1, 2, ..., 23                 |       |
 * |                                 | ko      | 24th, 1st, 2nd, ..., 23rd         | 7     |
 * |                                 | kk      | 24, 01, 02, ..., 23               |       |
 * | Minute                          | m       | 0, 1, ..., 59                     |       |
 * |                                 | mo      | 0th, 1st, ..., 59th               | 7     |
 * |                                 | mm      | 00, 01, ..., 59                   |       |
 * | Second                          | s       | 0, 1, ..., 59                     |       |
 * |                                 | so      | 0th, 1st, ..., 59th               | 7     |
 * |                                 | ss      | 00, 01, ..., 59                   |       |
 * | Fraction of second              | S       | 0, 1, ..., 9                      |       |
 * |                                 | SS      | 00, 01, ..., 99                   |       |
 * |                                 | SSS     | 000, 001, ..., 999                |       |
 * |                                 | SSSS    | ...                               | 3     |
 * | Timezone (ISO-8601 w/ Z)        | X       | -08, +0530, Z                     |       |
 * |                                 | XX      | -0800, +0530, Z                   |       |
 * |                                 | XXX     | -08:00, +05:30, Z                 |       |
 * |                                 | XXXX    | -0800, +0530, Z, +123456          | 2     |
 * |                                 | XXXXX   | -08:00, +05:30, Z, +12:34:56      |       |
 * | Timezone (ISO-8601 w/o Z)       | x       | -08, +0530, +00                   |       |
 * |                                 | xx      | -0800, +0530, +0000               |       |
 * |                                 | xxx     | -08:00, +05:30, +00:00            | 2     |
 * |                                 | xxxx    | -0800, +0530, +0000, +123456      |       |
 * |                                 | xxxxx   | -08:00, +05:30, +00:00, +12:34:56 |       |
 * | Timezone (GMT)                  | O...OOO | GMT-8, GMT+5:30, GMT+0            |       |
 * |                                 | OOOO    | GMT-08:00, GMT+05:30, GMT+00:00   | 2     |
 * | Timezone (specific non-locat.)  | z...zzz | GMT-8, GMT+5:30, GMT+0            | 6     |
 * |                                 | zzzz    | GMT-08:00, GMT+05:30, GMT+00:00   | 2,6   |
 * | Seconds timestamp               | t       | 512969520                         | 7     |
 * |                                 | tt      | ...                               | 3,7   |
 * | Milliseconds timestamp          | T       | 512969520900                      | 7     |
 * |                                 | TT      | ...                               | 3,7   |
 * | Long localized date             | P       | 04/29/1453                        | 7     |
 * |                                 | PP      | Apr 29, 1453                      | 7     |
 * |                                 | PPP     | April 29th, 1453                  | 7     |
 * |                                 | PPPP    | Friday, April 29th, 1453          | 2,7   |
 * | Long localized time             | p       | 12:00 AM                          | 7     |
 * |                                 | pp      | 12:00:00 AM                       | 7     |
 * |                                 | ppp     | 12:00:00 AM GMT+2                 | 7     |
 * |                                 | pppp    | 12:00:00 AM GMT+02:00             | 2,7   |
 * | Combination of date and time    | Pp      | 04/29/1453, 12:00 AM              | 7     |
 * |                                 | PPpp    | Apr 29, 1453, 12:00:00 AM         | 7     |
 * |                                 | PPPppp  | April 29th, 1453 at ...           | 7     |
 * |                                 | PPPPpppp| Friday, April 29th, 1453 at ...   | 2,7   |
 * Notes:
 * 1. "Formatting" units (e.g. formatting quarter) in the default en-US locale
 *    are the same as "stand-alone" units, but are different in some languages.
 *    "Formatting" units are declined according to the rules of the language
 *    in the context of a date. "Stand-alone" units are always nominative singular:
 *
 *    `format(new Date(2017, 10, 6), 'do LLLL', {locale: cs}) //=> '6. listopad'`
 *
 *    `format(new Date(2017, 10, 6), 'do MMMM', {locale: cs}) //=> '6. listopadu'`
 *
 * 2. Any sequence of the identical letters is a pattern, unless it is escaped by
 *    the single quote characters (see below).
 *    If the sequence is longer than listed in table (e.g. `EEEEEEEEEEE`)
 *    the output will be the same as default pattern for this unit, usually
 *    the longest one (in case of ISO weekdays, `EEEE`). Default patterns for units
 *    are marked with "2" in the last column of the table.
 *
 *    `format(new Date(2017, 10, 6), 'MMM') //=> 'Nov'`
 *
 *    `format(new Date(2017, 10, 6), 'MMMM') //=> 'November'`
 *
 *    `format(new Date(2017, 10, 6), 'MMMMM') //=> 'N'`
 *
 *    `format(new Date(2017, 10, 6), 'MMMMMM') //=> 'November'`
 *
 *    `format(new Date(2017, 10, 6), 'MMMMMMM') //=> 'November'`
 *
 * 3. Some patterns could be unlimited length (such as `yyyyyyyy`).
 *    The output will be padded with zeros to match the length of the pattern.
 *
 *    `format(new Date(2017, 10, 6), 'yyyyyyyy') //=> '00002017'`
 *
 * 4. `QQQQQ` and `qqqqq` could be not strictly numerical in some locales.
 *    These tokens represent the shortest form of the quarter.
 *
 * 5. The main difference between `y` and `u` patterns are B.C. years:
 *
 *    | Year | `y` | `u` |
 *    |------|-----|-----|
 *    | AC 1 |   1 |   1 |
 *    | BC 1 |   1 |   0 |
 *    | BC 2 |   2 |  -1 |
 *
 *    Also `yy` always returns the last two digits of a year,
 *    while `uu` pads single digit years to 2 characters and returns other years unchanged:
 *
 *    | Year | `yy` | `uu` |
 *    |------|------|------|
 *    | 1    |   01 |   01 |
 *    | 14   |   14 |   14 |
 *    | 376  |   76 |  376 |
 *    | 1453 |   53 | 1453 |
 *
 *    The same difference is true for local and ISO week-numbering years (`Y` and `R`),
 *    except local week-numbering years are dependent on `options.weekStartsOn`
 *    and `options.firstWeekContainsDate` (compare [getISOWeekYear](https://date-fns.org/docs/getISOWeekYear)
 *    and [getWeekYear](https://date-fns.org/docs/getWeekYear)).
 *
 * 6. Specific non-location timezones are currently unavailable in `date-fns`,
 *    so right now these tokens fall back to GMT timezones.
 *
 * 7. These patterns are not in the Unicode Technical Standard #35:
 *    - `i`: ISO day of week
 *    - `I`: ISO week of year
 *    - `R`: ISO week-numbering year
 *    - `t`: seconds timestamp
 *    - `T`: milliseconds timestamp
 *    - `o`: ordinal number modifier
 *    - `P`: long localized date
 *    - `p`: long localized time
 *
 * 8. `YY` and `YYYY` tokens represent week-numbering years but they are often confused with years.
 *    You should enable `options.useAdditionalWeekYearTokens` to use them. See: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md
 *
 * 9. `D` and `DD` tokens represent days of the year but they are often confused with days of the month.
 *    You should enable `options.useAdditionalDayOfYearTokens` to use them. See: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The original date
 * @param format - The string of tokens
 * @param options - An object with options
 *
 * @returns The formatted date string
 *
 * @throws `date` must not be Invalid Date
 * @throws `options.locale` must contain `localize` property
 * @throws `options.locale` must contain `formatLong` property
 * @throws use `yyyy` instead of `YYYY` for formatting years using [format provided] to the input [input provided]; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md
 * @throws use `yy` instead of `YY` for formatting years using [format provided] to the input [input provided]; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md
 * @throws use `d` instead of `D` for formatting days of the month using [format provided] to the input [input provided]; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md
 * @throws use `dd` instead of `DD` for formatting days of the month using [format provided] to the input [input provided]; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md
 * @throws format string contains an unescaped latin alphabet character
 *
 * @example
 * // Represent 11 February 2014 in middle-endian format:
 * const result = format(new Date(2014, 1, 11), 'MM/dd/yyyy')
 * //=> '02/11/2014'
 *
 * @example
 * // Represent 2 July 2014 in Esperanto:
 * import { eoLocale } from 'date-fns/locale/eo'
 * const result = format(new Date(2014, 6, 2), "do 'de' MMMM yyyy", {
 *   locale: eoLocale
 * })
 * //=> '2-a de julio 2014'
 *
 * @example
 * // Escape string by single quote characters:
 * const result = format(new Date(2014, 6, 2, 15), "h 'o''clock'")
 * //=> "3 o'clock"
 */
function format(date, formatStr, options) {
  const defaultOptions = (0, _index2.getDefaultOptions)();
  const locale =
    options?.locale ?? defaultOptions.locale ?? _index.defaultLocale;

  const firstWeekContainsDate =
    options?.firstWeekContainsDate ??
    options?.locale?.options?.firstWeekContainsDate ??
    defaultOptions.firstWeekContainsDate ??
    defaultOptions.locale?.options?.firstWeekContainsDate ??
    1;

  const weekStartsOn =
    options?.weekStartsOn ??
    options?.locale?.options?.weekStartsOn ??
    defaultOptions.weekStartsOn ??
    defaultOptions.locale?.options?.weekStartsOn ??
    0;

  const originalDate = (0, _index7.toDate)(date);

  if (!(0, _index6.isValid)(originalDate)) {
    throw new RangeError("Invalid time value");
  }

  let parts = formatStr
    .match(longFormattingTokensRegExp)
    .map((substring) => {
      const firstCharacter = substring[0];
      if (firstCharacter === "p" || firstCharacter === "P") {
        const longFormatter = _index4.longFormatters[firstCharacter];
        return longFormatter(substring, locale.formatLong);
      }
      return substring;
    })
    .join("")
    .match(formattingTokensRegExp)
    .map((substring) => {
      // Replace two single quote characters with one single quote character
      if (substring === "''") {
        return { isToken: false, value: "'" };
      }

      const firstCharacter = substring[0];
      if (firstCharacter === "'") {
        return { isToken: false, value: cleanEscapedString(substring) };
      }

      if (_index3.formatters[firstCharacter]) {
        return { isToken: true, value: substring };
      }

      if (firstCharacter.match(unescapedLatinCharacterRegExp)) {
        throw new RangeError(
          "Format string contains an unescaped latin alphabet character `" +
            firstCharacter +
            "`",
        );
      }

      return { isToken: false, value: substring };
    });

  // invoke localize preprocessor (only for french locales at the moment)
  if (locale.localize.preprocessor) {
    parts = locale.localize.preprocessor(originalDate, parts);
  }

  const formatterOptions = {
    firstWeekContainsDate,
    weekStartsOn,
    locale,
  };

  return parts
    .map((part) => {
      if (!part.isToken) return part.value;

      const token = part.value;

      if (
        (!options?.useAdditionalWeekYearTokens &&
          (0, _index5.isProtectedWeekYearToken)(token)) ||
        (!options?.useAdditionalDayOfYearTokens &&
          (0, _index5.isProtectedDayOfYearToken)(token))
      ) {
        (0, _index5.warnOrThrowProtectedError)(token, formatStr, String(date));
      }

      const formatter = _index3.formatters[token[0]];
      return formatter(originalDate, token, locale.localize, formatterOptions);
    })
    .join("");
}

function cleanEscapedString(input) {
  const matched = input.match(escapedStringRegExp);

  if (!matched) {
    return input;
  }

  return matched[1].replace(doubleQuoteRegExp, "'");
}


/***/ }),
/* 141 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "defaultLocale", ({
  enumerable: true,
  get: function () {
    return _index.enUS;
  },
}));
var _index = __webpack_require__(142);


/***/ }),
/* 142 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.enUS = void 0;
var _index = __webpack_require__(143);
var _index2 = __webpack_require__(144);
var _index3 = __webpack_require__(146);
var _index4 = __webpack_require__(147);
var _index5 = __webpack_require__(149);

/**
 * @category Locales
 * @summary English locale (United States).
 * @language English
 * @iso-639-2 eng
 * @author Sasha Koss [@kossnocorp](https://github.com/kossnocorp)
 * @author Lesha Koss [@leshakoss](https://github.com/leshakoss)
 */
const enUS = (exports.enUS = {
  code: "en-US",
  formatDistance: _index.formatDistance,
  formatLong: _index2.formatLong,
  formatRelative: _index3.formatRelative,
  localize: _index4.localize,
  match: _index5.match,
  options: {
    weekStartsOn: 0 /* Sunday */,
    firstWeekContainsDate: 1,
  },
});


/***/ }),
/* 143 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

exports.formatDistance = void 0;

const formatDistanceLocale = {
  lessThanXSeconds: {
    one: "less than a second",
    other: "less than {{count}} seconds",
  },

  xSeconds: {
    one: "1 second",
    other: "{{count}} seconds",
  },

  halfAMinute: "half a minute",

  lessThanXMinutes: {
    one: "less than a minute",
    other: "less than {{count}} minutes",
  },

  xMinutes: {
    one: "1 minute",
    other: "{{count}} minutes",
  },

  aboutXHours: {
    one: "about 1 hour",
    other: "about {{count}} hours",
  },

  xHours: {
    one: "1 hour",
    other: "{{count}} hours",
  },

  xDays: {
    one: "1 day",
    other: "{{count}} days",
  },

  aboutXWeeks: {
    one: "about 1 week",
    other: "about {{count}} weeks",
  },

  xWeeks: {
    one: "1 week",
    other: "{{count}} weeks",
  },

  aboutXMonths: {
    one: "about 1 month",
    other: "about {{count}} months",
  },

  xMonths: {
    one: "1 month",
    other: "{{count}} months",
  },

  aboutXYears: {
    one: "about 1 year",
    other: "about {{count}} years",
  },

  xYears: {
    one: "1 year",
    other: "{{count}} years",
  },

  overXYears: {
    one: "over 1 year",
    other: "over {{count}} years",
  },

  almostXYears: {
    one: "almost 1 year",
    other: "almost {{count}} years",
  },
};

const formatDistance = (token, count, options) => {
  let result;

  const tokenValue = formatDistanceLocale[token];
  if (typeof tokenValue === "string") {
    result = tokenValue;
  } else if (count === 1) {
    result = tokenValue.one;
  } else {
    result = tokenValue.other.replace("{{count}}", count.toString());
  }

  if (options?.addSuffix) {
    if (options.comparison && options.comparison > 0) {
      return "in " + result;
    } else {
      return result + " ago";
    }
  }

  return result;
};
exports.formatDistance = formatDistance;


/***/ }),
/* 144 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.formatLong = void 0;
var _index = __webpack_require__(145);

const dateFormats = {
  full: "EEEE, MMMM do, y",
  long: "MMMM do, y",
  medium: "MMM d, y",
  short: "MM/dd/yyyy",
};

const timeFormats = {
  full: "h:mm:ss a zzzz",
  long: "h:mm:ss a z",
  medium: "h:mm:ss a",
  short: "h:mm a",
};

const dateTimeFormats = {
  full: "{{date}} 'at' {{time}}",
  long: "{{date}} 'at' {{time}}",
  medium: "{{date}}, {{time}}",
  short: "{{date}}, {{time}}",
};

const formatLong = (exports.formatLong = {
  date: (0, _index.buildFormatLongFn)({
    formats: dateFormats,
    defaultWidth: "full",
  }),

  time: (0, _index.buildFormatLongFn)({
    formats: timeFormats,
    defaultWidth: "full",
  }),

  dateTime: (0, _index.buildFormatLongFn)({
    formats: dateTimeFormats,
    defaultWidth: "full",
  }),
});


/***/ }),
/* 145 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

exports.buildFormatLongFn = buildFormatLongFn;

function buildFormatLongFn(args) {
  return (options = {}) => {
    // TODO: Remove String()
    const width = options.width ? String(options.width) : args.defaultWidth;
    const format = args.formats[width] || args.formats[args.defaultWidth];
    return format;
  };
}


/***/ }),
/* 146 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

exports.formatRelative = void 0;

const formatRelativeLocale = {
  lastWeek: "'last' eeee 'at' p",
  yesterday: "'yesterday at' p",
  today: "'today at' p",
  tomorrow: "'tomorrow at' p",
  nextWeek: "eeee 'at' p",
  other: "P",
};

const formatRelative = (token, _date, _baseDate, _options) =>
  formatRelativeLocale[token];
exports.formatRelative = formatRelative;


/***/ }),
/* 147 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.localize = void 0;
var _index = __webpack_require__(148);

const eraValues = {
  narrow: ["B", "A"],
  abbreviated: ["BC", "AD"],
  wide: ["Before Christ", "Anno Domini"],
};

const quarterValues = {
  narrow: ["1", "2", "3", "4"],
  abbreviated: ["Q1", "Q2", "Q3", "Q4"],
  wide: ["1st quarter", "2nd quarter", "3rd quarter", "4th quarter"],
};

// Note: in English, the names of days of the week and months are capitalized.
// If you are making a new locale based on this one, check if the same is true for the language you're working on.
// Generally, formatted dates should look like they are in the middle of a sentence,
// e.g. in Spanish language the weekdays and months should be in the lowercase.
const monthValues = {
  narrow: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
  abbreviated: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ],

  wide: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
};

const dayValues = {
  narrow: ["S", "M", "T", "W", "T", "F", "S"],
  short: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
  abbreviated: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  wide: [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ],
};

const dayPeriodValues = {
  narrow: {
    am: "a",
    pm: "p",
    midnight: "mi",
    noon: "n",
    morning: "morning",
    afternoon: "afternoon",
    evening: "evening",
    night: "night",
  },
  abbreviated: {
    am: "AM",
    pm: "PM",
    midnight: "midnight",
    noon: "noon",
    morning: "morning",
    afternoon: "afternoon",
    evening: "evening",
    night: "night",
  },
  wide: {
    am: "a.m.",
    pm: "p.m.",
    midnight: "midnight",
    noon: "noon",
    morning: "morning",
    afternoon: "afternoon",
    evening: "evening",
    night: "night",
  },
};

const formattingDayPeriodValues = {
  narrow: {
    am: "a",
    pm: "p",
    midnight: "mi",
    noon: "n",
    morning: "in the morning",
    afternoon: "in the afternoon",
    evening: "in the evening",
    night: "at night",
  },
  abbreviated: {
    am: "AM",
    pm: "PM",
    midnight: "midnight",
    noon: "noon",
    morning: "in the morning",
    afternoon: "in the afternoon",
    evening: "in the evening",
    night: "at night",
  },
  wide: {
    am: "a.m.",
    pm: "p.m.",
    midnight: "midnight",
    noon: "noon",
    morning: "in the morning",
    afternoon: "in the afternoon",
    evening: "in the evening",
    night: "at night",
  },
};

const ordinalNumber = (dirtyNumber, _options) => {
  const number = Number(dirtyNumber);

  // If ordinal numbers depend on context, for example,
  // if they are different for different grammatical genders,
  // use `options.unit`.
  //
  // `unit` can be 'year', 'quarter', 'month', 'week', 'date', 'dayOfYear',
  // 'day', 'hour', 'minute', 'second'.

  const rem100 = number % 100;
  if (rem100 > 20 || rem100 < 10) {
    switch (rem100 % 10) {
      case 1:
        return number + "st";
      case 2:
        return number + "nd";
      case 3:
        return number + "rd";
    }
  }
  return number + "th";
};

const localize = (exports.localize = {
  ordinalNumber,

  era: (0, _index.buildLocalizeFn)({
    values: eraValues,
    defaultWidth: "wide",
  }),

  quarter: (0, _index.buildLocalizeFn)({
    values: quarterValues,
    defaultWidth: "wide",
    argumentCallback: (quarter) => quarter - 1,
  }),

  month: (0, _index.buildLocalizeFn)({
    values: monthValues,
    defaultWidth: "wide",
  }),

  day: (0, _index.buildLocalizeFn)({
    values: dayValues,
    defaultWidth: "wide",
  }),

  dayPeriod: (0, _index.buildLocalizeFn)({
    values: dayPeriodValues,
    defaultWidth: "wide",
    formattingValues: formattingDayPeriodValues,
    defaultFormattingWidth: "wide",
  }),
});


/***/ }),
/* 148 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

exports.buildLocalizeFn = buildLocalizeFn; /* eslint-disable no-unused-vars */

/**
 * The localize function argument callback which allows to convert raw value to
 * the actual type.
 *
 * @param value - The value to convert
 *
 * @returns The converted value
 */

/**
 * The map of localized values for each width.
 */

/**
 * The index type of the locale unit value. It types conversion of units of
 * values that don't start at 0 (i.e. quarters).
 */

/**
 * Converts the unit value to the tuple of values.
 */

/**
 * The tuple of localized era values. The first element represents BC,
 * the second element represents AD.
 */

/**
 * The tuple of localized quarter values. The first element represents Q1.
 */

/**
 * The tuple of localized day values. The first element represents Sunday.
 */

/**
 * The tuple of localized month values. The first element represents January.
 */

function buildLocalizeFn(args) {
  return (value, options) => {
    const context = options?.context ? String(options.context) : "standalone";

    let valuesArray;
    if (context === "formatting" && args.formattingValues) {
      const defaultWidth = args.defaultFormattingWidth || args.defaultWidth;
      const width = options?.width ? String(options.width) : defaultWidth;

      valuesArray =
        args.formattingValues[width] || args.formattingValues[defaultWidth];
    } else {
      const defaultWidth = args.defaultWidth;
      const width = options?.width ? String(options.width) : args.defaultWidth;

      valuesArray = args.values[width] || args.values[defaultWidth];
    }
    const index = args.argumentCallback ? args.argumentCallback(value) : value;

    // @ts-expect-error - For some reason TypeScript just don't want to match it, no matter how hard we try. I challenge you to try to remove it!
    return valuesArray[index];
  };
}


/***/ }),
/* 149 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.match = void 0;

var _index = __webpack_require__(150);
var _index2 = __webpack_require__(151);

const matchOrdinalNumberPattern = /^(\d+)(th|st|nd|rd)?/i;
const parseOrdinalNumberPattern = /\d+/i;

const matchEraPatterns = {
  narrow: /^(b|a)/i,
  abbreviated: /^(b\.?\s?c\.?|b\.?\s?c\.?\s?e\.?|a\.?\s?d\.?|c\.?\s?e\.?)/i,
  wide: /^(before christ|before common era|anno domini|common era)/i,
};
const parseEraPatterns = {
  any: [/^b/i, /^(a|c)/i],
};

const matchQuarterPatterns = {
  narrow: /^[1234]/i,
  abbreviated: /^q[1234]/i,
  wide: /^[1234](th|st|nd|rd)? quarter/i,
};
const parseQuarterPatterns = {
  any: [/1/i, /2/i, /3/i, /4/i],
};

const matchMonthPatterns = {
  narrow: /^[jfmasond]/i,
  abbreviated: /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i,
  wide: /^(january|february|march|april|may|june|july|august|september|october|november|december)/i,
};
const parseMonthPatterns = {
  narrow: [
    /^j/i,
    /^f/i,
    /^m/i,
    /^a/i,
    /^m/i,
    /^j/i,
    /^j/i,
    /^a/i,
    /^s/i,
    /^o/i,
    /^n/i,
    /^d/i,
  ],

  any: [
    /^ja/i,
    /^f/i,
    /^mar/i,
    /^ap/i,
    /^may/i,
    /^jun/i,
    /^jul/i,
    /^au/i,
    /^s/i,
    /^o/i,
    /^n/i,
    /^d/i,
  ],
};

const matchDayPatterns = {
  narrow: /^[smtwf]/i,
  short: /^(su|mo|tu|we|th|fr|sa)/i,
  abbreviated: /^(sun|mon|tue|wed|thu|fri|sat)/i,
  wide: /^(sunday|monday|tuesday|wednesday|thursday|friday|saturday)/i,
};
const parseDayPatterns = {
  narrow: [/^s/i, /^m/i, /^t/i, /^w/i, /^t/i, /^f/i, /^s/i],
  any: [/^su/i, /^m/i, /^tu/i, /^w/i, /^th/i, /^f/i, /^sa/i],
};

const matchDayPeriodPatterns = {
  narrow: /^(a|p|mi|n|(in the|at) (morning|afternoon|evening|night))/i,
  any: /^([ap]\.?\s?m\.?|midnight|noon|(in the|at) (morning|afternoon|evening|night))/i,
};
const parseDayPeriodPatterns = {
  any: {
    am: /^a/i,
    pm: /^p/i,
    midnight: /^mi/i,
    noon: /^no/i,
    morning: /morning/i,
    afternoon: /afternoon/i,
    evening: /evening/i,
    night: /night/i,
  },
};

const match = (exports.match = {
  ordinalNumber: (0, _index2.buildMatchPatternFn)({
    matchPattern: matchOrdinalNumberPattern,
    parsePattern: parseOrdinalNumberPattern,
    valueCallback: (value) => parseInt(value, 10),
  }),

  era: (0, _index.buildMatchFn)({
    matchPatterns: matchEraPatterns,
    defaultMatchWidth: "wide",
    parsePatterns: parseEraPatterns,
    defaultParseWidth: "any",
  }),

  quarter: (0, _index.buildMatchFn)({
    matchPatterns: matchQuarterPatterns,
    defaultMatchWidth: "wide",
    parsePatterns: parseQuarterPatterns,
    defaultParseWidth: "any",
    valueCallback: (index) => index + 1,
  }),

  month: (0, _index.buildMatchFn)({
    matchPatterns: matchMonthPatterns,
    defaultMatchWidth: "wide",
    parsePatterns: parseMonthPatterns,
    defaultParseWidth: "any",
  }),

  day: (0, _index.buildMatchFn)({
    matchPatterns: matchDayPatterns,
    defaultMatchWidth: "wide",
    parsePatterns: parseDayPatterns,
    defaultParseWidth: "any",
  }),

  dayPeriod: (0, _index.buildMatchFn)({
    matchPatterns: matchDayPeriodPatterns,
    defaultMatchWidth: "any",
    parsePatterns: parseDayPeriodPatterns,
    defaultParseWidth: "any",
  }),
});


/***/ }),
/* 150 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

exports.buildMatchFn = buildMatchFn;

function buildMatchFn(args) {
  return (string, options = {}) => {
    const width = options.width;

    const matchPattern =
      (width && args.matchPatterns[width]) ||
      args.matchPatterns[args.defaultMatchWidth];
    const matchResult = string.match(matchPattern);

    if (!matchResult) {
      return null;
    }
    const matchedString = matchResult[0];

    const parsePatterns =
      (width && args.parsePatterns[width]) ||
      args.parsePatterns[args.defaultParseWidth];

    const key = Array.isArray(parsePatterns)
      ? findIndex(parsePatterns, (pattern) => pattern.test(matchedString))
      : // eslint-disable-next-line @typescript-eslint/no-explicit-any -- I challange you to fix the type
        findKey(parsePatterns, (pattern) => pattern.test(matchedString));

    let value;

    value = args.valueCallback ? args.valueCallback(key) : key;
    value = options.valueCallback
      ? // eslint-disable-next-line @typescript-eslint/no-explicit-any -- I challange you to fix the type
        options.valueCallback(value)
      : value;

    const rest = string.slice(matchedString.length);

    return { value, rest };
  };
}

function findKey(object, predicate) {
  for (const key in object) {
    if (
      Object.prototype.hasOwnProperty.call(object, key) &&
      predicate(object[key])
    ) {
      return key;
    }
  }
  return undefined;
}

function findIndex(array, predicate) {
  for (let key = 0; key < array.length; key++) {
    if (predicate(array[key])) {
      return key;
    }
  }
  return undefined;
}


/***/ }),
/* 151 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

exports.buildMatchPatternFn = buildMatchPatternFn;

function buildMatchPatternFn(args) {
  return (string, options = {}) => {
    const matchResult = string.match(args.matchPattern);
    if (!matchResult) return null;
    const matchedString = matchResult[0];

    const parseResult = string.match(args.parsePattern);
    if (!parseResult) return null;
    let value = args.valueCallback
      ? args.valueCallback(parseResult[0])
      : parseResult[0];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- I challange you to fix the type
    value = options.valueCallback ? options.valueCallback(value) : value;

    const rest = string.slice(matchedString.length);

    return { value, rest };
  };
}


/***/ }),
/* 152 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.formatters = void 0;
var _index = __webpack_require__(153);
var _index2 = __webpack_require__(154);
var _index3 = __webpack_require__(64);
var _index4 = __webpack_require__(155);
var _index5 = __webpack_require__(157);

var _index6 = __webpack_require__(158);
var _index7 = __webpack_require__(159);

const dayPeriodEnum = {
  am: "am",
  pm: "pm",
  midnight: "midnight",
  noon: "noon",
  morning: "morning",
  afternoon: "afternoon",
  evening: "evening",
  night: "night",
};

/*
 * |     | Unit                           |     | Unit                           |
 * |-----|--------------------------------|-----|--------------------------------|
 * |  a  | AM, PM                         |  A* | Milliseconds in day            |
 * |  b  | AM, PM, noon, midnight         |  B  | Flexible day period            |
 * |  c  | Stand-alone local day of week  |  C* | Localized hour w/ day period   |
 * |  d  | Day of month                   |  D  | Day of year                    |
 * |  e  | Local day of week              |  E  | Day of week                    |
 * |  f  |                                |  F* | Day of week in month           |
 * |  g* | Modified Julian day            |  G  | Era                            |
 * |  h  | Hour [1-12]                    |  H  | Hour [0-23]                    |
 * |  i! | ISO day of week                |  I! | ISO week of year               |
 * |  j* | Localized hour w/ day period   |  J* | Localized hour w/o day period  |
 * |  k  | Hour [1-24]                    |  K  | Hour [0-11]                    |
 * |  l* | (deprecated)                   |  L  | Stand-alone month              |
 * |  m  | Minute                         |  M  | Month                          |
 * |  n  |                                |  N  |                                |
 * |  o! | Ordinal number modifier        |  O  | Timezone (GMT)                 |
 * |  p! | Long localized time            |  P! | Long localized date            |
 * |  q  | Stand-alone quarter            |  Q  | Quarter                        |
 * |  r* | Related Gregorian year         |  R! | ISO week-numbering year        |
 * |  s  | Second                         |  S  | Fraction of second             |
 * |  t! | Seconds timestamp              |  T! | Milliseconds timestamp         |
 * |  u  | Extended year                  |  U* | Cyclic year                    |
 * |  v* | Timezone (generic non-locat.)  |  V* | Timezone (location)            |
 * |  w  | Local week of year             |  W* | Week of month                  |
 * |  x  | Timezone (ISO-8601 w/o Z)      |  X  | Timezone (ISO-8601)            |
 * |  y  | Year (abs)                     |  Y  | Local week-numbering year      |
 * |  z  | Timezone (specific non-locat.) |  Z* | Timezone (aliases)             |
 *
 * Letters marked by * are not implemented but reserved by Unicode standard.
 *
 * Letters marked by ! are non-standard, but implemented by date-fns:
 * - `o` modifies the previous token to turn it into an ordinal (see `format` docs)
 * - `i` is ISO day of week. For `i` and `ii` is returns numeric ISO week days,
 *   i.e. 7 for Sunday, 1 for Monday, etc.
 * - `I` is ISO week of year, as opposed to `w` which is local week of year.
 * - `R` is ISO week-numbering year, as opposed to `Y` which is local week-numbering year.
 *   `R` is supposed to be used in conjunction with `I` and `i`
 *   for universal ISO week-numbering date, whereas
 *   `Y` is supposed to be used in conjunction with `w` and `e`
 *   for week-numbering date specific to the locale.
 * - `P` is long localized date format
 * - `p` is long localized time format
 */

const formatters = (exports.formatters = {
  // Era
  G: function (date, token, localize) {
    const era = date.getFullYear() > 0 ? 1 : 0;
    switch (token) {
      // AD, BC
      case "G":
      case "GG":
      case "GGG":
        return localize.era(era, { width: "abbreviated" });
      // A, B
      case "GGGGG":
        return localize.era(era, { width: "narrow" });
      // Anno Domini, Before Christ
      case "GGGG":
      default:
        return localize.era(era, { width: "wide" });
    }
  },

  // Year
  y: function (date, token, localize) {
    // Ordinal number
    if (token === "yo") {
      const signedYear = date.getFullYear();
      // Returns 1 for 1 BC (which is year 0 in JavaScript)
      const year = signedYear > 0 ? signedYear : 1 - signedYear;
      return localize.ordinalNumber(year, { unit: "year" });
    }

    return _index7.lightFormatters.y(date, token);
  },

  // Local week-numbering year
  Y: function (date, token, localize, options) {
    const signedWeekYear = (0, _index5.getWeekYear)(date, options);
    // Returns 1 for 1 BC (which is year 0 in JavaScript)
    const weekYear = signedWeekYear > 0 ? signedWeekYear : 1 - signedWeekYear;

    // Two digit year
    if (token === "YY") {
      const twoDigitYear = weekYear % 100;
      return (0, _index6.addLeadingZeros)(twoDigitYear, 2);
    }

    // Ordinal number
    if (token === "Yo") {
      return localize.ordinalNumber(weekYear, { unit: "year" });
    }

    // Padding
    return (0, _index6.addLeadingZeros)(weekYear, token.length);
  },

  // ISO week-numbering year
  R: function (date, token) {
    const isoWeekYear = (0, _index3.getISOWeekYear)(date);

    // Padding
    return (0, _index6.addLeadingZeros)(isoWeekYear, token.length);
  },

  // Extended year. This is a single number designating the year of this calendar system.
  // The main difference between `y` and `u` localizers are B.C. years:
  // | Year | `y` | `u` |
  // |------|-----|-----|
  // | AC 1 |   1 |   1 |
  // | BC 1 |   1 |   0 |
  // | BC 2 |   2 |  -1 |
  // Also `yy` always returns the last two digits of a year,
  // while `uu` pads single digit years to 2 characters and returns other years unchanged.
  u: function (date, token) {
    const year = date.getFullYear();
    return (0, _index6.addLeadingZeros)(year, token.length);
  },

  // Quarter
  Q: function (date, token, localize) {
    const quarter = Math.ceil((date.getMonth() + 1) / 3);
    switch (token) {
      // 1, 2, 3, 4
      case "Q":
        return String(quarter);
      // 01, 02, 03, 04
      case "QQ":
        return (0, _index6.addLeadingZeros)(quarter, 2);
      // 1st, 2nd, 3rd, 4th
      case "Qo":
        return localize.ordinalNumber(quarter, { unit: "quarter" });
      // Q1, Q2, Q3, Q4
      case "QQQ":
        return localize.quarter(quarter, {
          width: "abbreviated",
          context: "formatting",
        });
      // 1, 2, 3, 4 (narrow quarter; could be not numerical)
      case "QQQQQ":
        return localize.quarter(quarter, {
          width: "narrow",
          context: "formatting",
        });
      // 1st quarter, 2nd quarter, ...
      case "QQQQ":
      default:
        return localize.quarter(quarter, {
          width: "wide",
          context: "formatting",
        });
    }
  },

  // Stand-alone quarter
  q: function (date, token, localize) {
    const quarter = Math.ceil((date.getMonth() + 1) / 3);
    switch (token) {
      // 1, 2, 3, 4
      case "q":
        return String(quarter);
      // 01, 02, 03, 04
      case "qq":
        return (0, _index6.addLeadingZeros)(quarter, 2);
      // 1st, 2nd, 3rd, 4th
      case "qo":
        return localize.ordinalNumber(quarter, { unit: "quarter" });
      // Q1, Q2, Q3, Q4
      case "qqq":
        return localize.quarter(quarter, {
          width: "abbreviated",
          context: "standalone",
        });
      // 1, 2, 3, 4 (narrow quarter; could be not numerical)
      case "qqqqq":
        return localize.quarter(quarter, {
          width: "narrow",
          context: "standalone",
        });
      // 1st quarter, 2nd quarter, ...
      case "qqqq":
      default:
        return localize.quarter(quarter, {
          width: "wide",
          context: "standalone",
        });
    }
  },

  // Month
  M: function (date, token, localize) {
    const month = date.getMonth();
    switch (token) {
      case "M":
      case "MM":
        return _index7.lightFormatters.M(date, token);
      // 1st, 2nd, ..., 12th
      case "Mo":
        return localize.ordinalNumber(month + 1, { unit: "month" });
      // Jan, Feb, ..., Dec
      case "MMM":
        return localize.month(month, {
          width: "abbreviated",
          context: "formatting",
        });
      // J, F, ..., D
      case "MMMMM":
        return localize.month(month, {
          width: "narrow",
          context: "formatting",
        });
      // January, February, ..., December
      case "MMMM":
      default:
        return localize.month(month, { width: "wide", context: "formatting" });
    }
  },

  // Stand-alone month
  L: function (date, token, localize) {
    const month = date.getMonth();
    switch (token) {
      // 1, 2, ..., 12
      case "L":
        return String(month + 1);
      // 01, 02, ..., 12
      case "LL":
        return (0, _index6.addLeadingZeros)(month + 1, 2);
      // 1st, 2nd, ..., 12th
      case "Lo":
        return localize.ordinalNumber(month + 1, { unit: "month" });
      // Jan, Feb, ..., Dec
      case "LLL":
        return localize.month(month, {
          width: "abbreviated",
          context: "standalone",
        });
      // J, F, ..., D
      case "LLLLL":
        return localize.month(month, {
          width: "narrow",
          context: "standalone",
        });
      // January, February, ..., December
      case "LLLL":
      default:
        return localize.month(month, { width: "wide", context: "standalone" });
    }
  },

  // Local week of year
  w: function (date, token, localize, options) {
    const week = (0, _index4.getWeek)(date, options);

    if (token === "wo") {
      return localize.ordinalNumber(week, { unit: "week" });
    }

    return (0, _index6.addLeadingZeros)(week, token.length);
  },

  // ISO week of year
  I: function (date, token, localize) {
    const isoWeek = (0, _index2.getISOWeek)(date);

    if (token === "Io") {
      return localize.ordinalNumber(isoWeek, { unit: "week" });
    }

    return (0, _index6.addLeadingZeros)(isoWeek, token.length);
  },

  // Day of the month
  d: function (date, token, localize) {
    if (token === "do") {
      return localize.ordinalNumber(date.getDate(), { unit: "date" });
    }

    return _index7.lightFormatters.d(date, token);
  },

  // Day of year
  D: function (date, token, localize) {
    const dayOfYear = (0, _index.getDayOfYear)(date);

    if (token === "Do") {
      return localize.ordinalNumber(dayOfYear, { unit: "dayOfYear" });
    }

    return (0, _index6.addLeadingZeros)(dayOfYear, token.length);
  },

  // Day of week
  E: function (date, token, localize) {
    const dayOfWeek = date.getDay();
    switch (token) {
      // Tue
      case "E":
      case "EE":
      case "EEE":
        return localize.day(dayOfWeek, {
          width: "abbreviated",
          context: "formatting",
        });
      // T
      case "EEEEE":
        return localize.day(dayOfWeek, {
          width: "narrow",
          context: "formatting",
        });
      // Tu
      case "EEEEEE":
        return localize.day(dayOfWeek, {
          width: "short",
          context: "formatting",
        });
      // Tuesday
      case "EEEE":
      default:
        return localize.day(dayOfWeek, {
          width: "wide",
          context: "formatting",
        });
    }
  },

  // Local day of week
  e: function (date, token, localize, options) {
    const dayOfWeek = date.getDay();
    const localDayOfWeek = (dayOfWeek - options.weekStartsOn + 8) % 7 || 7;
    switch (token) {
      // Numerical value (Nth day of week with current locale or weekStartsOn)
      case "e":
        return String(localDayOfWeek);
      // Padded numerical value
      case "ee":
        return (0, _index6.addLeadingZeros)(localDayOfWeek, 2);
      // 1st, 2nd, ..., 7th
      case "eo":
        return localize.ordinalNumber(localDayOfWeek, { unit: "day" });
      case "eee":
        return localize.day(dayOfWeek, {
          width: "abbreviated",
          context: "formatting",
        });
      // T
      case "eeeee":
        return localize.day(dayOfWeek, {
          width: "narrow",
          context: "formatting",
        });
      // Tu
      case "eeeeee":
        return localize.day(dayOfWeek, {
          width: "short",
          context: "formatting",
        });
      // Tuesday
      case "eeee":
      default:
        return localize.day(dayOfWeek, {
          width: "wide",
          context: "formatting",
        });
    }
  },

  // Stand-alone local day of week
  c: function (date, token, localize, options) {
    const dayOfWeek = date.getDay();
    const localDayOfWeek = (dayOfWeek - options.weekStartsOn + 8) % 7 || 7;
    switch (token) {
      // Numerical value (same as in `e`)
      case "c":
        return String(localDayOfWeek);
      // Padded numerical value
      case "cc":
        return (0, _index6.addLeadingZeros)(localDayOfWeek, token.length);
      // 1st, 2nd, ..., 7th
      case "co":
        return localize.ordinalNumber(localDayOfWeek, { unit: "day" });
      case "ccc":
        return localize.day(dayOfWeek, {
          width: "abbreviated",
          context: "standalone",
        });
      // T
      case "ccccc":
        return localize.day(dayOfWeek, {
          width: "narrow",
          context: "standalone",
        });
      // Tu
      case "cccccc":
        return localize.day(dayOfWeek, {
          width: "short",
          context: "standalone",
        });
      // Tuesday
      case "cccc":
      default:
        return localize.day(dayOfWeek, {
          width: "wide",
          context: "standalone",
        });
    }
  },

  // ISO day of week
  i: function (date, token, localize) {
    const dayOfWeek = date.getDay();
    const isoDayOfWeek = dayOfWeek === 0 ? 7 : dayOfWeek;
    switch (token) {
      // 2
      case "i":
        return String(isoDayOfWeek);
      // 02
      case "ii":
        return (0, _index6.addLeadingZeros)(isoDayOfWeek, token.length);
      // 2nd
      case "io":
        return localize.ordinalNumber(isoDayOfWeek, { unit: "day" });
      // Tue
      case "iii":
        return localize.day(dayOfWeek, {
          width: "abbreviated",
          context: "formatting",
        });
      // T
      case "iiiii":
        return localize.day(dayOfWeek, {
          width: "narrow",
          context: "formatting",
        });
      // Tu
      case "iiiiii":
        return localize.day(dayOfWeek, {
          width: "short",
          context: "formatting",
        });
      // Tuesday
      case "iiii":
      default:
        return localize.day(dayOfWeek, {
          width: "wide",
          context: "formatting",
        });
    }
  },

  // AM or PM
  a: function (date, token, localize) {
    const hours = date.getHours();
    const dayPeriodEnumValue = hours / 12 >= 1 ? "pm" : "am";

    switch (token) {
      case "a":
      case "aa":
        return localize.dayPeriod(dayPeriodEnumValue, {
          width: "abbreviated",
          context: "formatting",
        });
      case "aaa":
        return localize
          .dayPeriod(dayPeriodEnumValue, {
            width: "abbreviated",
            context: "formatting",
          })
          .toLowerCase();
      case "aaaaa":
        return localize.dayPeriod(dayPeriodEnumValue, {
          width: "narrow",
          context: "formatting",
        });
      case "aaaa":
      default:
        return localize.dayPeriod(dayPeriodEnumValue, {
          width: "wide",
          context: "formatting",
        });
    }
  },

  // AM, PM, midnight, noon
  b: function (date, token, localize) {
    const hours = date.getHours();
    let dayPeriodEnumValue;
    if (hours === 12) {
      dayPeriodEnumValue = dayPeriodEnum.noon;
    } else if (hours === 0) {
      dayPeriodEnumValue = dayPeriodEnum.midnight;
    } else {
      dayPeriodEnumValue = hours / 12 >= 1 ? "pm" : "am";
    }

    switch (token) {
      case "b":
      case "bb":
        return localize.dayPeriod(dayPeriodEnumValue, {
          width: "abbreviated",
          context: "formatting",
        });
      case "bbb":
        return localize
          .dayPeriod(dayPeriodEnumValue, {
            width: "abbreviated",
            context: "formatting",
          })
          .toLowerCase();
      case "bbbbb":
        return localize.dayPeriod(dayPeriodEnumValue, {
          width: "narrow",
          context: "formatting",
        });
      case "bbbb":
      default:
        return localize.dayPeriod(dayPeriodEnumValue, {
          width: "wide",
          context: "formatting",
        });
    }
  },

  // in the morning, in the afternoon, in the evening, at night
  B: function (date, token, localize) {
    const hours = date.getHours();
    let dayPeriodEnumValue;
    if (hours >= 17) {
      dayPeriodEnumValue = dayPeriodEnum.evening;
    } else if (hours >= 12) {
      dayPeriodEnumValue = dayPeriodEnum.afternoon;
    } else if (hours >= 4) {
      dayPeriodEnumValue = dayPeriodEnum.morning;
    } else {
      dayPeriodEnumValue = dayPeriodEnum.night;
    }

    switch (token) {
      case "B":
      case "BB":
      case "BBB":
        return localize.dayPeriod(dayPeriodEnumValue, {
          width: "abbreviated",
          context: "formatting",
        });
      case "BBBBB":
        return localize.dayPeriod(dayPeriodEnumValue, {
          width: "narrow",
          context: "formatting",
        });
      case "BBBB":
      default:
        return localize.dayPeriod(dayPeriodEnumValue, {
          width: "wide",
          context: "formatting",
        });
    }
  },

  // Hour [1-12]
  h: function (date, token, localize) {
    if (token === "ho") {
      let hours = date.getHours() % 12;
      if (hours === 0) hours = 12;
      return localize.ordinalNumber(hours, { unit: "hour" });
    }

    return _index7.lightFormatters.h(date, token);
  },

  // Hour [0-23]
  H: function (date, token, localize) {
    if (token === "Ho") {
      return localize.ordinalNumber(date.getHours(), { unit: "hour" });
    }

    return _index7.lightFormatters.H(date, token);
  },

  // Hour [0-11]
  K: function (date, token, localize) {
    const hours = date.getHours() % 12;

    if (token === "Ko") {
      return localize.ordinalNumber(hours, { unit: "hour" });
    }

    return (0, _index6.addLeadingZeros)(hours, token.length);
  },

  // Hour [1-24]
  k: function (date, token, localize) {
    let hours = date.getHours();
    if (hours === 0) hours = 24;

    if (token === "ko") {
      return localize.ordinalNumber(hours, { unit: "hour" });
    }

    return (0, _index6.addLeadingZeros)(hours, token.length);
  },

  // Minute
  m: function (date, token, localize) {
    if (token === "mo") {
      return localize.ordinalNumber(date.getMinutes(), { unit: "minute" });
    }

    return _index7.lightFormatters.m(date, token);
  },

  // Second
  s: function (date, token, localize) {
    if (token === "so") {
      return localize.ordinalNumber(date.getSeconds(), { unit: "second" });
    }

    return _index7.lightFormatters.s(date, token);
  },

  // Fraction of second
  S: function (date, token) {
    return _index7.lightFormatters.S(date, token);
  },

  // Timezone (ISO-8601. If offset is 0, output is always `'Z'`)
  X: function (date, token, _localize) {
    const timezoneOffset = date.getTimezoneOffset();

    if (timezoneOffset === 0) {
      return "Z";
    }

    switch (token) {
      // Hours and optional minutes
      case "X":
        return formatTimezoneWithOptionalMinutes(timezoneOffset);

      // Hours, minutes and optional seconds without `:` delimiter
      // Note: neither ISO-8601 nor JavaScript supports seconds in timezone offsets
      // so this token always has the same output as `XX`
      case "XXXX":
      case "XX": // Hours and minutes without `:` delimiter
        return formatTimezone(timezoneOffset);

      // Hours, minutes and optional seconds with `:` delimiter
      // Note: neither ISO-8601 nor JavaScript supports seconds in timezone offsets
      // so this token always has the same output as `XXX`
      case "XXXXX":
      case "XXX": // Hours and minutes with `:` delimiter
      default:
        return formatTimezone(timezoneOffset, ":");
    }
  },

  // Timezone (ISO-8601. If offset is 0, output is `'+00:00'` or equivalent)
  x: function (date, token, _localize) {
    const timezoneOffset = date.getTimezoneOffset();

    switch (token) {
      // Hours and optional minutes
      case "x":
        return formatTimezoneWithOptionalMinutes(timezoneOffset);

      // Hours, minutes and optional seconds without `:` delimiter
      // Note: neither ISO-8601 nor JavaScript supports seconds in timezone offsets
      // so this token always has the same output as `xx`
      case "xxxx":
      case "xx": // Hours and minutes without `:` delimiter
        return formatTimezone(timezoneOffset);

      // Hours, minutes and optional seconds with `:` delimiter
      // Note: neither ISO-8601 nor JavaScript supports seconds in timezone offsets
      // so this token always has the same output as `xxx`
      case "xxxxx":
      case "xxx": // Hours and minutes with `:` delimiter
      default:
        return formatTimezone(timezoneOffset, ":");
    }
  },

  // Timezone (GMT)
  O: function (date, token, _localize) {
    const timezoneOffset = date.getTimezoneOffset();

    switch (token) {
      // Short
      case "O":
      case "OO":
      case "OOO":
        return "GMT" + formatTimezoneShort(timezoneOffset, ":");
      // Long
      case "OOOO":
      default:
        return "GMT" + formatTimezone(timezoneOffset, ":");
    }
  },

  // Timezone (specific non-location)
  z: function (date, token, _localize) {
    const timezoneOffset = date.getTimezoneOffset();

    switch (token) {
      // Short
      case "z":
      case "zz":
      case "zzz":
        return "GMT" + formatTimezoneShort(timezoneOffset, ":");
      // Long
      case "zzzz":
      default:
        return "GMT" + formatTimezone(timezoneOffset, ":");
    }
  },

  // Seconds timestamp
  t: function (date, token, _localize) {
    const timestamp = Math.trunc(date.getTime() / 1000);
    return (0, _index6.addLeadingZeros)(timestamp, token.length);
  },

  // Milliseconds timestamp
  T: function (date, token, _localize) {
    const timestamp = date.getTime();
    return (0, _index6.addLeadingZeros)(timestamp, token.length);
  },
});

function formatTimezoneShort(offset, delimiter = "") {
  const sign = offset > 0 ? "-" : "+";
  const absOffset = Math.abs(offset);
  const hours = Math.trunc(absOffset / 60);
  const minutes = absOffset % 60;
  if (minutes === 0) {
    return sign + String(hours);
  }
  return (
    sign + String(hours) + delimiter + (0, _index6.addLeadingZeros)(minutes, 2)
  );
}

function formatTimezoneWithOptionalMinutes(offset, delimiter) {
  if (offset % 60 === 0) {
    const sign = offset > 0 ? "-" : "+";
    return sign + (0, _index6.addLeadingZeros)(Math.abs(offset) / 60, 2);
  }
  return formatTimezone(offset, delimiter);
}

function formatTimezone(offset, delimiter = "") {
  const sign = offset > 0 ? "-" : "+";
  const absOffset = Math.abs(offset);
  const hours = (0, _index6.addLeadingZeros)(Math.trunc(absOffset / 60), 2);
  const minutes = (0, _index6.addLeadingZeros)(absOffset % 60, 2);
  return sign + hours + delimiter + minutes;
}


/***/ }),
/* 153 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.getDayOfYear = getDayOfYear;
var _index = __webpack_require__(69);
var _index2 = __webpack_require__(127);
var _index3 = __webpack_require__(53);

/**
 * @name getDayOfYear
 * @category Day Helpers
 * @summary Get the day of the year of the given date.
 *
 * @description
 * Get the day of the year of the given date.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The given date
 *
 * @returns The day of year
 *
 * @example
 * // Which day of the year is 2 July 2014?
 * const result = getDayOfYear(new Date(2014, 6, 2))
 * //=> 183
 */
function getDayOfYear(date) {
  const _date = (0, _index3.toDate)(date);
  const diff = (0, _index.differenceInCalendarDays)(
    _date,
    (0, _index2.startOfYear)(_date),
  );
  const dayOfYear = diff + 1;
  return dayOfYear;
}


/***/ }),
/* 154 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.getISOWeek = getISOWeek;
var _index = __webpack_require__(62);
var _index2 = __webpack_require__(65);
var _index3 = __webpack_require__(72);
var _index4 = __webpack_require__(53);

/**
 * @name getISOWeek
 * @category ISO Week Helpers
 * @summary Get the ISO week of the given date.
 *
 * @description
 * Get the ISO week of the given date.
 *
 * ISO week-numbering year: http://en.wikipedia.org/wiki/ISO_week_date
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The given date
 *
 * @returns The ISO week
 *
 * @example
 * // Which week of the ISO-week numbering year is 2 January 2005?
 * const result = getISOWeek(new Date(2005, 0, 2))
 * //=> 53
 */
function getISOWeek(date) {
  const _date = (0, _index4.toDate)(date);
  const diff =
    +(0, _index2.startOfISOWeek)(_date) -
    +(0, _index3.startOfISOWeekYear)(_date);

  // Round the number of weeks to the nearest integer because the number of
  // milliseconds in a week is not constant (e.g. it's different in the week of
  // the daylight saving time clock shift).
  return Math.round(diff / _index.millisecondsInWeek) + 1;
}


/***/ }),
/* 155 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.getWeek = getWeek;
var _index = __webpack_require__(62);
var _index2 = __webpack_require__(66);
var _index3 = __webpack_require__(156);
var _index4 = __webpack_require__(53);

/**
 * The {@link getWeek} function options.
 */

/**
 * @name getWeek
 * @category Week Helpers
 * @summary Get the local week index of the given date.
 *
 * @description
 * Get the local week index of the given date.
 * The exact calculation depends on the values of
 * `options.weekStartsOn` (which is the index of the first day of the week)
 * and `options.firstWeekContainsDate` (which is the day of January, which is always in
 * the first week of the week-numbering year)
 *
 * Week numbering: https://en.wikipedia.org/wiki/Week#The_ISO_week_date_system
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The given date
 * @param options - An object with options
 *
 * @returns The week
 *
 * @example
 * // Which week of the local week numbering year is 2 January 2005 with default options?
 * const result = getWeek(new Date(2005, 0, 2))
 * //=> 2
 *
 * @example
 * // Which week of the local week numbering year is 2 January 2005,
 * // if Monday is the first day of the week,
 * // and the first week of the year always contains 4 January?
 * const result = getWeek(new Date(2005, 0, 2), {
 *   weekStartsOn: 1,
 *   firstWeekContainsDate: 4
 * })
 * //=> 53
 */

function getWeek(date, options) {
  const _date = (0, _index4.toDate)(date);
  const diff =
    +(0, _index2.startOfWeek)(_date, options) -
    +(0, _index3.startOfWeekYear)(_date, options);

  // Round the number of weeks to the nearest integer because the number of
  // milliseconds in a week is not constant (e.g. it's different in the week of
  // the daylight saving time clock shift).
  return Math.round(diff / _index.millisecondsInWeek) + 1;
}


/***/ }),
/* 156 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.startOfWeekYear = startOfWeekYear;
var _index = __webpack_require__(54);
var _index2 = __webpack_require__(157);
var _index3 = __webpack_require__(66);

var _index4 = __webpack_require__(67);

/**
 * The {@link startOfWeekYear} function options.
 */

/**
 * @name startOfWeekYear
 * @category Week-Numbering Year Helpers
 * @summary Return the start of a local week-numbering year for the given date.
 *
 * @description
 * Return the start of a local week-numbering year.
 * The exact calculation depends on the values of
 * `options.weekStartsOn` (which is the index of the first day of the week)
 * and `options.firstWeekContainsDate` (which is the day of January, which is always in
 * the first week of the week-numbering year)
 *
 * Week numbering: https://en.wikipedia.org/wiki/Week#The_ISO_week_date_system
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The original date
 * @param options - An object with options
 *
 * @returns The start of a week-numbering year
 *
 * @example
 * // The start of an a week-numbering year for 2 July 2005 with default settings:
 * const result = startOfWeekYear(new Date(2005, 6, 2))
 * //=> Sun Dec 26 2004 00:00:00
 *
 * @example
 * // The start of a week-numbering year for 2 July 2005
 * // if Monday is the first day of week
 * // and 4 January is always in the first week of the year:
 * const result = startOfWeekYear(new Date(2005, 6, 2), {
 *   weekStartsOn: 1,
 *   firstWeekContainsDate: 4
 * })
 * //=> Mon Jan 03 2005 00:00:00
 */
function startOfWeekYear(date, options) {
  const defaultOptions = (0, _index4.getDefaultOptions)();
  const firstWeekContainsDate =
    options?.firstWeekContainsDate ??
    options?.locale?.options?.firstWeekContainsDate ??
    defaultOptions.firstWeekContainsDate ??
    defaultOptions.locale?.options?.firstWeekContainsDate ??
    1;

  const year = (0, _index2.getWeekYear)(date, options);
  const firstWeek = (0, _index.constructFrom)(date, 0);
  firstWeek.setFullYear(year, 0, firstWeekContainsDate);
  firstWeek.setHours(0, 0, 0, 0);
  const _date = (0, _index3.startOfWeek)(firstWeek, options);
  return _date;
}


/***/ }),
/* 157 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.getWeekYear = getWeekYear;
var _index = __webpack_require__(54);
var _index2 = __webpack_require__(66);
var _index3 = __webpack_require__(53);

var _index4 = __webpack_require__(67);

/**
 * The {@link getWeekYear} function options.
 */

/**
 * @name getWeekYear
 * @category Week-Numbering Year Helpers
 * @summary Get the local week-numbering year of the given date.
 *
 * @description
 * Get the local week-numbering year of the given date.
 * The exact calculation depends on the values of
 * `options.weekStartsOn` (which is the index of the first day of the week)
 * and `options.firstWeekContainsDate` (which is the day of January, which is always in
 * the first week of the week-numbering year)
 *
 * Week numbering: https://en.wikipedia.org/wiki/Week#The_ISO_week_date_system
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The given date
 * @param options - An object with options.
 *
 * @returns The local week-numbering year
 *
 * @example
 * // Which week numbering year is 26 December 2004 with the default settings?
 * const result = getWeekYear(new Date(2004, 11, 26))
 * //=> 2005
 *
 * @example
 * // Which week numbering year is 26 December 2004 if week starts on Saturday?
 * const result = getWeekYear(new Date(2004, 11, 26), { weekStartsOn: 6 })
 * //=> 2004
 *
 * @example
 * // Which week numbering year is 26 December 2004 if the first week contains 4 January?
 * const result = getWeekYear(new Date(2004, 11, 26), { firstWeekContainsDate: 4 })
 * //=> 2004
 */
function getWeekYear(date, options) {
  const _date = (0, _index3.toDate)(date);
  const year = _date.getFullYear();

  const defaultOptions = (0, _index4.getDefaultOptions)();
  const firstWeekContainsDate =
    options?.firstWeekContainsDate ??
    options?.locale?.options?.firstWeekContainsDate ??
    defaultOptions.firstWeekContainsDate ??
    defaultOptions.locale?.options?.firstWeekContainsDate ??
    1;

  const firstWeekOfNextYear = (0, _index.constructFrom)(date, 0);
  firstWeekOfNextYear.setFullYear(year + 1, 0, firstWeekContainsDate);
  firstWeekOfNextYear.setHours(0, 0, 0, 0);
  const startOfNextYear = (0, _index2.startOfWeek)(
    firstWeekOfNextYear,
    options,
  );

  const firstWeekOfThisYear = (0, _index.constructFrom)(date, 0);
  firstWeekOfThisYear.setFullYear(year, 0, firstWeekContainsDate);
  firstWeekOfThisYear.setHours(0, 0, 0, 0);
  const startOfThisYear = (0, _index2.startOfWeek)(
    firstWeekOfThisYear,
    options,
  );

  if (_date.getTime() >= startOfNextYear.getTime()) {
    return year + 1;
  } else if (_date.getTime() >= startOfThisYear.getTime()) {
    return year;
  } else {
    return year - 1;
  }
}


/***/ }),
/* 158 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

exports.addLeadingZeros = addLeadingZeros;
function addLeadingZeros(number, targetLength) {
  const sign = number < 0 ? "-" : "";
  const output = Math.abs(number).toString().padStart(targetLength, "0");
  return sign + output;
}


/***/ }),
/* 159 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.lightFormatters = void 0;
var _index = __webpack_require__(158);

/*
 * |     | Unit                           |     | Unit                           |
 * |-----|--------------------------------|-----|--------------------------------|
 * |  a  | AM, PM                         |  A* |                                |
 * |  d  | Day of month                   |  D  |                                |
 * |  h  | Hour [1-12]                    |  H  | Hour [0-23]                    |
 * |  m  | Minute                         |  M  | Month                          |
 * |  s  | Second                         |  S  | Fraction of second             |
 * |  y  | Year (abs)                     |  Y  |                                |
 *
 * Letters marked by * are not implemented but reserved by Unicode standard.
 */

const lightFormatters = (exports.lightFormatters = {
  // Year
  y(date, token) {
    // From http://www.unicode.org/reports/tr35/tr35-31/tr35-dates.html#Date_Format_tokens
    // | Year     |     y | yy |   yyy |  yyyy | yyyyy |
    // |----------|-------|----|-------|-------|-------|
    // | AD 1     |     1 | 01 |   001 |  0001 | 00001 |
    // | AD 12    |    12 | 12 |   012 |  0012 | 00012 |
    // | AD 123   |   123 | 23 |   123 |  0123 | 00123 |
    // | AD 1234  |  1234 | 34 |  1234 |  1234 | 01234 |
    // | AD 12345 | 12345 | 45 | 12345 | 12345 | 12345 |

    const signedYear = date.getFullYear();
    // Returns 1 for 1 BC (which is year 0 in JavaScript)
    const year = signedYear > 0 ? signedYear : 1 - signedYear;
    return (0, _index.addLeadingZeros)(
      token === "yy" ? year % 100 : year,
      token.length,
    );
  },

  // Month
  M(date, token) {
    const month = date.getMonth();
    return token === "M"
      ? String(month + 1)
      : (0, _index.addLeadingZeros)(month + 1, 2);
  },

  // Day of the month
  d(date, token) {
    return (0, _index.addLeadingZeros)(date.getDate(), token.length);
  },

  // AM or PM
  a(date, token) {
    const dayPeriodEnumValue = date.getHours() / 12 >= 1 ? "pm" : "am";

    switch (token) {
      case "a":
      case "aa":
        return dayPeriodEnumValue.toUpperCase();
      case "aaa":
        return dayPeriodEnumValue;
      case "aaaaa":
        return dayPeriodEnumValue[0];
      case "aaaa":
      default:
        return dayPeriodEnumValue === "am" ? "a.m." : "p.m.";
    }
  },

  // Hour [1-12]
  h(date, token) {
    return (0, _index.addLeadingZeros)(
      date.getHours() % 12 || 12,
      token.length,
    );
  },

  // Hour [0-23]
  H(date, token) {
    return (0, _index.addLeadingZeros)(date.getHours(), token.length);
  },

  // Minute
  m(date, token) {
    return (0, _index.addLeadingZeros)(date.getMinutes(), token.length);
  },

  // Second
  s(date, token) {
    return (0, _index.addLeadingZeros)(date.getSeconds(), token.length);
  },

  // Fraction of second
  S(date, token) {
    const numberOfDigits = token.length;
    const milliseconds = date.getMilliseconds();
    const fractionalSeconds = Math.trunc(
      milliseconds * Math.pow(10, numberOfDigits - 3),
    );
    return (0, _index.addLeadingZeros)(fractionalSeconds, token.length);
  },
});


/***/ }),
/* 160 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

exports.longFormatters = void 0;

const dateLongFormatter = (pattern, formatLong) => {
  switch (pattern) {
    case "P":
      return formatLong.date({ width: "short" });
    case "PP":
      return formatLong.date({ width: "medium" });
    case "PPP":
      return formatLong.date({ width: "long" });
    case "PPPP":
    default:
      return formatLong.date({ width: "full" });
  }
};

const timeLongFormatter = (pattern, formatLong) => {
  switch (pattern) {
    case "p":
      return formatLong.time({ width: "short" });
    case "pp":
      return formatLong.time({ width: "medium" });
    case "ppp":
      return formatLong.time({ width: "long" });
    case "pppp":
    default:
      return formatLong.time({ width: "full" });
  }
};

const dateTimeLongFormatter = (pattern, formatLong) => {
  const matchResult = pattern.match(/(P+)(p+)?/) || [];
  const datePattern = matchResult[1];
  const timePattern = matchResult[2];

  if (!timePattern) {
    return dateLongFormatter(pattern, formatLong);
  }

  let dateTimeFormat;

  switch (datePattern) {
    case "P":
      dateTimeFormat = formatLong.dateTime({ width: "short" });
      break;
    case "PP":
      dateTimeFormat = formatLong.dateTime({ width: "medium" });
      break;
    case "PPP":
      dateTimeFormat = formatLong.dateTime({ width: "long" });
      break;
    case "PPPP":
    default:
      dateTimeFormat = formatLong.dateTime({ width: "full" });
      break;
  }

  return dateTimeFormat
    .replace("{{date}}", dateLongFormatter(datePattern, formatLong))
    .replace("{{time}}", timeLongFormatter(timePattern, formatLong));
};

const longFormatters = (exports.longFormatters = {
  p: timeLongFormatter,
  P: dateTimeLongFormatter,
});


/***/ }),
/* 161 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

exports.isProtectedDayOfYearToken = isProtectedDayOfYearToken;
exports.isProtectedWeekYearToken = isProtectedWeekYearToken;
exports.warnOrThrowProtectedError = warnOrThrowProtectedError;
const dayOfYearTokenRE = /^D+$/;
const weekYearTokenRE = /^Y+$/;

const throwTokens = ["D", "DD", "YY", "YYYY"];

function isProtectedDayOfYearToken(token) {
  return dayOfYearTokenRE.test(token);
}

function isProtectedWeekYearToken(token) {
  return weekYearTokenRE.test(token);
}

function warnOrThrowProtectedError(token, format, input) {
  const _message = message(token, format, input);
  console.warn(_message);
  if (throwTokens.includes(token)) throw new RangeError(_message);
}

function message(token, format, input) {
  const subject = token[0] === "Y" ? "years" : "days of the month";
  return `Use \`${token.toLowerCase()}\` instead of \`${token}\` (in \`${format}\`) for formatting ${subject} to the input \`${input}\`; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md`;
}


/***/ }),
/* 162 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.formatDistance = formatDistance;
var _index = __webpack_require__(84);
var _index2 = __webpack_require__(62);
var _index3 = __webpack_require__(106);
var _index4 = __webpack_require__(111);
var _index5 = __webpack_require__(53);

var _index6 = __webpack_require__(141);
var _index7 = __webpack_require__(67);
var _index8 = __webpack_require__(71);

/**
 * The {@link formatDistance} function options.
 */

/**
 * @name formatDistance
 * @category Common Helpers
 * @summary Return the distance between the given dates in words.
 *
 * @description
 * Return the distance between the given dates in words.
 *
 * | Distance between dates                                            | Result              |
 * |-------------------------------------------------------------------|---------------------|
 * | 0 ... 30 secs                                                     | less than a minute  |
 * | 30 secs ... 1 min 30 secs                                         | 1 minute            |
 * | 1 min 30 secs ... 44 mins 30 secs                                 | [2..44] minutes     |
 * | 44 mins ... 30 secs ... 89 mins 30 secs                           | about 1 hour        |
 * | 89 mins 30 secs ... 23 hrs 59 mins 30 secs                        | about [2..24] hours |
 * | 23 hrs 59 mins 30 secs ... 41 hrs 59 mins 30 secs                 | 1 day               |
 * | 41 hrs 59 mins 30 secs ... 29 days 23 hrs 59 mins 30 secs         | [2..30] days        |
 * | 29 days 23 hrs 59 mins 30 secs ... 44 days 23 hrs 59 mins 30 secs | about 1 month       |
 * | 44 days 23 hrs 59 mins 30 secs ... 59 days 23 hrs 59 mins 30 secs | about 2 months      |
 * | 59 days 23 hrs 59 mins 30 secs ... 1 yr                           | [2..12] months      |
 * | 1 yr ... 1 yr 3 months                                            | about 1 year        |
 * | 1 yr 3 months ... 1 yr 9 month s                                  | over 1 year         |
 * | 1 yr 9 months ... 2 yrs                                           | almost 2 years      |
 * | N yrs ... N yrs 3 months                                          | about N years       |
 * | N yrs 3 months ... N yrs 9 months                                 | over N years        |
 * | N yrs 9 months ... N+1 yrs                                        | almost N+1 years    |
 *
 * With `options.includeSeconds == true`:
 * | Distance between dates | Result               |
 * |------------------------|----------------------|
 * | 0 secs ... 5 secs      | less than 5 seconds  |
 * | 5 secs ... 10 secs     | less than 10 seconds |
 * | 10 secs ... 20 secs    | less than 20 seconds |
 * | 20 secs ... 40 secs    | half a minute        |
 * | 40 secs ... 60 secs    | less than a minute   |
 * | 60 secs ... 90 secs    | 1 minute             |
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The date
 * @param baseDate - The date to compare with
 * @param options - An object with options
 *
 * @returns The distance in words
 *
 * @throws `date` must not be Invalid Date
 * @throws `baseDate` must not be Invalid Date
 * @throws `options.locale` must contain `formatDistance` property
 *
 * @example
 * // What is the distance between 2 July 2014 and 1 January 2015?
 * const result = formatDistance(new Date(2014, 6, 2), new Date(2015, 0, 1))
 * //=> '6 months'
 *
 * @example
 * // What is the distance between 1 January 2015 00:00:15
 * // and 1 January 2015 00:00:00, including seconds?
 * const result = formatDistance(
 *   new Date(2015, 0, 1, 0, 0, 15),
 *   new Date(2015, 0, 1, 0, 0, 0),
 *   { includeSeconds: true }
 * )
 * //=> 'less than 20 seconds'
 *
 * @example
 * // What is the distance from 1 January 2016
 * // to 1 January 2015, with a suffix?
 * const result = formatDistance(new Date(2015, 0, 1), new Date(2016, 0, 1), {
 *   addSuffix: true
 * })
 * //=> 'about 1 year ago'
 *
 * @example
 * // What is the distance between 1 August 2016 and 1 January 2015 in Esperanto?
 * import { eoLocale } from 'date-fns/locale/eo'
 * const result = formatDistance(new Date(2016, 7, 1), new Date(2015, 0, 1), {
 *   locale: eoLocale
 * })
 * //=> 'pli ol 1 jaro'
 */

function formatDistance(date, baseDate, options) {
  const defaultOptions = (0, _index7.getDefaultOptions)();
  const locale =
    options?.locale ?? defaultOptions.locale ?? _index6.defaultLocale;
  const minutesInAlmostTwoDays = 2520;

  const comparison = (0, _index.compareAsc)(date, baseDate);

  if (isNaN(comparison)) {
    throw new RangeError("Invalid time value");
  }

  const localizeOptions = Object.assign({}, options, {
    addSuffix: options?.addSuffix,
    comparison: comparison,
  });

  let dateLeft;
  let dateRight;
  if (comparison > 0) {
    dateLeft = (0, _index5.toDate)(baseDate);
    dateRight = (0, _index5.toDate)(date);
  } else {
    dateLeft = (0, _index5.toDate)(date);
    dateRight = (0, _index5.toDate)(baseDate);
  }

  const seconds = (0, _index4.differenceInSeconds)(dateRight, dateLeft);
  const offsetInSeconds =
    ((0, _index8.getTimezoneOffsetInMilliseconds)(dateRight) -
      (0, _index8.getTimezoneOffsetInMilliseconds)(dateLeft)) /
    1000;
  const minutes = Math.round((seconds - offsetInSeconds) / 60);
  let months;

  // 0 up to 2 mins
  if (minutes < 2) {
    if (options?.includeSeconds) {
      if (seconds < 5) {
        return locale.formatDistance("lessThanXSeconds", 5, localizeOptions);
      } else if (seconds < 10) {
        return locale.formatDistance("lessThanXSeconds", 10, localizeOptions);
      } else if (seconds < 20) {
        return locale.formatDistance("lessThanXSeconds", 20, localizeOptions);
      } else if (seconds < 40) {
        return locale.formatDistance("halfAMinute", 0, localizeOptions);
      } else if (seconds < 60) {
        return locale.formatDistance("lessThanXMinutes", 1, localizeOptions);
      } else {
        return locale.formatDistance("xMinutes", 1, localizeOptions);
      }
    } else {
      if (minutes === 0) {
        return locale.formatDistance("lessThanXMinutes", 1, localizeOptions);
      } else {
        return locale.formatDistance("xMinutes", minutes, localizeOptions);
      }
    }

    // 2 mins up to 0.75 hrs
  } else if (minutes < 45) {
    return locale.formatDistance("xMinutes", minutes, localizeOptions);

    // 0.75 hrs up to 1.5 hrs
  } else if (minutes < 90) {
    return locale.formatDistance("aboutXHours", 1, localizeOptions);

    // 1.5 hrs up to 24 hrs
  } else if (minutes < _index2.minutesInDay) {
    const hours = Math.round(minutes / 60);
    return locale.formatDistance("aboutXHours", hours, localizeOptions);

    // 1 day up to 1.75 days
  } else if (minutes < minutesInAlmostTwoDays) {
    return locale.formatDistance("xDays", 1, localizeOptions);

    // 1.75 days up to 30 days
  } else if (minutes < _index2.minutesInMonth) {
    const days = Math.round(minutes / _index2.minutesInDay);
    return locale.formatDistance("xDays", days, localizeOptions);

    // 1 month up to 2 months
  } else if (minutes < _index2.minutesInMonth * 2) {
    months = Math.round(minutes / _index2.minutesInMonth);
    return locale.formatDistance("aboutXMonths", months, localizeOptions);
  }

  months = (0, _index3.differenceInMonths)(dateRight, dateLeft);

  // 2 months up to 12 months
  if (months < 12) {
    const nearestMonth = Math.round(minutes / _index2.minutesInMonth);
    return locale.formatDistance("xMonths", nearestMonth, localizeOptions);

    // 1 year up to max Date
  } else {
    const monthsSinceStartOfYear = months % 12;
    const years = Math.trunc(months / 12);

    // N years up to 1 years 3 months
    if (monthsSinceStartOfYear < 3) {
      return locale.formatDistance("aboutXYears", years, localizeOptions);

      // N years 3 months up to N years 9 months
    } else if (monthsSinceStartOfYear < 9) {
      return locale.formatDistance("overXYears", years, localizeOptions);

      // N years 9 months up to N year 12 months
    } else {
      return locale.formatDistance("almostXYears", years + 1, localizeOptions);
    }
  }
}


/***/ }),
/* 163 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.formatDistanceStrict = formatDistanceStrict;
var _index = __webpack_require__(141);
var _index2 = __webpack_require__(67);
var _index3 = __webpack_require__(101);
var _index4 = __webpack_require__(71);
var _index5 = __webpack_require__(84);
var _index6 = __webpack_require__(62);

var _index7 = __webpack_require__(53);

/**
 * The {@link formatDistanceStrict} function options.
 */

/**
 * The unit used to format the distance in {@link formatDistanceStrict}.
 */

/**
 * @name formatDistanceStrict
 * @category Common Helpers
 * @summary Return the distance between the given dates in words.
 *
 * @description
 * Return the distance between the given dates in words, using strict units.
 * This is like `formatDistance`, but does not use helpers like 'almost', 'over',
 * 'less than' and the like.
 *
 * | Distance between dates | Result              |
 * |------------------------|---------------------|
 * | 0 ... 59 secs          | [0..59] seconds     |
 * | 1 ... 59 mins          | [1..59] minutes     |
 * | 1 ... 23 hrs           | [1..23] hours       |
 * | 1 ... 29 days          | [1..29] days        |
 * | 1 ... 11 months        | [1..11] months      |
 * | 1 ... N years          | [1..N]  years       |
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The date
 * @param baseDate - The date to compare with
 * @param options - An object with options
 *
 * @returns The distance in words
 *
 * @throws `date` must not be Invalid Date
 * @throws `baseDate` must not be Invalid Date
 * @throws `options.unit` must be 'second', 'minute', 'hour', 'day', 'month' or 'year'
 * @throws `options.locale` must contain `formatDistance` property
 *
 * @example
 * // What is the distance between 2 July 2014 and 1 January 2015?
 * const result = formatDistanceStrict(new Date(2014, 6, 2), new Date(2015, 0, 2))
 * //=> '6 months'
 *
 * @example
 * // What is the distance between 1 January 2015 00:00:15
 * // and 1 January 2015 00:00:00?
 * const result = formatDistanceStrict(
 *   new Date(2015, 0, 1, 0, 0, 15),
 *   new Date(2015, 0, 1, 0, 0, 0)
 * )
 * //=> '15 seconds'
 *
 * @example
 * // What is the distance from 1 January 2016
 * // to 1 January 2015, with a suffix?
 * const result = formatDistanceStrict(new Date(2015, 0, 1), new Date(2016, 0, 1), {
 *   addSuffix: true
 * })
 * //=> '1 year ago'
 *
 * @example
 * // What is the distance from 1 January 2016
 * // to 1 January 2015, in minutes?
 * const result = formatDistanceStrict(new Date(2016, 0, 1), new Date(2015, 0, 1), {
 *   unit: 'minute'
 * })
 * //=> '525600 minutes'
 *
 * @example
 * // What is the distance from 1 January 2015
 * // to 28 January 2015, in months, rounded up?
 * const result = formatDistanceStrict(new Date(2015, 0, 28), new Date(2015, 0, 1), {
 *   unit: 'month',
 *   roundingMethod: 'ceil'
 * })
 * //=> '1 month'
 *
 * @example
 * // What is the distance between 1 August 2016 and 1 January 2015 in Esperanto?
 * import { eoLocale } from 'date-fns/locale/eo'
 * const result = formatDistanceStrict(new Date(2016, 7, 1), new Date(2015, 0, 1), {
 *   locale: eoLocale
 * })
 * //=> '1 jaro'
 */

function formatDistanceStrict(date, baseDate, options) {
  const defaultOptions = (0, _index2.getDefaultOptions)();
  const locale =
    options?.locale ?? defaultOptions.locale ?? _index.defaultLocale;

  const comparison = (0, _index5.compareAsc)(date, baseDate);

  if (isNaN(comparison)) {
    throw new RangeError("Invalid time value");
  }

  const localizeOptions = Object.assign({}, options, {
    addSuffix: options?.addSuffix,
    comparison: comparison,
  });

  let dateLeft;
  let dateRight;
  if (comparison > 0) {
    dateLeft = (0, _index7.toDate)(baseDate);
    dateRight = (0, _index7.toDate)(date);
  } else {
    dateLeft = (0, _index7.toDate)(date);
    dateRight = (0, _index7.toDate)(baseDate);
  }

  const roundingMethod = (0, _index3.getRoundingMethod)(
    options?.roundingMethod ?? "round",
  );

  const milliseconds = dateRight.getTime() - dateLeft.getTime();
  const minutes = milliseconds / _index6.millisecondsInMinute;

  const timezoneOffset =
    (0, _index4.getTimezoneOffsetInMilliseconds)(dateRight) -
    (0, _index4.getTimezoneOffsetInMilliseconds)(dateLeft);

  // Use DST-normalized difference in minutes for years, months and days;
  // use regular difference in minutes for hours, minutes and seconds.
  const dstNormalizedMinutes =
    (milliseconds - timezoneOffset) / _index6.millisecondsInMinute;

  const defaultUnit = options?.unit;
  let unit;
  if (!defaultUnit) {
    if (minutes < 1) {
      unit = "second";
    } else if (minutes < 60) {
      unit = "minute";
    } else if (minutes < _index6.minutesInDay) {
      unit = "hour";
    } else if (dstNormalizedMinutes < _index6.minutesInMonth) {
      unit = "day";
    } else if (dstNormalizedMinutes < _index6.minutesInYear) {
      unit = "month";
    } else {
      unit = "year";
    }
  } else {
    unit = defaultUnit;
  }

  // 0 up to 60 seconds
  if (unit === "second") {
    const seconds = roundingMethod(milliseconds / 1000);
    return locale.formatDistance("xSeconds", seconds, localizeOptions);

    // 1 up to 60 mins
  } else if (unit === "minute") {
    const roundedMinutes = roundingMethod(minutes);
    return locale.formatDistance("xMinutes", roundedMinutes, localizeOptions);

    // 1 up to 24 hours
  } else if (unit === "hour") {
    const hours = roundingMethod(minutes / 60);
    return locale.formatDistance("xHours", hours, localizeOptions);

    // 1 up to 30 days
  } else if (unit === "day") {
    const days = roundingMethod(dstNormalizedMinutes / _index6.minutesInDay);
    return locale.formatDistance("xDays", days, localizeOptions);

    // 1 up to 12 months
  } else if (unit === "month") {
    const months = roundingMethod(
      dstNormalizedMinutes / _index6.minutesInMonth,
    );
    return months === 12 && defaultUnit !== "month"
      ? locale.formatDistance("xYears", 1, localizeOptions)
      : locale.formatDistance("xMonths", months, localizeOptions);

    // 1 year up to max Date
  } else {
    const years = roundingMethod(dstNormalizedMinutes / _index6.minutesInYear);
    return locale.formatDistance("xYears", years, localizeOptions);
  }
}


/***/ }),
/* 164 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.formatDistanceToNow = formatDistanceToNow;
var _index = __webpack_require__(86);

var _index2 = __webpack_require__(162);

/**
 * The {@link formatDistanceToNow} function options.
 */

/**
 * @name formatDistanceToNow
 * @category Common Helpers
 * @summary Return the distance between the given date and now in words.
 * @pure false
 *
 * @description
 * Return the distance between the given date and now in words.
 *
 * | Distance to now                                                   | Result              |
 * |-------------------------------------------------------------------|---------------------|
 * | 0 ... 30 secs                                                     | less than a minute  |
 * | 30 secs ... 1 min 30 secs                                         | 1 minute            |
 * | 1 min 30 secs ... 44 mins 30 secs                                 | [2..44] minutes     |
 * | 44 mins ... 30 secs ... 89 mins 30 secs                           | about 1 hour        |
 * | 89 mins 30 secs ... 23 hrs 59 mins 30 secs                        | about [2..24] hours |
 * | 23 hrs 59 mins 30 secs ... 41 hrs 59 mins 30 secs                 | 1 day               |
 * | 41 hrs 59 mins 30 secs ... 29 days 23 hrs 59 mins 30 secs         | [2..30] days        |
 * | 29 days 23 hrs 59 mins 30 secs ... 44 days 23 hrs 59 mins 30 secs | about 1 month       |
 * | 44 days 23 hrs 59 mins 30 secs ... 59 days 23 hrs 59 mins 30 secs | about 2 months      |
 * | 59 days 23 hrs 59 mins 30 secs ... 1 yr                           | [2..12] months      |
 * | 1 yr ... 1 yr 3 months                                            | about 1 year        |
 * | 1 yr 3 months ... 1 yr 9 month s                                  | over 1 year         |
 * | 1 yr 9 months ... 2 yrs                                           | almost 2 years      |
 * | N yrs ... N yrs 3 months                                          | about N years       |
 * | N yrs 3 months ... N yrs 9 months                                 | over N years        |
 * | N yrs 9 months ... N+1 yrs                                        | almost N+1 years    |
 *
 * With `options.includeSeconds == true`:
 * | Distance to now     | Result               |
 * |---------------------|----------------------|
 * | 0 secs ... 5 secs   | less than 5 seconds  |
 * | 5 secs ... 10 secs  | less than 10 seconds |
 * | 10 secs ... 20 secs | less than 20 seconds |
 * | 20 secs ... 40 secs | half a minute        |
 * | 40 secs ... 60 secs | less than a minute   |
 * | 60 secs ... 90 secs | 1 minute             |
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The given date
 * @param options - The object with options
 *
 * @returns The distance in words
 *
 * @throws `date` must not be Invalid Date
 * @throws `options.locale` must contain `formatDistance` property
 *
 * @example
 * // If today is 1 January 2015, what is the distance to 2 July 2014?
 * const result = formatDistanceToNow(
 *   new Date(2014, 6, 2)
 * )
 * //=> '6 months'
 *
 * @example
 * // If now is 1 January 2015 00:00:00,
 * // what is the distance to 1 January 2015 00:00:15, including seconds?
 * const result = formatDistanceToNow(
 *   new Date(2015, 0, 1, 0, 0, 15),
 *   {includeSeconds: true}
 * )
 * //=> 'less than 20 seconds'
 *
 * @example
 * // If today is 1 January 2015,
 * // what is the distance to 1 January 2016, with a suffix?
 * const result = formatDistanceToNow(
 *   new Date(2016, 0, 1),
 *   {addSuffix: true}
 * )
 * //=> 'in about 1 year'
 *
 * @example
 * // If today is 1 January 2015,
 * // what is the distance to 1 August 2016 in Esperanto?
 * const eoLocale = require('date-fns/locale/eo')
 * const result = formatDistanceToNow(
 *   new Date(2016, 7, 1),
 *   {locale: eoLocale}
 * )
 * //=> 'pli ol 1 jaro'
 */
function formatDistanceToNow(date, options) {
  return (0, _index2.formatDistance)(
    date,
    (0, _index.constructNow)(date),
    options,
  );
}


/***/ }),
/* 165 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.formatDistanceToNowStrict = formatDistanceToNowStrict;
var _index = __webpack_require__(163);
var _index2 = __webpack_require__(86);

/**
 * The {@link formatDistanceToNowStrict} function options.
 */

/**
 * @name formatDistanceToNowStrict
 * @category Common Helpers
 * @summary Return the distance between the given date and now in words.
 * @pure false
 *
 * @description
 * Return the distance between the given dates in words, using strict units.
 * This is like `formatDistance`, but does not use helpers like 'almost', 'over',
 * 'less than' and the like.
 *
 * | Distance between dates | Result              |
 * |------------------------|---------------------|
 * | 0 ... 59 secs          | [0..59] seconds     |
 * | 1 ... 59 mins          | [1..59] minutes     |
 * | 1 ... 23 hrs           | [1..23] hours       |
 * | 1 ... 29 days          | [1..29] days        |
 * | 1 ... 11 months        | [1..11] months      |
 * | 1 ... N years          | [1..N]  years       |
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The given date
 * @param options - An object with options.
 *
 * @returns The distance in words
 *
 * @throws `date` must not be Invalid Date
 * @throws `options.locale` must contain `formatDistance` property
 *
 * @example
 * // If today is 1 January 2015, what is the distance to 2 July 2014?
 * const result = formatDistanceToNowStrict(
 *   new Date(2014, 6, 2)
 * )
 * //=> '6 months'
 *
 * @example
 * // If now is 1 January 2015 00:00:00,
 * // what is the distance to 1 January 2015 00:00:15, including seconds?
 * const result = formatDistanceToNowStrict(
 *   new Date(2015, 0, 1, 0, 0, 15)
 * )
 * //=> '15 seconds'
 *
 * @example
 * // If today is 1 January 2015,
 * // what is the distance to 1 January 2016, with a suffix?
 * const result = formatDistanceToNowStrict(
 *   new Date(2016, 0, 1),
 *   {addSuffix: true}
 * )
 * //=> 'in 1 year'
 *
 * @example
 * // If today is 28 January 2015,
 * // what is the distance to 1 January 2015, in months, rounded up??
 * const result = formatDistanceToNowStrict(new Date(2015, 0, 1), {
 *   unit: 'month',
 *   roundingMethod: 'ceil'
 * })
 * //=> '1 month'
 *
 * @example
 * // If today is 1 January 2015,
 * // what is the distance to 1 January 2016 in Esperanto?
 * const eoLocale = require('date-fns/locale/eo')
 * const result = formatDistanceToNowStrict(
 *   new Date(2016, 0, 1),
 *   {locale: eoLocale}
 * )
 * //=> '1 jaro'
 */
function formatDistanceToNowStrict(date, options) {
  return (0, _index.formatDistanceStrict)(
    date,
    (0, _index2.constructNow)(date),
    options,
  );
}


/***/ }),
/* 166 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.formatDuration = formatDuration;

var _index = __webpack_require__(141);
var _index2 = __webpack_require__(67);

/**
 * The {@link formatDuration} function options.
 */

const defaultFormat = [
  "years",
  "months",
  "weeks",
  "days",
  "hours",
  "minutes",
  "seconds",
];

/**
 * @name formatDuration
 * @category Common Helpers
 * @summary Formats a duration in human-readable format
 *
 * @description
 * Return human-readable duration string i.e. "9 months 2 days"
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param duration - The duration to format
 * @param options - An object with options.
 *
 * @returns The formatted date string
 *
 * @example
 * // Format full duration
 * formatDuration({
 *   years: 2,
 *   months: 9,
 *   weeks: 1,
 *   days: 7,
 *   hours: 5,
 *   minutes: 9,
 *   seconds: 30
 * })
 * //=> '2 years 9 months 1 week 7 days 5 hours 9 minutes 30 seconds'
 *
 * @example
 * // Format partial duration
 * formatDuration({ months: 9, days: 2 })
 * //=> '9 months 2 days'
 *
 * @example
 * // Customize the format
 * formatDuration(
 *   {
 *     years: 2,
 *     months: 9,
 *     weeks: 1,
 *     days: 7,
 *     hours: 5,
 *     minutes: 9,
 *     seconds: 30
 *   },
 *   { format: ['months', 'weeks'] }
 * ) === '9 months 1 week'
 *
 * @example
 * // Customize the zeros presence
 * formatDuration({ years: 0, months: 9 })
 * //=> '9 months'
 * formatDuration({ years: 0, months: 9 }, { zero: true })
 * //=> '0 years 9 months'
 *
 * @example
 * // Customize the delimiter
 * formatDuration({ years: 2, months: 9, weeks: 3 }, { delimiter: ', ' })
 * //=> '2 years, 9 months, 3 weeks'
 */
function formatDuration(duration, options) {
  const defaultOptions = (0, _index2.getDefaultOptions)();
  const locale =
    options?.locale ?? defaultOptions.locale ?? _index.defaultLocale;
  const format = options?.format ?? defaultFormat;
  const zero = options?.zero ?? false;
  const delimiter = options?.delimiter ?? " ";

  if (!locale.formatDistance) {
    return "";
  }

  const result = format
    .reduce((acc, unit) => {
      const token = `x${unit.replace(/(^.)/, (m) => m.toUpperCase())}`;
      const value = duration[unit];
      if (value !== undefined && (zero || duration[unit])) {
        return acc.concat(locale.formatDistance(token, value));
      }
      return acc;
    }, [])
    .join(delimiter);

  return result;
}


/***/ }),
/* 167 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.formatISO = formatISO;
var _index = __webpack_require__(53);

var _index2 = __webpack_require__(158);

/**
 * The {@link formatISO} function options.
 */

/**
 * @name formatISO
 * @category Common Helpers
 * @summary Format the date according to the ISO 8601 standard (https://support.sas.com/documentation/cdl/en/lrdict/64316/HTML/default/viewer.htm#a003169814.htm).
 *
 * @description
 * Return the formatted date string in ISO 8601 format. Options may be passed to control the parts and notations of the date.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The original date
 * @param options - An object with options.
 *
 * @returns The formatted date string (in loca.l time zone)
 *
 * @throws `date` must not be Invalid Date
 *
 * @example
 * // Represent 18 September 2019 in ISO 8601 format (local time zone is UTC):
 * const result = formatISO(new Date(2019, 8, 18, 19, 0, 52))
 * //=> '2019-09-18T19:00:52Z'
 *
 * @example
 * // Represent 18 September 2019 in ISO 8601, short format (local time zone is UTC):
 * const result = formatISO(new Date(2019, 8, 18, 19, 0, 52), { format: 'basic' })
 * //=> '20190918T190052'
 *
 * @example
 * // Represent 18 September 2019 in ISO 8601 format, date only:
 * const result = formatISO(new Date(2019, 8, 18, 19, 0, 52), { representation: 'date' })
 * //=> '2019-09-18'
 *
 * @example
 * // Represent 18 September 2019 in ISO 8601 format, time only (local time zone is UTC):
 * const result = formatISO(new Date(2019, 8, 18, 19, 0, 52), { representation: 'time' })
 * //=> '19:00:52Z'
 */
function formatISO(date, options) {
  const _date = (0, _index.toDate)(date);

  if (isNaN(_date.getTime())) {
    throw new RangeError("Invalid time value");
  }

  const format = options?.format ?? "extended";
  const representation = options?.representation ?? "complete";

  let result = "";
  let tzOffset = "";

  const dateDelimiter = format === "extended" ? "-" : "";
  const timeDelimiter = format === "extended" ? ":" : "";

  // Representation is either 'date' or 'complete'
  if (representation !== "time") {
    const day = (0, _index2.addLeadingZeros)(_date.getDate(), 2);
    const month = (0, _index2.addLeadingZeros)(_date.getMonth() + 1, 2);
    const year = (0, _index2.addLeadingZeros)(_date.getFullYear(), 4);

    // yyyyMMdd or yyyy-MM-dd.
    result = `${year}${dateDelimiter}${month}${dateDelimiter}${day}`;
  }

  // Representation is either 'time' or 'complete'
  if (representation !== "date") {
    // Add the timezone.
    const offset = _date.getTimezoneOffset();

    if (offset !== 0) {
      const absoluteOffset = Math.abs(offset);
      const hourOffset = (0, _index2.addLeadingZeros)(
        Math.trunc(absoluteOffset / 60),
        2,
      );
      const minuteOffset = (0, _index2.addLeadingZeros)(absoluteOffset % 60, 2);
      // If less than 0, the sign is +, because it is ahead of time.
      const sign = offset < 0 ? "+" : "-";

      tzOffset = `${sign}${hourOffset}:${minuteOffset}`;
    } else {
      tzOffset = "Z";
    }

    const hour = (0, _index2.addLeadingZeros)(_date.getHours(), 2);
    const minute = (0, _index2.addLeadingZeros)(_date.getMinutes(), 2);
    const second = (0, _index2.addLeadingZeros)(_date.getSeconds(), 2);

    // If there's also date, separate it with time with 'T'
    const separator = result === "" ? "" : "T";

    // Creates a time string consisting of hour, minute, and second, separated by delimiters, if defined.
    const time = [hour, minute, second].join(timeDelimiter);

    // HHmmss or HH:mm:ss.
    result = `${result}${separator}${time}${tzOffset}`;
  }

  return result;
}


/***/ }),
/* 168 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.formatISO9075 = formatISO9075;
var _index = __webpack_require__(90);
var _index2 = __webpack_require__(53);

var _index3 = __webpack_require__(158);

/**
 * The {@link formatISO9075} function options.
 */

/**
 * @name formatISO9075
 * @category Common Helpers
 * @summary Format the date according to the ISO 9075 standard (https://dev.mysql.com/doc/refman/5.7/en/date-and-time-functions.html#function_get-format).
 *
 * @description
 * Return the formatted date string in ISO 9075 format. Options may be passed to control the parts and notations of the date.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The original date
 * @param options - An object with options.
 *
 * @returns The formatted date string
 *
 * @throws `date` must not be Invalid Date
 *
 * @example
 * // Represent 18 September 2019 in ISO 9075 format:
 * const result = formatISO9075(new Date(2019, 8, 18, 19, 0, 52))
 * //=> '2019-09-18 19:00:52'
 *
 * @example
 * // Represent 18 September 2019 in ISO 9075, short format:
 * const result = formatISO9075(new Date(2019, 8, 18, 19, 0, 52), { format: 'basic' })
 * //=> '20190918 190052'
 *
 * @example
 * // Represent 18 September 2019 in ISO 9075 format, date only:
 * const result = formatISO9075(new Date(2019, 8, 18, 19, 0, 52), { representation: 'date' })
 * //=> '2019-09-18'
 *
 * @example
 * // Represent 18 September 2019 in ISO 9075 format, time only:
 * const result = formatISO9075(new Date(2019, 8, 18, 19, 0, 52), { representation: 'time' })
 * //=> '19:00:52'
 */
function formatISO9075(date, options) {
  const _date = (0, _index2.toDate)(date);

  if (!(0, _index.isValid)(_date)) {
    throw new RangeError("Invalid time value");
  }

  const format = options?.format ?? "extended";
  const representation = options?.representation ?? "complete";

  let result = "";

  const dateDelimiter = format === "extended" ? "-" : "";
  const timeDelimiter = format === "extended" ? ":" : "";

  // Representation is either 'date' or 'complete'
  if (representation !== "time") {
    const day = (0, _index3.addLeadingZeros)(_date.getDate(), 2);
    const month = (0, _index3.addLeadingZeros)(_date.getMonth() + 1, 2);
    const year = (0, _index3.addLeadingZeros)(_date.getFullYear(), 4);

    // yyyyMMdd or yyyy-MM-dd.
    result = `${year}${dateDelimiter}${month}${dateDelimiter}${day}`;
  }

  // Representation is either 'time' or 'complete'
  if (representation !== "date") {
    const hour = (0, _index3.addLeadingZeros)(_date.getHours(), 2);
    const minute = (0, _index3.addLeadingZeros)(_date.getMinutes(), 2);
    const second = (0, _index3.addLeadingZeros)(_date.getSeconds(), 2);

    // If there's also date, separate it with time with a space
    const separator = result === "" ? "" : " ";

    // HHmmss or HH:mm:ss.
    result = `${result}${separator}${hour}${timeDelimiter}${minute}${timeDelimiter}${second}`;
  }

  return result;
}


/***/ }),
/* 169 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

exports.formatISODuration = formatISODuration;

/**
 * @name formatISODuration
 * @category Common Helpers
 * @summary Format a duration object according as ISO 8601 duration string
 *
 * @description
 * Format a duration object according to the ISO 8601 duration standard (https://www.digi.com/resources/documentation/digidocs//90001488-13/reference/r_iso_8601_duration_format.htm)
 *
 * @param duration - The duration to format
 *
 * @returns The ISO 8601 duration string
 *
 * @example
 * // Format the given duration as ISO 8601 string
 * const result = formatISODuration({
 *   years: 39,
 *   months: 2,
 *   days: 20,
 *   hours: 7,
 *   minutes: 5,
 *   seconds: 0
 * })
 * //=> 'P39Y2M20DT0H0M0S'
 */
function formatISODuration(duration) {
  const {
    years = 0,
    months = 0,
    days = 0,
    hours = 0,
    minutes = 0,
    seconds = 0,
  } = duration;

  return `P${years}Y${months}M${days}DT${hours}H${minutes}M${seconds}S`;
}


/***/ }),
/* 170 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.formatRFC3339 = formatRFC3339;
var _index = __webpack_require__(90);
var _index2 = __webpack_require__(53);
var _index3 = __webpack_require__(158);

/**
 * The {@link formatRFC3339} function options.
 */

/**
 * @name formatRFC3339
 * @category Common Helpers
 * @summary Format the date according to the RFC 3339 standard (https://tools.ietf.org/html/rfc3339#section-5.6).
 *
 * @description
 * Return the formatted date string in RFC 3339 format. Options may be passed to control the parts and notations of the date.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The original date
 * @param options - An object with options.
 *
 * @returns The formatted date string
 *
 * @throws `date` must not be Invalid Date
 *
 * @example
 * // Represent 18 September 2019 in RFC 3339 format:
 * formatRFC3339(new Date(2019, 8, 18, 19, 0, 52))
 * //=> '2019-09-18T19:00:52Z'
 *
 * @example
 * // Represent 18 September 2019 in RFC 3339 format, 3 digits of second fraction
 * formatRFC3339(new Date(2019, 8, 18, 19, 0, 52, 234), {
 *   fractionDigits: 3
 * })
 * //=> '2019-09-18T19:00:52.234Z'
 */
function formatRFC3339(date, options) {
  const _date = (0, _index2.toDate)(date);

  if (!(0, _index.isValid)(_date)) {
    throw new RangeError("Invalid time value");
  }

  const fractionDigits = options?.fractionDigits ?? 0;

  const day = (0, _index3.addLeadingZeros)(_date.getDate(), 2);
  const month = (0, _index3.addLeadingZeros)(_date.getMonth() + 1, 2);
  const year = _date.getFullYear();

  const hour = (0, _index3.addLeadingZeros)(_date.getHours(), 2);
  const minute = (0, _index3.addLeadingZeros)(_date.getMinutes(), 2);
  const second = (0, _index3.addLeadingZeros)(_date.getSeconds(), 2);

  let fractionalSecond = "";
  if (fractionDigits > 0) {
    const milliseconds = _date.getMilliseconds();
    const fractionalSeconds = Math.trunc(
      milliseconds * Math.pow(10, fractionDigits - 3),
    );
    fractionalSecond =
      "." + (0, _index3.addLeadingZeros)(fractionalSeconds, fractionDigits);
  }

  let offset = "";
  const tzOffset = _date.getTimezoneOffset();

  if (tzOffset !== 0) {
    const absoluteOffset = Math.abs(tzOffset);
    const hourOffset = (0, _index3.addLeadingZeros)(
      Math.trunc(absoluteOffset / 60),
      2,
    );
    const minuteOffset = (0, _index3.addLeadingZeros)(absoluteOffset % 60, 2);
    // If less than 0, the sign is +, because it is ahead of time.
    const sign = tzOffset < 0 ? "+" : "-";

    offset = `${sign}${hourOffset}:${minuteOffset}`;
  } else {
    offset = "Z";
  }

  return `${year}-${month}-${day}T${hour}:${minute}:${second}${fractionalSecond}${offset}`;
}


/***/ }),
/* 171 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.formatRFC7231 = formatRFC7231;
var _index = __webpack_require__(90);
var _index2 = __webpack_require__(53);
var _index3 = __webpack_require__(158);

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/**
 * @name formatRFC7231
 * @category Common Helpers
 * @summary Format the date according to the RFC 7231 standard (https://tools.ietf.org/html/rfc7231#section-7.1.1.1).
 *
 * @description
 * Return the formatted date string in RFC 7231 format.
 * The result will always be in UTC timezone.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The original date
 *
 * @returns The formatted date string
 *
 * @throws `date` must not be Invalid Date
 *
 * @example
 * // Represent 18 September 2019 in RFC 7231 format:
 * const result = formatRFC7231(new Date(2019, 8, 18, 19, 0, 52))
 * //=> 'Wed, 18 Sep 2019 19:00:52 GMT'
 */
function formatRFC7231(date) {
  const _date = (0, _index2.toDate)(date);

  if (!(0, _index.isValid)(_date)) {
    throw new RangeError("Invalid time value");
  }

  const dayName = days[_date.getUTCDay()];
  const dayOfMonth = (0, _index3.addLeadingZeros)(_date.getUTCDate(), 2);
  const monthName = months[_date.getUTCMonth()];
  const year = _date.getUTCFullYear();

  const hour = (0, _index3.addLeadingZeros)(_date.getUTCHours(), 2);
  const minute = (0, _index3.addLeadingZeros)(_date.getUTCMinutes(), 2);
  const second = (0, _index3.addLeadingZeros)(_date.getUTCSeconds(), 2);

  // Result variables.
  return `${dayName}, ${dayOfMonth} ${monthName} ${year} ${hour}:${minute}:${second} GMT`;
}


/***/ }),
/* 172 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.formatRelative = formatRelative;
var _index = __webpack_require__(69);
var _index2 = __webpack_require__(140);

var _index3 = __webpack_require__(53);

var _index4 = __webpack_require__(141);
var _index5 = __webpack_require__(67);

/**
 * The {@link formatRelative} function options.
 */

/**
 * @name formatRelative
 * @category Common Helpers
 * @summary Represent the date in words relative to the given base date.
 *
 * @description
 * Represent the date in words relative to the given base date.
 *
 * | Distance to the base date | Result                    |
 * |---------------------------|---------------------------|
 * | Previous 6 days           | last Sunday at 04:30 AM   |
 * | Last day                  | yesterday at 04:30 AM     |
 * | Same day                  | today at 04:30 AM         |
 * | Next day                  | tomorrow at 04:30 AM      |
 * | Next 6 days               | Sunday at 04:30 AM        |
 * | Other                     | 12/31/2017                |
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The date to format
 * @param baseDate - The date to compare with
 * @param options - An object with options
 *
 * @returns The date in words
 *
 * @throws `date` must not be Invalid Date
 * @throws `baseDate` must not be Invalid Date
 * @throws `options.locale` must contain `localize` property
 * @throws `options.locale` must contain `formatLong` property
 * @throws `options.locale` must contain `formatRelative` property
 *
 * @example
 * // Represent the date of 6 days ago in words relative to the given base date. In this example, today is Wednesday
 * const result = formatRelative(subDays(new Date(), 6), new Date())
 * //=> "last Thursday at 12:45 AM"
 */
function formatRelative(date, baseDate, options) {
  const _date = (0, _index3.toDate)(date);
  const _baseDate = (0, _index3.toDate)(baseDate);

  const defaultOptions = (0, _index5.getDefaultOptions)();
  const locale =
    options?.locale ?? defaultOptions.locale ?? _index4.defaultLocale;
  const weekStartsOn =
    options?.weekStartsOn ??
    options?.locale?.options?.weekStartsOn ??
    defaultOptions.weekStartsOn ??
    defaultOptions.locale?.options?.weekStartsOn ??
    0;

  const diff = (0, _index.differenceInCalendarDays)(_date, _baseDate);

  if (isNaN(diff)) {
    throw new RangeError("Invalid time value");
  }

  let token;
  if (diff < -6) {
    token = "other";
  } else if (diff < -1) {
    token = "lastWeek";
  } else if (diff < 0) {
    token = "yesterday";
  } else if (diff < 1) {
    token = "today";
  } else if (diff < 2) {
    token = "tomorrow";
  } else if (diff < 7) {
    token = "nextWeek";
  } else {
    token = "other";
  }

  const formatStr = locale.formatRelative(token, _date, _baseDate, {
    locale,
    weekStartsOn,
  });
  return (0, _index2.format)(_date, formatStr, { locale, weekStartsOn });
}


/***/ }),
/* 173 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.fromUnixTime = fromUnixTime;
var _index = __webpack_require__(53);

/**
 * @name fromUnixTime
 * @category Timestamp Helpers
 * @summary Create a date from a Unix timestamp.
 *
 * @description
 * Create a date from a Unix timestamp (in seconds). Decimal values will be discarded.
 *
 * @param unixTime - The given Unix timestamp (in seconds)
 *
 * @returns The date
 *
 * @example
 * // Create the date 29 February 2012 11:45:05:
 * const result = fromUnixTime(1330515905)
 * //=> Wed Feb 29 2012 11:45:05
 */
function fromUnixTime(unixTime) {
  return (0, _index.toDate)(unixTime * 1000);
}


/***/ }),
/* 174 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.getDate = getDate;
var _index = __webpack_require__(53);

/**
 * @name getDate
 * @category Day Helpers
 * @summary Get the day of the month of the given date.
 *
 * @description
 * Get the day of the month of the given date.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The given date
 *
 * @returns The day of month
 *
 * @example
 * // Which day of the month is 29 February 2012?
 * const result = getDate(new Date(2012, 1, 29))
 * //=> 29
 */
function getDate(date) {
  const _date = (0, _index.toDate)(date);
  const dayOfMonth = _date.getDate();
  return dayOfMonth;
}


/***/ }),
/* 175 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.getDay = getDay;
var _index = __webpack_require__(53);

/**
 * @name getDay
 * @category Weekday Helpers
 * @summary Get the day of the week of the given date.
 *
 * @description
 * Get the day of the week of the given date.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The given date
 *
 * @returns The day of week, 0 represents Sunday
 *
 * @example
 * // Which day of the week is 29 February 2012?
 * const result = getDay(new Date(2012, 1, 29))
 * //=> 3
 */
function getDay(date) {
  const _date = (0, _index.toDate)(date);
  const day = _date.getDay();
  return day;
}


/***/ }),
/* 176 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.getDaysInMonth = getDaysInMonth;
var _index = __webpack_require__(53);
var _index2 = __webpack_require__(54);

/**
 * @name getDaysInMonth
 * @category Month Helpers
 * @summary Get the number of days in a month of the given date.
 *
 * @description
 * Get the number of days in a month of the given date.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The given date
 *
 * @returns The number of days in a month
 *
 * @example
 * // How many days are in February 2000?
 * const result = getDaysInMonth(new Date(2000, 1))
 * //=> 29
 */
function getDaysInMonth(date) {
  const _date = (0, _index.toDate)(date);
  const year = _date.getFullYear();
  const monthIndex = _date.getMonth();
  const lastDayOfMonth = (0, _index2.constructFrom)(date, 0);
  lastDayOfMonth.setFullYear(year, monthIndex + 1, 0);
  lastDayOfMonth.setHours(0, 0, 0, 0);
  return lastDayOfMonth.getDate();
}


/***/ }),
/* 177 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.getDaysInYear = getDaysInYear;
var _index = __webpack_require__(178);
var _index2 = __webpack_require__(53);

/**
 * @name getDaysInYear
 * @category Year Helpers
 * @summary Get the number of days in a year of the given date.
 *
 * @description
 * Get the number of days in a year of the given date.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The given date
 *
 * @returns The number of days in a year
 *
 * @example
 * // How many days are in 2012?
 * const result = getDaysInYear(new Date(2012, 0, 1))
 * //=> 366
 */
function getDaysInYear(date) {
  const _date = (0, _index2.toDate)(date);

  if (String(new Date(_date)) === "Invalid Date") {
    return NaN;
  }

  return (0, _index.isLeapYear)(_date) ? 366 : 365;
}


/***/ }),
/* 178 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.isLeapYear = isLeapYear;
var _index = __webpack_require__(53);

/**
 * @name isLeapYear
 * @category Year Helpers
 * @summary Is the given date in the leap year?
 *
 * @description
 * Is the given date in the leap year?
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The date to check
 *
 * @returns The date is in the leap year
 *
 * @example
 * // Is 1 September 2012 in the leap year?
 * const result = isLeapYear(new Date(2012, 8, 1))
 * //=> true
 */
function isLeapYear(date) {
  const _date = (0, _index.toDate)(date);
  const year = _date.getFullYear();
  return year % 400 === 0 || (year % 4 === 0 && year % 100 !== 0);
}


/***/ }),
/* 179 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.getDecade = getDecade;
var _index = __webpack_require__(53);

/**
 * @name getDecade
 * @category Decade Helpers
 * @summary Get the decade of the given date.
 *
 * @description
 * Get the decade of the given date.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The given date
 *
 * @returns The year of decade
 *
 * @example
 * // Which decade belongs 27 November 1942?
 * const result = getDecade(new Date(1942, 10, 27))
 * //=> 1940
 */
function getDecade(date) {
  // TODO: Switch to more technical definition in of decades that start with 1
  // end with 0. I.e. 2001-2010 instead of current 2000-2009. It's a breaking
  // change, so it can only be done in 4.0.
  const _date = (0, _index.toDate)(date);
  const year = _date.getFullYear();
  const decade = Math.floor(year / 10) * 10;
  return decade;
}


/***/ }),
/* 180 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.getDefaultOptions = getDefaultOptions;

var _index = __webpack_require__(67);

/**
 * @name getDefaultOptions
 * @category Common Helpers
 * @summary Get default options.
 * @pure false
 *
 * @description
 * Returns an object that contains defaults for
 * `options.locale`, `options.weekStartsOn` and `options.firstWeekContainsDate`
 * arguments for all functions.
 *
 * You can change these with [setDefaultOptions](https://date-fns.org/docs/setDefaultOptions).
 *
 * @returns The default options
 *
 * @example
 * const result = getDefaultOptions()
 * //=> {}
 *
 * @example
 * setDefaultOptions({ weekStarsOn: 1, firstWeekContainsDate: 4 })
 * const result = getDefaultOptions()
 * //=> { weekStarsOn: 1, firstWeekContainsDate: 4 }
 */
function getDefaultOptions() {
  return Object.assign({}, (0, _index.getDefaultOptions)());
}


/***/ }),
/* 181 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.getHours = getHours;
var _index = __webpack_require__(53);

/**
 * @name getHours
 * @category Hour Helpers
 * @summary Get the hours of the given date.
 *
 * @description
 * Get the hours of the given date.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The given date
 *
 * @returns The hours
 *
 * @example
 * // Get the hours of 29 February 2012 11:45:00:
 * const result = getHours(new Date(2012, 1, 29, 11, 45))
 * //=> 11
 */
function getHours(date) {
  const _date = (0, _index.toDate)(date);
  const hours = _date.getHours();
  return hours;
}


/***/ }),
/* 182 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.getISODay = getISODay;
var _index = __webpack_require__(53);

/**
 * @name getISODay
 * @category Weekday Helpers
 * @summary Get the day of the ISO week of the given date.
 *
 * @description
 * Get the day of the ISO week of the given date,
 * which is 7 for Sunday, 1 for Monday etc.
 *
 * ISO week-numbering year: http://en.wikipedia.org/wiki/ISO_week_date
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The given date
 *
 * @returns The day of ISO week
 *
 * @example
 * // Which day of the ISO week is 26 February 2012?
 * const result = getISODay(new Date(2012, 1, 26))
 * //=> 7
 */
function getISODay(date) {
  const _date = (0, _index.toDate)(date);
  let day = _date.getDay();

  if (day === 0) {
    day = 7;
  }

  return day;
}


/***/ }),
/* 183 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.getISOWeeksInYear = getISOWeeksInYear;
var _index = __webpack_require__(76);
var _index2 = __webpack_require__(62);
var _index3 = __webpack_require__(72);

/**
 * @name getISOWeeksInYear
 * @category ISO Week-Numbering Year Helpers
 * @summary Get the number of weeks in an ISO week-numbering year of the given date.
 *
 * @description
 * Get the number of weeks in an ISO week-numbering year of the given date.
 *
 * ISO week-numbering year: http://en.wikipedia.org/wiki/ISO_week_date
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The given date
 *
 * @returns The number of ISO weeks in a year
 *
 * @example
 * // How many weeks are in ISO week-numbering year 2015?
 * const result = getISOWeeksInYear(new Date(2015, 1, 11))
 * //=> 53
 */
function getISOWeeksInYear(date) {
  const thisYear = (0, _index3.startOfISOWeekYear)(date);
  const nextYear = (0, _index3.startOfISOWeekYear)(
    (0, _index.addWeeks)(thisYear, 60),
  );
  const diff = +nextYear - +thisYear;

  // Round the number of weeks to the nearest integer because the number of
  // milliseconds in a week is not constant (e.g. it's different in the week of
  // the daylight saving time clock shift).
  return Math.round(diff / _index2.millisecondsInWeek);
}


/***/ }),
/* 184 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.getMilliseconds = getMilliseconds;
var _index = __webpack_require__(53);

/**
 * @name getMilliseconds
 * @category Millisecond Helpers
 * @summary Get the milliseconds of the given date.
 *
 * @description
 * Get the milliseconds of the given date.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The given date
 *
 * @returns The milliseconds
 *
 * @example
 * // Get the milliseconds of 29 February 2012 11:45:05.123:
 * const result = getMilliseconds(new Date(2012, 1, 29, 11, 45, 5, 123))
 * //=> 123
 */
function getMilliseconds(date) {
  const _date = (0, _index.toDate)(date);
  const milliseconds = _date.getMilliseconds();
  return milliseconds;
}


/***/ }),
/* 185 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.getMinutes = getMinutes;
var _index = __webpack_require__(53);

/**
 * @name getMinutes
 * @category Minute Helpers
 * @summary Get the minutes of the given date.
 *
 * @description
 * Get the minutes of the given date.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The given date
 *
 * @returns The minutes
 *
 * @example
 * // Get the minutes of 29 February 2012 11:45:05:
 * const result = getMinutes(new Date(2012, 1, 29, 11, 45, 5))
 * //=> 45
 */
function getMinutes(date) {
  const _date = (0, _index.toDate)(date);
  const minutes = _date.getMinutes();
  return minutes;
}


/***/ }),
/* 186 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.getMonth = getMonth;
var _index = __webpack_require__(53);

/**
 * @name getMonth
 * @category Month Helpers
 * @summary Get the month of the given date.
 *
 * @description
 * Get the month of the given date.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The given date
 *
 * @returns The month index (0-11)
 *
 * @example
 * // Which month is 29 February 2012?
 * const result = getMonth(new Date(2012, 1, 29))
 * //=> 1
 */
function getMonth(date) {
  const _date = (0, _index.toDate)(date);
  const month = _date.getMonth();
  return month;
}


/***/ }),
/* 187 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.getOverlappingDaysInIntervals = getOverlappingDaysInIntervals;
var _index = __webpack_require__(71);
var _index2 = __webpack_require__(62);
var _index3 = __webpack_require__(53);

/**
 * @name getOverlappingDaysInIntervals
 * @category Interval Helpers
 * @summary Get the number of days that overlap in two time intervals
 *
 * @description
 * Get the number of days that overlap in two time intervals. It uses the time
 * between dates to calculate the number of days, rounding it up to include
 * partial days.
 *
 * Two equal 0-length intervals will result in 0. Two equal 1ms intervals will
 * result in 1.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param intervalLeft - The first interval to compare.
 * @param intervalRight - The second interval to compare.
 *
 * @returns The number of days that overlap in two time intervals
 *
 * @example
 * // For overlapping time intervals adds 1 for each started overlapping day:
 * getOverlappingDaysInIntervals(
 *   { start: new Date(2014, 0, 10), end: new Date(2014, 0, 20) },
 *   { start: new Date(2014, 0, 17), end: new Date(2014, 0, 21) }
 * )
 * //=> 3
 *
 * @example
 * // For non-overlapping time intervals returns 0:
 * getOverlappingDaysInIntervals(
 *   { start: new Date(2014, 0, 10), end: new Date(2014, 0, 20) },
 *   { start: new Date(2014, 0, 21), end: new Date(2014, 0, 22) }
 * )
 * //=> 0
 */

function getOverlappingDaysInIntervals(intervalLeft, intervalRight) {
  const [leftStart, leftEnd] = [
    +(0, _index3.toDate)(intervalLeft.start),
    +(0, _index3.toDate)(intervalLeft.end),
  ].sort((a, b) => a - b);
  const [rightStart, rightEnd] = [
    +(0, _index3.toDate)(intervalRight.start),
    +(0, _index3.toDate)(intervalRight.end),
  ].sort((a, b) => a - b);

  // Prevent NaN result if intervals don't overlap at all.
  const isOverlapping = leftStart < rightEnd && rightStart < leftEnd;
  if (!isOverlapping) return 0;

  // Remove the timezone offset to negate the DST effect on calculations.
  const overlapLeft = rightStart < leftStart ? leftStart : rightStart;
  const left =
    overlapLeft - (0, _index.getTimezoneOffsetInMilliseconds)(overlapLeft);
  const overlapRight = rightEnd > leftEnd ? leftEnd : rightEnd;
  const right =
    overlapRight - (0, _index.getTimezoneOffsetInMilliseconds)(overlapRight);

  // Ceil the number to include partial days too.
  return Math.ceil((right - left) / _index2.millisecondsInDay);
}


/***/ }),
/* 188 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.getSeconds = getSeconds;
var _index = __webpack_require__(53);

/**
 * @name getSeconds
 * @category Second Helpers
 * @summary Get the seconds of the given date.
 *
 * @description
 * Get the seconds of the given date.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The given date
 *
 * @returns The seconds
 *
 * @example
 * // Get the seconds of 29 February 2012 11:45:05.123:
 * const result = getSeconds(new Date(2012, 1, 29, 11, 45, 5, 123))
 * //=> 5
 */
function getSeconds(date) {
  const _date = (0, _index.toDate)(date);
  const seconds = _date.getSeconds();
  return seconds;
}


/***/ }),
/* 189 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.getTime = getTime;
var _index = __webpack_require__(53);

/**
 * @name getTime
 * @category Timestamp Helpers
 * @summary Get the milliseconds timestamp of the given date.
 *
 * @description
 * Get the milliseconds timestamp of the given date.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The given date
 *
 * @returns The timestamp
 *
 * @example
 * // Get the timestamp of 29 February 2012 11:45:05.123:
 * const result = getTime(new Date(2012, 1, 29, 11, 45, 5, 123))
 * //=> 1330515905123
 */
function getTime(date) {
  const _date = (0, _index.toDate)(date);
  const timestamp = _date.getTime();
  return timestamp;
}


/***/ }),
/* 190 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.getUnixTime = getUnixTime;
var _index = __webpack_require__(53);

/**
 * @name getUnixTime
 * @category Timestamp Helpers
 * @summary Get the seconds timestamp of the given date.
 *
 * @description
 * Get the seconds timestamp of the given date.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The given date
 *
 * @returns The timestamp
 *
 * @example
 * // Get the timestamp of 29 February 2012 11:45:05 CET:
 * const result = getUnixTime(new Date(2012, 1, 29, 11, 45, 5))
 * //=> 1330512305
 */
function getUnixTime(date) {
  return Math.trunc(+(0, _index.toDate)(date) / 1000);
}


/***/ }),
/* 191 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.getWeekOfMonth = getWeekOfMonth;
var _index = __webpack_require__(174);
var _index2 = __webpack_require__(175);
var _index3 = __webpack_require__(124);

var _index4 = __webpack_require__(67);

/**
 * The {@link getWeekOfMonth} function options.
 */

/**
 * @name getWeekOfMonth
 * @category Week Helpers
 * @summary Get the week of the month of the given date.
 *
 * @description
 * Get the week of the month of the given date.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The given date
 * @param options - An object with options.
 *
 * @returns The week of month
 *
 * @example
 * // Which week of the month is 9 November 2017?
 * const result = getWeekOfMonth(new Date(2017, 10, 9))
 * //=> 2
 */
function getWeekOfMonth(date, options) {
  const defaultOptions = (0, _index4.getDefaultOptions)();
  const weekStartsOn =
    options?.weekStartsOn ??
    options?.locale?.options?.weekStartsOn ??
    defaultOptions.weekStartsOn ??
    defaultOptions.locale?.options?.weekStartsOn ??
    0;

  const currentDayOfMonth = (0, _index.getDate)(date);
  if (isNaN(currentDayOfMonth)) return NaN;

  const startWeekDay = (0, _index2.getDay)((0, _index3.startOfMonth)(date));

  let lastDayOfFirstWeek = weekStartsOn - startWeekDay;
  if (lastDayOfFirstWeek <= 0) lastDayOfFirstWeek += 7;

  const remainingDaysAfterFirstWeek = currentDayOfMonth - lastDayOfFirstWeek;
  return Math.ceil(remainingDaysAfterFirstWeek / 7) + 1;
}


/***/ }),
/* 192 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.getWeeksInMonth = getWeeksInMonth;
var _index = __webpack_require__(97);
var _index2 = __webpack_require__(193);
var _index3 = __webpack_require__(124);

/**
 * The {@link getWeeksInMonth} function options.
 */

/**
 * @name getWeeksInMonth
 * @category Week Helpers
 * @summary Get the number of calendar weeks a month spans.
 *
 * @description
 * Get the number of calendar weeks the month in the given date spans.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The given date
 * @param options - An object with options.
 *
 * @returns The number of calendar weeks
 *
 * @example
 * // How many calendar weeks does February 2015 span?
 * const result = getWeeksInMonth(new Date(2015, 1, 8))
 * //=> 4
 *
 * @example
 * // If the week starts on Monday,
 * // how many calendar weeks does July 2017 span?
 * const result = getWeeksInMonth(new Date(2017, 6, 5), { weekStartsOn: 1 })
 * //=> 6
 */
function getWeeksInMonth(date, options) {
  return (
    (0, _index.differenceInCalendarWeeks)(
      (0, _index2.lastDayOfMonth)(date),
      (0, _index3.startOfMonth)(date),
      options,
    ) + 1
  );
}


/***/ }),
/* 193 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.lastDayOfMonth = lastDayOfMonth;
var _index = __webpack_require__(53);

/**
 * @name lastDayOfMonth
 * @category Month Helpers
 * @summary Return the last day of a month for the given date.
 *
 * @description
 * Return the last day of a month for the given date.
 * The result will be in the local timezone.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The original date
 *
 * @returns The last day of a month
 *
 * @example
 * // The last day of a month for 2 September 2014 11:55:00:
 * const result = lastDayOfMonth(new Date(2014, 8, 2, 11, 55, 0))
 * //=> Tue Sep 30 2014 00:00:00
 */
function lastDayOfMonth(date) {
  const _date = (0, _index.toDate)(date);
  const month = _date.getMonth();
  _date.setFullYear(_date.getFullYear(), month + 1, 0);
  _date.setHours(0, 0, 0, 0);
  return _date;
}


/***/ }),
/* 194 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.getYear = getYear;
var _index = __webpack_require__(53);

/**
 * @name getYear
 * @category Year Helpers
 * @summary Get the year of the given date.
 *
 * @description
 * Get the year of the given date.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The given date
 *
 * @returns The year
 *
 * @example
 * // Which year is 2 July 2014?
 * const result = getYear(new Date(2014, 6, 2))
 * //=> 2014
 */
function getYear(date) {
  return (0, _index.toDate)(date).getFullYear();
}


/***/ }),
/* 195 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.hoursToMilliseconds = hoursToMilliseconds;
var _index = __webpack_require__(62);

/**
 * @name hoursToMilliseconds
 * @category  Conversion Helpers
 * @summary Convert hours to milliseconds.
 *
 * @description
 * Convert a number of hours to a full number of milliseconds.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param hours - number of hours to be converted
 *
 * @returns The number of hours converted to milliseconds
 *
 * @example
 * // Convert 2 hours to milliseconds:
 * const result = hoursToMilliseconds(2)
 * //=> 7200000
 */
function hoursToMilliseconds(hours) {
  return Math.trunc(hours * _index.millisecondsInHour);
}


/***/ }),
/* 196 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.hoursToMinutes = hoursToMinutes;
var _index = __webpack_require__(62);

/**
 * @name hoursToMinutes
 * @category Conversion Helpers
 * @summary Convert hours to minutes.
 *
 * @description
 * Convert a number of hours to a full number of minutes.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param hours - number of hours to be converted
 *
 * @returns The number of hours converted in minutes
 *
 * @example
 * // Convert 2 hours to minutes:
 * const result = hoursToMinutes(2)
 * //=> 120
 */
function hoursToMinutes(hours) {
  return Math.trunc(hours * _index.minutesInHour);
}


/***/ }),
/* 197 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.hoursToSeconds = hoursToSeconds;
var _index = __webpack_require__(62);

/**
 * @name hoursToSeconds
 * @category Conversion Helpers
 * @summary Convert hours to seconds.
 *
 * @description
 * Convert a number of hours to a full number of seconds.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param hours - The number of hours to be converted
 *
 * @returns The number of hours converted in seconds
 *
 * @example
 * // Convert 2 hours to seconds:
 * const result = hoursToSeconds(2)
 * //=> 7200
 */
function hoursToSeconds(hours) {
  return Math.trunc(hours * _index.secondsInHour);
}


/***/ }),
/* 198 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.interval = interval;
var _index = __webpack_require__(53);

/**
 * The {@link interval} function options.
 */

/**
 * @name interval
 * @category Interval Helpers
 * @summary Creates an interval object and validates its values.
 *
 * @description
 * Creates a normalized interval object and validates its values. If the interval is invalid, an exception is thrown.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param start - The start of the interval.
 * @param end - The end of the interval.
 * @param options - The options object.
 *
 * @throws `Start date is invalid` when `start` is invalid.
 * @throws `End date is invalid` when `end` is invalid.
 * @throws `End date must be after start date` when end is before `start` and `options.assertPositive` is true.
 *
 * @returns The normalized and validated interval object.
 */
function interval(start, end, options) {
  const _start = (0, _index.toDate)(start);
  if (isNaN(+_start)) throw new TypeError("Start date is invalid");

  const _end = (0, _index.toDate)(end);
  if (isNaN(+_end)) throw new TypeError("End date is invalid");

  if (options?.assertPositive && +_start > +_end)
    throw new TypeError("End date must be after start date");

  return { start: _start, end: _end };
}


/***/ }),
/* 199 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.intervalToDuration = intervalToDuration;
var _index = __webpack_require__(51);
var _index2 = __webpack_require__(99);
var _index3 = __webpack_require__(100);
var _index4 = __webpack_require__(105);
var _index5 = __webpack_require__(106);
var _index6 = __webpack_require__(111);
var _index7 = __webpack_require__(113);
var _index8 = __webpack_require__(53);

/**
 * @name intervalToDuration
 * @category Common Helpers
 * @summary Convert interval to duration
 *
 * @description
 * Convert a interval object to a duration object.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param interval - The interval to convert to duration
 *
 * @returns The duration object
 *
 * @example
 * // Get the duration between January 15, 1929 and April 4, 1968.
 * intervalToDuration({
 *   start: new Date(1929, 0, 15, 12, 0, 0),
 *   end: new Date(1968, 3, 4, 19, 5, 0)
 * })
 * // => { years: 39, months: 2, days: 20, hours: 7, minutes: 5, seconds: 0 }
 */
function intervalToDuration(interval) {
  const start = (0, _index8.toDate)(interval.start);
  const end = (0, _index8.toDate)(interval.end);

  const duration = {};

  const years = (0, _index7.differenceInYears)(end, start);
  if (years) duration.years = years;

  const remainingMonths = (0, _index.add)(start, { years: duration.years });

  const months = (0, _index5.differenceInMonths)(end, remainingMonths);
  if (months) duration.months = months;

  const remainingDays = (0, _index.add)(remainingMonths, {
    months: duration.months,
  });

  const days = (0, _index2.differenceInDays)(end, remainingDays);
  if (days) duration.days = days;

  const remainingHours = (0, _index.add)(remainingDays, {
    days: duration.days,
  });

  const hours = (0, _index3.differenceInHours)(end, remainingHours);
  if (hours) duration.hours = hours;

  const remainingMinutes = (0, _index.add)(remainingHours, {
    hours: duration.hours,
  });

  const minutes = (0, _index4.differenceInMinutes)(end, remainingMinutes);
  if (minutes) duration.minutes = minutes;

  const remainingSeconds = (0, _index.add)(remainingMinutes, {
    minutes: duration.minutes,
  });

  const seconds = (0, _index6.differenceInSeconds)(end, remainingSeconds);
  if (seconds) duration.seconds = seconds;

  return duration;
}


/***/ }),
/* 200 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.intlFormat = intlFormat;
var _index = __webpack_require__(53);

/**
 * The locale string (see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl#locales_argument).
 */

/**
 * The format options (see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat#options)
 */

/**
 * The locale options.
 */

/**
 * @name intlFormat
 * @category Common Helpers
 * @summary Format the date with Intl.DateTimeFormat (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat).
 *
 * @description
 * Return the formatted date string in the given format.
 * The method uses [`Intl.DateTimeFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat) inside.
 * formatOptions are the same as [`Intl.DateTimeFormat` options](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat#using_options)
 *
 * > ⚠️ Please note that before Node version 13.0.0, only the locale data for en-US is available by default.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The date to format
 *
 * @returns The formatted date string
 *
 * @throws `date` must not be Invalid Date
 *
 * @example
 * // Represent 4 October 2019 in middle-endian format:
 * const result = intlFormat(new Date(2019, 9, 4, 12, 30, 13, 456))
 * //=> 10/4/2019
 */

/**
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The date to format
 * @param localeOptions - An object with locale
 *
 * @returns The formatted date string
 *
 * @throws `date` must not be Invalid Date
 *
 * @example
 * // Represent 4 October 2019 in Korean.
 * // Convert the date with locale's options.
 * const result = intlFormat(new Date(2019, 9, 4, 12, 30, 13, 456), {
 *   locale: 'ko-KR',
 * })
 * //=> 2019. 10. 4.
 */

/**
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The date to format
 * @param formatOptions - The format options
 *
 * @returns The formatted date string
 *
 * @throws `date` must not be Invalid Date
 *
 * @example
 * // Represent 4 October 2019.
 * // Convert the date with format's options.
 * const result = intlFormat.default(new Date(2019, 9, 4, 12, 30, 13, 456), {
 *   year: 'numeric',
 *   month: 'numeric',
 *   day: 'numeric',
 *   hour: 'numeric',
 * })
 * //=> 10/4/2019, 12 PM
 */

/**
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The date to format
 * @param formatOptions - The format options
 * @param localeOptions - An object with locale
 *
 * @returns The formatted date string
 *
 * @throws `date` must not be Invalid Date
 *
 * @example
 * // Represent 4 October 2019 in German.
 * // Convert the date with format's options and locale's options.
 * const result = intlFormat(new Date(2019, 9, 4, 12, 30, 13, 456), {
 *   weekday: 'long',
 *   year: 'numeric',
 *   month: 'long',
 *   day: 'numeric',
 * }, {
 *   locale: 'de-DE',
 * })
 * //=> Freitag, 4. Oktober 2019
 */

function intlFormat(date, formatOrLocale, localeOptions) {
  let formatOptions;

  if (isFormatOptions(formatOrLocale)) {
    formatOptions = formatOrLocale;
  } else {
    localeOptions = formatOrLocale;
  }

  return new Intl.DateTimeFormat(localeOptions?.locale, formatOptions).format(
    (0, _index.toDate)(date),
  );
}

function isFormatOptions(opts) {
  return opts !== undefined && !("locale" in opts);
}


/***/ }),
/* 201 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.intlFormatDistance = intlFormatDistance;
var _index = __webpack_require__(62);

var _index2 = __webpack_require__(69);
var _index3 = __webpack_require__(94);
var _index4 = __webpack_require__(95);
var _index5 = __webpack_require__(97);
var _index6 = __webpack_require__(98);
var _index7 = __webpack_require__(100);
var _index8 = __webpack_require__(105);
var _index9 = __webpack_require__(111);
var _index10 = __webpack_require__(53);

/**
 * The {@link intlFormatDistance} function options.
 */

/**
 * The unit used to format the distance in {@link intlFormatDistance}.
 */

/**
 * @name intlFormatDistance
 * @category Common Helpers
 * @summary Formats distance between two dates in a human-readable format
 * @description
 * The function calculates the difference between two dates and formats it as a human-readable string.
 *
 * The function will pick the most appropriate unit depending on the distance between dates. For example, if the distance is a few hours, it might return `x hours`. If the distance is a few months, it might return `x months`.
 *
 * You can also specify a unit to force using it regardless of the distance to get a result like `123456 hours`.
 *
 * See the table below for the unit picking logic:
 *
 * | Distance between dates | Result (past)  | Result (future) |
 * | ---------------------- | -------------- | --------------- |
 * | 0 seconds              | now            | now             |
 * | 1-59 seconds           | X seconds ago  | in X seconds    |
 * | 1-59 minutes           | X minutes ago  | in X minutes    |
 * | 1-23 hours             | X hours ago    | in X hours      |
 * | 1 day                  | yesterday      | tomorrow        |
 * | 2-6 days               | X days ago     | in X days       |
 * | 7 days                 | last week      | next week       |
 * | 8 days-1 month         | X weeks ago    | in X weeks      |
 * | 1 month                | last month     | next month      |
 * | 2-3 months             | X months ago   | in X months     |
 * | 1 quarter              | last quarter   | next quarter    |
 * | 2-3 quarters           | X quarters ago | in X quarters   |
 * | 1 year                 | last year      | next year       |
 * | 2+ years               | X years ago    | in X years      |
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The date
 * @param baseDate - The date to compare with.
 * @param options - An object with options.
 * See MDN for details [Locale identification and negotiation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl#locale_identification_and_negotiation)
 * The narrow one could be similar to the short one for some locales.
 *
 * @returns The distance in words according to language-sensitive relative time formatting.
 *
 * @throws `date` must not be Invalid Date
 * @throws `baseDate` must not be Invalid Date
 * @throws `options.unit` must not be invalid Unit
 * @throws `options.locale` must not be invalid locale
 * @throws `options.localeMatcher` must not be invalid localeMatcher
 * @throws `options.numeric` must not be invalid numeric
 * @throws `options.style` must not be invalid style
 *
 * @example
 * // What is the distance between the dates when the fist date is after the second?
 * intlFormatDistance(
 *   new Date(1986, 3, 4, 11, 30, 0),
 *   new Date(1986, 3, 4, 10, 30, 0)
 * )
 * //=> 'in 1 hour'
 *
 * // What is the distance between the dates when the fist date is before the second?
 * intlFormatDistance(
 *   new Date(1986, 3, 4, 10, 30, 0),
 *   new Date(1986, 3, 4, 11, 30, 0)
 * )
 * //=> '1 hour ago'
 *
 * @example
 * // Use the unit option to force the function to output the result in quarters. Without setting it, the example would return "next year"
 * intlFormatDistance(
 *   new Date(1987, 6, 4, 10, 30, 0),
 *   new Date(1986, 3, 4, 10, 30, 0),
 *   { unit: 'quarter' }
 * )
 * //=> 'in 5 quarters'
 *
 * @example
 * // Use the locale option to get the result in Spanish. Without setting it, the example would return "in 1 hour".
 * intlFormatDistance(
 *   new Date(1986, 3, 4, 11, 30, 0),
 *   new Date(1986, 3, 4, 10, 30, 0),
 *   { locale: 'es' }
 * )
 * //=> 'dentro de 1 hora'
 *
 * @example
 * // Use the numeric option to force the function to use numeric values. Without setting it, the example would return "tomorrow".
 * intlFormatDistance(
 *   new Date(1986, 3, 5, 11, 30, 0),
 *   new Date(1986, 3, 4, 11, 30, 0),
 *   { numeric: 'always' }
 * )
 * //=> 'in 1 day'
 *
 * @example
 * // Use the style option to force the function to use short values. Without setting it, the example would return "in 2 years".
 * intlFormatDistance(
 *   new Date(1988, 3, 4, 11, 30, 0),
 *   new Date(1986, 3, 4, 11, 30, 0),
 *   { style: 'short' }
 * )
 * //=> 'in 2 yr'
 */
function intlFormatDistance(date, baseDate, options) {
  let value = 0;
  let unit;
  const dateLeft = (0, _index10.toDate)(date);
  const dateRight = (0, _index10.toDate)(baseDate);

  if (!options?.unit) {
    // Get the unit based on diffInSeconds calculations if no unit is specified
    const diffInSeconds = (0, _index9.differenceInSeconds)(dateLeft, dateRight); // The smallest unit

    if (Math.abs(diffInSeconds) < _index.secondsInMinute) {
      value = (0, _index9.differenceInSeconds)(dateLeft, dateRight);
      unit = "second";
    } else if (Math.abs(diffInSeconds) < _index.secondsInHour) {
      value = (0, _index8.differenceInMinutes)(dateLeft, dateRight);
      unit = "minute";
    } else if (
      Math.abs(diffInSeconds) < _index.secondsInDay &&
      Math.abs((0, _index2.differenceInCalendarDays)(dateLeft, dateRight)) < 1
    ) {
      value = (0, _index7.differenceInHours)(dateLeft, dateRight);
      unit = "hour";
    } else if (
      Math.abs(diffInSeconds) < _index.secondsInWeek &&
      (value = (0, _index2.differenceInCalendarDays)(dateLeft, dateRight)) &&
      Math.abs(value) < 7
    ) {
      unit = "day";
    } else if (Math.abs(diffInSeconds) < _index.secondsInMonth) {
      value = (0, _index5.differenceInCalendarWeeks)(dateLeft, dateRight);
      unit = "week";
    } else if (Math.abs(diffInSeconds) < _index.secondsInQuarter) {
      value = (0, _index3.differenceInCalendarMonths)(dateLeft, dateRight);
      unit = "month";
    } else if (Math.abs(diffInSeconds) < _index.secondsInYear) {
      if ((0, _index4.differenceInCalendarQuarters)(dateLeft, dateRight) < 4) {
        // To filter out cases that are less than a year but match 4 quarters
        value = (0, _index4.differenceInCalendarQuarters)(dateLeft, dateRight);
        unit = "quarter";
      } else {
        value = (0, _index6.differenceInCalendarYears)(dateLeft, dateRight);
        unit = "year";
      }
    } else {
      value = (0, _index6.differenceInCalendarYears)(dateLeft, dateRight);
      unit = "year";
    }
  } else {
    // Get the value if unit is specified
    unit = options?.unit;
    if (unit === "second") {
      value = (0, _index9.differenceInSeconds)(dateLeft, dateRight);
    } else if (unit === "minute") {
      value = (0, _index8.differenceInMinutes)(dateLeft, dateRight);
    } else if (unit === "hour") {
      value = (0, _index7.differenceInHours)(dateLeft, dateRight);
    } else if (unit === "day") {
      value = (0, _index2.differenceInCalendarDays)(dateLeft, dateRight);
    } else if (unit === "week") {
      value = (0, _index5.differenceInCalendarWeeks)(dateLeft, dateRight);
    } else if (unit === "month") {
      value = (0, _index3.differenceInCalendarMonths)(dateLeft, dateRight);
    } else if (unit === "quarter") {
      value = (0, _index4.differenceInCalendarQuarters)(dateLeft, dateRight);
    } else if (unit === "year") {
      value = (0, _index6.differenceInCalendarYears)(dateLeft, dateRight);
    }
  }

  const rtf = new Intl.RelativeTimeFormat(options?.locale, {
    localeMatcher: options?.localeMatcher,
    numeric: options?.numeric || "auto",
    style: options?.style,
  });

  return rtf.format(value, unit);
}


/***/ }),
/* 202 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.isAfter = isAfter;
var _index = __webpack_require__(53);

/**
 * @name isAfter
 * @category Common Helpers
 * @summary Is the first date after the second one?
 *
 * @description
 * Is the first date after the second one?
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The date that should be after the other one to return true
 * @param dateToCompare - The date to compare with
 *
 * @returns The first date is after the second date
 *
 * @example
 * // Is 10 July 1989 after 11 February 1987?
 * const result = isAfter(new Date(1989, 6, 10), new Date(1987, 1, 11))
 * //=> true
 */
function isAfter(date, dateToCompare) {
  const _date = (0, _index.toDate)(date);
  const _dateToCompare = (0, _index.toDate)(dateToCompare);
  return _date.getTime() > _dateToCompare.getTime();
}


/***/ }),
/* 203 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.isBefore = isBefore;
var _index = __webpack_require__(53);

/**
 * @name isBefore
 * @category Common Helpers
 * @summary Is the first date before the second one?
 *
 * @description
 * Is the first date before the second one?
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The date that should be before the other one to return true
 * @param dateToCompare - The date to compare with
 *
 * @returns The first date is before the second date
 *
 * @example
 * // Is 10 July 1989 before 11 February 1987?
 * const result = isBefore(new Date(1989, 6, 10), new Date(1987, 1, 11))
 * //=> false
 */
function isBefore(date, dateToCompare) {
  const _date = (0, _index.toDate)(date);
  const _dateToCompare = (0, _index.toDate)(dateToCompare);
  return +_date < +_dateToCompare;
}


/***/ }),
/* 204 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.isEqual = isEqual;
var _index = __webpack_require__(53);

/**
 * @name isEqual
 * @category Common Helpers
 * @summary Are the given dates equal?
 *
 * @description
 * Are the given dates equal?
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param dateLeft - The first date to compare
 * @param dateRight - The second date to compare
 *
 * @returns The dates are equal
 *
 * @example
 * // Are 2 July 2014 06:30:45.000 and 2 July 2014 06:30:45.500 equal?
 * const result = isEqual(
 *   new Date(2014, 6, 2, 6, 30, 45, 0),
 *   new Date(2014, 6, 2, 6, 30, 45, 500)
 * )
 * //=> false
 */
function isEqual(leftDate, rightDate) {
  const _dateLeft = (0, _index.toDate)(leftDate);
  const _dateRight = (0, _index.toDate)(rightDate);
  return +_dateLeft === +_dateRight;
}


/***/ }),
/* 205 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

exports.isExists = isExists; /**
 * @name isExists
 * @category Common Helpers
 * @summary Is the given date exists?
 *
 * @description
 * Checks if the given arguments convert to an existing date.
 *
 * @param year - The year of the date to check
 * @param month - The month of the date to check
 * @param day - The day of the date to check
 *
 * @returns `true` if the date exists
 *
 * @example
 * // For the valid date:
 * const result = isExists(2018, 0, 31)
 * //=> true
 *
 * @example
 * // For the invalid date:
 * const result = isExists(2018, 1, 31)
 * //=> false
 */
function isExists(year, month, day) {
  const date = new Date(year, month, day);
  return (
    date.getFullYear() === year &&
    date.getMonth() === month &&
    date.getDate() === day
  );
}


/***/ }),
/* 206 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.isFirstDayOfMonth = isFirstDayOfMonth;
var _index = __webpack_require__(53);

/**
 * @name isFirstDayOfMonth
 * @category Month Helpers
 * @summary Is the given date the first day of a month?
 *
 * @description
 * Is the given date the first day of a month?
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The date to check

 * @returns The date is the first day of a month
 *
 * @example
 * // Is 1 September 2014 the first day of a month?
 * const result = isFirstDayOfMonth(new Date(2014, 8, 1))
 * //=> true
 */
function isFirstDayOfMonth(date) {
  return (0, _index.toDate)(date).getDate() === 1;
}


/***/ }),
/* 207 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.isFriday = isFriday;
var _index = __webpack_require__(53);

/**
 * @name isFriday
 * @category Weekday Helpers
 * @summary Is the given date Friday?
 *
 * @description
 * Is the given date Friday?
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The date to check
 *
 * @returns The date is Friday
 *
 * @example
 * // Is 26 September 2014 Friday?
 * const result = isFriday(new Date(2014, 8, 26))
 * //=> true
 */
function isFriday(date) {
  return (0, _index.toDate)(date).getDay() === 5;
}


/***/ }),
/* 208 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.isFuture = isFuture;
var _index = __webpack_require__(53);

/**
 * @name isFuture
 * @category Common Helpers
 * @summary Is the given date in the future?
 * @pure false
 *
 * @description
 * Is the given date in the future?
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The date to check
 *
 * @returns The date is in the future
 *
 * @example
 * // If today is 6 October 2014, is 31 December 2014 in the future?
 * const result = isFuture(new Date(2014, 11, 31))
 * //=> true
 */
function isFuture(date) {
  return +(0, _index.toDate)(date) > Date.now();
}


/***/ }),
/* 209 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.isMatch = isMatch;
var _index = __webpack_require__(90);
var _index2 = __webpack_require__(210);

/**
 * The {@link isMatch} function options.
 */

/**
 * @name isMatch
 * @category Common Helpers
 * @summary validates the date string against given formats
 *
 * @description
 * Return the true if given date is string correct against the given format else
 * will return false.
 *
 * > ⚠️ Please note that the `format` tokens differ from Moment.js and other libraries.
 * > See: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md
 *
 * The characters in the format string wrapped between two single quotes characters (') are escaped.
 * Two single quotes in a row, whether inside or outside a quoted sequence, represent a 'real' single quote.
 *
 * Format of the format string is based on Unicode Technical Standard #35:
 * https://www.unicode.org/reports/tr35/tr35-dates.html#Date_Field_Symbol_Table
 * with a few additions (see note 5 below the table).
 *
 * Not all tokens are compatible. Combinations that don't make sense or could lead to bugs are prohibited
 * and will throw `RangeError`. For example usage of 24-hour format token with AM/PM token will throw an exception:
 *
 * ```javascript
 * isMatch('23 AM', 'HH a')
 * //=> RangeError: The format string mustn't contain `HH` and `a` at the same time
 * ```
 *
 * See the compatibility table: https://docs.google.com/spreadsheets/d/e/2PACX-1vQOPU3xUhplll6dyoMmVUXHKl_8CRDs6_ueLmex3SoqwhuolkuN3O05l4rqx5h1dKX8eb46Ul-CCSrq/pubhtml?gid=0&single=true
 *
 * Accepted format string patterns:
 * | Unit                            |Prior| Pattern | Result examples                   | Notes |
 * |---------------------------------|-----|---------|-----------------------------------|-------|
 * | Era                             | 140 | G..GGG  | AD, BC                            |       |
 * |                                 |     | GGGG    | Anno Domini, Before Christ        | 2     |
 * |                                 |     | GGGGG   | A, B                              |       |
 * | Calendar year                   | 130 | y       | 44, 1, 1900, 2017, 9999           | 4     |
 * |                                 |     | yo      | 44th, 1st, 1900th, 9999999th      | 4,5   |
 * |                                 |     | yy      | 44, 01, 00, 17                    | 4     |
 * |                                 |     | yyy     | 044, 001, 123, 999                | 4     |
 * |                                 |     | yyyy    | 0044, 0001, 1900, 2017            | 4     |
 * |                                 |     | yyyyy   | ...                               | 2,4   |
 * | Local week-numbering year       | 130 | Y       | 44, 1, 1900, 2017, 9000           | 4     |
 * |                                 |     | Yo      | 44th, 1st, 1900th, 9999999th      | 4,5   |
 * |                                 |     | YY      | 44, 01, 00, 17                    | 4,6   |
 * |                                 |     | YYY     | 044, 001, 123, 999                | 4     |
 * |                                 |     | YYYY    | 0044, 0001, 1900, 2017            | 4,6   |
 * |                                 |     | YYYYY   | ...                               | 2,4   |
 * | ISO week-numbering year         | 130 | R       | -43, 1, 1900, 2017, 9999, -9999   | 4,5   |
 * |                                 |     | RR      | -43, 01, 00, 17                   | 4,5   |
 * |                                 |     | RRR     | -043, 001, 123, 999, -999         | 4,5   |
 * |                                 |     | RRRR    | -0043, 0001, 2017, 9999, -9999    | 4,5   |
 * |                                 |     | RRRRR   | ...                               | 2,4,5 |
 * | Extended year                   | 130 | u       | -43, 1, 1900, 2017, 9999, -999    | 4     |
 * |                                 |     | uu      | -43, 01, 99, -99                  | 4     |
 * |                                 |     | uuu     | -043, 001, 123, 999, -999         | 4     |
 * |                                 |     | uuuu    | -0043, 0001, 2017, 9999, -9999    | 4     |
 * |                                 |     | uuuuu   | ...                               | 2,4   |
 * | Quarter (formatting)            | 120 | Q       | 1, 2, 3, 4                        |       |
 * |                                 |     | Qo      | 1st, 2nd, 3rd, 4th                | 5     |
 * |                                 |     | QQ      | 01, 02, 03, 04                    |       |
 * |                                 |     | QQQ     | Q1, Q2, Q3, Q4                    |       |
 * |                                 |     | QQQQ    | 1st quarter, 2nd quarter, ...     | 2     |
 * |                                 |     | QQQQQ   | 1, 2, 3, 4                        | 4     |
 * | Quarter (stand-alone)           | 120 | q       | 1, 2, 3, 4                        |       |
 * |                                 |     | qo      | 1st, 2nd, 3rd, 4th                | 5     |
 * |                                 |     | qq      | 01, 02, 03, 04                    |       |
 * |                                 |     | qqq     | Q1, Q2, Q3, Q4                    |       |
 * |                                 |     | qqqq    | 1st quarter, 2nd quarter, ...     | 2     |
 * |                                 |     | qqqqq   | 1, 2, 3, 4                        | 3     |
 * | Month (formatting)              | 110 | M       | 1, 2, ..., 12                     |       |
 * |                                 |     | Mo      | 1st, 2nd, ..., 12th               | 5     |
 * |                                 |     | MM      | 01, 02, ..., 12                   |       |
 * |                                 |     | MMM     | Jan, Feb, ..., Dec                |       |
 * |                                 |     | MMMM    | January, February, ..., December  | 2     |
 * |                                 |     | MMMMM   | J, F, ..., D                      |       |
 * | Month (stand-alone)             | 110 | L       | 1, 2, ..., 12                     |       |
 * |                                 |     | Lo      | 1st, 2nd, ..., 12th               | 5     |
 * |                                 |     | LL      | 01, 02, ..., 12                   |       |
 * |                                 |     | LLL     | Jan, Feb, ..., Dec                |       |
 * |                                 |     | LLLL    | January, February, ..., December  | 2     |
 * |                                 |     | LLLLL   | J, F, ..., D                      |       |
 * | Local week of year              | 100 | w       | 1, 2, ..., 53                     |       |
 * |                                 |     | wo      | 1st, 2nd, ..., 53th               | 5     |
 * |                                 |     | ww      | 01, 02, ..., 53                   |       |
 * | ISO week of year                | 100 | I       | 1, 2, ..., 53                     | 5     |
 * |                                 |     | Io      | 1st, 2nd, ..., 53th               | 5     |
 * |                                 |     | II      | 01, 02, ..., 53                   | 5     |
 * | Day of month                    |  90 | d       | 1, 2, ..., 31                     |       |
 * |                                 |     | do      | 1st, 2nd, ..., 31st               | 5     |
 * |                                 |     | dd      | 01, 02, ..., 31                   |       |
 * | Day of year                     |  90 | D       | 1, 2, ..., 365, 366               | 7     |
 * |                                 |     | Do      | 1st, 2nd, ..., 365th, 366th       | 5     |
 * |                                 |     | DD      | 01, 02, ..., 365, 366             | 7     |
 * |                                 |     | DDD     | 001, 002, ..., 365, 366           |       |
 * |                                 |     | DDDD    | ...                               | 2     |
 * | Day of week (formatting)        |  90 | E..EEE  | Mon, Tue, Wed, ..., Su            |       |
 * |                                 |     | EEEE    | Monday, Tuesday, ..., Sunday      | 2     |
 * |                                 |     | EEEEE   | M, T, W, T, F, S, S               |       |
 * |                                 |     | EEEEEE  | Mo, Tu, We, Th, Fr, Sa, Su        |       |
 * | ISO day of week (formatting)    |  90 | i       | 1, 2, 3, ..., 7                   | 5     |
 * |                                 |     | io      | 1st, 2nd, ..., 7th                | 5     |
 * |                                 |     | ii      | 01, 02, ..., 07                   | 5     |
 * |                                 |     | iii     | Mon, Tue, Wed, ..., Su            | 5     |
 * |                                 |     | iiii    | Monday, Tuesday, ..., Sunday      | 2,5   |
 * |                                 |     | iiiii   | M, T, W, T, F, S, S               | 5     |
 * |                                 |     | iiiiii  | Mo, Tu, We, Th, Fr, Sa, Su        | 5     |
 * | Local day of week (formatting)  |  90 | e       | 2, 3, 4, ..., 1                   |       |
 * |                                 |     | eo      | 2nd, 3rd, ..., 1st                | 5     |
 * |                                 |     | ee      | 02, 03, ..., 01                   |       |
 * |                                 |     | eee     | Mon, Tue, Wed, ..., Su            |       |
 * |                                 |     | eeee    | Monday, Tuesday, ..., Sunday      | 2     |
 * |                                 |     | eeeee   | M, T, W, T, F, S, S               |       |
 * |                                 |     | eeeeee  | Mo, Tu, We, Th, Fr, Sa, Su        |       |
 * | Local day of week (stand-alone) |  90 | c       | 2, 3, 4, ..., 1                   |       |
 * |                                 |     | co      | 2nd, 3rd, ..., 1st                | 5     |
 * |                                 |     | cc      | 02, 03, ..., 01                   |       |
 * |                                 |     | ccc     | Mon, Tue, Wed, ..., Su            |       |
 * |                                 |     | cccc    | Monday, Tuesday, ..., Sunday      | 2     |
 * |                                 |     | ccccc   | M, T, W, T, F, S, S               |       |
 * |                                 |     | cccccc  | Mo, Tu, We, Th, Fr, Sa, Su        |       |
 * | AM, PM                          |  80 | a..aaa  | AM, PM                            |       |
 * |                                 |     | aaaa    | a.m., p.m.                        | 2     |
 * |                                 |     | aaaaa   | a, p                              |       |
 * | AM, PM, noon, midnight          |  80 | b..bbb  | AM, PM, noon, midnight            |       |
 * |                                 |     | bbbb    | a.m., p.m., noon, midnight        | 2     |
 * |                                 |     | bbbbb   | a, p, n, mi                       |       |
 * | Flexible day period             |  80 | B..BBB  | at night, in the morning, ...     |       |
 * |                                 |     | BBBB    | at night, in the morning, ...     | 2     |
 * |                                 |     | BBBBB   | at night, in the morning, ...     |       |
 * | Hour [1-12]                     |  70 | h       | 1, 2, ..., 11, 12                 |       |
 * |                                 |     | ho      | 1st, 2nd, ..., 11th, 12th         | 5     |
 * |                                 |     | hh      | 01, 02, ..., 11, 12               |       |
 * | Hour [0-23]                     |  70 | H       | 0, 1, 2, ..., 23                  |       |
 * |                                 |     | Ho      | 0th, 1st, 2nd, ..., 23rd          | 5     |
 * |                                 |     | HH      | 00, 01, 02, ..., 23               |       |
 * | Hour [0-11]                     |  70 | K       | 1, 2, ..., 11, 0                  |       |
 * |                                 |     | Ko      | 1st, 2nd, ..., 11th, 0th          | 5     |
 * |                                 |     | KK      | 01, 02, ..., 11, 00               |       |
 * | Hour [1-24]                     |  70 | k       | 24, 1, 2, ..., 23                 |       |
 * |                                 |     | ko      | 24th, 1st, 2nd, ..., 23rd         | 5     |
 * |                                 |     | kk      | 24, 01, 02, ..., 23               |       |
 * | Minute                          |  60 | m       | 0, 1, ..., 59                     |       |
 * |                                 |     | mo      | 0th, 1st, ..., 59th               | 5     |
 * |                                 |     | mm      | 00, 01, ..., 59                   |       |
 * | Second                          |  50 | s       | 0, 1, ..., 59                     |       |
 * |                                 |     | so      | 0th, 1st, ..., 59th               | 5     |
 * |                                 |     | ss      | 00, 01, ..., 59                   |       |
 * | Seconds timestamp               |  40 | t       | 512969520                         |       |
 * |                                 |     | tt      | ...                               | 2     |
 * | Fraction of second              |  30 | S       | 0, 1, ..., 9                      |       |
 * |                                 |     | SS      | 00, 01, ..., 99                   |       |
 * |                                 |     | SSS     | 000, 001, ..., 999                |       |
 * |                                 |     | SSSS    | ...                               | 2     |
 * | Milliseconds timestamp          |  20 | T       | 512969520900                      |       |
 * |                                 |     | TT      | ...                               | 2     |
 * | Timezone (ISO-8601 w/ Z)        |  10 | X       | -08, +0530, Z                     |       |
 * |                                 |     | XX      | -0800, +0530, Z                   |       |
 * |                                 |     | XXX     | -08:00, +05:30, Z                 |       |
 * |                                 |     | XXXX    | -0800, +0530, Z, +123456          | 2     |
 * |                                 |     | XXXXX   | -08:00, +05:30, Z, +12:34:56      |       |
 * | Timezone (ISO-8601 w/o Z)       |  10 | x       | -08, +0530, +00                   |       |
 * |                                 |     | xx      | -0800, +0530, +0000               |       |
 * |                                 |     | xxx     | -08:00, +05:30, +00:00            | 2     |
 * |                                 |     | xxxx    | -0800, +0530, +0000, +123456      |       |
 * |                                 |     | xxxxx   | -08:00, +05:30, +00:00, +12:34:56 |       |
 * | Long localized date             |  NA | P       | 05/29/1453                        | 5,8   |
 * |                                 |     | PP      | May 29, 1453                      |       |
 * |                                 |     | PPP     | May 29th, 1453                    |       |
 * |                                 |     | PPPP    | Sunday, May 29th, 1453            | 2,5,8 |
 * | Long localized time             |  NA | p       | 12:00 AM                          | 5,8   |
 * |                                 |     | pp      | 12:00:00 AM                       |       |
 * | Combination of date and time    |  NA | Pp      | 05/29/1453, 12:00 AM              |       |
 * |                                 |     | PPpp    | May 29, 1453, 12:00:00 AM         |       |
 * |                                 |     | PPPpp   | May 29th, 1453 at ...             |       |
 * |                                 |     | PPPPpp  | Sunday, May 29th, 1453 at ...     | 2,5,8 |
 * Notes:
 * 1. "Formatting" units (e.g. formatting quarter) in the default en-US locale
 *    are the same as "stand-alone" units, but are different in some languages.
 *    "Formatting" units are declined according to the rules of the language
 *    in the context of a date. "Stand-alone" units are always nominative singular.
 *    In `format` function, they will produce different result:
 *
 *    `format(new Date(2017, 10, 6), 'do LLLL', {locale: cs}) //=> '6. listopad'`
 *
 *    `format(new Date(2017, 10, 6), 'do MMMM', {locale: cs}) //=> '6. listopadu'`
 *
 *    `isMatch` will try to match both formatting and stand-alone units interchangably.
 *
 * 2. Any sequence of the identical letters is a pattern, unless it is escaped by
 *    the single quote characters (see below).
 *    If the sequence is longer than listed in table:
 *    - for numerical units (`yyyyyyyy`) `isMatch` will try to match a number
 *      as wide as the sequence
 *    - for text units (`MMMMMMMM`) `isMatch` will try to match the widest variation of the unit.
 *      These variations are marked with "2" in the last column of the table.
 *
 * 3. `QQQQQ` and `qqqqq` could be not strictly numerical in some locales.
 *    These tokens represent the shortest form of the quarter.
 *
 * 4. The main difference between `y` and `u` patterns are B.C. years:
 *
 *    | Year | `y` | `u` |
 *    |------|-----|-----|
 *    | AC 1 |   1 |   1 |
 *    | BC 1 |   1 |   0 |
 *    | BC 2 |   2 |  -1 |
 *
 *    Also `yy` will try to guess the century of two digit year by proximity with `referenceDate`:
 *
 *    `isMatch('50', 'yy') //=> true`
 *
 *    `isMatch('75', 'yy') //=> true`
 *
 *    while `uu` will use the year as is:
 *
 *    `isMatch('50', 'uu') //=> true`
 *
 *    `isMatch('75', 'uu') //=> true`
 *
 *    The same difference is true for local and ISO week-numbering years (`Y` and `R`),
 *    except local week-numbering years are dependent on `options.weekStartsOn`
 *    and `options.firstWeekContainsDate` (compare [setISOWeekYear](https://date-fns.org/docs/setISOWeekYear)
 *    and [setWeekYear](https://date-fns.org/docs/setWeekYear)).
 *
 * 5. These patterns are not in the Unicode Technical Standard #35:
 *    - `i`: ISO day of week
 *    - `I`: ISO week of year
 *    - `R`: ISO week-numbering year
 *    - `o`: ordinal number modifier
 *    - `P`: long localized date
 *    - `p`: long localized time
 *
 * 6. `YY` and `YYYY` tokens represent week-numbering years but they are often confused with years.
 *    You should enable `options.useAdditionalWeekYearTokens` to use them. See: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md
 *
 * 7. `D` and `DD` tokens represent days of the year but they are ofthen confused with days of the month.
 *    You should enable `options.useAdditionalDayOfYearTokens` to use them. See: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md
 *
 * 8. `P+` tokens do not have a defined priority since they are merely aliases to other tokens based
 *    on the given locale.
 *
 *    using `en-US` locale: `P` => `MM/dd/yyyy`
 *    using `en-US` locale: `p` => `hh:mm a`
 *    using `pt-BR` locale: `P` => `dd/MM/yyyy`
 *    using `pt-BR` locale: `p` => `HH:mm`
 *
 * Values will be checked in the descending order of its unit's priority.
 * Units of an equal priority overwrite each other in the order of appearance.
 *
 * If no values of higher priority are matched (e.g. when matching string 'January 1st' without a year),
 * the values will be taken from today's using `new Date()` date which works as a context of parsing.
 *
 * The result may vary by locale.
 *
 * If `formatString` matches with `dateString` but does not provides tokens, `referenceDate` will be returned.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param dateStr - The date string to verify
 * @param format - The string of tokens
 * @param options - An object with options.
 *   see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md
 *   see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md
 *
 * @returns Is format string a match for date string?
 *
 * @throws `options.locale` must contain `match` property
 * @throws use `yyyy` instead of `YYYY` for formatting years; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md
 * @throws use `yy` instead of `YY` for formatting years; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md
 * @throws use `d` instead of `D` for formatting days of the month; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md
 * @throws use `dd` instead of `DD` for formatting days of the month; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md
 * @throws format string contains an unescaped latin alphabet character
 *
 * @example
 * // Match 11 February 2014 from middle-endian format:
 * const result = isMatch('02/11/2014', 'MM/dd/yyyy')
 * //=> true
 *
 * @example
 * // Match 28th of February in Esperanto locale in the context of 2010 year:
 * import eo from 'date-fns/locale/eo'
 * const result = isMatch('28-a de februaro', "do 'de' MMMM", {
 *   locale: eo
 * })
 * //=> true
 */
function isMatch(dateStr, formatStr, options) {
  return (0, _index.isValid)(
    (0, _index2.parse)(dateStr, formatStr, new Date(), options),
  );
}


/***/ }),
/* 210 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "longFormatters", ({
  enumerable: true,
  get: function () {
    return _index5.longFormatters;
  },
}));
exports.parse = parse;
Object.defineProperty(exports, "parsers", ({
  enumerable: true,
  get: function () {
    return _index7.parsers;
  },
}));
var _index = __webpack_require__(54);
var _index2 = __webpack_require__(180);
var _index3 = __webpack_require__(141);
var _index4 = __webpack_require__(53);

var _index5 = __webpack_require__(160);
var _index6 = __webpack_require__(161);

var _index7 = __webpack_require__(211);

var _Setter = __webpack_require__(214);

// Rexports of internal for libraries to use.
// See: https://github.com/date-fns/date-fns/issues/3638#issuecomment-1877082874

/**
 * The {@link parse} function options.
 */

// This RegExp consists of three parts separated by `|`:
// - [yYQqMLwIdDecihHKkms]o matches any available ordinal number token
//   (one of the certain letters followed by `o`)
// - (\w)\1* matches any sequences of the same letter
// - '' matches two quote characters in a row
// - '(''|[^'])+('|$) matches anything surrounded by two quote characters ('),
//   except a single quote symbol, which ends the sequence.
//   Two quote characters do not end the sequence.
//   If there is no matching single quote
//   then the sequence will continue until the end of the string.
// - . matches any single character unmatched by previous parts of the RegExps
const formattingTokensRegExp =
  /[yYQqMLwIdDecihHKkms]o|(\w)\1*|''|'(''|[^'])+('|$)|./g;

// This RegExp catches symbols escaped by quotes, and also
// sequences of symbols P, p, and the combinations like `PPPPPPPppppp`
const longFormattingTokensRegExp = /P+p+|P+|p+|''|'(''|[^'])+('|$)|./g;

const escapedStringRegExp = /^'([^]*?)'?$/;
const doubleQuoteRegExp = /''/g;

const notWhitespaceRegExp = /\S/;
const unescapedLatinCharacterRegExp = /[a-zA-Z]/;

/**
 * @name parse
 * @category Common Helpers
 * @summary Parse the date.
 *
 * @description
 * Return the date parsed from string using the given format string.
 *
 * > ⚠️ Please note that the `format` tokens differ from Moment.js and other libraries.
 * > See: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md
 *
 * The characters in the format string wrapped between two single quotes characters (') are escaped.
 * Two single quotes in a row, whether inside or outside a quoted sequence, represent a 'real' single quote.
 *
 * Format of the format string is based on Unicode Technical Standard #35:
 * https://www.unicode.org/reports/tr35/tr35-dates.html#Date_Field_Symbol_Table
 * with a few additions (see note 5 below the table).
 *
 * Not all tokens are compatible. Combinations that don't make sense or could lead to bugs are prohibited
 * and will throw `RangeError`. For example usage of 24-hour format token with AM/PM token will throw an exception:
 *
 * ```javascript
 * parse('23 AM', 'HH a', new Date())
 * //=> RangeError: The format string mustn't contain `HH` and `a` at the same time
 * ```
 *
 * See the compatibility table: https://docs.google.com/spreadsheets/d/e/2PACX-1vQOPU3xUhplll6dyoMmVUXHKl_8CRDs6_ueLmex3SoqwhuolkuN3O05l4rqx5h1dKX8eb46Ul-CCSrq/pubhtml?gid=0&single=true
 *
 * Accepted format string patterns:
 * | Unit                            |Prior| Pattern | Result examples                   | Notes |
 * |---------------------------------|-----|---------|-----------------------------------|-------|
 * | Era                             | 140 | G..GGG  | AD, BC                            |       |
 * |                                 |     | GGGG    | Anno Domini, Before Christ        | 2     |
 * |                                 |     | GGGGG   | A, B                              |       |
 * | Calendar year                   | 130 | y       | 44, 1, 1900, 2017, 9999           | 4     |
 * |                                 |     | yo      | 44th, 1st, 1900th, 9999999th      | 4,5   |
 * |                                 |     | yy      | 44, 01, 00, 17                    | 4     |
 * |                                 |     | yyy     | 044, 001, 123, 999                | 4     |
 * |                                 |     | yyyy    | 0044, 0001, 1900, 2017            | 4     |
 * |                                 |     | yyyyy   | ...                               | 2,4   |
 * | Local week-numbering year       | 130 | Y       | 44, 1, 1900, 2017, 9000           | 4     |
 * |                                 |     | Yo      | 44th, 1st, 1900th, 9999999th      | 4,5   |
 * |                                 |     | YY      | 44, 01, 00, 17                    | 4,6   |
 * |                                 |     | YYY     | 044, 001, 123, 999                | 4     |
 * |                                 |     | YYYY    | 0044, 0001, 1900, 2017            | 4,6   |
 * |                                 |     | YYYYY   | ...                               | 2,4   |
 * | ISO week-numbering year         | 130 | R       | -43, 1, 1900, 2017, 9999, -9999   | 4,5   |
 * |                                 |     | RR      | -43, 01, 00, 17                   | 4,5   |
 * |                                 |     | RRR     | -043, 001, 123, 999, -999         | 4,5   |
 * |                                 |     | RRRR    | -0043, 0001, 2017, 9999, -9999    | 4,5   |
 * |                                 |     | RRRRR   | ...                               | 2,4,5 |
 * | Extended year                   | 130 | u       | -43, 1, 1900, 2017, 9999, -999    | 4     |
 * |                                 |     | uu      | -43, 01, 99, -99                  | 4     |
 * |                                 |     | uuu     | -043, 001, 123, 999, -999         | 4     |
 * |                                 |     | uuuu    | -0043, 0001, 2017, 9999, -9999    | 4     |
 * |                                 |     | uuuuu   | ...                               | 2,4   |
 * | Quarter (formatting)            | 120 | Q       | 1, 2, 3, 4                        |       |
 * |                                 |     | Qo      | 1st, 2nd, 3rd, 4th                | 5     |
 * |                                 |     | QQ      | 01, 02, 03, 04                    |       |
 * |                                 |     | QQQ     | Q1, Q2, Q3, Q4                    |       |
 * |                                 |     | QQQQ    | 1st quarter, 2nd quarter, ...     | 2     |
 * |                                 |     | QQQQQ   | 1, 2, 3, 4                        | 4     |
 * | Quarter (stand-alone)           | 120 | q       | 1, 2, 3, 4                        |       |
 * |                                 |     | qo      | 1st, 2nd, 3rd, 4th                | 5     |
 * |                                 |     | qq      | 01, 02, 03, 04                    |       |
 * |                                 |     | qqq     | Q1, Q2, Q3, Q4                    |       |
 * |                                 |     | qqqq    | 1st quarter, 2nd quarter, ...     | 2     |
 * |                                 |     | qqqqq   | 1, 2, 3, 4                        | 3     |
 * | Month (formatting)              | 110 | M       | 1, 2, ..., 12                     |       |
 * |                                 |     | Mo      | 1st, 2nd, ..., 12th               | 5     |
 * |                                 |     | MM      | 01, 02, ..., 12                   |       |
 * |                                 |     | MMM     | Jan, Feb, ..., Dec                |       |
 * |                                 |     | MMMM    | January, February, ..., December  | 2     |
 * |                                 |     | MMMMM   | J, F, ..., D                      |       |
 * | Month (stand-alone)             | 110 | L       | 1, 2, ..., 12                     |       |
 * |                                 |     | Lo      | 1st, 2nd, ..., 12th               | 5     |
 * |                                 |     | LL      | 01, 02, ..., 12                   |       |
 * |                                 |     | LLL     | Jan, Feb, ..., Dec                |       |
 * |                                 |     | LLLL    | January, February, ..., December  | 2     |
 * |                                 |     | LLLLL   | J, F, ..., D                      |       |
 * | Local week of year              | 100 | w       | 1, 2, ..., 53                     |       |
 * |                                 |     | wo      | 1st, 2nd, ..., 53th               | 5     |
 * |                                 |     | ww      | 01, 02, ..., 53                   |       |
 * | ISO week of year                | 100 | I       | 1, 2, ..., 53                     | 5     |
 * |                                 |     | Io      | 1st, 2nd, ..., 53th               | 5     |
 * |                                 |     | II      | 01, 02, ..., 53                   | 5     |
 * | Day of month                    |  90 | d       | 1, 2, ..., 31                     |       |
 * |                                 |     | do      | 1st, 2nd, ..., 31st               | 5     |
 * |                                 |     | dd      | 01, 02, ..., 31                   |       |
 * | Day of year                     |  90 | D       | 1, 2, ..., 365, 366               | 7     |
 * |                                 |     | Do      | 1st, 2nd, ..., 365th, 366th       | 5     |
 * |                                 |     | DD      | 01, 02, ..., 365, 366             | 7     |
 * |                                 |     | DDD     | 001, 002, ..., 365, 366           |       |
 * |                                 |     | DDDD    | ...                               | 2     |
 * | Day of week (formatting)        |  90 | E..EEE  | Mon, Tue, Wed, ..., Sun           |       |
 * |                                 |     | EEEE    | Monday, Tuesday, ..., Sunday      | 2     |
 * |                                 |     | EEEEE   | M, T, W, T, F, S, S               |       |
 * |                                 |     | EEEEEE  | Mo, Tu, We, Th, Fr, Sa, Su        |       |
 * | ISO day of week (formatting)    |  90 | i       | 1, 2, 3, ..., 7                   | 5     |
 * |                                 |     | io      | 1st, 2nd, ..., 7th                | 5     |
 * |                                 |     | ii      | 01, 02, ..., 07                   | 5     |
 * |                                 |     | iii     | Mon, Tue, Wed, ..., Sun           | 5     |
 * |                                 |     | iiii    | Monday, Tuesday, ..., Sunday      | 2,5   |
 * |                                 |     | iiiii   | M, T, W, T, F, S, S               | 5     |
 * |                                 |     | iiiiii  | Mo, Tu, We, Th, Fr, Sa, Su        | 5     |
 * | Local day of week (formatting)  |  90 | e       | 2, 3, 4, ..., 1                   |       |
 * |                                 |     | eo      | 2nd, 3rd, ..., 1st                | 5     |
 * |                                 |     | ee      | 02, 03, ..., 01                   |       |
 * |                                 |     | eee     | Mon, Tue, Wed, ..., Sun           |       |
 * |                                 |     | eeee    | Monday, Tuesday, ..., Sunday      | 2     |
 * |                                 |     | eeeee   | M, T, W, T, F, S, S               |       |
 * |                                 |     | eeeeee  | Mo, Tu, We, Th, Fr, Sa, Su        |       |
 * | Local day of week (stand-alone) |  90 | c       | 2, 3, 4, ..., 1                   |       |
 * |                                 |     | co      | 2nd, 3rd, ..., 1st                | 5     |
 * |                                 |     | cc      | 02, 03, ..., 01                   |       |
 * |                                 |     | ccc     | Mon, Tue, Wed, ..., Sun           |       |
 * |                                 |     | cccc    | Monday, Tuesday, ..., Sunday      | 2     |
 * |                                 |     | ccccc   | M, T, W, T, F, S, S               |       |
 * |                                 |     | cccccc  | Mo, Tu, We, Th, Fr, Sa, Su        |       |
 * | AM, PM                          |  80 | a..aaa  | AM, PM                            |       |
 * |                                 |     | aaaa    | a.m., p.m.                        | 2     |
 * |                                 |     | aaaaa   | a, p                              |       |
 * | AM, PM, noon, midnight          |  80 | b..bbb  | AM, PM, noon, midnight            |       |
 * |                                 |     | bbbb    | a.m., p.m., noon, midnight        | 2     |
 * |                                 |     | bbbbb   | a, p, n, mi                       |       |
 * | Flexible day period             |  80 | B..BBB  | at night, in the morning, ...     |       |
 * |                                 |     | BBBB    | at night, in the morning, ...     | 2     |
 * |                                 |     | BBBBB   | at night, in the morning, ...     |       |
 * | Hour [1-12]                     |  70 | h       | 1, 2, ..., 11, 12                 |       |
 * |                                 |     | ho      | 1st, 2nd, ..., 11th, 12th         | 5     |
 * |                                 |     | hh      | 01, 02, ..., 11, 12               |       |
 * | Hour [0-23]                     |  70 | H       | 0, 1, 2, ..., 23                  |       |
 * |                                 |     | Ho      | 0th, 1st, 2nd, ..., 23rd          | 5     |
 * |                                 |     | HH      | 00, 01, 02, ..., 23               |       |
 * | Hour [0-11]                     |  70 | K       | 1, 2, ..., 11, 0                  |       |
 * |                                 |     | Ko      | 1st, 2nd, ..., 11th, 0th          | 5     |
 * |                                 |     | KK      | 01, 02, ..., 11, 00               |       |
 * | Hour [1-24]                     |  70 | k       | 24, 1, 2, ..., 23                 |       |
 * |                                 |     | ko      | 24th, 1st, 2nd, ..., 23rd         | 5     |
 * |                                 |     | kk      | 24, 01, 02, ..., 23               |       |
 * | Minute                          |  60 | m       | 0, 1, ..., 59                     |       |
 * |                                 |     | mo      | 0th, 1st, ..., 59th               | 5     |
 * |                                 |     | mm      | 00, 01, ..., 59                   |       |
 * | Second                          |  50 | s       | 0, 1, ..., 59                     |       |
 * |                                 |     | so      | 0th, 1st, ..., 59th               | 5     |
 * |                                 |     | ss      | 00, 01, ..., 59                   |       |
 * | Seconds timestamp               |  40 | t       | 512969520                         |       |
 * |                                 |     | tt      | ...                               | 2     |
 * | Fraction of second              |  30 | S       | 0, 1, ..., 9                      |       |
 * |                                 |     | SS      | 00, 01, ..., 99                   |       |
 * |                                 |     | SSS     | 000, 001, ..., 999                |       |
 * |                                 |     | SSSS    | ...                               | 2     |
 * | Milliseconds timestamp          |  20 | T       | 512969520900                      |       |
 * |                                 |     | TT      | ...                               | 2     |
 * | Timezone (ISO-8601 w/ Z)        |  10 | X       | -08, +0530, Z                     |       |
 * |                                 |     | XX      | -0800, +0530, Z                   |       |
 * |                                 |     | XXX     | -08:00, +05:30, Z                 |       |
 * |                                 |     | XXXX    | -0800, +0530, Z, +123456          | 2     |
 * |                                 |     | XXXXX   | -08:00, +05:30, Z, +12:34:56      |       |
 * | Timezone (ISO-8601 w/o Z)       |  10 | x       | -08, +0530, +00                   |       |
 * |                                 |     | xx      | -0800, +0530, +0000               |       |
 * |                                 |     | xxx     | -08:00, +05:30, +00:00            | 2     |
 * |                                 |     | xxxx    | -0800, +0530, +0000, +123456      |       |
 * |                                 |     | xxxxx   | -08:00, +05:30, +00:00, +12:34:56 |       |
 * | Long localized date             |  NA | P       | 05/29/1453                        | 5,8   |
 * |                                 |     | PP      | May 29, 1453                      |       |
 * |                                 |     | PPP     | May 29th, 1453                    |       |
 * |                                 |     | PPPP    | Sunday, May 29th, 1453            | 2,5,8 |
 * | Long localized time             |  NA | p       | 12:00 AM                          | 5,8   |
 * |                                 |     | pp      | 12:00:00 AM                       |       |
 * | Combination of date and time    |  NA | Pp      | 05/29/1453, 12:00 AM              |       |
 * |                                 |     | PPpp    | May 29, 1453, 12:00:00 AM         |       |
 * |                                 |     | PPPpp   | May 29th, 1453 at ...             |       |
 * |                                 |     | PPPPpp  | Sunday, May 29th, 1453 at ...     | 2,5,8 |
 * Notes:
 * 1. "Formatting" units (e.g. formatting quarter) in the default en-US locale
 *    are the same as "stand-alone" units, but are different in some languages.
 *    "Formatting" units are declined according to the rules of the language
 *    in the context of a date. "Stand-alone" units are always nominative singular.
 *    In `format` function, they will produce different result:
 *
 *    `format(new Date(2017, 10, 6), 'do LLLL', {locale: cs}) //=> '6. listopad'`
 *
 *    `format(new Date(2017, 10, 6), 'do MMMM', {locale: cs}) //=> '6. listopadu'`
 *
 *    `parse` will try to match both formatting and stand-alone units interchangably.
 *
 * 2. Any sequence of the identical letters is a pattern, unless it is escaped by
 *    the single quote characters (see below).
 *    If the sequence is longer than listed in table:
 *    - for numerical units (`yyyyyyyy`) `parse` will try to match a number
 *      as wide as the sequence
 *    - for text units (`MMMMMMMM`) `parse` will try to match the widest variation of the unit.
 *      These variations are marked with "2" in the last column of the table.
 *
 * 3. `QQQQQ` and `qqqqq` could be not strictly numerical in some locales.
 *    These tokens represent the shortest form of the quarter.
 *
 * 4. The main difference between `y` and `u` patterns are B.C. years:
 *
 *    | Year | `y` | `u` |
 *    |------|-----|-----|
 *    | AC 1 |   1 |   1 |
 *    | BC 1 |   1 |   0 |
 *    | BC 2 |   2 |  -1 |
 *
 *    Also `yy` will try to guess the century of two digit year by proximity with `referenceDate`:
 *
 *    `parse('50', 'yy', new Date(2018, 0, 1)) //=> Sat Jan 01 2050 00:00:00`
 *
 *    `parse('75', 'yy', new Date(2018, 0, 1)) //=> Wed Jan 01 1975 00:00:00`
 *
 *    while `uu` will just assign the year as is:
 *
 *    `parse('50', 'uu', new Date(2018, 0, 1)) //=> Sat Jan 01 0050 00:00:00`
 *
 *    `parse('75', 'uu', new Date(2018, 0, 1)) //=> Tue Jan 01 0075 00:00:00`
 *
 *    The same difference is true for local and ISO week-numbering years (`Y` and `R`),
 *    except local week-numbering years are dependent on `options.weekStartsOn`
 *    and `options.firstWeekContainsDate` (compare [setISOWeekYear](https://date-fns.org/docs/setISOWeekYear)
 *    and [setWeekYear](https://date-fns.org/docs/setWeekYear)).
 *
 * 5. These patterns are not in the Unicode Technical Standard #35:
 *    - `i`: ISO day of week
 *    - `I`: ISO week of year
 *    - `R`: ISO week-numbering year
 *    - `o`: ordinal number modifier
 *    - `P`: long localized date
 *    - `p`: long localized time
 *
 * 6. `YY` and `YYYY` tokens represent week-numbering years but they are often confused with years.
 *    You should enable `options.useAdditionalWeekYearTokens` to use them. See: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md
 *
 * 7. `D` and `DD` tokens represent days of the year but they are ofthen confused with days of the month.
 *    You should enable `options.useAdditionalDayOfYearTokens` to use them. See: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md
 *
 * 8. `P+` tokens do not have a defined priority since they are merely aliases to other tokens based
 *    on the given locale.
 *
 *    using `en-US` locale: `P` => `MM/dd/yyyy`
 *    using `en-US` locale: `p` => `hh:mm a`
 *    using `pt-BR` locale: `P` => `dd/MM/yyyy`
 *    using `pt-BR` locale: `p` => `HH:mm`
 *
 * Values will be assigned to the date in the descending order of its unit's priority.
 * Units of an equal priority overwrite each other in the order of appearance.
 *
 * If no values of higher priority are parsed (e.g. when parsing string 'January 1st' without a year),
 * the values will be taken from 3rd argument `referenceDate` which works as a context of parsing.
 *
 * `referenceDate` must be passed for correct work of the function.
 * If you're not sure which `referenceDate` to supply, create a new instance of Date:
 * `parse('02/11/2014', 'MM/dd/yyyy', new Date())`
 * In this case parsing will be done in the context of the current date.
 * If `referenceDate` is `Invalid Date` or a value not convertible to valid `Date`,
 * then `Invalid Date` will be returned.
 *
 * The result may vary by locale.
 *
 * If `formatString` matches with `dateString` but does not provides tokens, `referenceDate` will be returned.
 *
 * If parsing failed, `Invalid Date` will be returned.
 * Invalid Date is a Date, whose time value is NaN.
 * Time value of Date: http://es5.github.io/#x15.9.1.1
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param dateStr - The string to parse
 * @param formatStr - The string of tokens
 * @param referenceDate - defines values missing from the parsed dateString
 * @param options - An object with options.
 *   see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md
 *   see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md
 *
 * @returns The parsed date
 *
 * @throws `options.locale` must contain `match` property
 * @throws use `yyyy` instead of `YYYY` for formatting years using [format provided] to the input [input provided]; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md
 * @throws use `yy` instead of `YY` for formatting years using [format provided] to the input [input provided]; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md
 * @throws use `d` instead of `D` for formatting days of the month using [format provided] to the input [input provided]; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md
 * @throws use `dd` instead of `DD` for formatting days of the month using [format provided] to the input [input provided]; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md
 * @throws format string contains an unescaped latin alphabet character
 *
 * @example
 * // Parse 11 February 2014 from middle-endian format:
 * var result = parse('02/11/2014', 'MM/dd/yyyy', new Date())
 * //=> Tue Feb 11 2014 00:00:00
 *
 * @example
 * // Parse 28th of February in Esperanto locale in the context of 2010 year:
 * import eo from 'date-fns/locale/eo'
 * var result = parse('28-a de februaro', "do 'de' MMMM", new Date(2010, 0, 1), {
 *   locale: eo
 * })
 * //=> Sun Feb 28 2010 00:00:00
 */
function parse(dateStr, formatStr, referenceDate, options) {
  const defaultOptions = (0, _index2.getDefaultOptions)();
  const locale =
    options?.locale ?? defaultOptions.locale ?? _index3.defaultLocale;

  const firstWeekContainsDate =
    options?.firstWeekContainsDate ??
    options?.locale?.options?.firstWeekContainsDate ??
    defaultOptions.firstWeekContainsDate ??
    defaultOptions.locale?.options?.firstWeekContainsDate ??
    1;

  const weekStartsOn =
    options?.weekStartsOn ??
    options?.locale?.options?.weekStartsOn ??
    defaultOptions.weekStartsOn ??
    defaultOptions.locale?.options?.weekStartsOn ??
    0;

  if (formatStr === "") {
    if (dateStr === "") {
      return (0, _index4.toDate)(referenceDate);
    } else {
      return (0, _index.constructFrom)(referenceDate, NaN);
    }
  }

  const subFnOptions = {
    firstWeekContainsDate,
    weekStartsOn,
    locale,
  };

  // If timezone isn't specified, it will be set to the system timezone
  const setters = [new _Setter.DateToSystemTimezoneSetter()];

  const tokens = formatStr
    .match(longFormattingTokensRegExp)
    .map((substring) => {
      const firstCharacter = substring[0];
      if (firstCharacter in _index5.longFormatters) {
        const longFormatter = _index5.longFormatters[firstCharacter];
        return longFormatter(substring, locale.formatLong);
      }
      return substring;
    })
    .join("")
    .match(formattingTokensRegExp);

  const usedTokens = [];

  for (let token of tokens) {
    if (
      !options?.useAdditionalWeekYearTokens &&
      (0, _index6.isProtectedWeekYearToken)(token)
    ) {
      (0, _index6.warnOrThrowProtectedError)(token, formatStr, dateStr);
    }
    if (
      !options?.useAdditionalDayOfYearTokens &&
      (0, _index6.isProtectedDayOfYearToken)(token)
    ) {
      (0, _index6.warnOrThrowProtectedError)(token, formatStr, dateStr);
    }

    const firstCharacter = token[0];
    const parser = _index7.parsers[firstCharacter];
    if (parser) {
      const { incompatibleTokens } = parser;
      if (Array.isArray(incompatibleTokens)) {
        const incompatibleToken = usedTokens.find(
          (usedToken) =>
            incompatibleTokens.includes(usedToken.token) ||
            usedToken.token === firstCharacter,
        );
        if (incompatibleToken) {
          throw new RangeError(
            `The format string mustn't contain \`${incompatibleToken.fullToken}\` and \`${token}\` at the same time`,
          );
        }
      } else if (parser.incompatibleTokens === "*" && usedTokens.length > 0) {
        throw new RangeError(
          `The format string mustn't contain \`${token}\` and any other token at the same time`,
        );
      }

      usedTokens.push({ token: firstCharacter, fullToken: token });

      const parseResult = parser.run(
        dateStr,
        token,
        locale.match,
        subFnOptions,
      );

      if (!parseResult) {
        return (0, _index.constructFrom)(referenceDate, NaN);
      }

      setters.push(parseResult.setter);

      dateStr = parseResult.rest;
    } else {
      if (firstCharacter.match(unescapedLatinCharacterRegExp)) {
        throw new RangeError(
          "Format string contains an unescaped latin alphabet character `" +
            firstCharacter +
            "`",
        );
      }

      // Replace two single quote characters with one single quote character
      if (token === "''") {
        token = "'";
      } else if (firstCharacter === "'") {
        token = cleanEscapedString(token);
      }

      // Cut token from string, or, if string doesn't match the token, return Invalid Date
      if (dateStr.indexOf(token) === 0) {
        dateStr = dateStr.slice(token.length);
      } else {
        return (0, _index.constructFrom)(referenceDate, NaN);
      }
    }
  }

  // Check if the remaining input contains something other than whitespace
  if (dateStr.length > 0 && notWhitespaceRegExp.test(dateStr)) {
    return (0, _index.constructFrom)(referenceDate, NaN);
  }

  const uniquePrioritySetters = setters
    .map((setter) => setter.priority)
    .sort((a, b) => b - a)
    .filter((priority, index, array) => array.indexOf(priority) === index)
    .map((priority) =>
      setters
        .filter((setter) => setter.priority === priority)
        .sort((a, b) => b.subPriority - a.subPriority),
    )
    .map((setterArray) => setterArray[0]);

  let date = (0, _index4.toDate)(referenceDate);

  if (isNaN(date.getTime())) {
    return (0, _index.constructFrom)(referenceDate, NaN);
  }

  const flags = {};
  for (const setter of uniquePrioritySetters) {
    if (!setter.validate(date, subFnOptions)) {
      return (0, _index.constructFrom)(referenceDate, NaN);
    }

    const result = setter.set(date, flags, subFnOptions);
    // Result is tuple (date, flags)
    if (Array.isArray(result)) {
      date = result[0];
      Object.assign(flags, result[1]);
      // Result is date
    } else {
      date = result;
    }
  }

  return (0, _index.constructFrom)(referenceDate, date);
}

function cleanEscapedString(input) {
  return input.match(escapedStringRegExp)[1].replace(doubleQuoteRegExp, "'");
}


/***/ }),
/* 211 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.parsers = void 0;
var _EraParser = __webpack_require__(212);
var _YearParser = __webpack_require__(216);
var _LocalWeekYearParser = __webpack_require__(219);
var _ISOWeekYearParser = __webpack_require__(220);
var _ExtendedYearParser = __webpack_require__(221);
var _QuarterParser = __webpack_require__(222);
var _StandAloneQuarterParser = __webpack_require__(223);
var _MonthParser = __webpack_require__(224);
var _StandAloneMonthParser = __webpack_require__(225);
var _LocalWeekParser = __webpack_require__(226);
var _ISOWeekParser = __webpack_require__(228);
var _DateParser = __webpack_require__(230);
var _DayOfYearParser = __webpack_require__(231);
var _DayParser = __webpack_require__(232);
var _LocalDayParser = __webpack_require__(234);
var _StandAloneLocalDayParser = __webpack_require__(235);
var _ISODayParser = __webpack_require__(236);
var _AMPMParser = __webpack_require__(238);
var _AMPMMidnightParser = __webpack_require__(239);
var _DayPeriodParser = __webpack_require__(240);
var _Hour1to12Parser = __webpack_require__(241);
var _Hour0to23Parser = __webpack_require__(242);
var _Hour0To11Parser = __webpack_require__(243);
var _Hour1To24Parser = __webpack_require__(244);
var _MinuteParser = __webpack_require__(245);
var _SecondParser = __webpack_require__(246);
var _FractionOfSecondParser = __webpack_require__(247);
var _ISOTimezoneWithZParser = __webpack_require__(248);
var _ISOTimezoneParser = __webpack_require__(249);
var _TimestampSecondsParser = __webpack_require__(250);
var _TimestampMillisecondsParser = __webpack_require__(251);

/*
 * |     | Unit                           |     | Unit                           |
 * |-----|--------------------------------|-----|--------------------------------|
 * |  a  | AM, PM                         |  A* | Milliseconds in day            |
 * |  b  | AM, PM, noon, midnight         |  B  | Flexible day period            |
 * |  c  | Stand-alone local day of week  |  C* | Localized hour w/ day period   |
 * |  d  | Day of month                   |  D  | Day of year                    |
 * |  e  | Local day of week              |  E  | Day of week                    |
 * |  f  |                                |  F* | Day of week in month           |
 * |  g* | Modified Julian day            |  G  | Era                            |
 * |  h  | Hour [1-12]                    |  H  | Hour [0-23]                    |
 * |  i! | ISO day of week                |  I! | ISO week of year               |
 * |  j* | Localized hour w/ day period   |  J* | Localized hour w/o day period  |
 * |  k  | Hour [1-24]                    |  K  | Hour [0-11]                    |
 * |  l* | (deprecated)                   |  L  | Stand-alone month              |
 * |  m  | Minute                         |  M  | Month                          |
 * |  n  |                                |  N  |                                |
 * |  o! | Ordinal number modifier        |  O* | Timezone (GMT)                 |
 * |  p  |                                |  P  |                                |
 * |  q  | Stand-alone quarter            |  Q  | Quarter                        |
 * |  r* | Related Gregorian year         |  R! | ISO week-numbering year        |
 * |  s  | Second                         |  S  | Fraction of second             |
 * |  t! | Seconds timestamp              |  T! | Milliseconds timestamp         |
 * |  u  | Extended year                  |  U* | Cyclic year                    |
 * |  v* | Timezone (generic non-locat.)  |  V* | Timezone (location)            |
 * |  w  | Local week of year             |  W* | Week of month                  |
 * |  x  | Timezone (ISO-8601 w/o Z)      |  X  | Timezone (ISO-8601)            |
 * |  y  | Year (abs)                     |  Y  | Local week-numbering year      |
 * |  z* | Timezone (specific non-locat.) |  Z* | Timezone (aliases)             |
 *
 * Letters marked by * are not implemented but reserved by Unicode standard.
 *
 * Letters marked by ! are non-standard, but implemented by date-fns:
 * - `o` modifies the previous token to turn it into an ordinal (see `parse` docs)
 * - `i` is ISO day of week. For `i` and `ii` is returns numeric ISO week days,
 *   i.e. 7 for Sunday, 1 for Monday, etc.
 * - `I` is ISO week of year, as opposed to `w` which is local week of year.
 * - `R` is ISO week-numbering year, as opposed to `Y` which is local week-numbering year.
 *   `R` is supposed to be used in conjunction with `I` and `i`
 *   for universal ISO week-numbering date, whereas
 *   `Y` is supposed to be used in conjunction with `w` and `e`
 *   for week-numbering date specific to the locale.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- It's ok, we want any here
const parsers = (exports.parsers = {
  G: new _EraParser.EraParser(),
  y: new _YearParser.YearParser(),
  Y: new _LocalWeekYearParser.LocalWeekYearParser(),
  R: new _ISOWeekYearParser.ISOWeekYearParser(),
  u: new _ExtendedYearParser.ExtendedYearParser(),
  Q: new _QuarterParser.QuarterParser(),
  q: new _StandAloneQuarterParser.StandAloneQuarterParser(),
  M: new _MonthParser.MonthParser(),
  L: new _StandAloneMonthParser.StandAloneMonthParser(),
  w: new _LocalWeekParser.LocalWeekParser(),
  I: new _ISOWeekParser.ISOWeekParser(),
  d: new _DateParser.DateParser(),
  D: new _DayOfYearParser.DayOfYearParser(),
  E: new _DayParser.DayParser(),
  e: new _LocalDayParser.LocalDayParser(),
  c: new _StandAloneLocalDayParser.StandAloneLocalDayParser(),
  i: new _ISODayParser.ISODayParser(),
  a: new _AMPMParser.AMPMParser(),
  b: new _AMPMMidnightParser.AMPMMidnightParser(),
  B: new _DayPeriodParser.DayPeriodParser(),
  h: new _Hour1to12Parser.Hour1to12Parser(),
  H: new _Hour0to23Parser.Hour0to23Parser(),
  K: new _Hour0To11Parser.Hour0To11Parser(),
  k: new _Hour1To24Parser.Hour1To24Parser(),
  m: new _MinuteParser.MinuteParser(),
  s: new _SecondParser.SecondParser(),
  S: new _FractionOfSecondParser.FractionOfSecondParser(),
  X: new _ISOTimezoneWithZParser.ISOTimezoneWithZParser(),
  x: new _ISOTimezoneParser.ISOTimezoneParser(),
  t: new _TimestampSecondsParser.TimestampSecondsParser(),
  T: new _TimestampMillisecondsParser.TimestampMillisecondsParser(),
});


/***/ }),
/* 212 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.EraParser = void 0;

var _Parser = __webpack_require__(213);

class EraParser extends _Parser.Parser {
  priority = 140;

  parse(dateString, token, match) {
    switch (token) {
      // AD, BC
      case "G":
      case "GG":
      case "GGG":
        return (
          match.era(dateString, { width: "abbreviated" }) ||
          match.era(dateString, { width: "narrow" })
        );

      // A, B
      case "GGGGG":
        return match.era(dateString, { width: "narrow" });
      // Anno Domini, Before Christ
      case "GGGG":
      default:
        return (
          match.era(dateString, { width: "wide" }) ||
          match.era(dateString, { width: "abbreviated" }) ||
          match.era(dateString, { width: "narrow" })
        );
    }
  }

  set(date, flags, value) {
    flags.era = value;
    date.setFullYear(value, 0, 1);
    date.setHours(0, 0, 0, 0);
    return date;
  }

  incompatibleTokens = ["R", "u", "t", "T"];
}
exports.EraParser = EraParser;


/***/ }),
/* 213 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.Parser = void 0;
var _Setter = __webpack_require__(214);

class Parser {
  run(dateString, token, match, options) {
    const result = this.parse(dateString, token, match, options);
    if (!result) {
      return null;
    }

    return {
      setter: new _Setter.ValueSetter(
        result.value,
        this.validate,
        this.set,
        this.priority,
        this.subPriority,
      ),
      rest: result.rest,
    };
  }

  validate(_utcDate, _value, _options) {
    return true;
  }
}
exports.Parser = Parser;


/***/ }),
/* 214 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.ValueSetter =
  exports.Setter =
  exports.DateToSystemTimezoneSetter =
    void 0;
var _index = __webpack_require__(215);
var _index2 = __webpack_require__(54);

const TIMEZONE_UNIT_PRIORITY = 10;

class Setter {
  subPriority = 0;

  validate(_utcDate, _options) {
    return true;
  }
}
exports.Setter = Setter;

class ValueSetter extends Setter {
  constructor(
    value,

    validateValue,

    setValue,

    priority,
    subPriority,
  ) {
    super();
    this.value = value;
    this.validateValue = validateValue;
    this.setValue = setValue;
    this.priority = priority;
    if (subPriority) {
      this.subPriority = subPriority;
    }
  }

  validate(date, options) {
    return this.validateValue(date, this.value, options);
  }

  set(date, flags, options) {
    return this.setValue(date, flags, this.value, options);
  }
}
exports.ValueSetter = ValueSetter;

class DateToSystemTimezoneSetter extends Setter {
  priority = TIMEZONE_UNIT_PRIORITY;
  subPriority = -1;
  set(date, flags) {
    if (flags.timestampIsSet) return date;
    return (0, _index2.constructFrom)(date, (0, _index.transpose)(date, Date));
  }
}
exports.DateToSystemTimezoneSetter = DateToSystemTimezoneSetter;


/***/ }),
/* 215 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.transpose = transpose;
var _index = __webpack_require__(54);

/**
 * @name transpose
 * @category Generic Helpers
 * @summary Transpose the date to the given constructor.
 *
 * @description
 * The function transposes the date to the given constructor. It helps you
 * to transpose the date in the system time zone to say `UTCDate` or any other
 * date extension.
 *
 * @typeParam DateInputType - The input `Date` type derived from the passed argument.
 * @typeParam DateOutputType - The output `Date` type derived from the passed constructor.
 *
 * @param fromDate - The date to use values from
 * @param constructor - The date constructor to use
 *
 * @returns Date transposed to the given constructor
 *
 * @example
 * // Create July 10, 2022 00:00 in locale time zone
 * const date = new Date(2022, 6, 10)
 * //=> 'Sun Jul 10 2022 00:00:00 GMT+0800 (Singapore Standard Time)'
 *
 * @example
 * // Transpose the date to July 10, 2022 00:00 in UTC
 * transpose(date, UTCDate)
 * //=> 'Sun Jul 10 2022 00:00:00 GMT+0000 (Coordinated Universal Time)'
 */
function transpose(fromDate, constructor) {
  const date =
    constructor instanceof Date
      ? (0, _index.constructFrom)(constructor, 0)
      : new constructor(0);
  date.setFullYear(
    fromDate.getFullYear(),
    fromDate.getMonth(),
    fromDate.getDate(),
  );
  date.setHours(
    fromDate.getHours(),
    fromDate.getMinutes(),
    fromDate.getSeconds(),
    fromDate.getMilliseconds(),
  );
  return date;
}


/***/ }),
/* 216 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.YearParser = void 0;
var _Parser = __webpack_require__(213);

var _utils = __webpack_require__(217);

// From http://www.unicode.org/reports/tr35/tr35-31/tr35-dates.html#Date_Format_Patterns
// | Year     |     y | yy |   yyy |  yyyy | yyyyy |
// |----------|-------|----|-------|-------|-------|
// | AD 1     |     1 | 01 |   001 |  0001 | 00001 |
// | AD 12    |    12 | 12 |   012 |  0012 | 00012 |
// | AD 123   |   123 | 23 |   123 |  0123 | 00123 |
// | AD 1234  |  1234 | 34 |  1234 |  1234 | 01234 |
// | AD 12345 | 12345 | 45 | 12345 | 12345 | 12345 |
class YearParser extends _Parser.Parser {
  priority = 130;
  incompatibleTokens = ["Y", "R", "u", "w", "I", "i", "e", "c", "t", "T"];

  parse(dateString, token, match) {
    const valueCallback = (year) => ({
      year,
      isTwoDigitYear: token === "yy",
    });

    switch (token) {
      case "y":
        return (0, _utils.mapValue)(
          (0, _utils.parseNDigits)(4, dateString),
          valueCallback,
        );
      case "yo":
        return (0, _utils.mapValue)(
          match.ordinalNumber(dateString, {
            unit: "year",
          }),
          valueCallback,
        );
      default:
        return (0, _utils.mapValue)(
          (0, _utils.parseNDigits)(token.length, dateString),
          valueCallback,
        );
    }
  }

  validate(_date, value) {
    return value.isTwoDigitYear || value.year > 0;
  }

  set(date, flags, value) {
    const currentYear = date.getFullYear();

    if (value.isTwoDigitYear) {
      const normalizedTwoDigitYear = (0, _utils.normalizeTwoDigitYear)(
        value.year,
        currentYear,
      );
      date.setFullYear(normalizedTwoDigitYear, 0, 1);
      date.setHours(0, 0, 0, 0);
      return date;
    }

    const year =
      !("era" in flags) || flags.era === 1 ? value.year : 1 - value.year;
    date.setFullYear(year, 0, 1);
    date.setHours(0, 0, 0, 0);
    return date;
  }
}
exports.YearParser = YearParser;


/***/ }),
/* 217 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.dayPeriodEnumToHours = dayPeriodEnumToHours;
exports.isLeapYearIndex = isLeapYearIndex;
exports.mapValue = mapValue;
exports.normalizeTwoDigitYear = normalizeTwoDigitYear;
exports.parseAnyDigitsSigned = parseAnyDigitsSigned;
exports.parseNDigits = parseNDigits;
exports.parseNDigitsSigned = parseNDigitsSigned;
exports.parseNumericPattern = parseNumericPattern;
exports.parseTimezonePattern = parseTimezonePattern;
var _index = __webpack_require__(62);

var _constants = __webpack_require__(218);

function mapValue(parseFnResult, mapFn) {
  if (!parseFnResult) {
    return parseFnResult;
  }

  return {
    value: mapFn(parseFnResult.value),
    rest: parseFnResult.rest,
  };
}

function parseNumericPattern(pattern, dateString) {
  const matchResult = dateString.match(pattern);

  if (!matchResult) {
    return null;
  }

  return {
    value: parseInt(matchResult[0], 10),
    rest: dateString.slice(matchResult[0].length),
  };
}

function parseTimezonePattern(pattern, dateString) {
  const matchResult = dateString.match(pattern);

  if (!matchResult) {
    return null;
  }

  // Input is 'Z'
  if (matchResult[0] === "Z") {
    return {
      value: 0,
      rest: dateString.slice(1),
    };
  }

  const sign = matchResult[1] === "+" ? 1 : -1;
  const hours = matchResult[2] ? parseInt(matchResult[2], 10) : 0;
  const minutes = matchResult[3] ? parseInt(matchResult[3], 10) : 0;
  const seconds = matchResult[5] ? parseInt(matchResult[5], 10) : 0;

  return {
    value:
      sign *
      (hours * _index.millisecondsInHour +
        minutes * _index.millisecondsInMinute +
        seconds * _index.millisecondsInSecond),
    rest: dateString.slice(matchResult[0].length),
  };
}

function parseAnyDigitsSigned(dateString) {
  return parseNumericPattern(
    _constants.numericPatterns.anyDigitsSigned,
    dateString,
  );
}

function parseNDigits(n, dateString) {
  switch (n) {
    case 1:
      return parseNumericPattern(
        _constants.numericPatterns.singleDigit,
        dateString,
      );
    case 2:
      return parseNumericPattern(
        _constants.numericPatterns.twoDigits,
        dateString,
      );
    case 3:
      return parseNumericPattern(
        _constants.numericPatterns.threeDigits,
        dateString,
      );
    case 4:
      return parseNumericPattern(
        _constants.numericPatterns.fourDigits,
        dateString,
      );
    default:
      return parseNumericPattern(new RegExp("^\\d{1," + n + "}"), dateString);
  }
}

function parseNDigitsSigned(n, dateString) {
  switch (n) {
    case 1:
      return parseNumericPattern(
        _constants.numericPatterns.singleDigitSigned,
        dateString,
      );
    case 2:
      return parseNumericPattern(
        _constants.numericPatterns.twoDigitsSigned,
        dateString,
      );
    case 3:
      return parseNumericPattern(
        _constants.numericPatterns.threeDigitsSigned,
        dateString,
      );
    case 4:
      return parseNumericPattern(
        _constants.numericPatterns.fourDigitsSigned,
        dateString,
      );
    default:
      return parseNumericPattern(new RegExp("^-?\\d{1," + n + "}"), dateString);
  }
}

function dayPeriodEnumToHours(dayPeriod) {
  switch (dayPeriod) {
    case "morning":
      return 4;
    case "evening":
      return 17;
    case "pm":
    case "noon":
    case "afternoon":
      return 12;
    case "am":
    case "midnight":
    case "night":
    default:
      return 0;
  }
}

function normalizeTwoDigitYear(twoDigitYear, currentYear) {
  const isCommonEra = currentYear > 0;
  // Absolute number of the current year:
  // 1 -> 1 AC
  // 0 -> 1 BC
  // -1 -> 2 BC
  const absCurrentYear = isCommonEra ? currentYear : 1 - currentYear;

  let result;
  if (absCurrentYear <= 50) {
    result = twoDigitYear || 100;
  } else {
    const rangeEnd = absCurrentYear + 50;
    const rangeEndCentury = Math.trunc(rangeEnd / 100) * 100;
    const isPreviousCentury = twoDigitYear >= rangeEnd % 100;
    result = twoDigitYear + rangeEndCentury - (isPreviousCentury ? 100 : 0);
  }

  return isCommonEra ? result : 1 - result;
}

function isLeapYearIndex(year) {
  return year % 400 === 0 || (year % 4 === 0 && year % 100 !== 0);
}


/***/ }),
/* 218 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

exports.timezonePatterns = exports.numericPatterns = void 0;
const numericPatterns = (exports.numericPatterns = {
  month: /^(1[0-2]|0?\d)/, // 0 to 12
  date: /^(3[0-1]|[0-2]?\d)/, // 0 to 31
  dayOfYear: /^(36[0-6]|3[0-5]\d|[0-2]?\d?\d)/, // 0 to 366
  week: /^(5[0-3]|[0-4]?\d)/, // 0 to 53
  hour23h: /^(2[0-3]|[0-1]?\d)/, // 0 to 23
  hour24h: /^(2[0-4]|[0-1]?\d)/, // 0 to 24
  hour11h: /^(1[0-1]|0?\d)/, // 0 to 11
  hour12h: /^(1[0-2]|0?\d)/, // 0 to 12
  minute: /^[0-5]?\d/, // 0 to 59
  second: /^[0-5]?\d/, // 0 to 59

  singleDigit: /^\d/, // 0 to 9
  twoDigits: /^\d{1,2}/, // 0 to 99
  threeDigits: /^\d{1,3}/, // 0 to 999
  fourDigits: /^\d{1,4}/, // 0 to 9999

  anyDigitsSigned: /^-?\d+/,
  singleDigitSigned: /^-?\d/, // 0 to 9, -0 to -9
  twoDigitsSigned: /^-?\d{1,2}/, // 0 to 99, -0 to -99
  threeDigitsSigned: /^-?\d{1,3}/, // 0 to 999, -0 to -999
  fourDigitsSigned: /^-?\d{1,4}/, // 0 to 9999, -0 to -9999
});

const timezonePatterns = (exports.timezonePatterns = {
  basicOptionalMinutes: /^([+-])(\d{2})(\d{2})?|Z/,
  basic: /^([+-])(\d{2})(\d{2})|Z/,
  basicOptionalSeconds: /^([+-])(\d{2})(\d{2})((\d{2}))?|Z/,
  extended: /^([+-])(\d{2}):(\d{2})|Z/,
  extendedOptionalSeconds: /^([+-])(\d{2}):(\d{2})(:(\d{2}))?|Z/,
});


/***/ }),
/* 219 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.LocalWeekYearParser = void 0;
var _index = __webpack_require__(157);

var _index2 = __webpack_require__(66);
var _Parser = __webpack_require__(213);

var _utils = __webpack_require__(217);

// Local week-numbering year
class LocalWeekYearParser extends _Parser.Parser {
  priority = 130;

  parse(dateString, token, match) {
    const valueCallback = (year) => ({
      year,
      isTwoDigitYear: token === "YY",
    });

    switch (token) {
      case "Y":
        return (0, _utils.mapValue)(
          (0, _utils.parseNDigits)(4, dateString),
          valueCallback,
        );
      case "Yo":
        return (0, _utils.mapValue)(
          match.ordinalNumber(dateString, {
            unit: "year",
          }),
          valueCallback,
        );
      default:
        return (0, _utils.mapValue)(
          (0, _utils.parseNDigits)(token.length, dateString),
          valueCallback,
        );
    }
  }

  validate(_date, value) {
    return value.isTwoDigitYear || value.year > 0;
  }

  set(date, flags, value, options) {
    const currentYear = (0, _index.getWeekYear)(date, options);

    if (value.isTwoDigitYear) {
      const normalizedTwoDigitYear = (0, _utils.normalizeTwoDigitYear)(
        value.year,
        currentYear,
      );
      date.setFullYear(
        normalizedTwoDigitYear,
        0,
        options.firstWeekContainsDate,
      );
      date.setHours(0, 0, 0, 0);
      return (0, _index2.startOfWeek)(date, options);
    }

    const year =
      !("era" in flags) || flags.era === 1 ? value.year : 1 - value.year;
    date.setFullYear(year, 0, options.firstWeekContainsDate);
    date.setHours(0, 0, 0, 0);
    return (0, _index2.startOfWeek)(date, options);
  }

  incompatibleTokens = [
    "y",
    "R",
    "u",
    "Q",
    "q",
    "M",
    "L",
    "I",
    "d",
    "D",
    "i",
    "t",
    "T",
  ];
}
exports.LocalWeekYearParser = LocalWeekYearParser;


/***/ }),
/* 220 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.ISOWeekYearParser = void 0;
var _index = __webpack_require__(65);
var _index2 = __webpack_require__(54);
var _Parser = __webpack_require__(213);

var _utils = __webpack_require__(217);

// ISO week-numbering year
class ISOWeekYearParser extends _Parser.Parser {
  priority = 130;

  parse(dateString, token) {
    if (token === "R") {
      return (0, _utils.parseNDigitsSigned)(4, dateString);
    }

    return (0, _utils.parseNDigitsSigned)(token.length, dateString);
  }

  set(date, _flags, value) {
    const firstWeekOfYear = (0, _index2.constructFrom)(date, 0);
    firstWeekOfYear.setFullYear(value, 0, 4);
    firstWeekOfYear.setHours(0, 0, 0, 0);
    return (0, _index.startOfISOWeek)(firstWeekOfYear);
  }

  incompatibleTokens = [
    "G",
    "y",
    "Y",
    "u",
    "Q",
    "q",
    "M",
    "L",
    "w",
    "d",
    "D",
    "e",
    "c",
    "t",
    "T",
  ];
}
exports.ISOWeekYearParser = ISOWeekYearParser;


/***/ }),
/* 221 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.ExtendedYearParser = void 0;
var _Parser = __webpack_require__(213);

var _utils = __webpack_require__(217);

class ExtendedYearParser extends _Parser.Parser {
  priority = 130;

  parse(dateString, token) {
    if (token === "u") {
      return (0, _utils.parseNDigitsSigned)(4, dateString);
    }

    return (0, _utils.parseNDigitsSigned)(token.length, dateString);
  }

  set(date, _flags, value) {
    date.setFullYear(value, 0, 1);
    date.setHours(0, 0, 0, 0);
    return date;
  }

  incompatibleTokens = ["G", "y", "Y", "R", "w", "I", "i", "e", "c", "t", "T"];
}
exports.ExtendedYearParser = ExtendedYearParser;


/***/ }),
/* 222 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.QuarterParser = void 0;
var _Parser = __webpack_require__(213);

var _utils = __webpack_require__(217);

class QuarterParser extends _Parser.Parser {
  priority = 120;

  parse(dateString, token, match) {
    switch (token) {
      // 1, 2, 3, 4
      case "Q":
      case "QQ": // 01, 02, 03, 04
        return (0, _utils.parseNDigits)(token.length, dateString);
      // 1st, 2nd, 3rd, 4th
      case "Qo":
        return match.ordinalNumber(dateString, { unit: "quarter" });
      // Q1, Q2, Q3, Q4
      case "QQQ":
        return (
          match.quarter(dateString, {
            width: "abbreviated",
            context: "formatting",
          }) ||
          match.quarter(dateString, {
            width: "narrow",
            context: "formatting",
          })
        );

      // 1, 2, 3, 4 (narrow quarter; could be not numerical)
      case "QQQQQ":
        return match.quarter(dateString, {
          width: "narrow",
          context: "formatting",
        });
      // 1st quarter, 2nd quarter, ...
      case "QQQQ":
      default:
        return (
          match.quarter(dateString, {
            width: "wide",
            context: "formatting",
          }) ||
          match.quarter(dateString, {
            width: "abbreviated",
            context: "formatting",
          }) ||
          match.quarter(dateString, {
            width: "narrow",
            context: "formatting",
          })
        );
    }
  }

  validate(_date, value) {
    return value >= 1 && value <= 4;
  }

  set(date, _flags, value) {
    date.setMonth((value - 1) * 3, 1);
    date.setHours(0, 0, 0, 0);
    return date;
  }

  incompatibleTokens = [
    "Y",
    "R",
    "q",
    "M",
    "L",
    "w",
    "I",
    "d",
    "D",
    "i",
    "e",
    "c",
    "t",
    "T",
  ];
}
exports.QuarterParser = QuarterParser;


/***/ }),
/* 223 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.StandAloneQuarterParser = void 0;
var _Parser = __webpack_require__(213);

var _utils = __webpack_require__(217);

class StandAloneQuarterParser extends _Parser.Parser {
  priority = 120;

  parse(dateString, token, match) {
    switch (token) {
      // 1, 2, 3, 4
      case "q":
      case "qq": // 01, 02, 03, 04
        return (0, _utils.parseNDigits)(token.length, dateString);
      // 1st, 2nd, 3rd, 4th
      case "qo":
        return match.ordinalNumber(dateString, { unit: "quarter" });
      // Q1, Q2, Q3, Q4
      case "qqq":
        return (
          match.quarter(dateString, {
            width: "abbreviated",
            context: "standalone",
          }) ||
          match.quarter(dateString, {
            width: "narrow",
            context: "standalone",
          })
        );

      // 1, 2, 3, 4 (narrow quarter; could be not numerical)
      case "qqqqq":
        return match.quarter(dateString, {
          width: "narrow",
          context: "standalone",
        });
      // 1st quarter, 2nd quarter, ...
      case "qqqq":
      default:
        return (
          match.quarter(dateString, {
            width: "wide",
            context: "standalone",
          }) ||
          match.quarter(dateString, {
            width: "abbreviated",
            context: "standalone",
          }) ||
          match.quarter(dateString, {
            width: "narrow",
            context: "standalone",
          })
        );
    }
  }

  validate(_date, value) {
    return value >= 1 && value <= 4;
  }

  set(date, _flags, value) {
    date.setMonth((value - 1) * 3, 1);
    date.setHours(0, 0, 0, 0);
    return date;
  }

  incompatibleTokens = [
    "Y",
    "R",
    "Q",
    "M",
    "L",
    "w",
    "I",
    "d",
    "D",
    "i",
    "e",
    "c",
    "t",
    "T",
  ];
}
exports.StandAloneQuarterParser = StandAloneQuarterParser;


/***/ }),
/* 224 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.MonthParser = void 0;
var _constants = __webpack_require__(218);
var _Parser = __webpack_require__(213);

var _utils = __webpack_require__(217);

class MonthParser extends _Parser.Parser {
  incompatibleTokens = [
    "Y",
    "R",
    "q",
    "Q",
    "L",
    "w",
    "I",
    "D",
    "i",
    "e",
    "c",
    "t",
    "T",
  ];

  priority = 110;

  parse(dateString, token, match) {
    const valueCallback = (value) => value - 1;

    switch (token) {
      // 1, 2, ..., 12
      case "M":
        return (0, _utils.mapValue)(
          (0, _utils.parseNumericPattern)(
            _constants.numericPatterns.month,
            dateString,
          ),
          valueCallback,
        );
      // 01, 02, ..., 12
      case "MM":
        return (0, _utils.mapValue)(
          (0, _utils.parseNDigits)(2, dateString),
          valueCallback,
        );
      // 1st, 2nd, ..., 12th
      case "Mo":
        return (0, _utils.mapValue)(
          match.ordinalNumber(dateString, {
            unit: "month",
          }),
          valueCallback,
        );
      // Jan, Feb, ..., Dec
      case "MMM":
        return (
          match.month(dateString, {
            width: "abbreviated",
            context: "formatting",
          }) ||
          match.month(dateString, { width: "narrow", context: "formatting" })
        );

      // J, F, ..., D
      case "MMMMM":
        return match.month(dateString, {
          width: "narrow",
          context: "formatting",
        });
      // January, February, ..., December
      case "MMMM":
      default:
        return (
          match.month(dateString, { width: "wide", context: "formatting" }) ||
          match.month(dateString, {
            width: "abbreviated",
            context: "formatting",
          }) ||
          match.month(dateString, { width: "narrow", context: "formatting" })
        );
    }
  }

  validate(_date, value) {
    return value >= 0 && value <= 11;
  }

  set(date, _flags, value) {
    date.setMonth(value, 1);
    date.setHours(0, 0, 0, 0);
    return date;
  }
}
exports.MonthParser = MonthParser;


/***/ }),
/* 225 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.StandAloneMonthParser = void 0;
var _constants = __webpack_require__(218);
var _Parser = __webpack_require__(213);

var _utils = __webpack_require__(217);

class StandAloneMonthParser extends _Parser.Parser {
  priority = 110;

  parse(dateString, token, match) {
    const valueCallback = (value) => value - 1;

    switch (token) {
      // 1, 2, ..., 12
      case "L":
        return (0, _utils.mapValue)(
          (0, _utils.parseNumericPattern)(
            _constants.numericPatterns.month,
            dateString,
          ),
          valueCallback,
        );
      // 01, 02, ..., 12
      case "LL":
        return (0, _utils.mapValue)(
          (0, _utils.parseNDigits)(2, dateString),
          valueCallback,
        );
      // 1st, 2nd, ..., 12th
      case "Lo":
        return (0, _utils.mapValue)(
          match.ordinalNumber(dateString, {
            unit: "month",
          }),
          valueCallback,
        );
      // Jan, Feb, ..., Dec
      case "LLL":
        return (
          match.month(dateString, {
            width: "abbreviated",
            context: "standalone",
          }) ||
          match.month(dateString, { width: "narrow", context: "standalone" })
        );

      // J, F, ..., D
      case "LLLLL":
        return match.month(dateString, {
          width: "narrow",
          context: "standalone",
        });
      // January, February, ..., December
      case "LLLL":
      default:
        return (
          match.month(dateString, { width: "wide", context: "standalone" }) ||
          match.month(dateString, {
            width: "abbreviated",
            context: "standalone",
          }) ||
          match.month(dateString, { width: "narrow", context: "standalone" })
        );
    }
  }

  validate(_date, value) {
    return value >= 0 && value <= 11;
  }

  set(date, _flags, value) {
    date.setMonth(value, 1);
    date.setHours(0, 0, 0, 0);
    return date;
  }

  incompatibleTokens = [
    "Y",
    "R",
    "q",
    "Q",
    "M",
    "w",
    "I",
    "D",
    "i",
    "e",
    "c",
    "t",
    "T",
  ];
}
exports.StandAloneMonthParser = StandAloneMonthParser;


/***/ }),
/* 226 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.LocalWeekParser = void 0;
var _index = __webpack_require__(227);
var _index2 = __webpack_require__(66);
var _constants = __webpack_require__(218);
var _Parser = __webpack_require__(213);

var _utils = __webpack_require__(217);

// Local week of year
class LocalWeekParser extends _Parser.Parser {
  priority = 100;

  parse(dateString, token, match) {
    switch (token) {
      case "w":
        return (0, _utils.parseNumericPattern)(
          _constants.numericPatterns.week,
          dateString,
        );
      case "wo":
        return match.ordinalNumber(dateString, { unit: "week" });
      default:
        return (0, _utils.parseNDigits)(token.length, dateString);
    }
  }

  validate(_date, value) {
    return value >= 1 && value <= 53;
  }

  set(date, _flags, value, options) {
    return (0, _index2.startOfWeek)(
      (0, _index.setWeek)(date, value, options),
      options,
    );
  }

  incompatibleTokens = [
    "y",
    "R",
    "u",
    "q",
    "Q",
    "M",
    "L",
    "I",
    "d",
    "D",
    "i",
    "t",
    "T",
  ];
}
exports.LocalWeekParser = LocalWeekParser;


/***/ }),
/* 227 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.setWeek = setWeek;
var _index = __webpack_require__(155);
var _index2 = __webpack_require__(53);

/**
 * The {@link setWeek} function options.
 */

/**
 * @name setWeek
 * @category Week Helpers
 * @summary Set the local week to the given date.
 *
 * @description
 * Set the local week to the given date, saving the weekday number.
 * The exact calculation depends on the values of
 * `options.weekStartsOn` (which is the index of the first day of the week)
 * and `options.firstWeekContainsDate` (which is the day of January, which is always in
 * the first week of the week-numbering year)
 *
 * Week numbering: https://en.wikipedia.org/wiki/Week#The_ISO_week_date_system
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The date to be changed
 * @param week - The week of the new date
 * @param options - An object with options
 *
 * @returns The new date with the local week set
 *
 * @example
 * // Set the 1st week to 2 January 2005 with default options:
 * const result = setWeek(new Date(2005, 0, 2), 1)
 * //=> Sun Dec 26 2004 00:00:00
 *
 * @example
 * // Set the 1st week to 2 January 2005,
 * // if Monday is the first day of the week,
 * // and the first week of the year always contains 4 January:
 * const result = setWeek(new Date(2005, 0, 2), 1, {
 *   weekStartsOn: 1,
 *   firstWeekContainsDate: 4
 * })
 * //=> Sun Jan 4 2004 00:00:00
 */
function setWeek(date, week, options) {
  const _date = (0, _index2.toDate)(date);
  const diff = (0, _index.getWeek)(_date, options) - week;
  _date.setDate(_date.getDate() - diff * 7);
  return _date;
}


/***/ }),
/* 228 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.ISOWeekParser = void 0;
var _index = __webpack_require__(229);
var _index2 = __webpack_require__(65);
var _constants = __webpack_require__(218);
var _Parser = __webpack_require__(213);

var _utils = __webpack_require__(217);

// ISO week of year
class ISOWeekParser extends _Parser.Parser {
  priority = 100;

  parse(dateString, token, match) {
    switch (token) {
      case "I":
        return (0, _utils.parseNumericPattern)(
          _constants.numericPatterns.week,
          dateString,
        );
      case "Io":
        return match.ordinalNumber(dateString, { unit: "week" });
      default:
        return (0, _utils.parseNDigits)(token.length, dateString);
    }
  }

  validate(_date, value) {
    return value >= 1 && value <= 53;
  }

  set(date, _flags, value) {
    return (0, _index2.startOfISOWeek)((0, _index.setISOWeek)(date, value));
  }

  incompatibleTokens = [
    "y",
    "Y",
    "u",
    "q",
    "Q",
    "M",
    "L",
    "w",
    "d",
    "D",
    "e",
    "c",
    "t",
    "T",
  ];
}
exports.ISOWeekParser = ISOWeekParser;


/***/ }),
/* 229 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.setISOWeek = setISOWeek;
var _index = __webpack_require__(154);
var _index2 = __webpack_require__(53);

/**
 * @name setISOWeek
 * @category ISO Week Helpers
 * @summary Set the ISO week to the given date.
 *
 * @description
 * Set the ISO week to the given date, saving the weekday number.
 *
 * ISO week-numbering year: http://en.wikipedia.org/wiki/ISO_week_date
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The date to be changed
 * @param week - The ISO week of the new date
 *
 * @returns The new date with the ISO week set
 *
 * @example
 * // Set the 53rd ISO week to 7 August 2004:
 * const result = setISOWeek(new Date(2004, 7, 7), 53)
 * //=> Sat Jan 01 2005 00:00:00
 */
function setISOWeek(date, week) {
  const _date = (0, _index2.toDate)(date);
  const diff = (0, _index.getISOWeek)(_date) - week;
  _date.setDate(_date.getDate() - diff * 7);
  return _date;
}


/***/ }),
/* 230 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.DateParser = void 0;
var _constants = __webpack_require__(218);
var _Parser = __webpack_require__(213);

var _utils = __webpack_require__(217);

const DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const DAYS_IN_MONTH_LEAP_YEAR = [
  31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31,
];

// Day of the month
class DateParser extends _Parser.Parser {
  priority = 90;
  subPriority = 1;

  parse(dateString, token, match) {
    switch (token) {
      case "d":
        return (0, _utils.parseNumericPattern)(
          _constants.numericPatterns.date,
          dateString,
        );
      case "do":
        return match.ordinalNumber(dateString, { unit: "date" });
      default:
        return (0, _utils.parseNDigits)(token.length, dateString);
    }
  }

  validate(date, value) {
    const year = date.getFullYear();
    const isLeapYear = (0, _utils.isLeapYearIndex)(year);
    const month = date.getMonth();
    if (isLeapYear) {
      return value >= 1 && value <= DAYS_IN_MONTH_LEAP_YEAR[month];
    } else {
      return value >= 1 && value <= DAYS_IN_MONTH[month];
    }
  }

  set(date, _flags, value) {
    date.setDate(value);
    date.setHours(0, 0, 0, 0);
    return date;
  }

  incompatibleTokens = [
    "Y",
    "R",
    "q",
    "Q",
    "w",
    "I",
    "D",
    "i",
    "e",
    "c",
    "t",
    "T",
  ];
}
exports.DateParser = DateParser;


/***/ }),
/* 231 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.DayOfYearParser = void 0;
var _constants = __webpack_require__(218);
var _Parser = __webpack_require__(213);

var _utils = __webpack_require__(217);

class DayOfYearParser extends _Parser.Parser {
  priority = 90;

  subpriority = 1;

  parse(dateString, token, match) {
    switch (token) {
      case "D":
      case "DD":
        return (0, _utils.parseNumericPattern)(
          _constants.numericPatterns.dayOfYear,
          dateString,
        );
      case "Do":
        return match.ordinalNumber(dateString, { unit: "date" });
      default:
        return (0, _utils.parseNDigits)(token.length, dateString);
    }
  }

  validate(date, value) {
    const year = date.getFullYear();
    const isLeapYear = (0, _utils.isLeapYearIndex)(year);
    if (isLeapYear) {
      return value >= 1 && value <= 366;
    } else {
      return value >= 1 && value <= 365;
    }
  }

  set(date, _flags, value) {
    date.setMonth(0, value);
    date.setHours(0, 0, 0, 0);
    return date;
  }

  incompatibleTokens = [
    "Y",
    "R",
    "q",
    "Q",
    "M",
    "L",
    "w",
    "I",
    "d",
    "E",
    "i",
    "e",
    "c",
    "t",
    "T",
  ];
}
exports.DayOfYearParser = DayOfYearParser;


/***/ }),
/* 232 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.DayParser = void 0;
var _index = __webpack_require__(233);
var _Parser = __webpack_require__(213);

// Day of week
class DayParser extends _Parser.Parser {
  priority = 90;

  parse(dateString, token, match) {
    switch (token) {
      // Tue
      case "E":
      case "EE":
      case "EEE":
        return (
          match.day(dateString, {
            width: "abbreviated",
            context: "formatting",
          }) ||
          match.day(dateString, { width: "short", context: "formatting" }) ||
          match.day(dateString, { width: "narrow", context: "formatting" })
        );

      // T
      case "EEEEE":
        return match.day(dateString, {
          width: "narrow",
          context: "formatting",
        });
      // Tu
      case "EEEEEE":
        return (
          match.day(dateString, { width: "short", context: "formatting" }) ||
          match.day(dateString, { width: "narrow", context: "formatting" })
        );

      // Tuesday
      case "EEEE":
      default:
        return (
          match.day(dateString, { width: "wide", context: "formatting" }) ||
          match.day(dateString, {
            width: "abbreviated",
            context: "formatting",
          }) ||
          match.day(dateString, { width: "short", context: "formatting" }) ||
          match.day(dateString, { width: "narrow", context: "formatting" })
        );
    }
  }

  validate(_date, value) {
    return value >= 0 && value <= 6;
  }

  set(date, _flags, value, options) {
    date = (0, _index.setDay)(date, value, options);
    date.setHours(0, 0, 0, 0);
    return date;
  }

  incompatibleTokens = ["D", "i", "e", "c", "t", "T"];
}
exports.DayParser = DayParser;


/***/ }),
/* 233 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.setDay = setDay;
var _index = __webpack_require__(52);
var _index2 = __webpack_require__(53);

var _index3 = __webpack_require__(67);

/**
 * The {@link setDay} function options.
 */

/**
 * @name setDay
 * @category Weekday Helpers
 * @summary Set the day of the week to the given date.
 *
 * @description
 * Set the day of the week to the given date.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The date to be changed
 * @param day - The day of the week of the new date
 * @param options - An object with options.
 *
 * @returns The new date with the day of the week set
 *
 * @example
 * // Set week day to Sunday, with the default weekStartsOn of Sunday:
 * const result = setDay(new Date(2014, 8, 1), 0)
 * //=> Sun Aug 31 2014 00:00:00
 *
 * @example
 * // Set week day to Sunday, with a weekStartsOn of Monday:
 * const result = setDay(new Date(2014, 8, 1), 0, { weekStartsOn: 1 })
 * //=> Sun Sep 07 2014 00:00:00
 */
function setDay(date, day, options) {
  const defaultOptions = (0, _index3.getDefaultOptions)();
  const weekStartsOn =
    options?.weekStartsOn ??
    options?.locale?.options?.weekStartsOn ??
    defaultOptions.weekStartsOn ??
    defaultOptions.locale?.options?.weekStartsOn ??
    0;

  const _date = (0, _index2.toDate)(date);
  const currentDay = _date.getDay();

  const remainder = day % 7;
  const dayIndex = (remainder + 7) % 7;

  const delta = 7 - weekStartsOn;
  const diff =
    day < 0 || day > 6
      ? day - ((currentDay + delta) % 7)
      : ((dayIndex + delta) % 7) - ((currentDay + delta) % 7);
  return (0, _index.addDays)(_date, diff);
}


/***/ }),
/* 234 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.LocalDayParser = void 0;
var _index = __webpack_require__(233);
var _Parser = __webpack_require__(213);

var _utils = __webpack_require__(217);

// Local day of week
class LocalDayParser extends _Parser.Parser {
  priority = 90;
  parse(dateString, token, match, options) {
    const valueCallback = (value) => {
      // We want here floor instead of trunc, so we get -7 for value 0 instead of 0
      const wholeWeekDays = Math.floor((value - 1) / 7) * 7;
      return ((value + options.weekStartsOn + 6) % 7) + wholeWeekDays;
    };

    switch (token) {
      // 3
      case "e":
      case "ee": // 03
        return (0, _utils.mapValue)(
          (0, _utils.parseNDigits)(token.length, dateString),
          valueCallback,
        );
      // 3rd
      case "eo":
        return (0, _utils.mapValue)(
          match.ordinalNumber(dateString, {
            unit: "day",
          }),
          valueCallback,
        );
      // Tue
      case "eee":
        return (
          match.day(dateString, {
            width: "abbreviated",
            context: "formatting",
          }) ||
          match.day(dateString, { width: "short", context: "formatting" }) ||
          match.day(dateString, { width: "narrow", context: "formatting" })
        );

      // T
      case "eeeee":
        return match.day(dateString, {
          width: "narrow",
          context: "formatting",
        });
      // Tu
      case "eeeeee":
        return (
          match.day(dateString, { width: "short", context: "formatting" }) ||
          match.day(dateString, { width: "narrow", context: "formatting" })
        );

      // Tuesday
      case "eeee":
      default:
        return (
          match.day(dateString, { width: "wide", context: "formatting" }) ||
          match.day(dateString, {
            width: "abbreviated",
            context: "formatting",
          }) ||
          match.day(dateString, { width: "short", context: "formatting" }) ||
          match.day(dateString, { width: "narrow", context: "formatting" })
        );
    }
  }

  validate(_date, value) {
    return value >= 0 && value <= 6;
  }

  set(date, _flags, value, options) {
    date = (0, _index.setDay)(date, value, options);
    date.setHours(0, 0, 0, 0);
    return date;
  }

  incompatibleTokens = [
    "y",
    "R",
    "u",
    "q",
    "Q",
    "M",
    "L",
    "I",
    "d",
    "D",
    "E",
    "i",
    "c",
    "t",
    "T",
  ];
}
exports.LocalDayParser = LocalDayParser;


/***/ }),
/* 235 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.StandAloneLocalDayParser = void 0;
var _index = __webpack_require__(233);
var _Parser = __webpack_require__(213);

var _utils = __webpack_require__(217);

// Stand-alone local day of week
class StandAloneLocalDayParser extends _Parser.Parser {
  priority = 90;

  parse(dateString, token, match, options) {
    const valueCallback = (value) => {
      // We want here floor instead of trunc, so we get -7 for value 0 instead of 0
      const wholeWeekDays = Math.floor((value - 1) / 7) * 7;
      return ((value + options.weekStartsOn + 6) % 7) + wholeWeekDays;
    };

    switch (token) {
      // 3
      case "c":
      case "cc": // 03
        return (0, _utils.mapValue)(
          (0, _utils.parseNDigits)(token.length, dateString),
          valueCallback,
        );
      // 3rd
      case "co":
        return (0, _utils.mapValue)(
          match.ordinalNumber(dateString, {
            unit: "day",
          }),
          valueCallback,
        );
      // Tue
      case "ccc":
        return (
          match.day(dateString, {
            width: "abbreviated",
            context: "standalone",
          }) ||
          match.day(dateString, { width: "short", context: "standalone" }) ||
          match.day(dateString, { width: "narrow", context: "standalone" })
        );

      // T
      case "ccccc":
        return match.day(dateString, {
          width: "narrow",
          context: "standalone",
        });
      // Tu
      case "cccccc":
        return (
          match.day(dateString, { width: "short", context: "standalone" }) ||
          match.day(dateString, { width: "narrow", context: "standalone" })
        );

      // Tuesday
      case "cccc":
      default:
        return (
          match.day(dateString, { width: "wide", context: "standalone" }) ||
          match.day(dateString, {
            width: "abbreviated",
            context: "standalone",
          }) ||
          match.day(dateString, { width: "short", context: "standalone" }) ||
          match.day(dateString, { width: "narrow", context: "standalone" })
        );
    }
  }

  validate(_date, value) {
    return value >= 0 && value <= 6;
  }

  set(date, _flags, value, options) {
    date = (0, _index.setDay)(date, value, options);
    date.setHours(0, 0, 0, 0);
    return date;
  }

  incompatibleTokens = [
    "y",
    "R",
    "u",
    "q",
    "Q",
    "M",
    "L",
    "I",
    "d",
    "D",
    "E",
    "i",
    "e",
    "t",
    "T",
  ];
}
exports.StandAloneLocalDayParser = StandAloneLocalDayParser;


/***/ }),
/* 236 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.ISODayParser = void 0;
var _index = __webpack_require__(237);
var _Parser = __webpack_require__(213);

var _utils = __webpack_require__(217);

// ISO day of week
class ISODayParser extends _Parser.Parser {
  priority = 90;

  parse(dateString, token, match) {
    const valueCallback = (value) => {
      if (value === 0) {
        return 7;
      }
      return value;
    };

    switch (token) {
      // 2
      case "i":
      case "ii": // 02
        return (0, _utils.parseNDigits)(token.length, dateString);
      // 2nd
      case "io":
        return match.ordinalNumber(dateString, { unit: "day" });
      // Tue
      case "iii":
        return (0, _utils.mapValue)(
          match.day(dateString, {
            width: "abbreviated",
            context: "formatting",
          }) ||
            match.day(dateString, {
              width: "short",
              context: "formatting",
            }) ||
            match.day(dateString, {
              width: "narrow",
              context: "formatting",
            }),
          valueCallback,
        );
      // T
      case "iiiii":
        return (0, _utils.mapValue)(
          match.day(dateString, {
            width: "narrow",
            context: "formatting",
          }),
          valueCallback,
        );
      // Tu
      case "iiiiii":
        return (0, _utils.mapValue)(
          match.day(dateString, {
            width: "short",
            context: "formatting",
          }) ||
            match.day(dateString, {
              width: "narrow",
              context: "formatting",
            }),
          valueCallback,
        );
      // Tuesday
      case "iiii":
      default:
        return (0, _utils.mapValue)(
          match.day(dateString, {
            width: "wide",
            context: "formatting",
          }) ||
            match.day(dateString, {
              width: "abbreviated",
              context: "formatting",
            }) ||
            match.day(dateString, {
              width: "short",
              context: "formatting",
            }) ||
            match.day(dateString, {
              width: "narrow",
              context: "formatting",
            }),
          valueCallback,
        );
    }
  }

  validate(_date, value) {
    return value >= 1 && value <= 7;
  }

  set(date, _flags, value) {
    date = (0, _index.setISODay)(date, value);
    date.setHours(0, 0, 0, 0);
    return date;
  }

  incompatibleTokens = [
    "y",
    "Y",
    "u",
    "q",
    "Q",
    "M",
    "L",
    "w",
    "d",
    "D",
    "E",
    "e",
    "c",
    "t",
    "T",
  ];
}
exports.ISODayParser = ISODayParser;


/***/ }),
/* 237 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.setISODay = setISODay;
var _index = __webpack_require__(52);
var _index2 = __webpack_require__(182);
var _index3 = __webpack_require__(53);

/**
 * @name setISODay
 * @category Weekday Helpers
 * @summary Set the day of the ISO week to the given date.
 *
 * @description
 * Set the day of the ISO week to the given date.
 * ISO week starts with Monday.
 * 7 is the index of Sunday, 1 is the index of Monday etc.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The date to be changed
 * @param day - The day of the ISO week of the new date
 *
 * @returns The new date with the day of the ISO week set
 *
 * @example
 * // Set Sunday to 1 September 2014:
 * const result = setISODay(new Date(2014, 8, 1), 7)
 * //=> Sun Sep 07 2014 00:00:00
 */
function setISODay(date, day) {
  const _date = (0, _index3.toDate)(date);
  const currentDay = (0, _index2.getISODay)(_date);
  const diff = day - currentDay;
  return (0, _index.addDays)(_date, diff);
}


/***/ }),
/* 238 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.AMPMParser = void 0;
var _Parser = __webpack_require__(213);

var _utils = __webpack_require__(217);

class AMPMParser extends _Parser.Parser {
  priority = 80;

  parse(dateString, token, match) {
    switch (token) {
      case "a":
      case "aa":
      case "aaa":
        return (
          match.dayPeriod(dateString, {
            width: "abbreviated",
            context: "formatting",
          }) ||
          match.dayPeriod(dateString, {
            width: "narrow",
            context: "formatting",
          })
        );

      case "aaaaa":
        return match.dayPeriod(dateString, {
          width: "narrow",
          context: "formatting",
        });
      case "aaaa":
      default:
        return (
          match.dayPeriod(dateString, {
            width: "wide",
            context: "formatting",
          }) ||
          match.dayPeriod(dateString, {
            width: "abbreviated",
            context: "formatting",
          }) ||
          match.dayPeriod(dateString, {
            width: "narrow",
            context: "formatting",
          })
        );
    }
  }

  set(date, _flags, value) {
    date.setHours((0, _utils.dayPeriodEnumToHours)(value), 0, 0, 0);
    return date;
  }

  incompatibleTokens = ["b", "B", "H", "k", "t", "T"];
}
exports.AMPMParser = AMPMParser;


/***/ }),
/* 239 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.AMPMMidnightParser = void 0;
var _Parser = __webpack_require__(213);

var _utils = __webpack_require__(217);

class AMPMMidnightParser extends _Parser.Parser {
  priority = 80;

  parse(dateString, token, match) {
    switch (token) {
      case "b":
      case "bb":
      case "bbb":
        return (
          match.dayPeriod(dateString, {
            width: "abbreviated",
            context: "formatting",
          }) ||
          match.dayPeriod(dateString, {
            width: "narrow",
            context: "formatting",
          })
        );

      case "bbbbb":
        return match.dayPeriod(dateString, {
          width: "narrow",
          context: "formatting",
        });
      case "bbbb":
      default:
        return (
          match.dayPeriod(dateString, {
            width: "wide",
            context: "formatting",
          }) ||
          match.dayPeriod(dateString, {
            width: "abbreviated",
            context: "formatting",
          }) ||
          match.dayPeriod(dateString, {
            width: "narrow",
            context: "formatting",
          })
        );
    }
  }

  set(date, _flags, value) {
    date.setHours((0, _utils.dayPeriodEnumToHours)(value), 0, 0, 0);
    return date;
  }

  incompatibleTokens = ["a", "B", "H", "k", "t", "T"];
}
exports.AMPMMidnightParser = AMPMMidnightParser;


/***/ }),
/* 240 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.DayPeriodParser = void 0;
var _Parser = __webpack_require__(213);

var _utils = __webpack_require__(217);

// in the morning, in the afternoon, in the evening, at night
class DayPeriodParser extends _Parser.Parser {
  priority = 80;

  parse(dateString, token, match) {
    switch (token) {
      case "B":
      case "BB":
      case "BBB":
        return (
          match.dayPeriod(dateString, {
            width: "abbreviated",
            context: "formatting",
          }) ||
          match.dayPeriod(dateString, {
            width: "narrow",
            context: "formatting",
          })
        );

      case "BBBBB":
        return match.dayPeriod(dateString, {
          width: "narrow",
          context: "formatting",
        });
      case "BBBB":
      default:
        return (
          match.dayPeriod(dateString, {
            width: "wide",
            context: "formatting",
          }) ||
          match.dayPeriod(dateString, {
            width: "abbreviated",
            context: "formatting",
          }) ||
          match.dayPeriod(dateString, {
            width: "narrow",
            context: "formatting",
          })
        );
    }
  }

  set(date, _flags, value) {
    date.setHours((0, _utils.dayPeriodEnumToHours)(value), 0, 0, 0);
    return date;
  }

  incompatibleTokens = ["a", "b", "t", "T"];
}
exports.DayPeriodParser = DayPeriodParser;


/***/ }),
/* 241 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.Hour1to12Parser = void 0;
var _constants = __webpack_require__(218);
var _Parser = __webpack_require__(213);

var _utils = __webpack_require__(217);

class Hour1to12Parser extends _Parser.Parser {
  priority = 70;

  parse(dateString, token, match) {
    switch (token) {
      case "h":
        return (0, _utils.parseNumericPattern)(
          _constants.numericPatterns.hour12h,
          dateString,
        );
      case "ho":
        return match.ordinalNumber(dateString, { unit: "hour" });
      default:
        return (0, _utils.parseNDigits)(token.length, dateString);
    }
  }

  validate(_date, value) {
    return value >= 1 && value <= 12;
  }

  set(date, _flags, value) {
    const isPM = date.getHours() >= 12;
    if (isPM && value < 12) {
      date.setHours(value + 12, 0, 0, 0);
    } else if (!isPM && value === 12) {
      date.setHours(0, 0, 0, 0);
    } else {
      date.setHours(value, 0, 0, 0);
    }
    return date;
  }

  incompatibleTokens = ["H", "K", "k", "t", "T"];
}
exports.Hour1to12Parser = Hour1to12Parser;


/***/ }),
/* 242 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.Hour0to23Parser = void 0;
var _constants = __webpack_require__(218);
var _Parser = __webpack_require__(213);

var _utils = __webpack_require__(217);

class Hour0to23Parser extends _Parser.Parser {
  priority = 70;

  parse(dateString, token, match) {
    switch (token) {
      case "H":
        return (0, _utils.parseNumericPattern)(
          _constants.numericPatterns.hour23h,
          dateString,
        );
      case "Ho":
        return match.ordinalNumber(dateString, { unit: "hour" });
      default:
        return (0, _utils.parseNDigits)(token.length, dateString);
    }
  }

  validate(_date, value) {
    return value >= 0 && value <= 23;
  }

  set(date, _flags, value) {
    date.setHours(value, 0, 0, 0);
    return date;
  }

  incompatibleTokens = ["a", "b", "h", "K", "k", "t", "T"];
}
exports.Hour0to23Parser = Hour0to23Parser;


/***/ }),
/* 243 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.Hour0To11Parser = void 0;
var _constants = __webpack_require__(218);
var _Parser = __webpack_require__(213);

var _utils = __webpack_require__(217);

class Hour0To11Parser extends _Parser.Parser {
  priority = 70;

  parse(dateString, token, match) {
    switch (token) {
      case "K":
        return (0, _utils.parseNumericPattern)(
          _constants.numericPatterns.hour11h,
          dateString,
        );
      case "Ko":
        return match.ordinalNumber(dateString, { unit: "hour" });
      default:
        return (0, _utils.parseNDigits)(token.length, dateString);
    }
  }

  validate(_date, value) {
    return value >= 0 && value <= 11;
  }

  set(date, _flags, value) {
    const isPM = date.getHours() >= 12;
    if (isPM && value < 12) {
      date.setHours(value + 12, 0, 0, 0);
    } else {
      date.setHours(value, 0, 0, 0);
    }
    return date;
  }

  incompatibleTokens = ["h", "H", "k", "t", "T"];
}
exports.Hour0To11Parser = Hour0To11Parser;


/***/ }),
/* 244 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.Hour1To24Parser = void 0;
var _constants = __webpack_require__(218);
var _Parser = __webpack_require__(213);

var _utils = __webpack_require__(217);

class Hour1To24Parser extends _Parser.Parser {
  priority = 70;

  parse(dateString, token, match) {
    switch (token) {
      case "k":
        return (0, _utils.parseNumericPattern)(
          _constants.numericPatterns.hour24h,
          dateString,
        );
      case "ko":
        return match.ordinalNumber(dateString, { unit: "hour" });
      default:
        return (0, _utils.parseNDigits)(token.length, dateString);
    }
  }

  validate(_date, value) {
    return value >= 1 && value <= 24;
  }

  set(date, _flags, value) {
    const hours = value <= 24 ? value % 24 : value;
    date.setHours(hours, 0, 0, 0);
    return date;
  }

  incompatibleTokens = ["a", "b", "h", "H", "K", "t", "T"];
}
exports.Hour1To24Parser = Hour1To24Parser;


/***/ }),
/* 245 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.MinuteParser = void 0;
var _constants = __webpack_require__(218);
var _Parser = __webpack_require__(213);

var _utils = __webpack_require__(217);

class MinuteParser extends _Parser.Parser {
  priority = 60;

  parse(dateString, token, match) {
    switch (token) {
      case "m":
        return (0, _utils.parseNumericPattern)(
          _constants.numericPatterns.minute,
          dateString,
        );
      case "mo":
        return match.ordinalNumber(dateString, { unit: "minute" });
      default:
        return (0, _utils.parseNDigits)(token.length, dateString);
    }
  }

  validate(_date, value) {
    return value >= 0 && value <= 59;
  }

  set(date, _flags, value) {
    date.setMinutes(value, 0, 0);
    return date;
  }

  incompatibleTokens = ["t", "T"];
}
exports.MinuteParser = MinuteParser;


/***/ }),
/* 246 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.SecondParser = void 0;
var _constants = __webpack_require__(218);
var _Parser = __webpack_require__(213);

var _utils = __webpack_require__(217);

class SecondParser extends _Parser.Parser {
  priority = 50;

  parse(dateString, token, match) {
    switch (token) {
      case "s":
        return (0, _utils.parseNumericPattern)(
          _constants.numericPatterns.second,
          dateString,
        );
      case "so":
        return match.ordinalNumber(dateString, { unit: "second" });
      default:
        return (0, _utils.parseNDigits)(token.length, dateString);
    }
  }

  validate(_date, value) {
    return value >= 0 && value <= 59;
  }

  set(date, _flags, value) {
    date.setSeconds(value, 0);
    return date;
  }

  incompatibleTokens = ["t", "T"];
}
exports.SecondParser = SecondParser;


/***/ }),
/* 247 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.FractionOfSecondParser = void 0;
var _Parser = __webpack_require__(213);

var _utils = __webpack_require__(217);

class FractionOfSecondParser extends _Parser.Parser {
  priority = 30;

  parse(dateString, token) {
    const valueCallback = (value) =>
      Math.trunc(value * Math.pow(10, -token.length + 3));
    return (0, _utils.mapValue)(
      (0, _utils.parseNDigits)(token.length, dateString),
      valueCallback,
    );
  }

  set(date, _flags, value) {
    date.setMilliseconds(value);
    return date;
  }

  incompatibleTokens = ["t", "T"];
}
exports.FractionOfSecondParser = FractionOfSecondParser;


/***/ }),
/* 248 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.ISOTimezoneWithZParser = void 0;
var _index = __webpack_require__(54);
var _index2 = __webpack_require__(71);
var _constants = __webpack_require__(218);
var _Parser = __webpack_require__(213);

var _utils = __webpack_require__(217);

// Timezone (ISO-8601. +00:00 is `'Z'`)
class ISOTimezoneWithZParser extends _Parser.Parser {
  priority = 10;

  parse(dateString, token) {
    switch (token) {
      case "X":
        return (0, _utils.parseTimezonePattern)(
          _constants.timezonePatterns.basicOptionalMinutes,
          dateString,
        );
      case "XX":
        return (0, _utils.parseTimezonePattern)(
          _constants.timezonePatterns.basic,
          dateString,
        );
      case "XXXX":
        return (0, _utils.parseTimezonePattern)(
          _constants.timezonePatterns.basicOptionalSeconds,
          dateString,
        );
      case "XXXXX":
        return (0, _utils.parseTimezonePattern)(
          _constants.timezonePatterns.extendedOptionalSeconds,
          dateString,
        );
      case "XXX":
      default:
        return (0, _utils.parseTimezonePattern)(
          _constants.timezonePatterns.extended,
          dateString,
        );
    }
  }

  set(date, flags, value) {
    if (flags.timestampIsSet) return date;
    return (0, _index.constructFrom)(
      date,
      date.getTime() -
        (0, _index2.getTimezoneOffsetInMilliseconds)(date) -
        value,
    );
  }

  incompatibleTokens = ["t", "T", "x"];
}
exports.ISOTimezoneWithZParser = ISOTimezoneWithZParser;


/***/ }),
/* 249 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.ISOTimezoneParser = void 0;
var _index = __webpack_require__(54);
var _index2 = __webpack_require__(71);
var _constants = __webpack_require__(218);
var _Parser = __webpack_require__(213);

var _utils = __webpack_require__(217);

// Timezone (ISO-8601)
class ISOTimezoneParser extends _Parser.Parser {
  priority = 10;

  parse(dateString, token) {
    switch (token) {
      case "x":
        return (0, _utils.parseTimezonePattern)(
          _constants.timezonePatterns.basicOptionalMinutes,
          dateString,
        );
      case "xx":
        return (0, _utils.parseTimezonePattern)(
          _constants.timezonePatterns.basic,
          dateString,
        );
      case "xxxx":
        return (0, _utils.parseTimezonePattern)(
          _constants.timezonePatterns.basicOptionalSeconds,
          dateString,
        );
      case "xxxxx":
        return (0, _utils.parseTimezonePattern)(
          _constants.timezonePatterns.extendedOptionalSeconds,
          dateString,
        );
      case "xxx":
      default:
        return (0, _utils.parseTimezonePattern)(
          _constants.timezonePatterns.extended,
          dateString,
        );
    }
  }

  set(date, flags, value) {
    if (flags.timestampIsSet) return date;
    return (0, _index.constructFrom)(
      date,
      date.getTime() -
        (0, _index2.getTimezoneOffsetInMilliseconds)(date) -
        value,
    );
  }

  incompatibleTokens = ["t", "T", "X"];
}
exports.ISOTimezoneParser = ISOTimezoneParser;


/***/ }),
/* 250 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.TimestampSecondsParser = void 0;
var _index = __webpack_require__(54);
var _Parser = __webpack_require__(213);

var _utils = __webpack_require__(217);

class TimestampSecondsParser extends _Parser.Parser {
  priority = 40;

  parse(dateString) {
    return (0, _utils.parseAnyDigitsSigned)(dateString);
  }

  set(date, _flags, value) {
    return [
      (0, _index.constructFrom)(date, value * 1000),
      { timestampIsSet: true },
    ];
  }

  incompatibleTokens = "*";
}
exports.TimestampSecondsParser = TimestampSecondsParser;


/***/ }),
/* 251 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.TimestampMillisecondsParser = void 0;
var _index = __webpack_require__(54);
var _Parser = __webpack_require__(213);

var _utils = __webpack_require__(217);

class TimestampMillisecondsParser extends _Parser.Parser {
  priority = 20;

  parse(dateString) {
    return (0, _utils.parseAnyDigitsSigned)(dateString);
  }

  set(date, _flags, value) {
    return [(0, _index.constructFrom)(date, value), { timestampIsSet: true }];
  }

  incompatibleTokens = "*";
}
exports.TimestampMillisecondsParser = TimestampMillisecondsParser;


/***/ }),
/* 252 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.isMonday = isMonday;
var _index = __webpack_require__(53);

/**
 * @name isMonday
 * @category Weekday Helpers
 * @summary Is the given date Monday?
 *
 * @description
 * Is the given date Monday?
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The date to check
 *
 * @returns The date is Monday
 *
 * @example
 * // Is 22 September 2014 Monday?
 * const result = isMonday(new Date(2014, 8, 22))
 * //=> true
 */
function isMonday(date) {
  return (0, _index.toDate)(date).getDay() === 1;
}


/***/ }),
/* 253 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.isPast = isPast;
var _index = __webpack_require__(53);

/**
 * @name isPast
 * @category Common Helpers
 * @summary Is the given date in the past?
 * @pure false
 *
 * @description
 * Is the given date in the past?
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The date to check
 *
 * @returns The date is in the past
 *
 * @example
 * // If today is 6 October 2014, is 2 July 2014 in the past?
 * const result = isPast(new Date(2014, 6, 2))
 * //=> true
 */
function isPast(date) {
  return +(0, _index.toDate)(date) < Date.now();
}


/***/ }),
/* 254 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.isSameHour = isSameHour;
var _index = __webpack_require__(255);

/**
 * @name isSameHour
 * @category Hour Helpers
 * @summary Are the given dates in the same hour (and same day)?
 *
 * @description
 * Are the given dates in the same hour (and same day)?
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param dateLeft - The first date to check
 * @param dateRight - The second date to check
 *
 * @returns The dates are in the same hour (and same day)
 *
 * @example
 * // Are 4 September 2014 06:00:00 and 4 September 06:30:00 in the same hour?
 * const result = isSameHour(new Date(2014, 8, 4, 6, 0), new Date(2014, 8, 4, 6, 30))
 * //=> true
 *
 * @example
 * // Are 4 September 2014 06:00:00 and 5 September 06:00:00 in the same hour?
 * const result = isSameHour(new Date(2014, 8, 4, 6, 0), new Date(2014, 8, 5, 6, 0))
 * //=> false
 */
function isSameHour(dateLeft, dateRight) {
  const dateLeftStartOfHour = (0, _index.startOfHour)(dateLeft);
  const dateRightStartOfHour = (0, _index.startOfHour)(dateRight);

  return +dateLeftStartOfHour === +dateRightStartOfHour;
}


/***/ }),
/* 255 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.startOfHour = startOfHour;
var _index = __webpack_require__(53);

/**
 * @name startOfHour
 * @category Hour Helpers
 * @summary Return the start of an hour for the given date.
 *
 * @description
 * Return the start of an hour for the given date.
 * The result will be in the local timezone.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The original date
 *
 * @returns The start of an hour
 *
 * @example
 * // The start of an hour for 2 September 2014 11:55:00:
 * const result = startOfHour(new Date(2014, 8, 2, 11, 55))
 * //=> Tue Sep 02 2014 11:00:00
 */
function startOfHour(date) {
  const _date = (0, _index.toDate)(date);
  _date.setMinutes(0, 0, 0);
  return _date;
}


/***/ }),
/* 256 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.isSameISOWeek = isSameISOWeek;
var _index = __webpack_require__(257);

/**
 * @name isSameISOWeek
 * @category ISO Week Helpers
 * @summary Are the given dates in the same ISO week (and year)?
 *
 * @description
 * Are the given dates in the same ISO week (and year)?
 *
 * ISO week-numbering year: http://en.wikipedia.org/wiki/ISO_week_date
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param dateLeft - The first date to check
 * @param dateRight - The second date to check
 *
 * @returns The dates are in the same ISO week (and year)
 *
 * @example
 * // Are 1 September 2014 and 7 September 2014 in the same ISO week?
 * const result = isSameISOWeek(new Date(2014, 8, 1), new Date(2014, 8, 7))
 * //=> true
 *
 * @example
 * // Are 1 September 2014 and 1 September 2015 in the same ISO week?
 * const result = isSameISOWeek(new Date(2014, 8, 1), new Date(2015, 8, 1))
 * //=> false
 */
function isSameISOWeek(dateLeft, dateRight) {
  return (0, _index.isSameWeek)(dateLeft, dateRight, { weekStartsOn: 1 });
}


/***/ }),
/* 257 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.isSameWeek = isSameWeek;
var _index = __webpack_require__(66);

/**
 * The {@link isSameWeek} function options.
 */

/**
 * @name isSameWeek
 * @category Week Helpers
 * @summary Are the given dates in the same week (and month and year)?
 *
 * @description
 * Are the given dates in the same week (and month and year)?
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param dateLeft - The first date to check
 * @param dateRight - The second date to check
 * @param options - An object with options
 *
 * @returns The dates are in the same week (and month and year)
 *
 * @example
 * // Are 31 August 2014 and 4 September 2014 in the same week?
 * const result = isSameWeek(new Date(2014, 7, 31), new Date(2014, 8, 4))
 * //=> true
 *
 * @example
 * // If week starts with Monday,
 * // are 31 August 2014 and 4 September 2014 in the same week?
 * const result = isSameWeek(new Date(2014, 7, 31), new Date(2014, 8, 4), {
 *   weekStartsOn: 1
 * })
 * //=> false
 *
 * @example
 * // Are 1 January 2014 and 1 January 2015 in the same week?
 * const result = isSameWeek(new Date(2014, 0, 1), new Date(2015, 0, 1))
 * //=> false
 */
function isSameWeek(dateLeft, dateRight, options) {
  const dateLeftStartOfWeek = (0, _index.startOfWeek)(dateLeft, options);
  const dateRightStartOfWeek = (0, _index.startOfWeek)(dateRight, options);

  return +dateLeftStartOfWeek === +dateRightStartOfWeek;
}


/***/ }),
/* 258 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.isSameISOWeekYear = isSameISOWeekYear;
var _index = __webpack_require__(72);

/**
 * @name isSameISOWeekYear
 * @category ISO Week-Numbering Year Helpers
 * @summary Are the given dates in the same ISO week-numbering year?
 *
 * @description
 * Are the given dates in the same ISO week-numbering year?
 *
 * ISO week-numbering year: http://en.wikipedia.org/wiki/ISO_week_date
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param dateLeft - The first date to check
 * @param dateRight - The second date to check
 *
 * @returns The dates are in the same ISO week-numbering year
 *
 * @example
 * // Are 29 December 2003 and 2 January 2005 in the same ISO week-numbering year?
 * const result = isSameISOWeekYear(new Date(2003, 11, 29), new Date(2005, 0, 2))
 * //=> true
 */
function isSameISOWeekYear(dateLeft, dateRight) {
  const dateLeftStartOfYear = (0, _index.startOfISOWeekYear)(dateLeft);
  const dateRightStartOfYear = (0, _index.startOfISOWeekYear)(dateRight);

  return +dateLeftStartOfYear === +dateRightStartOfYear;
}


/***/ }),
/* 259 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.isSameMinute = isSameMinute;
var _index = __webpack_require__(117);

/**
 * @name isSameMinute
 * @category Minute Helpers
 * @summary Are the given dates in the same minute (and hour and day)?
 *
 * @description
 * Are the given dates in the same minute (and hour and day)?
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param dateLeft - The first date to check
 * @param dateRight - The second date to check
 *
 * @returns The dates are in the same minute (and hour and day)
 *
 * @example
 * // Are 4 September 2014 06:30:00 and 4 September 2014 06:30:15 in the same minute?
 * const result = isSameMinute(
 *   new Date(2014, 8, 4, 6, 30),
 *   new Date(2014, 8, 4, 6, 30, 15)
 * )
 * //=> true
 *
 * @example
 * // Are 4 September 2014 06:30:00 and 5 September 2014 06:30:00 in the same minute?
 * const result = isSameMinute(
 *   new Date(2014, 8, 4, 6, 30),
 *   new Date(2014, 8, 5, 6, 30)
 * )
 * //=> false
 */
function isSameMinute(dateLeft, dateRight) {
  const dateLeftStartOfMinute = (0, _index.startOfMinute)(dateLeft);
  const dateRightStartOfMinute = (0, _index.startOfMinute)(dateRight);

  return +dateLeftStartOfMinute === +dateRightStartOfMinute;
}


/***/ }),
/* 260 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.isSameMonth = isSameMonth;
var _index = __webpack_require__(53);

/**
 * @name isSameMonth
 * @category Month Helpers
 * @summary Are the given dates in the same month (and year)?
 *
 * @description
 * Are the given dates in the same month (and year)?
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param dateLeft - The first date to check
 * @param dateRight - The second date to check
 *
 * @returns The dates are in the same month (and year)
 *
 * @example
 * // Are 2 September 2014 and 25 September 2014 in the same month?
 * const result = isSameMonth(new Date(2014, 8, 2), new Date(2014, 8, 25))
 * //=> true
 *
 * @example
 * // Are 2 September 2014 and 25 September 2015 in the same month?
 * const result = isSameMonth(new Date(2014, 8, 2), new Date(2015, 8, 25))
 * //=> false
 */
function isSameMonth(dateLeft, dateRight) {
  const _dateLeft = (0, _index.toDate)(dateLeft);
  const _dateRight = (0, _index.toDate)(dateRight);
  return (
    _dateLeft.getFullYear() === _dateRight.getFullYear() &&
    _dateLeft.getMonth() === _dateRight.getMonth()
  );
}


/***/ }),
/* 261 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.isSameQuarter = isSameQuarter;
var _index = __webpack_require__(120);

/**
 * @name isSameQuarter
 * @category Quarter Helpers
 * @summary Are the given dates in the same quarter (and year)?
 *
 * @description
 * Are the given dates in the same quarter (and year)?
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param dateLeft - The first date to check
 * @param dateRight - The second date to check

 * @returns The dates are in the same quarter (and year)
 *
 * @example
 * // Are 1 January 2014 and 8 March 2014 in the same quarter?
 * const result = isSameQuarter(new Date(2014, 0, 1), new Date(2014, 2, 8))
 * //=> true
 *
 * @example
 * // Are 1 January 2014 and 1 January 2015 in the same quarter?
 * const result = isSameQuarter(new Date(2014, 0, 1), new Date(2015, 0, 1))
 * //=> false
 */
function isSameQuarter(dateLeft, dateRight) {
  const dateLeftStartOfQuarter = (0, _index.startOfQuarter)(dateLeft);
  const dateRightStartOfQuarter = (0, _index.startOfQuarter)(dateRight);

  return +dateLeftStartOfQuarter === +dateRightStartOfQuarter;
}


/***/ }),
/* 262 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.isSameSecond = isSameSecond;
var _index = __webpack_require__(263);

/**
 * @name isSameSecond
 * @category Second Helpers
 * @summary Are the given dates in the same second (and hour and day)?
 *
 * @description
 * Are the given dates in the same second (and hour and day)?
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param dateLeft - The first date to check
 * @param dateRight - The second date to check
 *
 * @returns The dates are in the same second (and hour and day)
 *
 * @example
 * // Are 4 September 2014 06:30:15.000 and 4 September 2014 06:30.15.500 in the same second?
 * const result = isSameSecond(
 *   new Date(2014, 8, 4, 6, 30, 15),
 *   new Date(2014, 8, 4, 6, 30, 15, 500)
 * )
 * //=> true
 *
 * @example
 * // Are 4 September 2014 06:00:15.000 and 4 September 2014 06:01.15.000 in the same second?
 * const result = isSameSecond(
 *   new Date(2014, 8, 4, 6, 0, 15),
 *   new Date(2014, 8, 4, 6, 1, 15)
 * )
 * //=> false
 *
 * @example
 * // Are 4 September 2014 06:00:15.000 and 5 September 2014 06:00.15.000 in the same second?
 * const result = isSameSecond(
 *   new Date(2014, 8, 4, 6, 0, 15),
 *   new Date(2014, 8, 5, 6, 0, 15)
 * )
 * //=> false
 */
function isSameSecond(dateLeft, dateRight) {
  const dateLeftStartOfSecond = (0, _index.startOfSecond)(dateLeft);
  const dateRightStartOfSecond = (0, _index.startOfSecond)(dateRight);

  return +dateLeftStartOfSecond === +dateRightStartOfSecond;
}


/***/ }),
/* 263 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.startOfSecond = startOfSecond;
var _index = __webpack_require__(53);

/**
 * @name startOfSecond
 * @category Second Helpers
 * @summary Return the start of a second for the given date.
 *
 * @description
 * Return the start of a second for the given date.
 * The result will be in the local timezone.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The original date
 *
 * @returns The start of a second
 *
 * @example
 * // The start of a second for 1 December 2014 22:15:45.400:
 * const result = startOfSecond(new Date(2014, 11, 1, 22, 15, 45, 400))
 * //=> Mon Dec 01 2014 22:15:45.000
 */
function startOfSecond(date) {
  const _date = (0, _index.toDate)(date);
  _date.setMilliseconds(0);
  return _date;
}


/***/ }),
/* 264 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.isSameYear = isSameYear;
var _index = __webpack_require__(53);

/**
 * @name isSameYear
 * @category Year Helpers
 * @summary Are the given dates in the same year?
 *
 * @description
 * Are the given dates in the same year?
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param dateLeft - The first date to check
 * @param dateRight - The second date to check
 *
 * @returns The dates are in the same year
 *
 * @example
 * // Are 2 September 2014 and 25 September 2014 in the same year?
 * const result = isSameYear(new Date(2014, 8, 2), new Date(2014, 8, 25))
 * //=> true
 */
function isSameYear(dateLeft, dateRight) {
  const _dateLeft = (0, _index.toDate)(dateLeft);
  const _dateRight = (0, _index.toDate)(dateRight);
  return _dateLeft.getFullYear() === _dateRight.getFullYear();
}


/***/ }),
/* 265 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.isThisHour = isThisHour;
var _index = __webpack_require__(86);
var _index2 = __webpack_require__(254);

/**
 * @name isThisHour
 * @category Hour Helpers
 * @summary Is the given date in the same hour as the current date?
 * @pure false
 *
 * @description
 * Is the given date in the same hour as the current date?
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The date to check
 *
 * @returns The date is in this hour
 *
 * @example
 * // If now is 25 September 2014 18:30:15.500,
 * // is 25 September 2014 18:00:00 in this hour?
 * const result = isThisHour(new Date(2014, 8, 25, 18))
 * //=> true
 */
function isThisHour(date) {
  return (0, _index2.isSameHour)(date, (0, _index.constructNow)(date));
}


/***/ }),
/* 266 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.isThisISOWeek = isThisISOWeek;
var _index = __webpack_require__(86);
var _index2 = __webpack_require__(256);

/**
 * @name isThisISOWeek
 * @category ISO Week Helpers
 * @summary Is the given date in the same ISO week as the current date?
 * @pure false
 *
 * @description
 * Is the given date in the same ISO week as the current date?
 *
 * ISO week-numbering year: http://en.wikipedia.org/wiki/ISO_week_date
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The date to check
 *
 * @returns The date is in this ISO week
 *
 * @example
 * // If today is 25 September 2014, is 22 September 2014 in this ISO week?
 * const result = isThisISOWeek(new Date(2014, 8, 22))
 * //=> true
 */

function isThisISOWeek(date) {
  return (0, _index2.isSameISOWeek)(date, (0, _index.constructNow)(date));
}


/***/ }),
/* 267 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.isThisMinute = isThisMinute;
var _index = __webpack_require__(86);
var _index2 = __webpack_require__(259);

/**
 * @name isThisMinute
 * @category Minute Helpers
 * @summary Is the given date in the same minute as the current date?
 * @pure false
 *
 * @description
 * Is the given date in the same minute as the current date?
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The date to check
 *
 * @returns The date is in this minute
 *
 * @example
 * // If now is 25 September 2014 18:30:15.500,
 * // is 25 September 2014 18:30:00 in this minute?
 * const result = isThisMinute(new Date(2014, 8, 25, 18, 30))
 * //=> true
 */

function isThisMinute(date) {
  return (0, _index2.isSameMinute)(date, (0, _index.constructNow)(date));
}


/***/ }),
/* 268 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.isThisMonth = isThisMonth;
var _index = __webpack_require__(86);
var _index2 = __webpack_require__(260);

/**
 * @name isThisMonth
 * @category Month Helpers
 * @summary Is the given date in the same month as the current date?
 * @pure false
 *
 * @description
 * Is the given date in the same month as the current date?
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The date to check
 *
 * @returns The date is in this month
 *
 * @example
 * // If today is 25 September 2014, is 15 September 2014 in this month?
 * const result = isThisMonth(new Date(2014, 8, 15))
 * //=> true
 */

function isThisMonth(date) {
  return (0, _index2.isSameMonth)(date, (0, _index.constructNow)(date));
}


/***/ }),
/* 269 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.isThisQuarter = isThisQuarter;
var _index = __webpack_require__(86);
var _index2 = __webpack_require__(261);

/**
 * @name isThisQuarter
 * @category Quarter Helpers
 * @summary Is the given date in the same quarter as the current date?
 * @pure false
 *
 * @description
 * Is the given date in the same quarter as the current date?
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The date to check
 *
 * @returns The date is in this quarter
 *
 * @example
 * // If today is 25 September 2014, is 2 July 2014 in this quarter?
 * const result = isThisQuarter(new Date(2014, 6, 2))
 * //=> true
 */
function isThisQuarter(date) {
  return (0, _index2.isSameQuarter)(date, (0, _index.constructNow)(date));
}


/***/ }),
/* 270 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.isThisSecond = isThisSecond;
var _index = __webpack_require__(86);
var _index2 = __webpack_require__(262);

/**
 * @name isThisSecond
 * @category Second Helpers
 * @summary Is the given date in the same second as the current date?
 * @pure false
 *
 * @description
 * Is the given date in the same second as the current date?
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The date to check
 *
 * @returns The date is in this second
 *
 * @example
 * // If now is 25 September 2014 18:30:15.500,
 * // is 25 September 2014 18:30:15.000 in this second?
 * const result = isThisSecond(new Date(2014, 8, 25, 18, 30, 15))
 * //=> true
 */
function isThisSecond(date) {
  return (0, _index2.isSameSecond)(date, (0, _index.constructNow)(date));
}


/***/ }),
/* 271 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.isThisWeek = isThisWeek;
var _index = __webpack_require__(86);
var _index2 = __webpack_require__(257);

/**
 * The {@link isThisWeek} function options.
 */

/**
 * @name isThisWeek
 * @category Week Helpers
 * @summary Is the given date in the same week as the current date?
 * @pure false
 *
 * @description
 * Is the given date in the same week as the current date?
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The date to check
 * @param options - The object with options
 *
 * @returns The date is in this week
 *
 * @example
 * // If today is 25 September 2014, is 21 September 2014 in this week?
 * const result = isThisWeek(new Date(2014, 8, 21))
 * //=> true
 *
 * @example
 * // If today is 25 September 2014 and week starts with Monday
 * // is 21 September 2014 in this week?
 * const result = isThisWeek(new Date(2014, 8, 21), { weekStartsOn: 1 })
 * //=> false
 */
function isThisWeek(date, options) {
  return (0, _index2.isSameWeek)(date, (0, _index.constructNow)(date), options);
}


/***/ }),
/* 272 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.isThisYear = isThisYear;
var _index = __webpack_require__(86);
var _index2 = __webpack_require__(264);

/**
 * @name isThisYear
 * @category Year Helpers
 * @summary Is the given date in the same year as the current date?
 * @pure false
 *
 * @description
 * Is the given date in the same year as the current date?
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The date to check
 *
 * @returns The date is in this year
 *
 * @example
 * // If today is 25 September 2014, is 2 July 2014 in this year?
 * const result = isThisYear(new Date(2014, 6, 2))
 * //=> true
 */
function isThisYear(date) {
  return (0, _index2.isSameYear)(date, (0, _index.constructNow)(date));
}


/***/ }),
/* 273 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.isThursday = isThursday;
var _index = __webpack_require__(53);

/**
 * @name isThursday
 * @category Weekday Helpers
 * @summary Is the given date Thursday?
 *
 * @description
 * Is the given date Thursday?
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The date to check
 *
 * @returns The date is Thursday
 *
 * @example
 * // Is 25 September 2014 Thursday?
 * const result = isThursday(new Date(2014, 8, 25))
 * //=> true
 */
function isThursday(date) {
  return (0, _index.toDate)(date).getDay() === 4;
}


/***/ }),
/* 274 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.isToday = isToday;
var _index = __webpack_require__(86);
var _index2 = __webpack_require__(89);

/**
 * @name isToday
 * @category Day Helpers
 * @summary Is the given date today?
 * @pure false
 *
 * @description
 * Is the given date today?
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The date to check
 *
 * @returns The date is today
 *
 * @example
 * // If today is 6 October 2014, is 6 October 14:00:00 today?
 * const result = isToday(new Date(2014, 9, 6, 14, 0))
 * //=> true
 */
function isToday(date) {
  return (0, _index2.isSameDay)(date, (0, _index.constructNow)(date));
}


/***/ }),
/* 275 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.isTomorrow = isTomorrow;
var _index = __webpack_require__(52);
var _index2 = __webpack_require__(86);
var _index3 = __webpack_require__(89);

/**
 * @name isTomorrow
 * @category Day Helpers
 * @summary Is the given date tomorrow?
 * @pure false
 *
 * @description
 * Is the given date tomorrow?
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The date to check
 *
 * @returns The date is tomorrow
 *
 * @example
 * // If today is 6 October 2014, is 7 October 14:00:00 tomorrow?
 * const result = isTomorrow(new Date(2014, 9, 7, 14, 0))
 * //=> true
 */
function isTomorrow(date) {
  return (0, _index3.isSameDay)(
    date,
    (0, _index.addDays)((0, _index2.constructNow)(date), 1),
  );
}


/***/ }),
/* 276 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.isTuesday = isTuesday;
var _index = __webpack_require__(53);

/**
 * @name isTuesday
 * @category Weekday Helpers
 * @summary Is the given date Tuesday?
 *
 * @description
 * Is the given date Tuesday?
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The date to check
 *
 * @returns The date is Tuesday
 *
 * @example
 * // Is 23 September 2014 Tuesday?
 * const result = isTuesday(new Date(2014, 8, 23))
 * //=> true
 */
function isTuesday(date) {
  return (0, _index.toDate)(date).getDay() === 2;
}


/***/ }),
/* 277 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.isWednesday = isWednesday;
var _index = __webpack_require__(53);

/**
 * @name isWednesday
 * @category Weekday Helpers
 * @summary Is the given date Wednesday?
 *
 * @description
 * Is the given date Wednesday?
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The date to check
 *
 * @returns The date is Wednesday
 *
 * @example
 * // Is 24 September 2014 Wednesday?
 * const result = isWednesday(new Date(2014, 8, 24))
 * //=> true
 */
function isWednesday(date) {
  return (0, _index.toDate)(date).getDay() === 3;
}


/***/ }),
/* 278 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.isWithinInterval = isWithinInterval;
var _index = __webpack_require__(53);

/**
 * @name isWithinInterval
 * @category Interval Helpers
 * @summary Is the given date within the interval?
 *
 * @description
 * Is the given date within the interval? (Including start and end.)
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The date to check
 * @param interval - The interval to check
 *
 * @returns The date is within the interval
 *
 * @example
 * // For the date within the interval:
 * isWithinInterval(new Date(2014, 0, 3), {
 *   start: new Date(2014, 0, 1),
 *   end: new Date(2014, 0, 7)
 * })
 * //=> true
 *
 * @example
 * // For the date outside of the interval:
 * isWithinInterval(new Date(2014, 0, 10), {
 *   start: new Date(2014, 0, 1),
 *   end: new Date(2014, 0, 7)
 * })
 * //=> false
 *
 * @example
 * // For date equal to interval start:
 * isWithinInterval(date, { start, end: date })
 * // => true
 *
 * @example
 * // For date equal to interval end:
 * isWithinInterval(date, { start: date, end })
 * // => true
 */
function isWithinInterval(date, interval) {
  const time = +(0, _index.toDate)(date);
  const [startTime, endTime] = [
    +(0, _index.toDate)(interval.start),
    +(0, _index.toDate)(interval.end),
  ].sort((a, b) => a - b);

  return time >= startTime && time <= endTime;
}


/***/ }),
/* 279 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.isYesterday = isYesterday;
var _index = __webpack_require__(86);
var _index2 = __webpack_require__(89);
var _index3 = __webpack_require__(280);

/**
 * @name isYesterday
 * @category Day Helpers
 * @summary Is the given date yesterday?
 * @pure false
 *
 * @description
 * Is the given date yesterday?
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The date to check
 *
 * @returns The date is yesterday
 *
 * @example
 * // If today is 6 October 2014, is 5 October 14:00:00 yesterday?
 * const result = isYesterday(new Date(2014, 9, 5, 14, 0))
 * //=> true
 */
function isYesterday(date) {
  return (0, _index2.isSameDay)(
    date,
    (0, _index3.subDays)((0, _index.constructNow)(date), 1),
  );
}


/***/ }),
/* 280 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.subDays = subDays;
var _index = __webpack_require__(52);

/**
 * @name subDays
 * @category Day Helpers
 * @summary Subtract the specified number of days from the given date.
 *
 * @description
 * Subtract the specified number of days from the given date.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The date to be changed
 * @param amount - The amount of days to be subtracted.
 *
 * @returns The new date with the days subtracted
 *
 * @example
 * // Subtract 10 days from 1 September 2014:
 * const result = subDays(new Date(2014, 8, 1), 10)
 * //=> Fri Aug 22 2014 00:00:00
 */
function subDays(date, amount) {
  return (0, _index.addDays)(date, -amount);
}


/***/ }),
/* 281 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.lastDayOfDecade = lastDayOfDecade;
var _index = __webpack_require__(53);

/**
 * @name lastDayOfDecade
 * @category Decade Helpers
 * @summary Return the last day of a decade for the given date.
 *
 * @description
 * Return the last day of a decade for the given date.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The original date
 *
 * @returns The last day of a decade
 *
 * @example
 * // The last day of a decade for 21 December 2012 21:12:00:
 * const result = lastDayOfDecade(new Date(2012, 11, 21, 21, 12, 00))
 * //=> Wed Dec 31 2019 00:00:00
 */
function lastDayOfDecade(date) {
  // TODO: Switch to more technical definition in of decades that start with 1
  // end with 0. I.e. 2001-2010 instead of current 2000-2009. It's a breaking
  // change, so it can only be done in 4.0.
  const _date = (0, _index.toDate)(date);
  const year = _date.getFullYear();
  const decade = 9 + Math.floor(year / 10) * 10;
  _date.setFullYear(decade + 1, 0, 0);
  _date.setHours(0, 0, 0, 0);
  return _date;
}


/***/ }),
/* 282 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.lastDayOfISOWeek = lastDayOfISOWeek;
var _index = __webpack_require__(283);

/**
 * @name lastDayOfISOWeek
 * @category ISO Week Helpers
 * @summary Return the last day of an ISO week for the given date.
 *
 * @description
 * Return the last day of an ISO week for the given date.
 * The result will be in the local timezone.
 *
 * ISO week-numbering year: http://en.wikipedia.org/wiki/ISO_week_date
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The original date
 *
 * @returns The last day of an ISO week
 *
 * @example
 * // The last day of an ISO week for 2 September 2014 11:55:00:
 * const result = lastDayOfISOWeek(new Date(2014, 8, 2, 11, 55, 0))
 * //=> Sun Sep 07 2014 00:00:00
 */
function lastDayOfISOWeek(date) {
  return (0, _index.lastDayOfWeek)(date, { weekStartsOn: 1 });
}


/***/ }),
/* 283 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.lastDayOfWeek = lastDayOfWeek;
var _index = __webpack_require__(53);

var _index2 = __webpack_require__(67);

/**
 * The {@link lastDayOfWeek} function options.
 */

/**
 * @name lastDayOfWeek
 * @category Week Helpers
 * @summary Return the last day of a week for the given date.
 *
 * @description
 * Return the last day of a week for the given date.
 * The result will be in the local timezone.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The original date
 * @param options - An object with options
 *
 * @returns The last day of a week
 *
 * @example
 * // The last day of a week for 2 September 2014 11:55:00:
 * const result = lastDayOfWeek(new Date(2014, 8, 2, 11, 55, 0))
 * //=> Sat Sep 06 2014 00:00:00
 *
 * @example
 * // If the week starts on Monday, the last day of the week for 2 September 2014 11:55:00:
 * const result = lastDayOfWeek(new Date(2014, 8, 2, 11, 55, 0), { weekStartsOn: 1 })
 * //=> Sun Sep 07 2014 00:00:00
 */
function lastDayOfWeek(date, options) {
  const defaultOptions = (0, _index2.getDefaultOptions)();
  const weekStartsOn =
    options?.weekStartsOn ??
    options?.locale?.options?.weekStartsOn ??
    defaultOptions.weekStartsOn ??
    defaultOptions.locale?.options?.weekStartsOn ??
    0;

  const _date = (0, _index.toDate)(date);
  const day = _date.getDay();
  const diff = (day < weekStartsOn ? -7 : 0) + 6 - (day - weekStartsOn);

  _date.setHours(0, 0, 0, 0);
  _date.setDate(_date.getDate() + diff);
  return _date;
}


/***/ }),
/* 284 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.lastDayOfISOWeekYear = lastDayOfISOWeekYear;
var _index = __webpack_require__(64);
var _index2 = __webpack_require__(65);
var _index3 = __webpack_require__(54);

/**
 * @name lastDayOfISOWeekYear
 * @category ISO Week-Numbering Year Helpers
 * @summary Return the last day of an ISO week-numbering year for the given date.
 *
 * @description
 * Return the last day of an ISO week-numbering year,
 * which always starts 3 days before the year's first Thursday.
 * The result will be in the local timezone.
 *
 * ISO week-numbering year: http://en.wikipedia.org/wiki/ISO_week_date
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The original date
 *
 * @returns The end of an ISO week-numbering year
 *
 * @example
 * // The last day of an ISO week-numbering year for 2 July 2005:
 * const result = lastDayOfISOWeekYear(new Date(2005, 6, 2))
 * //=> Sun Jan 01 2006 00:00:00
 */
function lastDayOfISOWeekYear(date) {
  const year = (0, _index.getISOWeekYear)(date);
  const fourthOfJanuary = (0, _index3.constructFrom)(date, 0);
  fourthOfJanuary.setFullYear(year + 1, 0, 4);
  fourthOfJanuary.setHours(0, 0, 0, 0);
  const _date = (0, _index2.startOfISOWeek)(fourthOfJanuary);
  _date.setDate(_date.getDate() - 1);
  return _date;
}


/***/ }),
/* 285 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.lastDayOfQuarter = lastDayOfQuarter;
var _index = __webpack_require__(53);

/**
 * @name lastDayOfQuarter
 * @category Quarter Helpers
 * @summary Return the last day of a year quarter for the given date.
 *
 * @description
 * Return the last day of a year quarter for the given date.
 * The result will be in the local timezone.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The original date
 *
 * @returns The last day of a quarter
 *
 * @example
 * // The last day of a quarter for 2 September 2014 11:55:00:
 * const result = lastDayOfQuarter(new Date(2014, 8, 2, 11, 55, 0))
 * //=> Tue Sep 30 2014 00:00:00
 */
function lastDayOfQuarter(date) {
  const _date = (0, _index.toDate)(date);
  const currentMonth = _date.getMonth();
  const month = currentMonth - (currentMonth % 3) + 3;
  _date.setMonth(month, 0);
  _date.setHours(0, 0, 0, 0);
  return _date;
}


/***/ }),
/* 286 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.lastDayOfYear = lastDayOfYear;
var _index = __webpack_require__(53);

/**
 * @name lastDayOfYear
 * @category Year Helpers
 * @summary Return the last day of a year for the given date.
 *
 * @description
 * Return the last day of a year for the given date.
 * The result will be in the local timezone.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The original date
 *
 * @returns The last day of a year
 *
 * @example
 * // The last day of a year for 2 September 2014 11:55:00:
 * const result = lastDayOfYear(new Date(2014, 8, 2, 11, 55, 00))
 * //=> Wed Dec 31 2014 00:00:00
 */
function lastDayOfYear(date) {
  const _date = (0, _index.toDate)(date);
  const year = _date.getFullYear();
  _date.setFullYear(year + 1, 0, 0);
  _date.setHours(0, 0, 0, 0);
  return _date;
}


/***/ }),
/* 287 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.lightFormat = lightFormat;
Object.defineProperty(exports, "lightFormatters", ({
  enumerable: true,
  get: function () {
    return _index3.lightFormatters;
  },
}));
var _index = __webpack_require__(90);
var _index2 = __webpack_require__(53);
var _index3 = __webpack_require__(159);

// Rexports of internal for libraries to use.
// See: https://github.com/date-fns/date-fns/issues/3638#issuecomment-1877082874

// This RegExp consists of three parts separated by `|`:
// - (\w)\1* matches any sequences of the same letter
// - '' matches two quote characters in a row
// - '(''|[^'])+('|$) matches anything surrounded by two quote characters ('),
//   except a single quote symbol, which ends the sequence.
//   Two quote characters do not end the sequence.
//   If there is no matching single quote
//   then the sequence will continue until the end of the string.
// - . matches any single character unmatched by previous parts of the RegExps
const formattingTokensRegExp = /(\w)\1*|''|'(''|[^'])+('|$)|./g;

const escapedStringRegExp = /^'([^]*?)'?$/;
const doubleQuoteRegExp = /''/g;
const unescapedLatinCharacterRegExp = /[a-zA-Z]/;

/**
 * @private
 */

/**
 * @name lightFormat
 * @category Common Helpers
 * @summary Format the date.
 *
 * @description
 * Return the formatted date string in the given format. Unlike `format`,
 * `lightFormat` doesn't use locales and outputs date using the most popular tokens.
 *
 * > ⚠️ Please note that the `lightFormat` tokens differ from Moment.js and other libraries.
 * > See: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md
 *
 * The characters wrapped between two single quotes characters (') are escaped.
 * Two single quotes in a row, whether inside or outside a quoted sequence, represent a 'real' single quote.
 *
 * Format of the string is based on Unicode Technical Standard #35:
 * https://www.unicode.org/reports/tr35/tr35-dates.html#Date_Field_Symbol_Table
 *
 * Accepted patterns:
 * | Unit                            | Pattern | Result examples                   |
 * |---------------------------------|---------|-----------------------------------|
 * | AM, PM                          | a..aaa  | AM, PM                            |
 * |                                 | aaaa    | a.m., p.m.                        |
 * |                                 | aaaaa   | a, p                              |
 * | Calendar year                   | y       | 44, 1, 1900, 2017                 |
 * |                                 | yy      | 44, 01, 00, 17                    |
 * |                                 | yyy     | 044, 001, 000, 017                |
 * |                                 | yyyy    | 0044, 0001, 1900, 2017            |
 * | Month (formatting)              | M       | 1, 2, ..., 12                     |
 * |                                 | MM      | 01, 02, ..., 12                   |
 * | Day of month                    | d       | 1, 2, ..., 31                     |
 * |                                 | dd      | 01, 02, ..., 31                   |
 * | Hour [1-12]                     | h       | 1, 2, ..., 11, 12                 |
 * |                                 | hh      | 01, 02, ..., 11, 12               |
 * | Hour [0-23]                     | H       | 0, 1, 2, ..., 23                  |
 * |                                 | HH      | 00, 01, 02, ..., 23               |
 * | Minute                          | m       | 0, 1, ..., 59                     |
 * |                                 | mm      | 00, 01, ..., 59                   |
 * | Second                          | s       | 0, 1, ..., 59                     |
 * |                                 | ss      | 00, 01, ..., 59                   |
 * | Fraction of second              | S       | 0, 1, ..., 9                      |
 * |                                 | SS      | 00, 01, ..., 99                   |
 * |                                 | SSS     | 000, 001, ..., 999                |
 * |                                 | SSSS    | ...                               |
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The original date
 * @param format - The string of tokens
 *
 * @returns The formatted date string
 *
 * @throws `Invalid time value` if the date is invalid
 * @throws format string contains an unescaped latin alphabet character
 *
 * @example
 * const result = lightFormat(new Date(2014, 1, 11), 'yyyy-MM-dd')
 * //=> '2014-02-11'
 */
function lightFormat(date, formatStr) {
  const _date = (0, _index2.toDate)(date);

  if (!(0, _index.isValid)(_date)) {
    throw new RangeError("Invalid time value");
  }

  const tokens = formatStr.match(formattingTokensRegExp);

  // The only case when formattingTokensRegExp doesn't match the string is when it's empty
  if (!tokens) return "";

  const result = tokens
    .map((substring) => {
      // Replace two single quote characters with one single quote character
      if (substring === "''") {
        return "'";
      }

      const firstCharacter = substring[0];
      if (firstCharacter === "'") {
        return cleanEscapedString(substring);
      }

      const formatter = _index3.lightFormatters[firstCharacter];
      if (formatter) {
        return formatter(_date, substring);
      }

      if (firstCharacter.match(unescapedLatinCharacterRegExp)) {
        throw new RangeError(
          "Format string contains an unescaped latin alphabet character `" +
            firstCharacter +
            "`",
        );
      }

      return substring;
    })
    .join("");

  return result;
}

function cleanEscapedString(input) {
  const matches = input.match(escapedStringRegExp);

  if (!matches) {
    return input;
  }

  return matches[1].replace(doubleQuoteRegExp, "'");
}


/***/ }),
/* 288 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.milliseconds = milliseconds;
var _index = __webpack_require__(62);

/**
 * @name milliseconds
 * @category Millisecond Helpers
 * @summary
 * Returns the number of milliseconds in the specified, years, months, weeks, days, hours, minutes and seconds.
 *
 * @description
 * Returns the number of milliseconds in the specified, years, months, weeks, days, hours, minutes and seconds.
 *
 * One years equals 365.2425 days according to the formula:
 *
 * > Leap year occures every 4 years, except for years that are divisable by 100 and not divisable by 400.
 * > 1 mean year = (365+1/4-1/100+1/400) days = 365.2425 days
 *
 * One month is a year divided by 12.
 *
 * @param duration - The object with years, months, weeks, days, hours, minutes and seconds to be added.
 *
 * @returns The milliseconds
 *
 * @example
 * // 1 year in milliseconds
 * milliseconds({ years: 1 })
 * //=> 31556952000
 *
 * // 3 months in milliseconds
 * milliseconds({ months: 3 })
 * //=> 7889238000
 */
function milliseconds({ years, months, weeks, days, hours, minutes, seconds }) {
  let totalDays = 0;

  if (years) totalDays += years * _index.daysInYear;
  if (months) totalDays += months * (_index.daysInYear / 12);
  if (weeks) totalDays += weeks * 7;
  if (days) totalDays += days;

  let totalSeconds = totalDays * 24 * 60 * 60;

  if (hours) totalSeconds += hours * 60 * 60;
  if (minutes) totalSeconds += minutes * 60;
  if (seconds) totalSeconds += seconds;

  return Math.trunc(totalSeconds * 1000);
}


/***/ }),
/* 289 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.millisecondsToHours = millisecondsToHours;
var _index = __webpack_require__(62);

/**
 * @name millisecondsToHours
 * @category Conversion Helpers
 * @summary Convert milliseconds to hours.
 *
 * @description
 * Convert a number of milliseconds to a full number of hours.
 *
 * @param milliseconds - The number of milliseconds to be converted
 *
 * @returns The number of milliseconds converted in hours
 *
 * @example
 * // Convert 7200000 milliseconds to hours:
 * const result = millisecondsToHours(7200000)
 * //=> 2
 *
 * @example
 * // It uses floor rounding:
 * const result = millisecondsToHours(7199999)
 * //=> 1
 */
function millisecondsToHours(milliseconds) {
  const hours = milliseconds / _index.millisecondsInHour;
  return Math.trunc(hours);
}


/***/ }),
/* 290 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.millisecondsToMinutes = millisecondsToMinutes;
var _index = __webpack_require__(62);

/**
 * @name millisecondsToMinutes
 * @category Conversion Helpers
 * @summary Convert milliseconds to minutes.
 *
 * @description
 * Convert a number of milliseconds to a full number of minutes.
 *
 * @param milliseconds - The number of milliseconds to be converted
 *
 * @returns The number of milliseconds converted in minutes
 *
 * @example
 * // Convert 60000 milliseconds to minutes:
 * const result = millisecondsToMinutes(60000)
 * //=> 1
 *
 * @example
 * // It uses floor rounding:
 * const result = millisecondsToMinutes(119999)
 * //=> 1
 */
function millisecondsToMinutes(milliseconds) {
  const minutes = milliseconds / _index.millisecondsInMinute;
  return Math.trunc(minutes);
}


/***/ }),
/* 291 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.millisecondsToSeconds = millisecondsToSeconds;
var _index = __webpack_require__(62);

/**
 * @name millisecondsToSeconds
 * @category Conversion Helpers
 * @summary Convert milliseconds to seconds.
 *
 * @description
 * Convert a number of milliseconds to a full number of seconds.
 *
 * @param milliseconds - The number of milliseconds to be converted
 *
 * @returns The number of milliseconds converted in seconds
 *
 * @example
 * // Convert 1000 miliseconds to seconds:
 * const result = millisecondsToSeconds(1000)
 * //=> 1
 *
 * @example
 * // It uses floor rounding:
 * const result = millisecondsToSeconds(1999)
 * //=> 1
 */
function millisecondsToSeconds(milliseconds) {
  const seconds = milliseconds / _index.millisecondsInSecond;
  return Math.trunc(seconds);
}


/***/ }),
/* 292 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.minutesToHours = minutesToHours;
var _index = __webpack_require__(62);

/**
 * @name minutesToHours
 * @category Conversion Helpers
 * @summary Convert minutes to hours.
 *
 * @description
 * Convert a number of minutes to a full number of hours.
 *
 * @param minutes - The number of minutes to be converted
 *
 * @returns The number of minutes converted in hours
 *
 * @example
 * // Convert 140 minutes to hours:
 * const result = minutesToHours(120)
 * //=> 2
 *
 * @example
 * // It uses floor rounding:
 * const result = minutesToHours(179)
 * //=> 2
 */
function minutesToHours(minutes) {
  const hours = minutes / _index.minutesInHour;
  return Math.trunc(hours);
}


/***/ }),
/* 293 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.minutesToMilliseconds = minutesToMilliseconds;
var _index = __webpack_require__(62);

/**
 * @name minutesToMilliseconds
 * @category Conversion Helpers
 * @summary Convert minutes to milliseconds.
 *
 * @description
 * Convert a number of minutes to a full number of milliseconds.
 *
 * @param minutes - The number of minutes to be converted
 *
 * @returns The number of minutes converted in milliseconds
 *
 * @example
 * // Convert 2 minutes to milliseconds
 * const result = minutesToMilliseconds(2)
 * //=> 120000
 */
function minutesToMilliseconds(minutes) {
  return Math.trunc(minutes * _index.millisecondsInMinute);
}


/***/ }),
/* 294 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.minutesToSeconds = minutesToSeconds;
var _index = __webpack_require__(62);

/**
 * @name minutesToSeconds
 * @category Conversion Helpers
 * @summary Convert minutes to seconds.
 *
 * @description
 * Convert a number of minutes to a full number of seconds.
 *
 * @param minutes - The number of minutes to be converted
 *
 * @returns The number of minutes converted in seconds
 *
 * @example
 * // Convert 2 minutes to seconds
 * const result = minutesToSeconds(2)
 * //=> 120
 */
function minutesToSeconds(minutes) {
  return Math.trunc(minutes * _index.secondsInMinute);
}


/***/ }),
/* 295 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.monthsToQuarters = monthsToQuarters;
var _index = __webpack_require__(62);

/**
 * @name monthsToQuarters
 * @category Conversion Helpers
 * @summary Convert number of months to quarters.
 *
 * @description
 * Convert a number of months to a full number of quarters.
 *
 * @param months - The number of months to be converted.
 *
 * @returns The number of months converted in quarters
 *
 * @example
 * // Convert 6 months to quarters:
 * const result = monthsToQuarters(6)
 * //=> 2
 *
 * @example
 * // It uses floor rounding:
 * const result = monthsToQuarters(7)
 * //=> 2
 */
function monthsToQuarters(months) {
  const quarters = months / _index.monthsInQuarter;
  return Math.trunc(quarters);
}


/***/ }),
/* 296 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.monthsToYears = monthsToYears;
var _index = __webpack_require__(62);

/**
 * @name monthsToYears
 * @category Conversion Helpers
 * @summary Convert number of months to years.
 *
 * @description
 * Convert a number of months to a full number of years.
 *
 * @param months - The number of months to be converted
 *
 * @returns The number of months converted in years
 *
 * @example
 * // Convert 36 months to years:
 * const result = monthsToYears(36)
 * //=> 3
 *
 * // It uses floor rounding:
 * const result = monthsToYears(40)
 * //=> 3
 */
function monthsToYears(months) {
  const years = months / _index.monthsInYear;
  return Math.trunc(years);
}


/***/ }),
/* 297 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.nextDay = nextDay;
var _index = __webpack_require__(52);
var _index2 = __webpack_require__(175);

/**
 * @name nextDay
 * @category Weekday Helpers
 * @summary When is the next day of the week?
 *
 * @description
 * When is the next day of the week? 0-6 the day of the week, 0 represents Sunday.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The date to check
 * @param day - day of the week
 *
 * @returns The date is the next day of week
 *
 * @example
 * // When is the next Monday after Mar, 20, 2020?
 * const result = nextDay(new Date(2020, 2, 20), 1)
 * //=> Mon Mar 23 2020 00:00:00
 *
 * @example
 * // When is the next Tuesday after Mar, 21, 2020?
 * const result = nextDay(new Date(2020, 2, 21), 2)
 * //=> Tue Mar 24 2020 00:00:00
 */
function nextDay(date, day) {
  let delta = day - (0, _index2.getDay)(date);
  if (delta <= 0) delta += 7;

  return (0, _index.addDays)(date, delta);
}


/***/ }),
/* 298 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.nextFriday = nextFriday;
var _index = __webpack_require__(297);

/**
 * @name nextFriday
 * @category Weekday Helpers
 * @summary When is the next Friday?
 *
 * @description
 * When is the next Friday?
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The date to start counting from
 *
 * @returns The next Friday
 *
 * @example
 * // When is the next Friday after Mar, 22, 2020?
 * const result = nextFriday(new Date(2020, 2, 22))
 * //=> Fri Mar 27 2020 00:00:00
 */
function nextFriday(date) {
  return (0, _index.nextDay)(date, 5);
}


/***/ }),
/* 299 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.nextMonday = nextMonday;
var _index = __webpack_require__(297);

/**
 * @name nextMonday
 * @category Weekday Helpers
 * @summary When is the next Monday?
 *
 * @description
 * When is the next Monday?
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The date to start counting from
 *
 * @returns The next Monday
 *
 * @example
 * // When is the next Monday after Mar, 22, 2020?
 * const result = nextMonday(new Date(2020, 2, 22))
 * //=> Mon Mar 23 2020 00:00:00
 */
function nextMonday(date) {
  return (0, _index.nextDay)(date, 1);
}


/***/ }),
/* 300 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.nextSaturday = nextSaturday;
var _index = __webpack_require__(297);

/**
 * @name nextSaturday
 * @category Weekday Helpers
 * @summary When is the next Saturday?
 *
 * @description
 * When is the next Saturday?
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The date to start counting from
 *
 * @returns The next Saturday
 *
 * @example
 * // When is the next Saturday after Mar, 22, 2020?
 * const result = nextSaturday(new Date(2020, 2, 22))
 * //=> Sat Mar 28 2020 00:00:00
 */
function nextSaturday(date) {
  return (0, _index.nextDay)(date, 6);
}


/***/ }),
/* 301 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.nextSunday = nextSunday;
var _index = __webpack_require__(297);

/**
 * @name nextSunday
 * @category Weekday Helpers
 * @summary When is the next Sunday?
 *
 * @description
 * When is the next Sunday?
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The date to start counting from
 *
 * @returns The next Sunday
 *
 * @example
 * // When is the next Sunday after Mar, 22, 2020?
 * const result = nextSunday(new Date(2020, 2, 22))
 * //=> Sun Mar 29 2020 00:00:00
 */
function nextSunday(date) {
  return (0, _index.nextDay)(date, 0);
}


/***/ }),
/* 302 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.nextThursday = nextThursday;
var _index = __webpack_require__(297);

/**
 * @name nextThursday
 * @category Weekday Helpers
 * @summary When is the next Thursday?
 *
 * @description
 * When is the next Thursday?
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The date to start counting from
 *
 * @returns The next Thursday
 *
 * @example
 * // When is the next Thursday after Mar, 22, 2020?
 * const result = nextThursday(new Date(2020, 2, 22))
 * //=> Thur Mar 26 2020 00:00:00
 */
function nextThursday(date) {
  return (0, _index.nextDay)(date, 4);
}


/***/ }),
/* 303 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.nextTuesday = nextTuesday;
var _index = __webpack_require__(297);

/**
 * @name nextTuesday
 * @category Weekday Helpers
 * @summary When is the next Tuesday?
 *
 * @description
 * When is the next Tuesday?
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The date to start counting from
 *
 * @returns The next Tuesday
 *
 * @example
 * // When is the next Tuesday after Mar, 22, 2020?
 * const result = nextTuesday(new Date(2020, 2, 22))
 * //=> Tue Mar 24 2020 00:00:00
 */
function nextTuesday(date) {
  return (0, _index.nextDay)(date, 2);
}


/***/ }),
/* 304 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.nextWednesday = nextWednesday;
var _index = __webpack_require__(297);

/**
 * @name nextWednesday
 * @category Weekday Helpers
 * @summary When is the next Wednesday?
 *
 * @description
 * When is the next Wednesday?
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The date to start counting from
 *
 * @returns The next Wednesday
 *
 * @example
 * // When is the next Wednesday after Mar, 22, 2020?
 * const result = nextWednesday(new Date(2020, 2, 22))
 * //=> Wed Mar 25 2020 00:00:00
 */
function nextWednesday(date) {
  return (0, _index.nextDay)(date, 3);
}


/***/ }),
/* 305 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.parseISO = parseISO;
var _index = __webpack_require__(62);

/**
 * The {@link parseISO} function options.
 */

/**
 * @name parseISO
 * @category Common Helpers
 * @summary Parse ISO string
 *
 * @description
 * Parse the given string in ISO 8601 format and return an instance of Date.
 *
 * Function accepts complete ISO 8601 formats as well as partial implementations.
 * ISO 8601: http://en.wikipedia.org/wiki/ISO_8601
 *
 * If the argument isn't a string, the function cannot parse the string or
 * the values are invalid, it returns Invalid Date.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param argument - The value to convert
 * @param options - An object with options
 *
 * @returns The parsed date in the local time zone
 *
 * @example
 * // Convert string '2014-02-11T11:30:30' to date:
 * const result = parseISO('2014-02-11T11:30:30')
 * //=> Tue Feb 11 2014 11:30:30
 *
 * @example
 * // Convert string '+02014101' to date,
 * // if the additional number of digits in the extended year format is 1:
 * const result = parseISO('+02014101', { additionalDigits: 1 })
 * //=> Fri Apr 11 2014 00:00:00
 */
function parseISO(argument, options) {
  const additionalDigits = options?.additionalDigits ?? 2;
  const dateStrings = splitDateString(argument);

  let date;
  if (dateStrings.date) {
    const parseYearResult = parseYear(dateStrings.date, additionalDigits);
    date = parseDate(parseYearResult.restDateString, parseYearResult.year);
  }

  if (!date || isNaN(date.getTime())) {
    return new Date(NaN);
  }

  const timestamp = date.getTime();
  let time = 0;
  let offset;

  if (dateStrings.time) {
    time = parseTime(dateStrings.time);
    if (isNaN(time)) {
      return new Date(NaN);
    }
  }

  if (dateStrings.timezone) {
    offset = parseTimezone(dateStrings.timezone);
    if (isNaN(offset)) {
      return new Date(NaN);
    }
  } else {
    const dirtyDate = new Date(timestamp + time);
    // JS parsed string assuming it's in UTC timezone
    // but we need it to be parsed in our timezone
    // so we use utc values to build date in our timezone.
    // Year values from 0 to 99 map to the years 1900 to 1999
    // so set year explicitly with setFullYear.
    const result = new Date(0);
    result.setFullYear(
      dirtyDate.getUTCFullYear(),
      dirtyDate.getUTCMonth(),
      dirtyDate.getUTCDate(),
    );
    result.setHours(
      dirtyDate.getUTCHours(),
      dirtyDate.getUTCMinutes(),
      dirtyDate.getUTCSeconds(),
      dirtyDate.getUTCMilliseconds(),
    );
    return result;
  }

  return new Date(timestamp + time + offset);
}

const patterns = {
  dateTimeDelimiter: /[T ]/,
  timeZoneDelimiter: /[Z ]/i,
  timezone: /([Z+-].*)$/,
};

const dateRegex =
  /^-?(?:(\d{3})|(\d{2})(?:-?(\d{2}))?|W(\d{2})(?:-?(\d{1}))?|)$/;
const timeRegex =
  /^(\d{2}(?:[.,]\d*)?)(?::?(\d{2}(?:[.,]\d*)?))?(?::?(\d{2}(?:[.,]\d*)?))?$/;
const timezoneRegex = /^([+-])(\d{2})(?::?(\d{2}))?$/;

function splitDateString(dateString) {
  const dateStrings = {};
  const array = dateString.split(patterns.dateTimeDelimiter);
  let timeString;

  // The regex match should only return at maximum two array elements.
  // [date], [time], or [date, time].
  if (array.length > 2) {
    return dateStrings;
  }

  if (/:/.test(array[0])) {
    timeString = array[0];
  } else {
    dateStrings.date = array[0];
    timeString = array[1];
    if (patterns.timeZoneDelimiter.test(dateStrings.date)) {
      dateStrings.date = dateString.split(patterns.timeZoneDelimiter)[0];
      timeString = dateString.substr(
        dateStrings.date.length,
        dateString.length,
      );
    }
  }

  if (timeString) {
    const token = patterns.timezone.exec(timeString);
    if (token) {
      dateStrings.time = timeString.replace(token[1], "");
      dateStrings.timezone = token[1];
    } else {
      dateStrings.time = timeString;
    }
  }

  return dateStrings;
}

function parseYear(dateString, additionalDigits) {
  const regex = new RegExp(
    "^(?:(\\d{4}|[+-]\\d{" +
      (4 + additionalDigits) +
      "})|(\\d{2}|[+-]\\d{" +
      (2 + additionalDigits) +
      "})$)",
  );

  const captures = dateString.match(regex);
  // Invalid ISO-formatted year
  if (!captures) return { year: NaN, restDateString: "" };

  const year = captures[1] ? parseInt(captures[1]) : null;
  const century = captures[2] ? parseInt(captures[2]) : null;

  // either year or century is null, not both
  return {
    year: century === null ? year : century * 100,
    restDateString: dateString.slice((captures[1] || captures[2]).length),
  };
}

function parseDate(dateString, year) {
  // Invalid ISO-formatted year
  if (year === null) return new Date(NaN);

  const captures = dateString.match(dateRegex);
  // Invalid ISO-formatted string
  if (!captures) return new Date(NaN);

  const isWeekDate = !!captures[4];
  const dayOfYear = parseDateUnit(captures[1]);
  const month = parseDateUnit(captures[2]) - 1;
  const day = parseDateUnit(captures[3]);
  const week = parseDateUnit(captures[4]);
  const dayOfWeek = parseDateUnit(captures[5]) - 1;

  if (isWeekDate) {
    if (!validateWeekDate(year, week, dayOfWeek)) {
      return new Date(NaN);
    }
    return dayOfISOWeekYear(year, week, dayOfWeek);
  } else {
    const date = new Date(0);
    if (
      !validateDate(year, month, day) ||
      !validateDayOfYearDate(year, dayOfYear)
    ) {
      return new Date(NaN);
    }
    date.setUTCFullYear(year, month, Math.max(dayOfYear, day));
    return date;
  }
}

function parseDateUnit(value) {
  return value ? parseInt(value) : 1;
}

function parseTime(timeString) {
  const captures = timeString.match(timeRegex);
  if (!captures) return NaN; // Invalid ISO-formatted time

  const hours = parseTimeUnit(captures[1]);
  const minutes = parseTimeUnit(captures[2]);
  const seconds = parseTimeUnit(captures[3]);

  if (!validateTime(hours, minutes, seconds)) {
    return NaN;
  }

  return (
    hours * _index.millisecondsInHour +
    minutes * _index.millisecondsInMinute +
    seconds * 1000
  );
}

function parseTimeUnit(value) {
  return (value && parseFloat(value.replace(",", "."))) || 0;
}

function parseTimezone(timezoneString) {
  if (timezoneString === "Z") return 0;

  const captures = timezoneString.match(timezoneRegex);
  if (!captures) return 0;

  const sign = captures[1] === "+" ? -1 : 1;
  const hours = parseInt(captures[2]);
  const minutes = (captures[3] && parseInt(captures[3])) || 0;

  if (!validateTimezone(hours, minutes)) {
    return NaN;
  }

  return (
    sign *
    (hours * _index.millisecondsInHour + minutes * _index.millisecondsInMinute)
  );
}

function dayOfISOWeekYear(isoWeekYear, week, day) {
  const date = new Date(0);
  date.setUTCFullYear(isoWeekYear, 0, 4);
  const fourthOfJanuaryDay = date.getUTCDay() || 7;
  const diff = (week - 1) * 7 + day + 1 - fourthOfJanuaryDay;
  date.setUTCDate(date.getUTCDate() + diff);
  return date;
}

// Validation functions

// February is null to handle the leap year (using ||)
const daysInMonths = [31, null, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

function isLeapYearIndex(year) {
  return year % 400 === 0 || (year % 4 === 0 && year % 100 !== 0);
}

function validateDate(year, month, date) {
  return (
    month >= 0 &&
    month <= 11 &&
    date >= 1 &&
    date <= (daysInMonths[month] || (isLeapYearIndex(year) ? 29 : 28))
  );
}

function validateDayOfYearDate(year, dayOfYear) {
  return dayOfYear >= 1 && dayOfYear <= (isLeapYearIndex(year) ? 366 : 365);
}

function validateWeekDate(_year, week, day) {
  return week >= 1 && week <= 53 && day >= 0 && day <= 6;
}

function validateTime(hours, minutes, seconds) {
  if (hours === 24) {
    return minutes === 0 && seconds === 0;
  }

  return (
    seconds >= 0 &&
    seconds < 60 &&
    minutes >= 0 &&
    minutes < 60 &&
    hours >= 0 &&
    hours < 25
  );
}

function validateTimezone(_hours, minutes) {
  return minutes >= 0 && minutes <= 59;
}


/***/ }),
/* 306 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

exports.parseJSON = parseJSON; /**
 * @name parseJSON
 * @category Common Helpers
 * @summary Parse a JSON date string
 *
 * @description
 * Converts a complete ISO date string in UTC time, the typical format for transmitting
 * a date in JSON, to a JavaScript `Date` instance.
 *
 * This is a minimal implementation for converting dates retrieved from a JSON API to
 * a `Date` instance which can be used with other functions in the `date-fns` library.
 * The following formats are supported:
 *
 * - `2000-03-15T05:20:10.123Z`: The output of `.toISOString()` and `JSON.stringify(new Date())`
 * - `2000-03-15T05:20:10Z`: Without milliseconds
 * - `2000-03-15T05:20:10+00:00`: With a zero offset, the default JSON encoded format in some other languages
 * - `2000-03-15T05:20:10+05:45`: With a positive or negative offset, the default JSON encoded format in some other languages
 * - `2000-03-15T05:20:10+0000`: With a zero offset without a colon
 * - `2000-03-15T05:20:10`: Without a trailing 'Z' symbol
 * - `2000-03-15T05:20:10.1234567`: Up to 7 digits in milliseconds field. Only first 3 are taken into account since JS does not allow fractional milliseconds
 * - `2000-03-15 05:20:10`: With a space instead of a 'T' separator for APIs returning a SQL date without reformatting
 *
 * For convenience and ease of use these other input types are also supported
 * via [toDate](https://date-fns.org/docs/toDate):
 *
 * - A `Date` instance will be cloned
 * - A `number` will be treated as a timestamp
 *
 * Any other input type or invalid date strings will return an `Invalid Date`.
 *
 * @param dateStr - A fully formed ISO8601 date string to convert
 *
 * @returns The parsed date in the local time zone
 */
function parseJSON(dateStr) {
  const parts = dateStr.match(
    /(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2}):(\d{2})(?:\.(\d{0,7}))?(?:Z|(.)(\d{2}):?(\d{2})?)?/,
  );
  if (parts) {
    // Group 8 matches the sign
    return new Date(
      Date.UTC(
        +parts[1],
        +parts[2] - 1,
        +parts[3],
        +parts[4] - (+parts[9] || 0) * (parts[8] == "-" ? -1 : 1),
        +parts[5] - (+parts[10] || 0) * (parts[8] == "-" ? -1 : 1),
        +parts[6],
        +((parts[7] || "0") + "00").substring(0, 3),
      ),
    );
  }
  return new Date(NaN);
}


/***/ }),
/* 307 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.previousDay = previousDay;
var _index = __webpack_require__(175);
var _index2 = __webpack_require__(280);

/**
 * @name previousDay
 * @category Weekday Helpers
 * @summary When is the previous day of the week?
 *
 * @description
 * When is the previous day of the week? 0-6 the day of the week, 0 represents Sunday.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The date to check
 * @param day - The day of the week
 *
 * @returns The date is the previous day of week
 *
 * @example
 * // When is the previous Monday before Mar, 20, 2020?
 * const result = previousDay(new Date(2020, 2, 20), 1)
 * //=> Mon Mar 16 2020 00:00:00
 *
 * @example
 * // When is the previous Tuesday before Mar, 21, 2020?
 * const result = previousDay(new Date(2020, 2, 21), 2)
 * //=> Tue Mar 17 2020 00:00:00
 */
function previousDay(date, day) {
  let delta = (0, _index.getDay)(date) - day;
  if (delta <= 0) delta += 7;

  return (0, _index2.subDays)(date, delta);
}


/***/ }),
/* 308 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.previousFriday = previousFriday;
var _index = __webpack_require__(307);

/**
 * @name previousFriday
 * @category Weekday Helpers
 * @summary When is the previous Friday?
 *
 * @description
 * When is the previous Friday?
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The date to start counting from
 *
 * @returns The previous Friday
 *
 * @example
 * // When is the previous Friday before Jun, 19, 2021?
 * const result = previousFriday(new Date(2021, 5, 19))
 * //=> Fri June 18 2021 00:00:00
 */
function previousFriday(date) {
  return (0, _index.previousDay)(date, 5);
}


/***/ }),
/* 309 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.previousMonday = previousMonday;
var _index = __webpack_require__(307);

/**
 * @name previousMonday
 * @category Weekday Helpers
 * @summary When is the previous Monday?
 *
 * @description
 * When is the previous Monday?
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The date to start counting from
 *
 * @returns The previous Monday
 *
 * @example
 * // When is the previous Monday before Jun, 18, 2021?
 * const result = previousMonday(new Date(2021, 5, 18))
 * //=> Mon June 14 2021 00:00:00
 */
function previousMonday(date) {
  return (0, _index.previousDay)(date, 1);
}


/***/ }),
/* 310 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.previousSaturday = previousSaturday;
var _index = __webpack_require__(307);

/**
 * @name previousSaturday
 * @category Weekday Helpers
 * @summary When is the previous Saturday?
 *
 * @description
 * When is the previous Saturday?
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The date to start counting from
 *
 * @returns The previous Saturday
 *
 * @example
 * // When is the previous Saturday before Jun, 20, 2021?
 * const result = previousSaturday(new Date(2021, 5, 20))
 * //=> Sat June 19 2021 00:00:00
 */
function previousSaturday(date) {
  return (0, _index.previousDay)(date, 6);
}


/***/ }),
/* 311 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.previousSunday = previousSunday;
var _index = __webpack_require__(307);

/**
 * @name previousSunday
 * @category Weekday Helpers
 * @summary When is the previous Sunday?
 *
 * @description
 * When is the previous Sunday?
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The date to start counting from
 *
 * @returns The previous Sunday
 *
 * @example
 * // When is the previous Sunday before Jun, 21, 2021?
 * const result = previousSunday(new Date(2021, 5, 21))
 * //=> Sun June 20 2021 00:00:00
 */
function previousSunday(date) {
  return (0, _index.previousDay)(date, 0);
}


/***/ }),
/* 312 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.previousThursday = previousThursday;
var _index = __webpack_require__(307);

/**
 * @name previousThursday
 * @category Weekday Helpers
 * @summary When is the previous Thursday?
 *
 * @description
 * When is the previous Thursday?
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The date to start counting from
 *
 * @returns The previous Thursday
 *
 * @example
 * // When is the previous Thursday before Jun, 18, 2021?
 * const result = previousThursday(new Date(2021, 5, 18))
 * //=> Thu June 17 2021 00:00:00
 */
function previousThursday(date) {
  return (0, _index.previousDay)(date, 4);
}


/***/ }),
/* 313 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.previousTuesday = previousTuesday;
var _index = __webpack_require__(307);

/**
 * @name previousTuesday
 * @category Weekday Helpers
 * @summary When is the previous Tuesday?
 *
 * @description
 * When is the previous Tuesday?
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The date to start counting from
 *
 * @returns The previous Tuesday
 *
 * @example
 * // When is the previous Tuesday before Jun, 18, 2021?
 * const result = previousTuesday(new Date(2021, 5, 18))
 * //=> Tue June 15 2021 00:00:00
 */
function previousTuesday(date) {
  return (0, _index.previousDay)(date, 2);
}


/***/ }),
/* 314 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.previousWednesday = previousWednesday;
var _index = __webpack_require__(307);

/**
 * @name previousWednesday
 * @category Weekday Helpers
 * @summary When is the previous Wednesday?
 *
 * @description
 * When is the previous Wednesday?
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The date to start counting from
 *
 * @returns The previous Wednesday
 *
 * @example
 * // When is the previous Wednesday before Jun, 18, 2021?
 * const result = previousWednesday(new Date(2021, 5, 18))
 * //=> Wed June 16 2021 00:00:00
 */
function previousWednesday(date) {
  return (0, _index.previousDay)(date, 3);
}


/***/ }),
/* 315 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.quartersToMonths = quartersToMonths;
var _index = __webpack_require__(62);

/**
 * @name quartersToMonths
 * @category Conversion Helpers
 * @summary Convert number of quarters to months.
 *
 * @description
 * Convert a number of quarters to a full number of months.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param quarters - The number of quarters to be converted
 *
 * @returns The number of quarters converted in months
 *
 * @example
 * // Convert 2 quarters to months
 * const result = quartersToMonths(2)
 * //=> 6
 */
function quartersToMonths(quarters) {
  return Math.trunc(quarters * _index.monthsInQuarter);
}


/***/ }),
/* 316 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.quartersToYears = quartersToYears;
var _index = __webpack_require__(62);

/**
 * @name quartersToYears
 * @category Conversion Helpers
 * @summary Convert number of quarters to years.
 *
 * @description
 * Convert a number of quarters to a full number of years.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param quarters - The number of quarters to be converted
 *
 * @returns The number of quarters converted in years
 *
 * @example
 * // Convert 8 quarters to years
 * const result = quartersToYears(8)
 * //=> 2
 *
 * @example
 * // It uses floor rounding:
 * const result = quartersToYears(11)
 * //=> 2
 */
function quartersToYears(quarters) {
  const years = quarters / _index.quartersInYear;
  return Math.trunc(years);
}


/***/ }),
/* 317 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.roundToNearestHours = roundToNearestHours;
var _index = __webpack_require__(101);
var _index2 = __webpack_require__(54);
var _index3 = __webpack_require__(53);

/**
 * The {@link roundToNearestHours} function options.
 */

/**
 * @name roundToNearestHours
 * @category Hour Helpers
 * @summary Rounds the given date to the nearest hour
 *
 * @description
 * Rounds the given date to the nearest hour (or number of hours).
 * Rounds up when the given date is exactly between the nearest round hours.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The date to round
 * @param options - An object with options.
 *
 * @returns The new date rounded to the closest hour
 *
 * @example
 * // Round 10 July 2014 12:34:56 to nearest hour:
 * const result = roundToNearestHours(new Date(2014, 6, 10, 12, 34, 56))
 * //=> Thu Jul 10 2014 13:00:00
 *
 * @example
 * // Round 10 July 2014 12:34:56 to nearest half hour:
 * const result = roundToNearestHours(new Date(2014, 6, 10, 12, 34, 56), { nearestTo: 6 })
 * //=> Thu Jul 10 2014 12:00:00

 * @example
 * // Round 10 July 2014 12:34:56 to nearest half hour:
 * const result = roundToNearestHours(new Date(2014, 6, 10, 12, 34, 56), { nearestTo: 8 })
 * //=> Thu Jul 10 2014 16:00:00

* @example
 * // Floor (rounds down) 10 July 2014 12:34:56 to nearest hour:
 * const result = roundToNearestHours(new Date(2014, 6, 10, 1, 23, 45), { roundingMethod: 'ceil' })
 * //=> Thu Jul 10 2014 02:00:00
 *
 * @example
 * // Ceil (rounds up) 10 July 2014 12:34:56 to nearest quarter hour:
 * const result = roundToNearestHours(new Date(2014, 6, 10, 12, 34, 56), { roundingMethod: 'floor', nearestTo: 8 })
 * //=> Thu Jul 10 2014 08:00:00
 */
function roundToNearestHours(date, options) {
  const nearestTo = options?.nearestTo ?? 1;

  if (nearestTo < 1 || nearestTo > 12)
    return (0, _index2.constructFrom)(date, NaN);

  const _date = (0, _index3.toDate)(date);
  const fractionalMinutes = _date.getMinutes() / 60;
  const fractionalSeconds = _date.getSeconds() / 60 / 60;
  const fractionalMilliseconds = _date.getMilliseconds() / 1000 / 60 / 60;
  const hours =
    _date.getHours() +
    fractionalMinutes +
    fractionalSeconds +
    fractionalMilliseconds;

  // Unlike the `differenceIn*` functions, the default rounding behavior is `round` and not 'trunc'
  const method = options?.roundingMethod ?? "round";
  const roundingMethod = (0, _index.getRoundingMethod)(method);

  // nearestTo option does not care daylight savings time
  const roundedHours = roundingMethod(hours / nearestTo) * nearestTo;

  const result = (0, _index2.constructFrom)(date, _date);
  result.setHours(roundedHours, 0, 0, 0);
  return result;
}


/***/ }),
/* 318 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.roundToNearestMinutes = roundToNearestMinutes;
var _index = __webpack_require__(101);
var _index2 = __webpack_require__(54);
var _index3 = __webpack_require__(53);

/**
 * The {@link roundToNearestMinutes} function options.
 */

/**
 * @name roundToNearestMinutes
 * @category Minute Helpers
 * @summary Rounds the given date to the nearest minute
 *
 * @description
 * Rounds the given date to the nearest minute (or number of minutes).
 * Rounds up when the given date is exactly between the nearest round minutes.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The date to round
 * @param options - An object with options.
 *
 * @returns The new date rounded to the closest minute
 *
 * @example
 * // Round 10 July 2014 12:12:34 to nearest minute:
 * const result = roundToNearestMinutes(new Date(2014, 6, 10, 12, 12, 34))
 * //=> Thu Jul 10 2014 12:13:00
 *
 * @example
 * // Round 10 July 2014 12:12:34 to nearest quarter hour:
 * const result = roundToNearestMinutes(new Date(2014, 6, 10, 12, 12, 34), { nearestTo: 15 })
 * //=> Thu Jul 10 2014 12:15:00
 *
 * @example
 * // Floor (rounds down) 10 July 2014 12:12:34 to nearest minute:
 * const result = roundToNearestMinutes(new Date(2014, 6, 10, 12, 12, 34), { roundingMethod: 'floor' })
 * //=> Thu Jul 10 2014 12:12:00
 *
 * @example
 * // Ceil (rounds up) 10 July 2014 12:12:34 to nearest half hour:
 * const result = roundToNearestMinutes(new Date(2014, 6, 10, 12, 12, 34), { roundingMethod: 'ceil', nearestTo: 30 })
 * //=> Thu Jul 10 2014 12:30:00
 */
function roundToNearestMinutes(date, options) {
  const nearestTo = options?.nearestTo ?? 1;

  if (nearestTo < 1 || nearestTo > 30)
    return (0, _index2.constructFrom)(date, NaN);

  const _date = (0, _index3.toDate)(date);
  const fractionalSeconds = _date.getSeconds() / 60;
  const fractionalMilliseconds = _date.getMilliseconds() / 1000 / 60;
  const minutes =
    _date.getMinutes() + fractionalSeconds + fractionalMilliseconds;

  // Unlike the `differenceIn*` functions, the default rounding behavior is `round` and not 'trunc'
  const method = options?.roundingMethod ?? "round";
  const roundingMethod = (0, _index.getRoundingMethod)(method);

  const roundedMinutes = roundingMethod(minutes / nearestTo) * nearestTo;

  const result = (0, _index2.constructFrom)(date, _date);
  result.setMinutes(roundedMinutes, 0, 0);
  return result;
}


/***/ }),
/* 319 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.secondsToHours = secondsToHours;
var _index = __webpack_require__(62);

/**
 * @name secondsToHours
 * @category Conversion Helpers
 * @summary Convert seconds to hours.
 *
 * @description
 * Convert a number of seconds to a full number of hours.
 *
 * @param seconds - The number of seconds to be converted
 *
 * @returns The number of seconds converted in hours
 *
 * @example
 * // Convert 7200 seconds into hours
 * const result = secondsToHours(7200)
 * //=> 2
 *
 * @example
 * // It uses floor rounding:
 * const result = secondsToHours(7199)
 * //=> 1
 */
function secondsToHours(seconds) {
  const hours = seconds / _index.secondsInHour;
  return Math.trunc(hours);
}


/***/ }),
/* 320 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.secondsToMilliseconds = secondsToMilliseconds;
var _index = __webpack_require__(62);

/**
 * @name secondsToMilliseconds
 * @category Conversion Helpers
 * @summary Convert seconds to milliseconds.
 *
 * @description
 * Convert a number of seconds to a full number of milliseconds.
 *
 * @param seconds - The number of seconds to be converted
 *
 * @returns The number of seconds converted in milliseconds
 *
 * @example
 * // Convert 2 seconds into milliseconds
 * const result = secondsToMilliseconds(2)
 * //=> 2000
 */
function secondsToMilliseconds(seconds) {
  return seconds * _index.millisecondsInSecond;
}


/***/ }),
/* 321 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.secondsToMinutes = secondsToMinutes;
var _index = __webpack_require__(62);

/**
 * @name secondsToMinutes
 * @category Conversion Helpers
 * @summary Convert seconds to minutes.
 *
 * @description
 * Convert a number of seconds to a full number of minutes.
 *
 * @param seconds - The number of seconds to be converted
 *
 * @returns The number of seconds converted in minutes
 *
 * @example
 * // Convert 120 seconds into minutes
 * const result = secondsToMinutes(120)
 * //=> 2
 *
 * @example
 * // It uses floor rounding:
 * const result = secondsToMinutes(119)
 * //=> 1
 */
function secondsToMinutes(seconds) {
  const minutes = seconds / _index.secondsInMinute;
  return Math.trunc(minutes);
}


/***/ }),
/* 322 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.set = set;
var _index = __webpack_require__(54);
var _index2 = __webpack_require__(323);
var _index3 = __webpack_require__(53);

/**
 * @name set
 * @category Common Helpers
 * @summary Set date values to a given date.
 *
 * @description
 * Set date values to a given date.
 *
 * Sets time values to date from object `values`.
 * A value is not set if it is undefined or null or doesn't exist in `values`.
 *
 * Note about bundle size: `set` does not internally use `setX` functions from date-fns but instead opts
 * to use native `Date#setX` methods. If you use this function, you may not want to include the
 * other `setX` functions that date-fns provides if you are concerned about the bundle size.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The date to be changed
 * @param values - The date values to be set
 *
 * @returns The new date with options set
 *
 * @example
 * // Transform 1 September 2014 into 20 October 2015 in a single line:
 * const result = set(new Date(2014, 8, 20), { year: 2015, month: 9, date: 20 })
 * //=> Tue Oct 20 2015 00:00:00
 *
 * @example
 * // Set 12 PM to 1 September 2014 01:23:45 to 1 September 2014 12:00:00:
 * const result = set(new Date(2014, 8, 1, 1, 23, 45), { hours: 12 })
 * //=> Mon Sep 01 2014 12:23:45
 */

function set(date, values) {
  let _date = (0, _index3.toDate)(date);

  // Check if date is Invalid Date because Date.prototype.setFullYear ignores the value of Invalid Date
  if (isNaN(+_date)) {
    return (0, _index.constructFrom)(date, NaN);
  }

  if (values.year != null) {
    _date.setFullYear(values.year);
  }

  if (values.month != null) {
    _date = (0, _index2.setMonth)(_date, values.month);
  }

  if (values.date != null) {
    _date.setDate(values.date);
  }

  if (values.hours != null) {
    _date.setHours(values.hours);
  }

  if (values.minutes != null) {
    _date.setMinutes(values.minutes);
  }

  if (values.seconds != null) {
    _date.setSeconds(values.seconds);
  }

  if (values.milliseconds != null) {
    _date.setMilliseconds(values.milliseconds);
  }

  return _date;
}


/***/ }),
/* 323 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.setMonth = setMonth;
var _index = __webpack_require__(54);
var _index2 = __webpack_require__(176);
var _index3 = __webpack_require__(53);

/**
 * @name setMonth
 * @category Month Helpers
 * @summary Set the month to the given date.
 *
 * @description
 * Set the month to the given date.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The date to be changed
 * @param month - The month index to set (0-11)
 *
 * @returns The new date with the month set
 *
 * @example
 * // Set February to 1 September 2014:
 * const result = setMonth(new Date(2014, 8, 1), 1)
 * //=> Sat Feb 01 2014 00:00:00
 */
function setMonth(date, month) {
  const _date = (0, _index3.toDate)(date);
  const year = _date.getFullYear();
  const day = _date.getDate();

  const dateWithDesiredMonth = (0, _index.constructFrom)(date, 0);
  dateWithDesiredMonth.setFullYear(year, month, 15);
  dateWithDesiredMonth.setHours(0, 0, 0, 0);
  const daysInMonth = (0, _index2.getDaysInMonth)(dateWithDesiredMonth);
  // Set the last day of the new month
  // if the original date was the last day of the longer month
  _date.setMonth(month, Math.min(day, daysInMonth));
  return _date;
}


/***/ }),
/* 324 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.setDate = setDate;
var _index = __webpack_require__(53);

/**
 * @name setDate
 * @category Day Helpers
 * @summary Set the day of the month to the given date.
 *
 * @description
 * Set the day of the month to the given date.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The date to be changed
 * @param dayOfMonth - The day of the month of the new date
 *
 * @returns The new date with the day of the month set
 *
 * @example
 * // Set the 30th day of the month to 1 September 2014:
 * const result = setDate(new Date(2014, 8, 1), 30)
 * //=> Tue Sep 30 2014 00:00:00
 */
function setDate(date, dayOfMonth) {
  const _date = (0, _index.toDate)(date);
  _date.setDate(dayOfMonth);
  return _date;
}


/***/ }),
/* 325 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.setDayOfYear = setDayOfYear;
var _index = __webpack_require__(53);

/**
 * @name setDayOfYear
 * @category Day Helpers
 * @summary Set the day of the year to the given date.
 *
 * @description
 * Set the day of the year to the given date.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The date to be changed
 * @param dayOfYear - The day of the year of the new date
 *
 * @returns The new date with the day of the year set
 *
 * @example
 * // Set the 2nd day of the year to 2 July 2014:
 * const result = setDayOfYear(new Date(2014, 6, 2), 2)
 * //=> Thu Jan 02 2014 00:00:00
 */
function setDayOfYear(date, dayOfYear) {
  const _date = (0, _index.toDate)(date);
  _date.setMonth(0);
  _date.setDate(dayOfYear);
  return _date;
}


/***/ }),
/* 326 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.setDefaultOptions = setDefaultOptions;

var _index = __webpack_require__(67);

/**
 * @name setDefaultOptions
 * @category Common Helpers
 * @summary Set default options including locale.
 * @pure false
 *
 * @description
 * Sets the defaults for
 * `options.locale`, `options.weekStartsOn` and `options.firstWeekContainsDate`
 * arguments for all functions.
 *
 * @param options - An object with options
 *
 * @example
 * // Set global locale:
 * import { es } from 'date-fns/locale'
 * setDefaultOptions({ locale: es })
 * const result = format(new Date(2014, 8, 2), 'PPPP')
 * //=> 'martes, 2 de septiembre de 2014'
 *
 * @example
 * // Start of the week for 2 September 2014:
 * const result = startOfWeek(new Date(2014, 8, 2))
 * //=> Sun Aug 31 2014 00:00:00
 *
 * @example
 * // Start of the week for 2 September 2014,
 * // when we set that week starts on Monday by default:
 * setDefaultOptions({ weekStartsOn: 1 })
 * const result = startOfWeek(new Date(2014, 8, 2))
 * //=> Mon Sep 01 2014 00:00:00
 *
 * @example
 * // Manually set options take priority over default options:
 * setDefaultOptions({ weekStartsOn: 1 })
 * const result = startOfWeek(new Date(2014, 8, 2), { weekStartsOn: 0 })
 * //=> Sun Aug 31 2014 00:00:00
 *
 * @example
 * // Remove the option by setting it to `undefined`:
 * setDefaultOptions({ weekStartsOn: 1 })
 * setDefaultOptions({ weekStartsOn: undefined })
 * const result = startOfWeek(new Date(2014, 8, 2))
 * //=> Sun Aug 31 2014 00:00:00
 */
function setDefaultOptions(options) {
  const result = {};
  const defaultOptions = (0, _index.getDefaultOptions)();

  for (const property in defaultOptions) {
    if (Object.prototype.hasOwnProperty.call(defaultOptions, property)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- I challange you to fix the type
      result[property] = defaultOptions[property];
    }
  }

  for (const property in options) {
    if (Object.prototype.hasOwnProperty.call(options, property)) {
      if (options[property] === undefined) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- I challange you to fix the type
        delete result[property];
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- I challange you to fix the type
        result[property] = options[property];
      }
    }
  }

  (0, _index.setDefaultOptions)(result);
}


/***/ }),
/* 327 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.setHours = setHours;
var _index = __webpack_require__(53);

/**
 * @name setHours
 * @category Hour Helpers
 * @summary Set the hours to the given date.
 *
 * @description
 * Set the hours to the given date.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The date to be changed
 * @param hours - The hours of the new date
 *
 * @returns The new date with the hours set
 *
 * @example
 * // Set 4 hours to 1 September 2014 11:30:00:
 * const result = setHours(new Date(2014, 8, 1, 11, 30), 4)
 * //=> Mon Sep 01 2014 04:30:00
 */
function setHours(date, hours) {
  const _date = (0, _index.toDate)(date);
  _date.setHours(hours);
  return _date;
}


/***/ }),
/* 328 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.setMilliseconds = setMilliseconds;
var _index = __webpack_require__(53);

/**
 * @name setMilliseconds
 * @category Millisecond Helpers
 * @summary Set the milliseconds to the given date.
 *
 * @description
 * Set the milliseconds to the given date.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The date to be changed
 * @param milliseconds - The milliseconds of the new date
 *
 * @returns The new date with the milliseconds set
 *
 * @example
 * // Set 300 milliseconds to 1 September 2014 11:30:40.500:
 * const result = setMilliseconds(new Date(2014, 8, 1, 11, 30, 40, 500), 300)
 * //=> Mon Sep 01 2014 11:30:40.300
 */
function setMilliseconds(date, milliseconds) {
  const _date = (0, _index.toDate)(date);
  _date.setMilliseconds(milliseconds);
  return _date;
}


/***/ }),
/* 329 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.setMinutes = setMinutes;
var _index = __webpack_require__(53);

/**
 * @name setMinutes
 * @category Minute Helpers
 * @summary Set the minutes to the given date.
 *
 * @description
 * Set the minutes to the given date.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The date to be changed
 * @param minutes - The minutes of the new date
 *
 * @returns The new date with the minutes set
 *
 * @example
 * // Set 45 minutes to 1 September 2014 11:30:40:
 * const result = setMinutes(new Date(2014, 8, 1, 11, 30, 40), 45)
 * //=> Mon Sep 01 2014 11:45:40
 */
function setMinutes(date, minutes) {
  const _date = (0, _index.toDate)(date);
  _date.setMinutes(minutes);
  return _date;
}


/***/ }),
/* 330 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.setQuarter = setQuarter;
var _index = __webpack_require__(323);
var _index2 = __webpack_require__(53);

/**
 * @name setQuarter
 * @category Quarter Helpers
 * @summary Set the year quarter to the given date.
 *
 * @description
 * Set the year quarter to the given date.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The date to be changed
 * @param quarter - The quarter of the new date
 *
 * @returns The new date with the quarter set
 *
 * @example
 * // Set the 2nd quarter to 2 July 2014:
 * const result = setQuarter(new Date(2014, 6, 2), 2)
 * //=> Wed Apr 02 2014 00:00:00
 */
function setQuarter(date, quarter) {
  const _date = (0, _index2.toDate)(date);
  const oldQuarter = Math.trunc(_date.getMonth() / 3) + 1;
  const diff = quarter - oldQuarter;
  return (0, _index.setMonth)(_date, _date.getMonth() + diff * 3);
}


/***/ }),
/* 331 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.setSeconds = setSeconds;
var _index = __webpack_require__(53);

/**
 * @name setSeconds
 * @category Second Helpers
 * @summary Set the seconds to the given date.
 *
 * @description
 * Set the seconds to the given date.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The date to be changed
 * @param seconds - The seconds of the new date
 *
 * @returns The new date with the seconds set
 *
 * @example
 * // Set 45 seconds to 1 September 2014 11:30:40:
 * const result = setSeconds(new Date(2014, 8, 1, 11, 30, 40), 45)
 * //=> Mon Sep 01 2014 11:30:45
 */
function setSeconds(date, seconds) {
  const _date = (0, _index.toDate)(date);
  _date.setSeconds(seconds);
  return _date;
}


/***/ }),
/* 332 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.setWeekYear = setWeekYear;
var _index = __webpack_require__(54);
var _index2 = __webpack_require__(69);
var _index3 = __webpack_require__(156);
var _index4 = __webpack_require__(53);

var _index5 = __webpack_require__(67);

/**
 * The {@link setWeekYear} function options.
 */

/**
 * @name setWeekYear
 * @category Week-Numbering Year Helpers
 * @summary Set the local week-numbering year to the given date.
 *
 * @description
 * Set the local week-numbering year to the given date,
 * saving the week number and the weekday number.
 * The exact calculation depends on the values of
 * `options.weekStartsOn` (which is the index of the first day of the week)
 * and `options.firstWeekContainsDate` (which is the day of January, which is always in
 * the first week of the week-numbering year)
 *
 * Week numbering: https://en.wikipedia.org/wiki/Week#The_ISO_week_date_system
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The date to be changed
 * @param weekYear - The local week-numbering year of the new date
 * @param options - An object with options
 *
 * @returns The new date with the local week-numbering year set
 *
 * @example
 * // Set the local week-numbering year 2004 to 2 January 2010 with default options:
 * const result = setWeekYear(new Date(2010, 0, 2), 2004)
 * //=> Sat Jan 03 2004 00:00:00
 *
 * @example
 * // Set the local week-numbering year 2004 to 2 January 2010,
 * // if Monday is the first day of week
 * // and 4 January is always in the first week of the year:
 * const result = setWeekYear(new Date(2010, 0, 2), 2004, {
 *   weekStartsOn: 1,
 *   firstWeekContainsDate: 4
 * })
 * //=> Sat Jan 01 2005 00:00:00
 */
function setWeekYear(date, weekYear, options) {
  const defaultOptions = (0, _index5.getDefaultOptions)();
  const firstWeekContainsDate =
    options?.firstWeekContainsDate ??
    options?.locale?.options?.firstWeekContainsDate ??
    defaultOptions.firstWeekContainsDate ??
    defaultOptions.locale?.options?.firstWeekContainsDate ??
    1;

  let _date = (0, _index4.toDate)(date);
  const diff = (0, _index2.differenceInCalendarDays)(
    _date,
    (0, _index3.startOfWeekYear)(_date, options),
  );
  const firstWeek = (0, _index.constructFrom)(date, 0);
  firstWeek.setFullYear(weekYear, 0, firstWeekContainsDate);
  firstWeek.setHours(0, 0, 0, 0);
  _date = (0, _index3.startOfWeekYear)(firstWeek, options);
  _date.setDate(_date.getDate() + diff);
  return _date;
}


/***/ }),
/* 333 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.setYear = setYear;
var _index = __webpack_require__(54);
var _index2 = __webpack_require__(53);

/**
 * @name setYear
 * @category Year Helpers
 * @summary Set the year to the given date.
 *
 * @description
 * Set the year to the given date.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The date to be changed
 * @param year - The year of the new date
 *
 * @returns The new date with the year set
 *
 * @example
 * // Set year 2013 to 1 September 2014:
 * const result = setYear(new Date(2014, 8, 1), 2013)
 * //=> Sun Sep 01 2013 00:00:00
 */
function setYear(date, year) {
  const _date = (0, _index2.toDate)(date);

  // Check if date is Invalid Date because Date.prototype.setFullYear ignores the value of Invalid Date
  if (isNaN(+_date)) {
    return (0, _index.constructFrom)(date, NaN);
  }

  _date.setFullYear(year);
  return _date;
}


/***/ }),
/* 334 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.startOfDecade = startOfDecade;
var _index = __webpack_require__(53);

/**
 * @name startOfDecade
 * @category Decade Helpers
 * @summary Return the start of a decade for the given date.
 *
 * @description
 * Return the start of a decade for the given date.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The original date
 *
 * @returns The start of a decade
 *
 * @example
 * // The start of a decade for 21 October 2015 00:00:00:
 * const result = startOfDecade(new Date(2015, 9, 21, 00, 00, 00))
 * //=> Jan 01 2010 00:00:00
 */
function startOfDecade(date) {
  // TODO: Switch to more technical definition in of decades that start with 1
  // end with 0. I.e. 2001-2010 instead of current 2000-2009. It's a breaking
  // change, so it can only be done in 4.0.
  const _date = (0, _index.toDate)(date);
  const year = _date.getFullYear();
  const decade = Math.floor(year / 10) * 10;
  _date.setFullYear(decade, 0, 1);
  _date.setHours(0, 0, 0, 0);
  return _date;
}


/***/ }),
/* 335 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.startOfToday = startOfToday;
var _index = __webpack_require__(70);

/**
 * @name startOfToday
 * @category Day Helpers
 * @summary Return the start of today.
 * @pure false
 *
 * @description
 * Return the start of today.
 *
 * @returns The start of today
 *
 * @example
 * // If today is 6 October 2014:
 * const result = startOfToday()
 * //=> Mon Oct 6 2014 00:00:00
 */
function startOfToday() {
  return (0, _index.startOfDay)(Date.now());
}


/***/ }),
/* 336 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

exports.startOfTomorrow = startOfTomorrow; /**
 * @name startOfTomorrow
 * @category Day Helpers
 * @summary Return the start of tomorrow.
 * @pure false
 *
 * @description
 * Return the start of tomorrow.
 *
 * @returns The start of tomorrow
 *
 * @example
 * // If today is 6 October 2014:
 * const result = startOfTomorrow()
 * //=> Tue Oct 7 2014 00:00:00
 */
function startOfTomorrow() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const day = now.getDate();

  const date = new Date(0);
  date.setFullYear(year, month, day + 1);
  date.setHours(0, 0, 0, 0);
  return date;
}


/***/ }),
/* 337 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

exports.startOfYesterday = startOfYesterday; /**
 * @name startOfYesterday
 * @category Day Helpers
 * @summary Return the start of yesterday.
 * @pure false
 *
 * @description
 * Return the start of yesterday.
 *
 * @returns The start of yesterday
 *
 * @example
 * // If today is 6 October 2014:
 * const result = startOfYesterday()
 * //=> Sun Oct 5 2014 00:00:00
 */
function startOfYesterday() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const day = now.getDate();

  const date = new Date(0);
  date.setFullYear(year, month, day - 1);
  date.setHours(0, 0, 0, 0);
  return date;
}


/***/ }),
/* 338 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.sub = sub;
var _index = __webpack_require__(280);
var _index2 = __webpack_require__(339);

var _index3 = __webpack_require__(54);

/**
 * @name sub
 * @category Common Helpers
 * @summary Subtract the specified years, months, weeks, days, hours, minutes and seconds from the given date.
 *
 * @description
 * Subtract the specified years, months, weeks, days, hours, minutes and seconds from the given date.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The date to be changed
 * @param duration - The object with years, months, weeks, days, hours, minutes and seconds to be subtracted
 *
 * | Key     | Description                        |
 * |---------|------------------------------------|
 * | years   | Amount of years to be subtracted   |
 * | months  | Amount of months to be subtracted  |
 * | weeks   | Amount of weeks to be subtracted   |
 * | days    | Amount of days to be subtracted    |
 * | hours   | Amount of hours to be subtracted   |
 * | minutes | Amount of minutes to be subtracted |
 * | seconds | Amount of seconds to be subtracted |
 *
 * All values default to 0
 *
 * @returns The new date with the seconds subtracted
 *
 * @example
 * // Subtract the following duration from 15 June 2017 15:29:20
 * const result = sub(new Date(2017, 5, 15, 15, 29, 20), {
 *   years: 2,
 *   months: 9,
 *   weeks: 1,
 *   days: 7,
 *   hours: 5,
 *   minutes: 9,
 *   seconds: 30
 * })
 * //=> Mon Sep 1 2014 10:19:50
 */
function sub(date, duration) {
  const {
    years = 0,
    months = 0,
    weeks = 0,
    days = 0,
    hours = 0,
    minutes = 0,
    seconds = 0,
  } = duration;

  // Subtract years and months
  const dateWithoutMonths = (0, _index2.subMonths)(date, months + years * 12);

  // Subtract weeks and days
  const dateWithoutDays = (0, _index.subDays)(
    dateWithoutMonths,
    days + weeks * 7,
  );

  // Subtract hours, minutes and seconds
  const minutestoSub = minutes + hours * 60;
  const secondstoSub = seconds + minutestoSub * 60;
  const mstoSub = secondstoSub * 1000;
  const finalDate = (0, _index3.constructFrom)(
    date,
    dateWithoutDays.getTime() - mstoSub,
  );

  return finalDate;
}


/***/ }),
/* 339 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.subMonths = subMonths;
var _index = __webpack_require__(55);

/**
 * @name subMonths
 * @category Month Helpers
 * @summary Subtract the specified number of months from the given date.
 *
 * @description
 * Subtract the specified number of months from the given date.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The date to be changed
 * @param amount - The amount of months to be subtracted.
 *
 * @returns The new date with the months subtracted
 *
 * @example
 * // Subtract 5 months from 1 February 2015:
 * const result = subMonths(new Date(2015, 1, 1), 5)
 * //=> Mon Sep 01 2014 00:00:00
 */
function subMonths(date, amount) {
  return (0, _index.addMonths)(date, -amount);
}


/***/ }),
/* 340 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.subBusinessDays = subBusinessDays;
var _index = __webpack_require__(56);

/**
 * @name subBusinessDays
 * @category Day Helpers
 * @summary Substract the specified number of business days (mon - fri) to the given date.
 *
 * @description
 * Substract the specified number of business days (mon - fri) to the given date, ignoring weekends.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The date to be changed
 * @param amount - The amount of business days to be subtracted.
 *
 * @returns The new date with the business days subtracted
 *
 * @example
 * // Substract 10 business days from 1 September 2014:
 * const result = subBusinessDays(new Date(2014, 8, 1), 10)
 * //=> Mon Aug 18 2014 00:00:00 (skipped weekend days)
 */
function subBusinessDays(date, amount) {
  return (0, _index.addBusinessDays)(date, -amount);
}


/***/ }),
/* 341 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.subHours = subHours;
var _index = __webpack_require__(60);

/**
 * @name subHours
 * @category Hour Helpers
 * @summary Subtract the specified number of hours from the given date.
 *
 * @description
 * Subtract the specified number of hours from the given date.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The date to be changed
 * @param amount - The amount of hours to be subtracted.
 *
 * @returns The new date with the hours subtracted
 *
 * @example
 * // Subtract 2 hours from 11 July 2014 01:00:00:
 * const result = subHours(new Date(2014, 6, 11, 1, 0), 2)
 * //=> Thu Jul 10 2014 23:00:00
 */
function subHours(date, amount) {
  return (0, _index.addHours)(date, -amount);
}


/***/ }),
/* 342 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.subMilliseconds = subMilliseconds;
var _index = __webpack_require__(61);

/**
 * @name subMilliseconds
 * @category Millisecond Helpers
 * @summary Subtract the specified number of milliseconds from the given date.
 *
 * @description
 * Subtract the specified number of milliseconds from the given date.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The date to be changed
 * @param amount - The amount of milliseconds to be subtracted.
 *
 * @returns The new date with the milliseconds subtracted
 *
 * @example
 * // Subtract 750 milliseconds from 10 July 2014 12:45:30.000:
 * const result = subMilliseconds(new Date(2014, 6, 10, 12, 45, 30, 0), 750)
 * //=> Thu Jul 10 2014 12:45:29.250
 */
function subMilliseconds(date, amount) {
  return (0, _index.addMilliseconds)(date, -amount);
}


/***/ }),
/* 343 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.subMinutes = subMinutes;
var _index = __webpack_require__(73);

/**
 * @name subMinutes
 * @category Minute Helpers
 * @summary Subtract the specified number of minutes from the given date.
 *
 * @description
 * Subtract the specified number of minutes from the given date.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The date to be changed
 * @param amount - The amount of minutes to be subtracted.
 *
 * @returns The new date with the minutes subtracted
 *
 * @example
 * // Subtract 30 minutes from 10 July 2014 12:00:00:
 * const result = subMinutes(new Date(2014, 6, 10, 12, 0), 30)
 * //=> Thu Jul 10 2014 11:30:00
 */
function subMinutes(date, amount) {
  return (0, _index.addMinutes)(date, -amount);
}


/***/ }),
/* 344 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.subQuarters = subQuarters;
var _index = __webpack_require__(74);

/**
 * @name subQuarters
 * @category Quarter Helpers
 * @summary Subtract the specified number of year quarters from the given date.
 *
 * @description
 * Subtract the specified number of year quarters from the given date.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The date to be changed
 * @param amount - The amount of quarters to be subtracted.
 *
 * @returns The new date with the quarters subtracted
 *
 * @example
 * // Subtract 3 quarters from 1 September 2014:
 * const result = subQuarters(new Date(2014, 8, 1), 3)
 * //=> Sun Dec 01 2013 00:00:00
 */
function subQuarters(date, amount) {
  return (0, _index.addQuarters)(date, -amount);
}


/***/ }),
/* 345 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.subSeconds = subSeconds;
var _index = __webpack_require__(75);

/**
 * @name subSeconds
 * @category Second Helpers
 * @summary Subtract the specified number of seconds from the given date.
 *
 * @description
 * Subtract the specified number of seconds from the given date.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The date to be changed
 * @param amount - The amount of seconds to be subtracted.
 *
 * @returns The new date with the seconds subtracted
 *
 * @example
 * // Subtract 30 seconds from 10 July 2014 12:45:00:
 * const result = subSeconds(new Date(2014, 6, 10, 12, 45, 0), 30)
 * //=> Thu Jul 10 2014 12:44:30
 */
function subSeconds(date, amount) {
  return (0, _index.addSeconds)(date, -amount);
}


/***/ }),
/* 346 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.subWeeks = subWeeks;
var _index = __webpack_require__(76);

/**
 * @name subWeeks
 * @category Week Helpers
 * @summary Subtract the specified number of weeks from the given date.
 *
 * @description
 * Subtract the specified number of weeks from the given date.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The date to be changed
 * @param amount - The amount of weeks to be subtracted.
 *
 * @returns The new date with the weeks subtracted
 *
 * @example
 * // Subtract 4 weeks from 1 September 2014:
 * const result = subWeeks(new Date(2014, 8, 1), 4)
 * //=> Mon Aug 04 2014 00:00:00
 */
function subWeeks(date, amount) {
  return (0, _index.addWeeks)(date, -amount);
}


/***/ }),
/* 347 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.subYears = subYears;
var _index = __webpack_require__(77);

/**
 * @name subYears
 * @category Year Helpers
 * @summary Subtract the specified number of years from the given date.
 *
 * @description
 * Subtract the specified number of years from the given date.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The date to be changed
 * @param amount - The amount of years to be subtracted.
 *
 * @returns The new date with the years subtracted
 *
 * @example
 * // Subtract 5 years from 1 September 2014:
 * const result = subYears(new Date(2014, 8, 1), 5)
 * //=> Tue Sep 01 2009 00:00:00
 */
function subYears(date, amount) {
  return (0, _index.addYears)(date, -amount);
}


/***/ }),
/* 348 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.weeksToDays = weeksToDays;
var _index = __webpack_require__(62);

/**
 * @name weeksToDays
 * @category Conversion Helpers
 * @summary Convert weeks to days.
 *
 * @description
 * Convert a number of weeks to a full number of days.
 *
 * @param weeks - The number of weeks to be converted
 *
 * @returns The number of weeks converted in days
 *
 * @example
 * // Convert 2 weeks into days
 * const result = weeksToDays(2)
 * //=> 14
 */
function weeksToDays(weeks) {
  return Math.trunc(weeks * _index.daysInWeek);
}


/***/ }),
/* 349 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.yearsToDays = yearsToDays;
var _index = __webpack_require__(62);

/**
 * @name yearsToDays
 * @category Conversion Helpers
 * @summary Convert years to days.
 *
 * @description
 * Convert a number of years to a full number of days.
 *
 * @param years - The number of years to be converted
 *
 * @returns The number of years converted in days
 *
 * @example
 * // Convert 2 years into days
 * const result = yearsToDays(2)
 * //=> 730
 */
function yearsToDays(years) {
  return Math.trunc(years * _index.daysInYear);
}


/***/ }),
/* 350 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.yearsToMonths = yearsToMonths;
var _index = __webpack_require__(62);

/**
 * @name yearsToMonths
 * @category Conversion Helpers
 * @summary Convert years to months.
 *
 * @description
 * Convert a number of years to a full number of months.
 *
 * @param years - The number of years to be converted
 *
 * @returns The number of years converted in months
 *
 * @example
 * // Convert 2 years into months
 * const result = yearsToMonths(2)
 * //=> 24
 */
function yearsToMonths(years) {
  return Math.trunc(years * _index.monthsInYear);
}


/***/ }),
/* 351 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.yearsToQuarters = yearsToQuarters;
var _index = __webpack_require__(62);

/**
 * @name yearsToQuarters
 * @category Conversion Helpers
 * @summary Convert years to quarters.
 *
 * @description
 * Convert a number of years to a full number of quarters.
 *
 * @param years - The number of years to be converted
 *
 * @returns The number of years converted in quarters
 *
 * @example
 * // Convert 2 years to quarters
 * const result = yearsToQuarters(2)
 * //=> 8
 */
function yearsToQuarters(years) {
  return Math.trunc(years * _index.quartersInYear);
}


/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var cozy_clisk_dist_contentscript__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var _cozy_minilog__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(15);
/* harmony import */ var _cozy_minilog__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_cozy_minilog__WEBPACK_IMPORTED_MODULE_1__);
/* eslint-disable no-console */


const { format } = __webpack_require__(50)
;
const log = _cozy_minilog__WEBPACK_IMPORTED_MODULE_1___default()('ContentScript')
_cozy_minilog__WEBPACK_IMPORTED_MODULE_1___default().enable('cesuCCC')

// Necessary here because they are using this function and the are not supported by the webview
console.groupCollapsed = function () {}
console.groupEnd = function () {}

const baseUrl = 'https://www.cesu.urssaf.fr/'
const loginFormUrl =
  'https://www.cesu.urssaf.fr/decla/index.html?page=page_se_connecter&LANG=FR'
const dashboardUrl =
  'https://www.cesu.urssaf.fr/decla/index.html?page=page_empl_tableau_bord&LANG=FR'

const requestInterceptor = new cozy_clisk_dist_contentscript__WEBPACK_IMPORTED_MODULE_0__.RequestInterceptor([
  {
    identifier: 'authentication',
    method: 'POST',
    url: '/cesuwebdec/authentication',
    serialization: 'json'
  },
  {
    identifier: 'userIdentity',
    method: 'GET',
    url: '/cesuwebdec/employeursIdentite/',
    serialization: 'json'
  },
  {
    identifier: 'declarations',
    method: 'GET',
    url: '/declarationsby?',
    serialization: 'json'
  },
  {
    identifier: 'attestations',
    method: 'GET',
    url: '/attestationsfiscales',
    serialization: 'json'
  },
  {
    identifier: 'prelevements',
    method: 'GET',
    url: '/entetePrelevements',
    serialization: 'json'
  },
  {
    identifier: 'payslips',
    method: 'GET',
    url: '/bulletinSalaires',
    serialization: 'json'
  }
])
requestInterceptor.init()

class CesuContentScript extends cozy_clisk_dist_contentscript__WEBPACK_IMPORTED_MODULE_0__.ContentScript {
  async onWorkerReady() {
    await this.waitForElementNoReload('#connexion')
    this.watchLoginForm.bind(this)()
  }

  onWorkerEvent({ event, payload }) {
    if (event === 'loginSubmit') {
      this.log('info', `User's credential intercepted`)
      const { login, password } = payload
      this.store.userCredentials = { login, password }
    }
    if (event === 'requestResponse') {
      const { identifier } = payload
      this.log('debug', `${identifier} request intercepted`)
      this.store[identifier] = { payload }
      if (identifier === 'authentication') {
        this.store.cesuNum = payload.response.objet.numero
      }
    }
  }

  watchLoginForm() {
    this.log('info', '📍️ watchLoginForm starts')
    const loginField = document.querySelector('#identifiantCompte')
    const passwordField = document.querySelector('#motPasseCompte')
    if (loginField && passwordField) {
      this.log('info', 'Found credentials fields, adding form listener')
      const loginForm = document.querySelector('#connexion')
      loginForm.addEventListener('submit', () => {
        const login = loginField.value
        const password = passwordField.value
        const event = 'loginSubmit'
        const payload = { login, password }
        this.bridge.emit('workerEvent', {
          event,
          payload
        })
      })
    }
  }

  async navigateToLoginForm() {
    this.log('info', '🤖 navigateToLoginForm')
    await this.goto(loginFormUrl)
    await this.waitForElementInWorker('#connexion')
  }

  async navigateToDashboardPage() {
    this.log('info', '🤖 navigateToDashboardPage')
    await this.goto(dashboardUrl)
    // If connected, reaches the user dashBoard, if not leads to the loginForm with an error element saying you need to be connected
    // We're waiting for this element because it mess with the form in a way autoFill is not working properly
    await Promise.race([
      this.waitForElementInWorker('#notification > .alert-danger'),
      this.waitForElementInWorker('#deconnexion_link_mobile')
    ])
  }

  async ensureAuthenticated({ account }) {
    this.bridge.addEventListener('workerEvent', this.onWorkerEvent.bind(this))
    this.log('info', '🤖 ensureAuthenticated')
    const credentials = await this.getCredentials()

    if (!account || !credentials) {
      await this.ensureNotAuthenticated()
      await this.showLoginFormAndWaitForAuthentication()
    } else {
      await this.navigateToDashboardPage()
      const authenticated = await this.runInWorker('checkAuthenticated')
      this.store.isEmployer = authenticated === 'employer'
      if (authenticated) {
        this.log('info', `Already connected as ${authenticated}, continue ...`)
        return true
      } else {
        await this.autoLogin(credentials)
        await this.waitForElementInWorker('#deconnexion_link_mobile')
        const autoAuth = await this.runInWorker('checkAuthenticated')
        this.store.isEmployer = autoAuth === 'employer'
        this.log('info', `autoLogin succeeded as ${autoAuth}`)
      }
    }
    return true
  }

  async autoLogin(credentials) {
    this.log('info', '📍️ autoLogin starts')
    // We need to wait for the hcaptcha to appears otherwise login failed
    await this.waitForElementInWorker('#hrecaptchaId')
    await this.runInWorker('fillText', '#identifiantCompte', credentials.login)
    await this.runInWorker('fillText', '#motPasseCompte', credentials.password)
    await this.runInWorker('click', '#connexion_button')
  }

  async ensureNotAuthenticated() {
    this.log('info', '🤖 ensureNotAuthenticated')
    await this.navigateToLoginForm(loginFormUrl)
    const authenticated = await this.runInWorker('checkAuthenticated')
    if (!authenticated) {
      return true
    }
    await this.runInWorker('click', '#deconnexion_link_mobile')
    await this.waitForElementInWorker('#page_se_connecter_link_i1')
    return true
  }

  async checkAuthenticated() {
    this.log('info', '📍️ checkAuthenticated starts')
    const formElement = document.querySelector('#connexion')
    const logoutButton = document.querySelector('#deconnexion_link_mobile')
    const declaElement = document.querySelector('#page_empl_mes_declarations')
    if (formElement) {
      return false
    } else if (logoutButton && declaElement) {
      this.log('info', 'Auth check succeeded - Employer account')
      return 'employer'
    } else if (logoutButton && !declaElement) {
      this.log('info', 'Auth check succeeded - Probably employee account')
      return 'employee'
    }
    return false
  }

  async showLoginFormAndWaitForAuthentication() {
    this.log('info', 'showLoginFormAndWaitForAuthentication start')
    await this.setWorkerState({ visible: true })
    await this.runInWorker('scrollFormIntoView')
    await this.runInWorkerUntilTrue({
      method: 'waitForAuthenticated'
    })
    await this.setWorkerState({ visible: false })
  }

  async fetch(context) {
    this.log('info', '🤖 fetch')
    if (this.store.userCredentials) {
      await this.saveCredentials(this.store.userCredentials)
    }
    const cesuNum = this.store.cesuNum
    if (this.store.isEmployer) {
      this.log('info', 'Employer account')
      const declarations = await this.getDeclarations(cesuNum)
      await this.saveFiles(declarations, {
        context,
        fileIdAttributes: ['vendorRef'],
        contentType: 'application/pdf',
        qualificationLabel: 'pay_sheet'
      })
      const attestations = await this.getAttestations(cesuNum)
      await this.saveFiles(attestations, {
        context,
        fileIdAttributes: ['cesuNum', 'year'],
        contentType: 'application/pdf',
        qualificationLabel: 'other_tax_document'
      })
      const prelevements = await this.getPrelevements(cesuNum)
      await this.saveFiles(prelevements, {
        context,
        fileIdAttributes: ['vendor', 'vendorRef'],
        contentType: 'application/pdf',
        qualificationLabel: 'tax_notice'
      })
      await this.getIdentity()
    } else {
      this.log('info', 'Employee acount')
      const employeePayslip = await this.getEmployeePayslips(cesuNum)
      await this.saveFiles(employeePayslip, {
        context,
        fileIdAttributes: ['vendorRef'],
        contentType: 'application/pdf',
        qualificationLabel: 'pay_sheet'
      })
      // Regarding the state of the intercepted response for the identity, we assume it will be different for an employee
      // so for now, we're not fetching any identity for this type of account
    }
  }

  async getUserDataFromWebsite() {
    this.log('info', '🤖 getUserDataFromWebsite')
    const credentials = await this.getCredentials()
    const credentialsLogin = credentials?.login
    const storeLogin = this.store?.userCredentials?.login

    // prefer credentials over user email since it may not be know by the user
    let sourceAccountIdentifier = credentialsLogin || storeLogin
    if (!sourceAccountIdentifier) {
      throw new Error('Could not get a sourceAccountIdentifier')
    }
    return {
      sourceAccountIdentifier: sourceAccountIdentifier
    }
  }

  async getDeclarations(cesuNum) {
    this.log('info', '📍️ getDeclarations starts')
    await this.goto(
      'https://www.cesu.urssaf.fr/decla/index.html?page=page_empl_mes_declarations&LANG=FR'
    )
    // sometimes one resolve before the other and vice versa so wait for both of them
    await Promise.all([
      this.waitForElementInWorker('#mesDeclarations'),
      this.waitForRequestInterception('declarations')
    ])
    const declarations = this.store.declarations.payload
    // const cesuNum = declarations.url.match(
    //   /cesuwebdec\/employeurs\/(.*)\/declarationsby/
    // )[1]
    return declarations.response.listeObjets
      .filter(item => item.isTelechargeable === true)
      .map(item => ({
        fileurl: `${baseUrl}cesuwebdec/employeurs/${cesuNum}/editions/bulletinSalairePE?refDoc=${item.referenceDocumentaire}`,
        filename: `${item.salarieDTO.nom}_${item.salarieDTO.prenom}_${format(
          new Date(item.dtDebut),
          'yyyy-MM'
        )}_${item.salaireNet}EUR.pdf`,
        shouldReplaceName: `${item.salarieDTO.nom}_${item.periode}.pdf`,
        amount: parseFloat(item.salaireNet),
        date: new Date(item.dtFin),
        vendorRef: item.referenceDocumentaire,
        employee: `${item.salarieDTO.nom}_${item.salarieDTO.prenom}`,
        fileAttributes: {
          metadata: {
            contentAuthor: 'cesu.urssaf.fr',
            issueDate: new Date(),
            carbonCopy: true
          }
        },
        vendor: 'cesu'
      }))
  }

  async getAttestations(cesuNum) {
    this.log('info', '📍️ getAttestations starts')
    await this.goto(
      'https://www.cesu.urssaf.fr/decla/index.html?page=page_empl_avantage_fiscal&LANG=FR'
    )
    await Promise.all([
      // Selector here is not a mistake, they misspelled it on the website
      this.waitForElementInWorker('#liste_attestions_fiscales'),
      this.waitForRequestInterception('attestations')
    ])
    const attestations = this.store.attestations.payload
    // const cesuNum = attestations.url.match(
    //   /cesuwebdec\/employeurs\/(.*)\/attestationsfiscales/
    // )[1]
    return attestations.response.listeObjets.map(item => ({
      fileurl:
        `${baseUrl}cesuwebdec/employeurs/${cesuNum}/editions/` +
        `attestation_fiscale_annee?periode=${item.periode}`,
      cesuNum,
      year: item.periode,
      filename: `${item.periode}_attestation_fiscale.pdf`,
      fileAttributes: {
        metadata: {
          contentAuthor: 'cesu.urssaf.fr',
          issueDate: new Date(),
          carbonCopy: true
        }
      }
    }))
  }

  async getPrelevements(cesuNum) {
    this.log('info', '📍️ getPrelevements starts')
    await this.goto(
      'https://www.cesu.urssaf.fr/decla/index.html?page=page_empl_mes_prelevements&LANG=FR'
    )
    await Promise.all([
      // Selector here is not a mistake, they misspelled it on the website
      this.waitForElementInWorker('#resultatsAffiches'),
      this.waitForRequestInterception('prelevements')
    ])
    const prelevements = this.store.prelevements.payload
    // const cesuNum = prelevements.url.match(
    //   /cesuwebdec\/employeurs\/(.*)\/entetePrelevements/
    // )[1]

    return prelevements.response.listeObjets
      .filter(item => item.typeOrigine !== 'VS') // avoid future prelevements
      .map(item => ({
        fileurl:
          `${baseUrl}cesuwebdec/employeurs/${cesuNum}/editions/` +
          `avisPrelevement?reference=${item.reference}` +
          `&periode=${item.datePrelevement.substring(
            0,
            4
          )}${item.datePrelevement.substring(5, 7)}` +
          `&type=${item.typeOrigine}`,
        filename: `${item.datePrelevement}_prelevement_${item.montantAcharge}€.pdf`,
        amount: item.montantAcharge,
        date: new Date(`${item.datePrelevement}T11:30:30`),
        vendor: 'cesu',
        vendorRef: item.reference,
        fileAttributes: {
          metadata: {
            contentAuthor: 'cesu.urssaf.fr',
            issueDate: new Date(),
            carbonCopy: true
          }
        }
      }))
  }

  async getEmployeePayslips(cesuNum) {
    this.log('info', '📍️ getEmployeePayslips starts')
    // Keeping this around for when we will have the url and the exact element to wait for
    // await this.goto(
    //   'https://www.cesu.urssaf.fr/decla/index.html?page=page_empl_mes_prelevements&LANG=FR'
    // )
    // await Promise.all([
    //   // Selector here is not a mistake, they misspelled it on the website
    //   this.waitForElementInWorker('#resultatsAffiches'),
    //   this.waitForRequestInterception('payslips')
    // ])
    await this.runInWorker('click', 'a', {
      incldesText: 'Mes bulletins de salaire'
    })
    await Promise.all([
      this.waitForRequestInterception('payslips'),
      // Only thing we can be pretty sure it appears on the next page
      this.waitForElementInWorker('#filAriane')
    ])
    const payslips = this.store.payslips.payload
    return payslips.response.listeObjets
      .filter(item => item.isTelechargeable === true)
      .map(item => ({
        fileurl: `${baseUrl}cesuwebdec/employeurs/${cesuNum}/editions/bulletinSalairePE?refDoc=${item.referenceDocumentaire}`,
        filename: `${item.salarieDTO.nom}_${item.salarieDTO.prenom}_${format(
          new Date(item.dtDebut),
          'yyyy-MM'
        )}_${item.salaireNet}EUR.pdf`,
        shouldReplaceName: `${item.salarieDTO.nom}_${item.periode}.pdf`,
        amount: parseFloat(item.salaireNet),
        date: new Date(item.dtFin),
        vendorRef: item.referenceDocumentaire,
        employee: `${item.salarieDTO.nom}_${item.salarieDTO.prenom}`,
        fileAttributes: {
          metadata: {
            contentAuthor: 'cesu.urssaf.fr',
            issueDate: new Date(),
            carbonCopy: true
          }
        },
        vendor: 'cesu'
      }))
  }

  async getIdentity() {
    this.log('info', '📍️ getIdentity starts')
    const userData = this.store.userIdentity.payload
    // For now we can just found full name, email address and pseudoSiret
    const firstName = userData.response.objet.prenom
    const lastName = userData.response.objet.nom
    // const pseudoSiret : userData.response.objet.pseudoSiret
    const identity = {
      email: [userData.response.objet.email],
      name: {
        firstName,
        lastName,
        fullName: `${firstName} ${lastName}`
      }
    }

    await this.saveIdentity({ identity })
  }

  async scrollFormIntoView() {
    this.log('info', '📍️ scrollFormIntoView starts')
    this.log('info', 'Scrolling to view')
    document.querySelector('.se-connecter.identifiant-pc-cesu').scrollIntoView()
    document.body.classList.add('noscroll')
  }
}

const connector = new CesuContentScript({ requestInterceptor })
connector
  .init({ additionalExposedMethodsNames: ['scrollFormIntoView'] })
  .catch(err => {
    log.warn(err)
  })

})();

/******/ })()
;