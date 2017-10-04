'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _yogaLayout = require('yoga-layout');

var yoga = _interopRequireWildcard(_yogaLayout);

var _computeYogaNode2 = require('./computeYogaNode');

var _computeYogaNode3 = _interopRequireDefault(_computeYogaNode2);

var _Context = require('../utils/Context');

var _Context2 = _interopRequireDefault(_Context);

var _zIndex = require('../utils/zIndex');

var _zIndex2 = _interopRequireDefault(_zIndex);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var walkTree = function walkTree(tree, context) {
  var _computeYogaNode = (0, _computeYogaNode3.default)(tree, context),
      node = _computeYogaNode.node,
      stop = _computeYogaNode.stop;

  if (tree.children && tree.children.length > 0) {
    // Calculates zIndex order
    var children = (0, _zIndex2.default)(tree.children);

    for (var index = 0; index < children.length; index += 1) {
      var childComponent = children[index];
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