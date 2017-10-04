"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});


// Clear out all page layers
var resetPage = exports.resetPage = function resetPage(page) {
  // Can't delete the last page. Remove all layers instead
  var layers = page.children();
  for (var l = 0; l < layers.count(); l += 1) {
    var layer = layers.objectAtIndex(l);
    layer.removeFromParent();
  }
};

// Clear out all document pages and layers
var resetDocument = exports.resetDocument = function resetDocument() {
  // Get Pages and delete them all (Except Symbols Page)
  var pages = context.document.pages();
  for (var index = pages.length - 1; index >= 0; index -= 1) {
    var page = pages[index];
    // Don't delete symbols page
    // NOTE: Must use != instead of !== due to page.name() being a MSBoxedObject
    // eslint-disable-next-line
    if (page.name() != "Symbols") {
      if (pages.length > 1) {
        context.document.documentData().removePageAtIndex(index);
      } else {
        resetPage(pages[index]);
      }
    }
  }
};