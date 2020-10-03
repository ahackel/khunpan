System.registerModule("../../js/Board.js", [], function(require) {
  "use strict";
  var __moduleName = "../../js/Board.js";
  var Board = function Board(width, height, blockSize) {
    this.blockSize = blockSize;
    this.blocks = new Set();
    this.element = $('#board');
    this.selectedBlock_ = null;
    this.setSize(width, height);
  };
  ($traceurRuntime.createClass)(Board, {
    setSize: function(width, height) {
      this.width = width;
      this.height = height;
      this.element.width(this.blockSize * width);
      this.element.height(this.blockSize * height);
    },
    get bounds() {
      return new Rect(0, 0, this.width, this.height);
    },
    get selectedBlock() {
      return this.selectedBlock_;
    },
    set selectedBlock(v) {
      if (this.selectedBlock_ != null)
        this.selectedBlock_.selected = false;
      this.selectedBlock_ = v;
      if (v != null)
        v.selected = true;
    },
    clear: function() {
      this.blocks.clear();
      this.element.empty();
    },
    addBlock: function(block) {
      this.blocks.add(block);
      this.element.append(block.element);
    }
  }, {});
  return {get Board() {
      return Board;
    }};
});
System.get("../../js/Board.js" + '');
