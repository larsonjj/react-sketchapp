'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _hacksForJSONImpl = require('../jsonUtils/hacksForJSONImpl');

// TODO(lmr): do something more sensible here
var FLOAT_MAX = 999999;

var createStringMeasurer = function createStringMeasurer(textNodes) {
  return function () {
    var width = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

    // width would be obj-c NaN and the only way to check for it is by comparing
    // width to itself (because NaN !== NaN)
    // eslint-disable-next-line no-self-compare
    var _width = width !== width ? 0 : width;
    var newHeight = 0;
    var newWidth = _width;

    if (textNodes.length > 0) {
      var fullStr = NSMutableAttributedString.alloc().init();
      textNodes.forEach(function (textNode) {
        var newString = (0, _hacksForJSONImpl.createAttributedString)(textNode);
        fullStr.appendAttributedString(newString);
      });
      var _fullStr$boundingRect = fullStr.boundingRectWithSize_options_context(CGSizeMake(_width, FLOAT_MAX), NSStringDrawingUsesLineFragmentOrigin, null).size,
          measureHeight = _fullStr$boundingRect.height,
          measureWidth = _fullStr$boundingRect.width;

      newHeight = measureHeight;
      newWidth = measureWidth;
    }

    return { width: newWidth, height: newHeight };
  };
};

exports.default = createStringMeasurer;