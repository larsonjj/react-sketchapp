'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

// Sort z-index values highest to lowest (opposite if `reverse` is true)
var zIndex = function zIndex(nodes) {
  var reverse = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  return nodes.map(function (node, index) {
    return _extends({}, node, {
      oIndex: index // Keep track of original index in array
    });
  }).sort(function (a, b) {
    var aIndex = a.props && a.props.style && a.props.style.zIndex ? a.props.style.zIndex : 0;
    var bIndex = b.props && b.props.style && b.props.style.zIndex ? b.props.style.zIndex : 0;
    return reverse ? aIndex - bIndex : bIndex - aIndex;
  });
};
exports.default = zIndex;