"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

// Clear out sketch document, so we have a clean slate to re-render
exports.default = function (context) {
  // Get Document
  var document = context.document;

  // Get Pages and delete them all
  var pages = context.document.pages();
  for (var index = pages.length - 1; index >= 0; index -= 1) {
    if (pages.length > 1) {
      document.documentData().removePageAtIndex(index);
    } else {
      // Can't delete the last page. Remove all layers instead
      var layers = pages[index].children();
      for (var l = 0; l < layers.count(); l += 1) {
        var layer = layers.objectAtIndex(l);
        layer.removeFromParent();
      }
    }
  }
};