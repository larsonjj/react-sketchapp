'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _constants = require('../utils/constants');

var walkTextTree = function walkTextTree(textTree, context, textNodes) {
  if (typeof textTree !== 'string' && !_constants.VALID_TEXT_CHILDREN_TYPES.includes(textTree.type)) {
    throw new Error('"' + textTree.type + '" is not a valid child for Text components');
  }

  if (typeof textTree === 'string') {
    textNodes.push({
      textStyles: context.getInheritedStyles(),
      content: textTree
    });
  }

  if (textTree.children) {
    if (textTree.props && textTree.props.style) {
      context.addInheritableStyles(textTree.props.style);
    }
    for (var index = 0; index < textTree.children.length; index += 1) {
      var textComponent = textTree.children[index];
      walkTextTree(textComponent, context.forChildren(), textNodes);
    }
  }
};


var computeTextTree = function computeTextTree(node, context) {
  var textNodes = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

  if (node.children) {
    var childContext = context.forChildren();
    for (var index = 0; index < node.children.length; index += 1) {
      var textNode = node.children[index];
      if (typeof textNode === 'string') {
        textNodes.push({
          content: textNode,
          textStyles: childContext.getInheritedStyles()
        });
      } else if (textNode.children && textNode.children.length > 0) {
        walkTextTree(textNode, childContext, textNodes);
      }
    }
  }

  return textNodes;
};

exports.default = computeTextTree;