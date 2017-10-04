'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getStyles = undefined;

var _yogaLayout = require('yoga-layout');

var yoga = _interopRequireWildcard(_yogaLayout);

var _Context = require('../utils/Context');

var _Context2 = _interopRequireDefault(_Context);

var _createStringMeasurer = require('../utils/createStringMeasurer');

var _createStringMeasurer2 = _interopRequireDefault(_createStringMeasurer);

var _hasAnyDefined = require('../utils/hasAnyDefined');

var _hasAnyDefined2 = _interopRequireDefault(_hasAnyDefined);

var _pick = require('../utils/pick');

var _pick2 = _interopRequireDefault(_pick);

var _computeTextTree = require('./computeTextTree');

var _computeTextTree2 = _interopRequireDefault(_computeTextTree);

var _constants = require('../utils/constants');

var _isNullOrUndefined = require('../utils/isNullOrUndefined');

var _isNullOrUndefined2 = _interopRequireDefault(_isNullOrUndefined);

var _symbol = require('../symbol');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

// flatten all styles (including nested) into one object
var getStyles = exports.getStyles = function getStyles(node) {
  var style = node.props.style;

  if (Array.isArray(style)) {
    var flattened = Array.prototype.concat.apply([], style);
    var themeFlattened = Array.prototype.concat.apply([], flattened);
    var objectsOnly = themeFlattened.filter(function (f) {
      return f;
    });
    style = Object.assign.apply(Object, [{}].concat(_toConsumableArray(objectsOnly)));
  }

  return style;
};

