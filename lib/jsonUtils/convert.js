'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.JSONToSketch = exports.JSObjectToSketch = exports.SketchToJSObject = exports.SketchToJSON = undefined;

var _constants = require('../utils/constants');

// Converts a Sketch page object into it's JSON equivalent
var SketchToJSON = exports.SketchToJSON = function SketchToJSON(sketchObj) {
  var imm = sketchObj.immutableModelObject();
  return MSJSONDataArchiver.archiveStringWithRootObject_error_(imm, null);
};

// Converts a Sketch page object into it's JS Object equivalent
var SketchToJSObject = exports.SketchToJSObject = function SketchToJSObject(sketchObj) {
  var json = SketchToJSON(sketchObj);
  return JSON.parse(json);
};

// Converts a JS Object tree into it's Sketch page object equivalent
var JSObjectToSketch = exports.JSObjectToSketch = function JSObjectToSketch(jsTree) {
  // prettier-ignore
  var decodedData = MSJSONDictionaryUnarchiver.unarchiveObjectFromDictionary_asVersion_corruptionDetected_error(jsTree, _constants.SKETCH_LOWEST_COMPATIBLE_VERSION, null, null);
  var mutable = decodedData.class().mutableClass();
  return mutable.alloc().initWithImmutableModelObject(decodedData);
};

// Converts a JSON tree into it's Sketch page object equivalent
var JSONToSketch = exports.JSONToSketch = function JSONToSketch(jsonTree) {
  var jsTree = JSON.parse(jsonTree);
  return JSObjectToSketch(jsTree);
};