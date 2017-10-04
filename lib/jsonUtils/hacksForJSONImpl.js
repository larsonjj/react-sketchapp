'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.makeImageDataFromUrl = exports.TEXT_TRANSFORM = exports.TEXT_DECORATION_LINETHROUGH = exports.TEXT_DECORATION_UNDERLINE = exports.TEXT_ALIGN = undefined;
exports.makeResizeConstraint = makeResizeConstraint;
exports.createAttributedString = createAttributedString;
exports.makeEncodedAttributedString = makeEncodedAttributedString;
exports.makeTextStyle = makeTextStyle;

var _sketchConstants = require('sketch-constants');

var _sketchappJsonPlugin = require('sketchapp-json-plugin');

var _findFont = require('../utils/findFont');

var _findFont2 = _interopRequireDefault(_findFont);

var _models = require('./models');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TEXT_ALIGN = exports.TEXT_ALIGN = {
  auto: _sketchConstants.TextAlignment.Left,
  left: _sketchConstants.TextAlignment.Left,
  right: _sketchConstants.TextAlignment.Right,
  center: _sketchConstants.TextAlignment.Center,
  justify: _sketchConstants.TextAlignment.Justified
};
// We need native macOS fonts and colors for these hacks so import the old utils
var TEXT_DECORATION_UNDERLINE = exports.TEXT_DECORATION_UNDERLINE = {
  none: 0,
  underline: 1,
  double: 9
};

var TEXT_DECORATION_LINETHROUGH = exports.TEXT_DECORATION_LINETHROUGH = {
  none: 0,
  'line-through': 1
};

// this doesn't exist in constants
var TEXT_TRANSFORM = exports.TEXT_TRANSFORM = {
  uppercase: 1,
  lowercase: 2,
  initial: 0,
  inherit: 0,
  none: 0,
  capitalize: 0
};

/*
  RESIZE CONSTRAINT RULES

  Order of properties as map keys:
  1. top
  2. right
  3. bottom
  4: left
  5. fixedHeight
  6. fixedWidth
 */

var RESIZE_CONSTRAINTS = {
  top_left_fixedHeight_fixedWidth: 9,
  top_right_left_fixedHeight: 10,
  top_left_fixedHeight: 11,
  top_right_fixedHeight_fixedWidth: 12,
  top_fixedHeight_fixedWidth: 13,
  top_right_fixedHeight: 14,
  top_fixedHeight: 15,
  top_bottom_left_fixedWidth: 17,
  top_right_bottom_left: 18,
  top_bottom_left: 19,
  top_right_bottom_fixedWidth: 20,
  top_bottom_fixedWidth: 21,
  top_right_bottom: 22,
  top_bottom: 23,
  top_left_fixedWidth: 25,
  top_right_left: 26,
  top_left: 27,
  top_right_fixedWidth: 28,
  top_fixedWidth: 29,
  top_right: 30,
  top: 31,
  bottom_left_fixedHeight_fixedWidth: 33,
  right_bottom_left_fixedHeight: 34,
  bottom_left_fixedHeight: 35,
  right_bottom_fixedHeight_fixedWidth: 36,
  bottom_fixedHeight_fixedWidth: 37,
  right_bottom_fixedHeight: 38,
  bottom_fixedHeight: 39,
  left_fixedHeight_fixedWidth: 41,
  right_left_fixedHeight: 42,
  left_fixedHeight: 43,
  right_fixedHeight_fixedWidth: 44,
  fixedHeight_fixedWidth: 45,
  right_fixedHeight: 46,
  fixedHeight: 47,
  bottom_left_fixedWidth: 49,
  right_bottom_left: 50,
  bottom_left: 51,
  right_bottom_fixedWidth: 52,
  bottom_fixedWidth: 53,
  right_bottom: 54,
  bottom: 55,
  left_fixedWidth: 57,
  right_left: 58,
  left: 59,
  right_fixedWidth: 60,
  fixedWidth: 61,
  right: 62,
  none: 63
};

// NOTE(gold): toSJSON doesn't recursively parse JS objects
// https://github.com/airbnb/react-sketchapp/pull/73#discussion_r108529703
function encodeSketchJSON(sketchObj) {
  var encoded = (0, _sketchappJsonPlugin.toSJSON)(sketchObj);
  return encoded ? JSON.parse(encoded) : {};
}

function makeParagraphStyle(textStyle) {
  var pStyle = NSMutableParagraphStyle.alloc().init();
  if (textStyle.lineHeight !== undefined) {
    pStyle.minimumLineHeight = textStyle.lineHeight;
    pStyle.lineHeightMultiple = 1.0;
    pStyle.maximumLineHeight = textStyle.lineHeight;
  }

  if (textStyle.textAlign) {
    pStyle.alignment = TEXT_ALIGN[textStyle.textAlign];
  }

  return pStyle;
}