var computeYogaNode = function computeYogaNode(node, context) {
  var yogaNode = yoga.Node.create();
  var hasStyle = node.props && node.props.style;
  var style = hasStyle ? getStyles(node) : {};

  // Setup default symbol instance dimensions
  if (node.type === 'symbolinstance') {
    var symbolProps = node.props;

    var _getSymbolMasterByNam = (0, _symbol.getSymbolMasterByName)(symbolProps.masterName),
        frame = _getSymbolMasterByNam.frame;

    yogaNode.setWidth(frame.width);
    yogaNode.setHeight(frame.height);
  }

  if (hasStyle) {
    // http://facebook.github.io/react-native/releases/0.48/docs/layout-props.html

    // Width
    if (!(0, _isNullOrUndefined2.default)(style.width)) {
      yogaNode.setWidth(style.width);
    }

    // Height
    if (!(0, _isNullOrUndefined2.default)(style.height)) {
      yogaNode.setHeight(style.height);
    }

    // Min-Height
    if (!(0, _isNullOrUndefined2.default)(style.minHeight)) {
      yogaNode.setMinHeight(style.minHeight);
    }

    // Min-Width
    if (!(0, _isNullOrUndefined2.default)(style.minWidth)) {
      yogaNode.setMinWidth(style.minWidth);
    }

    // Max-Height
    if (!(0, _isNullOrUndefined2.default)(style.maxHeight)) {
      yogaNode.setMaxHeight(style.maxHeight);
    }

    // Min-Width
    if (!(0, _isNullOrUndefined2.default)(style.maxWidth)) {
      yogaNode.setMaxWidth(style.maxWidth);
    }

    // Margin
    if (!(0, _isNullOrUndefined2.default)(style.marginTop)) {
      yogaNode.setMargin(yoga.EDGE_TOP, style.marginTop);
    }
    if (!(0, _isNullOrUndefined2.default)(style.marginBottom)) {
      yogaNode.setMargin(yoga.EDGE_BOTTOM, style.marginBottom);
    }
    if (!(0, _isNullOrUndefined2.default)(style.marginLeft)) {
      yogaNode.setMargin(yoga.EDGE_LEFT, style.marginLeft);
    }
    if (!(0, _isNullOrUndefined2.default)(style.marginRight)) {
      yogaNode.setMargin(yoga.EDGE_RIGHT, style.marginRight);
    }
    if (!(0, _isNullOrUndefined2.default)(style.marginVertical)) {
      yogaNode.setMargin(yoga.EDGE_VERTICAL, style.marginVertical);
    }
    if (!(0, _isNullOrUndefined2.default)(style.marginHorizontal)) {
      yogaNode.setMargin(yoga.EDGE_HORIZONTAL, style.marginHorizontal);
    }
    if (!(0, _isNullOrUndefined2.default)(style.margin)) {
      yogaNode.setMargin(yoga.EDGE_ALL, style.margin);
    }

    // Padding
    if (!(0, _isNullOrUndefined2.default)(style.paddingTop)) {
      yogaNode.setPadding(yoga.EDGE_TOP, style.paddingTop);
    }
    if (!(0, _isNullOrUndefined2.default)(style.paddingBottom)) {
      yogaNode.setPadding(yoga.EDGE_BOTTOM, style.paddingBottom);
    }
    if (!(0, _isNullOrUndefined2.default)(style.paddingLeft)) {
      yogaNode.setPadding(yoga.EDGE_LEFT, style.paddingLeft);
    }
    if (!(0, _isNullOrUndefined2.default)(style.paddingRight)) {
      yogaNode.setPadding(yoga.EDGE_RIGHT, style.paddingRight);
    }
    if (!(0, _isNullOrUndefined2.default)(style.paddingVertical)) {
      yogaNode.setPadding(yoga.EDGE_VERTICAL, style.paddingVertical);
    }
    if (!(0, _isNullOrUndefined2.default)(style.paddingHorizontal)) {
      yogaNode.setPadding(yoga.EDGE_HORIZONTAL, style.paddingHorizontal);
    }
    if (!(0, _isNullOrUndefined2.default)(style.padding)) {
      yogaNode.setPadding(yoga.EDGE_ALL, style.padding);
    }

    // Border
    if (!(0, _isNullOrUndefined2.default)(style.borderTopWidth)) {
      yogaNode.setBorder(yoga.EDGE_TOP, style.borderTopWidth);
    }
    if (!(0, _isNullOrUndefined2.default)(style.borderBottomWidth)) {
      yogaNode.setBorder(yoga.EDGE_BOTTOM, style.borderBottomWidth);
    }
    if (!(0, _isNullOrUndefined2.default)(style.borderLeftWidth)) {
      yogaNode.setBorder(yoga.EDGE_LEFT, style.borderLeftWidth);
    }
    if (!(0, _isNullOrUndefined2.default)(style.borderRightWidth)) {
      yogaNode.setBorder(yoga.EDGE_RIGHT, style.borderRightWidth);
    }
    if (!(0, _isNullOrUndefined2.default)(style.borderWidth)) {
      yogaNode.setBorder(yoga.EDGE_ALL, style.borderWidth);
    }

    // Flex
    if (!(0, _isNullOrUndefined2.default)(style.flex)) {
      yogaNode.setFlex(style.flex);
    }
    if (!(0, _isNullOrUndefined2.default)(style.flexGrow)) {
      yogaNode.setFlexGrow(style.flexGrow);
    }
    if (!(0, _isNullOrUndefined2.default)(style.flexShrink)) {
      yogaNode.setFlexShrink(style.flexShrink);
    }
    if (!(0, _isNullOrUndefined2.default)(style.flexBasis)) {
      yogaNode.setFlexBasis(style.flexBasis);
    }

    // Position
    if (style.position === 'absolute') {
      yogaNode.setPositionType(yoga.POSITION_TYPE_ABSOLUTE);
    }
    if (style.position === 'relative') {
      yogaNode.setPositionType(yoga.POSITION_TYPE_RELATIVE);
    }

    if (!(0, _isNullOrUndefined2.default)(style.top)) {
      yogaNode.setPosition(yoga.EDGE_TOP, style.top);
    }
    if (!(0, _isNullOrUndefined2.default)(style.left)) {
      yogaNode.setPosition(yoga.EDGE_LEFT, style.left);
    }
    if (!(0, _isNullOrUndefined2.default)(style.right)) {
      yogaNode.setPosition(yoga.EDGE_RIGHT, style.right);
    }
    if (!(0, _isNullOrUndefined2.default)(style.bottom)) {
      yogaNode.setPosition(yoga.EDGE_BOTTOM, style.bottom);
    }

    // Display
    if (style.display) {
      if (style.display === 'flex') {
        yogaNode.setDisplay(yoga.DISPLAY_FLEX);
      }
      if (style.display === 'none') {
        yogaNode.setDisplay(yoga.DISPLAY_NONE);
      }
    }

    // Overflow
    if (style.overflow) {
      if (style.overflow === 'visible') {
        yogaNode.setDisplay(yoga.OVERFLOW_VISIBLE);
      }
      if (style.overflow === 'scroll') {
        yogaNode.setDisplay(yoga.OVERFLOW_SCROLL);
      }
      if (style.overflow === 'hidden') {
        yogaNode.setDisplay(yoga.OVERFLOW_HIDDEN);
      }
    }

    // Flex direction
    if (style.flexDirection) {
      if (style.flexDirection === 'row') {
        yogaNode.setFlexDirection(yoga.FLEX_DIRECTION_ROW);
      }
      if (style.flexDirection === 'column') {
        yogaNode.setFlexDirection(yoga.FLEX_DIRECTION_COLUMN);
      }
      if (style.flexDirection === 'row-reverse') {
        yogaNode.setFlexDirection(yoga.FLEX_DIRECTION_ROW_REVERSE);
      }
      if (style.flexDirection === 'column-reverse') {
        yogaNode.setFlexDirection(yoga.FLEX_DIRECTION_COLUMN_REVERSE);
      }
    }

    // Justify Content
    if (style.justifyContent) {
      if (style.justifyContent === 'flex-start') {
        yogaNode.setJustifyContent(yoga.JUSTIFY_FLEX_START);
      }
      if (style.justifyContent === 'flex-end') {
        yogaNode.setJustifyContent(yoga.JUSTIFY_FLEX_END);
      }
      if (style.justifyContent === 'center') {
        yogaNode.setJustifyContent(yoga.JUSTIFY_CENTER);
      }
      if (style.justifyContent === 'space-between') {
        yogaNode.setJustifyContent(yoga.JUSTIFY_SPACE_BETWEEN);
      }
      if (style.justifyContent === 'space-around') {
        yogaNode.setJustifyContent(yoga.JUSTIFY_SPACE_AROUND);
      }
    }

    // Align Content
    if (style.alignContent) {
      if (style.alignContent === 'flex-start') {
        yogaNode.setAlignContent(yoga.ALIGN_FLEX_START);
      }
      if (style.alignContent === 'flex-end') {
        yogaNode.setAlignContent(yoga.ALIGN_FLEX_END);
      }
      if (style.alignContent === 'center') {
        yogaNode.setAlignContent(yoga.ALIGN_CENTER);
      }
      if (style.alignContent === 'stretch') {
        yogaNode.setAlignContent(yoga.ALIGN_STRETCH);
      }
      if (style.alignContent === 'baseline') {
        yogaNode.setAlignContent(yoga.ALIGN_BASELINE);
      }
      if (style.alignContent === 'space-between') {
        yogaNode.setAlignContent(yoga.ALIGN_SPACE_BETWEEN);
      }
      if (style.alignContent === 'space-around') {
        yogaNode.setAlignContent(yoga.ALIGN_SPACE_AROUND);
      }
      if (style.alignContent === 'auto') {
        yogaNode.setAlignContent(yoga.ALIGN_AUTO);
      }
    }

    // Align Items
    if (style.alignItems) {
      if (style.alignItems === 'flex-start') {
        yogaNode.setAlignItems(yoga.ALIGN_FLEX_START);
      }
      if (style.alignItems === 'flex-end') {
        yogaNode.setAlignItems(yoga.ALIGN_FLEX_END);
      }
      if (style.alignItems === 'center') {
        yogaNode.setAlignItems(yoga.ALIGN_CENTER);
      }
      if (style.alignItems === 'stretch') {
        yogaNode.setAlignItems(yoga.ALIGN_STRETCH);
      }
      if (style.alignItems === 'baseline') {
        yogaNode.setAlignItems(yoga.ALIGN_BASELINE);
      }
    }

    // Align Self
    if (style.alignSelf) {
      if (style.alignSelf === 'flex-start') {
        yogaNode.setAlignSelf(yoga.ALIGN_FLEX_END);
      }
      if (style.alignSelf === 'flex-end') {
        yogaNode.setAlignSelf(yoga.ALIGN_FLEX_END);
      }
      if (style.alignSelf === 'center') {
        yogaNode.setAlignSelf(yoga.ALIGN_CENTER);
      }
      if (style.alignSelf === 'stretch') {
        yogaNode.setAlignSelf(yoga.ALIGN_STRETCH);
      }
      if (style.alignSelf === 'baseline') {
        yogaNode.setAlignSelf(yoga.ALIGN_BASELINE);
      }
    }

    // Flex Wrap
    if (style.flexWrap) {
      if (style.flexWrap === 'nowrap') {
        yogaNode.setFlexWrap(yoga.WRAP_NO_WRAP);
      }
      if (style.flexWrap === 'wrap') {
        yogaNode.setFlexWrap(yoga.WRAP_WRAP);
      }
      if (style.flexWrap === 'wrap-reverse') {
        yogaNode.setFlexWrap(yoga.WRAP_WRAP_REVERSE);
      }
    }
  }

  if (node.type === 'text') {
    // If current node is a Text node, add text styles to Context to pass down to
    // child nodes.
    if (node.props.style && (0, _hasAnyDefined2.default)(style, _constants.INHERITABLE_FONT_STYLES)) {
      var inheritableStyles = (0, _pick2.default)(style, _constants.INHERITABLE_FONT_STYLES);
      context.addInheritableStyles(inheritableStyles);
    }

    // Handle Text Children
    var textNodes = (0, _computeTextTree2.default)(node, context);
    yogaNode.setMeasureFunc((0, _createStringMeasurer2.default)(textNodes));

    return { node: yogaNode, stop: true };
  }

  return { node: yogaNode };
};

exports.default = computeYogaNode;