'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSymbolMasterById = exports.getSymbolMasterByName = exports.makeSymbol = exports.makeSymbolByName = exports.getSymbolId = exports.getExistingSymbols = exports.getSymbolsPage = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _sketchappJsonPlugin = require('sketchapp-json-plugin');

var _stylesheet = require('./stylesheet');

var _stylesheet2 = _interopRequireDefault(_stylesheet);

var _models = require('./jsonUtils/models');

var _ViewStylePropTypes = require('./components/ViewStylePropTypes');

var _ViewStylePropTypes2 = _interopRequireDefault(_ViewStylePropTypes);

var _buildTree = require('./buildTree');

var _buildTree2 = _interopRequireDefault(_buildTree);

var _flexToSketchJSON = require('./flexToSketchJSON');

var _flexToSketchJSON2 = _interopRequireDefault(_flexToSketchJSON);

var _render = require('./render');

var _resets = require('./resets');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var id = 0;
var nextId = function nextId() {
  return ++id;
}; // eslint-disable-line

var displayName = function displayName(Component) {
  return Component.displayName || Component.name || 'UnknownSymbol' + nextId();
};

var mastersNameRegistry = null;
var existingSymbols = null;
var layers = {};

var msListToArray = function msListToArray(pageList) {
  var out = [];
  // eslint-disable-next-line
  for (var i = 0; i < pageList.length; i++) {
    out.push(pageList[i]);
  }
  return out;
};

var getSymbolsPage = exports.getSymbolsPage = function getSymbolsPage() {
  var globalContext = context;
  var pages = globalContext.document.pages();
  var array = msListToArray(pages);
  return array.find(function (p) {
    return String(p.name()) === 'Symbols';
  });
};

var getExistingSymbols = exports.getExistingSymbols = function getExistingSymbols() {
  var globalContext = context;
  if (existingSymbols === null) {
    var symbolsPage = getSymbolsPage();
    if (!symbolsPage) {
      symbolsPage = globalContext.document.addBlankPage();
      symbolsPage.setName('Symbols');
    }

    existingSymbols = msListToArray(symbolsPage.layers()).map(function (x) {
      var symbolJson = JSON.parse((0, _sketchappJsonPlugin.toSJSON)(x));
      layers[symbolJson.symbolID] = x;
      return symbolJson;
    });

    mastersNameRegistry = {};
    existingSymbols.forEach(function (symbolMaster) {
      if (symbolMaster._class !== 'symbolMaster') return;
      if (symbolMaster.name in mastersNameRegistry) return;
      mastersNameRegistry[symbolMaster.name] = symbolMaster;
    });
  }
  return existingSymbols;
};

var getSymbolId = exports.getSymbolId = function getSymbolId(masterName) {
  var symbolId = (0, _models.generateID)();

  existingSymbols.forEach(function (symbolMaster) {
    if (symbolMaster.name === masterName) {
      symbolId = symbolMaster.symbolID;
    }
  });
  return symbolId;
};

var injectSymbols = function injectSymbols() {
  var globalContext = context; // eslint-disable-line
  var pages = globalContext.document.pages();
  var array = msListToArray(pages);

  var symbolsPage = globalContext.document.documentData().symbolsPageOrCreateIfNecessary();

  var left = 0;
  Object.keys(mastersNameRegistry).forEach(function (key) {
    var symbolMaster = mastersNameRegistry[key];
    symbolMaster.frame.y = 0;
    symbolMaster.frame.x = left;
    left += symbolMaster.frame.width + 20;

    var newLayer = (0, _sketchappJsonPlugin.fromSJSONDictionary)(symbolMaster);
    layers[symbolMaster.symbolID] = newLayer;
  });

  // Clear out page layers to prepare for re-render
  (0, _resets.resetPage)(symbolsPage);

  (0, _render.renderLayers)(Object.keys(layers).map(function (k) {
    return layers[k];
  }), symbolsPage);

  var notSymbolsPage = array.find(function (p) {
    return String(p.name()) !== 'Symbols';
  });
  if (!notSymbolsPage) {
    notSymbolsPage = globalContext.document.addBlankPage();
  }
  globalContext.document.setCurrentPage(notSymbolsPage);
};

var makeSymbolByName = exports.makeSymbolByName = function makeSymbolByName(masterName) {
  var _class, _temp;

  return _temp = _class = function (_React$Component) {
    _inherits(_class, _React$Component);

    function _class() {
      _classCallCheck(this, _class);

      return _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).apply(this, arguments));
    }

    _createClass(_class, [{
      key: 'render',
      value: function render() {
        return _react2.default.createElement('symbolinstance', {
          masterName: masterName,
          name: this.props.name || masterName,
          style: _stylesheet2.default.flatten(this.props.style),
          resizingConstraint: this.props.resizingConstraint,
          overrides: this.props.overrides
        });
      }
    }]);

    return _class;
  }(_react2.default.Component), _class.displayName = 'SymbolInstance(' + masterName + ')', _class.propTypes = {
    style: _propTypes2.default.shape(_ViewStylePropTypes2.default),
    name: _propTypes2.default.string,
    overrides: _propTypes2.default.object, // eslint-disable-line
    resizingConstraint: _propTypes2.default.object // eslint-disable-line
  }, _class.masterName = masterName, _temp;
};

var makeSymbol = exports.makeSymbol = function makeSymbol(Component, name) {
  var masterName = name || displayName(Component);

  if (mastersNameRegistry === null) {
    getExistingSymbols();
  }
  var symbolId = getSymbolId(masterName);

  mastersNameRegistry[masterName] = (0, _flexToSketchJSON2.default)((0, _buildTree2.default)(_react2.default.createElement(
    'symbolmaster',
    { symbolID: symbolId, name: masterName },
    _react2.default.createElement(Component, null)
  )));

  var symbol = makeSymbolByName(masterName);
  injectSymbols();
  return symbol;
};

var getSymbolMasterByName = exports.getSymbolMasterByName = function getSymbolMasterByName(name) {
  // eslint-disable-next-line
  if (!mastersNameRegistry.hasOwnProperty(name)) {
    throw new Error('##FIXME## NO MASTER FOR THIS SYMBOL NAME');
  }
  return mastersNameRegistry[name];
};

var getSymbolMasterById = exports.getSymbolMasterById = function getSymbolMasterById(symbolId) {
  var masterName = Object.keys(mastersNameRegistry).find(function (key) {
    return String(mastersNameRegistry[key].symbolID) === symbolId;
  });

  if (typeof masterName === 'undefined') {
    throw new Error('##FIXME## NO MASTER WITH THAT SYMBOL ID');
  }

  return mastersNameRegistry[masterName];
};