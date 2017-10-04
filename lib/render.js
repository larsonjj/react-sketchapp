'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.render = exports.renderLayers = exports.renderToJSON = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _sketchappJsonPlugin = require('sketchapp-json-plugin');

var _buildTree = require('./buildTree');

var _buildTree2 = _interopRequireDefault(_buildTree);

var _flexToSketchJSON = require('./flexToSketchJSON');

var _flexToSketchJSON2 = _interopRequireDefault(_flexToSketchJSON);

var _resets = require('./resets');

var _symbol = require('./symbol');

var _RedBox = require('./components/RedBox');

var _RedBox2 = _interopRequireDefault(_RedBox);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var renderToJSON = exports.renderToJSON = function renderToJSON(element) {
  var tree = (0, _buildTree2.default)(element);
  return (0, _flexToSketchJSON2.default)(tree);
};

var renderLayers = exports.renderLayers = function renderLayers(layers, container) {
  if (container.addLayers === undefined) {
    throw new Error('\n     React SketchApp cannot render into this layer. You may be trying to render into a layer\n     that does not take children. Try rendering into a LayerGroup, Artboard, or Page.\n    ');
  }

  container.addLayers(layers);
  return container;
};

var renderToSketch = function renderToSketch(node, container) {
  var json = (0, _flexToSketchJSON2.default)(node);
  var layer = (0, _sketchappJsonPlugin.fromSJSONDictionary)(json);

  return renderLayers([layer], container);
};

// Crawl tree data to find all <Page> components
var findPageData = function findPageData(current) {
  var depth = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var accumulated = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

  var children = current.children;
  for (var i = 0, len = children.length; i < len; i += 1) {
    var node = children[i];

    if (node.type === 'page') {
      accumulated.push({
        type: 'page',
        name: node.props.name,
        children: node.children
      });
    }

    findPageData(children[i], depth + 1);
  }
  return accumulated;
};

var buildPages = function buildPages(tree, container) {
  var pageData = findPageData(tree);
  var symbolPage = (0, _symbol.getSymbolsPage)();

  if (pageData.length === 0) {
    var _container = container || context.document.currentPage();
    var page = !symbolPage ? _container : context.document.addBlankPage();

    return renderToSketch(tree, page);
  }

  // Keep track of created pages
  // Starts at `1` by default, because there is always one default page per document
  var pageTotal = symbolPage ? 2 : 1;
  // Keep track of existing and created pages to pass back to function caller
  var pages = [];

  pageData.forEach(function (data) {
    // Get Current Page
    var page = context.document.currentPage();

    if (pageTotal > 1) {
      // Create new page
      page = context.document.addBlankPage();
    } else {
      pageTotal += 1;
    }

    if (data.name) {
      // Name new page
      page.setName(data.name);
    }

    if (data.children && data.children.length > 0) {
      // Clear out page layers to prepare for re-render
      (0, _resets.resetPage)(page);
      data.children.forEach(function (child) {
        renderToSketch(child, page);
      });
    }

    pages.push(page);
  });

  return pages;
};

var render = exports.render = function render(element, container) {
  if ((0, _sketchappJsonPlugin.appVersionSupported)()) {
    try {
      // Clear out document to prepare for re-render
      (0, _resets.resetDocument)();

      // Build out sketch compatible tree representation
      var tree = (0, _buildTree2.default)(element);

      // Traverse tree to create pages and render their children.
      return buildPages(tree, container);
    } catch (err) {
      var _tree = (0, _buildTree2.default)(_react2.default.createElement(_RedBox2.default, { error: err }));
      return renderToSketch(_tree, context.document.currentPage());
    }
  }
  return null;
};