var makeImageDataFromUrl = exports.makeImageDataFromUrl = function makeImageDataFromUrl(url) {
  var fetchedData = NSData.dataWithContentsOfURL(NSURL.URLWithString(url));

  if (fetchedData) {
    var firstByte = fetchedData.subdataWithRange(NSMakeRange(0, 1)).description();

    // Check for first byte. Must use non-type-exact matching (!=).
    // 0xFF = JPEG, 0x89 = PNG, 0x47 = GIF, 0x49 = TIFF, 0x4D = TIFF
    if (
    /* eslint-disable eqeqeq */
    firstByte != '<ff>' && firstByte != '<89>' && firstByte != '<47>' && firstByte != '<49>' && firstByte != '<4d>'
    /* eslint-enable eqeqeq */
    ) {
        fetchedData = null;
      }
  }

  var image = void 0;

  if (!fetchedData) {
    var errorUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mM8w8DwHwAEOQHNmnaaOAAAAABJRU5ErkJggg==';
    image = NSImage.alloc().initWithContentsOfURL(NSURL.URLWithString(errorUrl));
  } else {
    image = NSImage.alloc().initWithData(fetchedData);
  }

  if (MSImageData.alloc().initWithImage_convertColorSpace !== undefined) {
    return MSImageData.alloc().initWithImage_convertColorSpace(image, false);
  }
  return MSImageData.alloc().initWithImage(image);
};

function makeResizeConstraint(resizingConstraint) {
  if (resizingConstraint) {
    var constraints = [];
    var top = resizingConstraint.top,
        right = resizingConstraint.right,
        bottom = resizingConstraint.bottom,
        left = resizingConstraint.left,
        fixedHeight = resizingConstraint.fixedHeight,
        fixedWidth = resizingConstraint.fixedWidth;


    if (top) {
      constraints.push('top');
    }
    if (right) {
      constraints.push('right');
    }
    if (bottom) {
      constraints.push('bottom');
    }
    if (left) {
      constraints.push('left');
    }
    if (fixedHeight) {
      constraints.push('fixedHeight');
    }
    if (fixedWidth) {
      constraints.push('fixedWidth');
    }

    if (constraints.length > 0) {
      var constraint = RESIZE_CONSTRAINTS[constraints.join('_')];
      if (!constraint) {
        throw new Error('\n' + JSON.stringify(resizingConstraint, null, 2) + '\nconstraint is not a valid combination.');
      }
      return constraint;
    }
  }

  return RESIZE_CONSTRAINTS.none; // No constraints
}

// This shouldn't need to call into Sketch, but it does currently, which is bad for perf :(
function createStringAttributes(textStyles) {
  var font = (0, _findFont2.default)(textStyles);

  var color = (0, _models.makeColorFromCSS)(textStyles.color || 'black');

  var attribs = {
    MSAttributedStringFontAttribute: font.fontDescriptor(),
    NSFont: font,
    NSParagraphStyle: makeParagraphStyle(textStyles),
    NSColor: NSColor.colorWithDeviceRed_green_blue_alpha(color.red, color.green, color.blue, color.alpha),
    NSUnderline: TEXT_DECORATION_UNDERLINE[textStyles.textDecoration] || 0,
    NSStrikethrough: TEXT_DECORATION_LINETHROUGH[textStyles.textDecoration] || 0
  };

  if (textStyles.letterSpacing !== undefined) {
    attribs.NSKern = textStyles.letterSpacing;
  }

  if (textStyles.textTransform !== undefined) {
    attribs.MSAttributedStringTextTransformAttribute = TEXT_TRANSFORM[textStyles.textTransform] * 1;
  }

  return attribs;
}

function createAttributedString(textNode) {
  var content = textNode.content,
      textStyles = textNode.textStyles;


  var attribs = createStringAttributes(textStyles);

  return NSAttributedString.attributedStringWithString_attributes_(content, attribs);
}

function makeEncodedAttributedString(textNodes) {
  var fullStr = NSMutableAttributedString.alloc().init();

  textNodes.forEach(function (textNode) {
    var newString = createAttributedString(textNode);
    fullStr.appendAttributedString(newString);
  });

  var msAttribStr = MSAttributedString.alloc().initWithAttributedString(fullStr);

  return encodeSketchJSON(msAttribStr);
}

function makeTextStyle(textStyle) {
  var pStyle = makeParagraphStyle(textStyle);

  var font = (0, _findFont2.default)(textStyle);

  var color = (0, _models.makeColorFromCSS)(textStyle.color || 'black');

  var value = {
    _class: 'textStyle',
    encodedAttributes: {
      MSAttributedStringFontAttribute: encodeSketchJSON(font.fontDescriptor()),
      NSFont: font,
      NSColor: encodeSketchJSON(NSColor.colorWithDeviceRed_green_blue_alpha(color.red, color.green, color.blue, color.alpha)),
      NSParagraphStyle: encodeSketchJSON(pStyle),
      NSKern: textStyle.letterSpacing || 0,
      MSAttributedStringTextTransformAttribute: TEXT_TRANSFORM[textStyle.textTransform || 'initial'] * 1
    }
  };

  return {
    _class: 'style',
    sharedObjectID: (0, _models.generateID)(),
    miterLimit: 10,
    startDecorationType: 0,
    endDecorationType: 0,
    textStyle: value
  };
}