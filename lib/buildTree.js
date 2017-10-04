'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _reactTestRenderer = require('react-test-renderer');

var _reactTestRenderer2 = _interopRequireDefault(_reactTestRenderer);

var _yogaLayout = require('yoga-layout');

var yoga = _interopRequireWildcard(_yogaLayout);

var _Context = require('./utils/Context');

var _Context2 = _interopRequireDefault(_Context);

var _hasAnyDefined = require('./utils/hasAnyDefined');

var _hasAnyDefined2 = _interopRequireDefault(_hasAnyDefined);

var _pick = require('./utils/pick');

var _pick2 = _interopRequireDefault(_pick);

var _computeYogaTree = require('./jsonUtils/computeYogaTree');

var _computeYogaTree2 = _interopRequireDefault(_computeYogaTree);

var _computeTextTree = require('./jsonUtils/computeTextTree');

var _computeTextTree2 = _interopRequireDefault(_computeTextTree);

var _constants = require('./utils/constants');

var _zIndex = require('./utils/zIndex');

var _zIndex2 = _interopRequireDefault(_zIndex);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var reactTreeToFlexTree = function reactTreeToFlexTree(node, yogaNode, context) {
  var textNodes = void 0;
  var textStyle = context.getInheritedStyles();
  var style = node.props && node.props.style ? node.props.style : {};
  var type = node.type || 'text';

  var newChildren = [];

  if (type === 'text') {
    // If current node is a Text node, add text styles to Context to pass down to
    // child nodes.
    if (node.props && node.props.style && (0, _hasAnyDefined2.default)(style, _constants.INHERITABLE_FONT_STYLES)) {
      var inheritableStyles = (0, _pick2.default)(style, _constants.INHERITABLE_FONT_STYLES);
      inheritableStyles.flexDirection = 'row';
      context.addInheritableStyles(inheritableStyles);
      textStyle = _extends({}, context.getInheritedStyles(), inheritableStyles);
    }

    // Compute Text Children
    textNodes = (0, _computeTextTree2.default)(node, context);
  } else if (node.children && node.children.length > 0) {
    // Recursion reverses the render stacking order, this corrects that
    node.children.reverse();

    // Calculates zIndex order
    var children = (0, _zIndex2.default)(node.children, true);

    for (var index = 0; index < children.length; index += 1) {
      var childComponent = children[index];
      var childStyles = childComponent.props && childComponent.props.styles ? childComponent.props.styles : {};

      // Since we reversed the order of children and sorted by zIndex, we need
      // to keep track of a decrementing index using the original index of the
      // TreeNode to get the correct layout.
      // NOTE: position: absolute handles zIndexes outside of flex layout, so we
      // need to use the current child index and not it's original index (from
      // before zIndex sorting).
      var decrementIndex = children.length - 1 - (childStyles.position === 'absolute' ? index : childComponent.oIndex);
      var childNode = yogaNode.getChild(decrementIndex);

      var renderedChildComponent = reactTreeToFlexTree(childComponent, childNode, context.forChildren());
      newChildren.push(renderedChildComponent);
    }
  }

  return {
    type: type,
    style: style,
    textStyle: textStyle,
    layout: {
      left: yogaNode.getComputedLeft(),
      right: yogaNode.getComputedRight(),
      top: yogaNode.getComputedTop(),
      bottom: yogaNode.getComputedBottom(),
      width: yogaNode.getComputedWidth(),
      height: yogaNode.getComputedHeight()
    },
    props: _extends({}, node.props, {
      textNodes: textNodes
    }),
    children: newChildren
  };
};

var buildTree = function buildTree(element) {
  var renderer = _reactTestRenderer2.default.create(element);
  var json = renderer.toJSON();
  var yogaNode = (0, _computeYogaTree2.default)(json, new _Context2.default());
  yogaNode.calculateLayout(yoga.UNDEFINED, yoga.UNDEFINED, yoga.DIRECTION_LTR);
  var tree = reactTreeToFlexTree(json, yogaNode, new _Context2.default());

  return tree;
};

exports.default = buildTree;