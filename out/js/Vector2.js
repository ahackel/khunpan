System.registerModule("../../js/Vector2.js", [], function() {
  "use strict";
  var __moduleName = "../../js/Vector2.js";
  var Vector2 = function Vector2(x, y) {
    this.x = x;
    this.y = y;
  };
  var $Vector2 = Vector2;
  ($traceurRuntime.createClass)(Vector2, {
    add: function(v) {
      this.x += v.x;
      this.y += v.y;
      return this;
    },
    sub: function(v) {
      this.x -= v.x;
      this.y -= v.y;
      return this;
    },
    multScalar: function(s) {
      this.x *= s;
      this.y *= s;
      return this;
    }
  }, {
    add: function(a, b) {
      return new $Vector2(a.x + b.x, a.y + b.y);
    },
    sub: function(a, b) {
      return new $Vector2(a.x - b.x, a.y - b.y);
    }
  });
  return {get Vector2() {
      return Vector2;
    }};
});
System.get("../../js/Vector2.js" + '');
