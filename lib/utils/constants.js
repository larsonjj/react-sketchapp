'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/* eslint-disable import/prefer-default-export */

// out of date in sketch-constants
// https://github.com/turbobabr/sketch-constants/pull/1
var PatternFillType = exports.PatternFillType = {
  Tile: 0,
  Fill: 1,
  Stretch: 2,
  Fit: 3
};

var INHERITABLE_FONT_STYLES = exports.INHERITABLE_FONT_STYLES = ['color', 'fontFamily', 'fontSize', 'fontStyle', 'fontWeight', 'textAlign', 'textDecoration', 'textShadowOffset', 'textShadowRadius', 'textShadowColor', 'textTransform', 'letterSpacing', 'lineHeight', 'writingDirection'];

// Only components that are allowed as children of <Text> components
var VALID_TEXT_CHILDREN_TYPES = exports.VALID_TEXT_CHILDREN_TYPES = ['text'];

// Font displayed if San Francisco fonts are not found
var APPLE_BROKEN_SYSTEM_FONT = exports.APPLE_BROKEN_SYSTEM_FONT = '.AppleSystemUIFont';