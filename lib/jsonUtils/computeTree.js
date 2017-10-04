'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _yogaLayout = require('yoga-layout');

var yoga = _interopRequireWildcard(_yogaLayout);

var _computeNode2 = require('./computeNode');

var _computeNode3 = _interopRequireDefault(_computeNode2);

var _Context = require('../utils/Context');

var _Context2 = _interopRequireDefault(_Context);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var walkTree = function walkTree(tree, context) {
  var _computeNode = (0, _computeNode3.default)(tree, context),
      node = _computeNode.node,
      stop = _computeNode.stop;

  if (tree.children) {
    for (var index = 0; index < tree.children.length; index += 1) {
      var childComponent = tree.children[index];
      // Avoid going into <text> node's children
      if (!stop) {
        var childNode = walkTree(childComponent, context.forChildren());
        node.insertChild(childNode, index);
      }
    }
  }

  return node;
};

var treeToNodes = function treeToNodes(root, context) {
  return walkTree(root, context);
};

exports.default = treeToNodes;