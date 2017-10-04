'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sketchVersionIsCompatible = undefined;

var _constants = require('./constants');

// Verify Sketch app version is compatible
// eslint-disable-next-line
var sketchVersionIsCompatible = exports.sketchVersionIsCompatible = function sketchVersionIsCompatible() {
  var sketch = context.api();
  return sketch._metadata.appVersion >= _constants.SKETCH_LOWEST_COMPATIBLE_APP_VERSION;
};