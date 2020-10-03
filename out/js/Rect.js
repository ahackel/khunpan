System.registerModule("../../js/Rect.js", [], function(require) {
  "use strict";
  var __moduleName = "../../js/Rect.js";
  var Rect = function Rect(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  };
  ($traceurRuntime.createClass)(Rect, {
    intersects: function(rect) {
      if (rect.x < this.x + this.width && this.x < rect.x + rect.width && rect.y < this.y + this.height)
        return this.y < rect.y + rect.height;
      else
        return false;
    },
    contains: function(rect) {
      if (rect.x >= this.x && rect.x + rect.width <= this.x + this.width && rect.y >= this.y && rect.y + rect.height <= this.y + this.height)
        return true;
      else
        return false;
    }
  }, {});
  var $__default = Rect;
  return {get default() {
      return $__default;
    }};
});
System.get("../../js/Rect.js" + '');
