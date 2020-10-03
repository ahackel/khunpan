System.registerModule("../../js/Block.js", [], function(require) {
  "use strict";
  var __moduleName = "../../js/Block.js";
  var Block = function Block(game, x, y, width, height, className) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.className = className;
    this.selected_ = false;
    this.element = $('<div/>').addClass('block').addClass(this.className).css('left', this.x * this.game.board.blockSize).css('top', this.y * this.game.board.blockSize).data('element_', this).click(this, function(e) {
      e.data.click(e);
    }).mousedown(this, function(e) {
      e.data.mouseDown(e);
    }).mouseup(this, function(e) {
      e.data.mouseUp(e);
    }).mousemove(this, function(e) {
      e.data.mouseMove(e);
    });
  };
  ($traceurRuntime.createClass)(Block, {
    get selected() {
      return this.selected_;
    },
    set selected(v) {
      this.selected_ = v;
      this.element.toggleClass('selected', v);
    },
    get bounds() {
      return new Rect(this.x, this.y, this.width, this.height);
    },
    mouseDown: function(e) {
      if (this.game.editMode)
        this.game.board.selectedBlock = this;
    },
    mouseUp: function(e) {
      if (this.game.editMode) {
        var x = e.clientX / this.game.board.blockSize - this.width / 2;
        var y = e.clientY / this.game.board.blockSize - this.height / 2;
        if (this.moveTo(Math.round(x), Math.round(y)) == false) {
          this.element.css('left', this.x * this.game.board.blockSize);
          this.element.css('top', this.y * this.game.board.blockSize);
        }
        this.game.board.selectedBlock = null;
      }
    },
    mouseMove: function(e) {
      if (this.selected) {
        var x = e.clientX / this.game.board.blockSize - this.width / 2;
        var y = e.clientY / this.game.board.blockSize - this.height / 2;
        this.element.css('left', x * this.game.board.blockSize);
        this.element.css('top', y * this.game.board.blockSize);
      }
    },
    click: function(e) {
      if (this.game.editMode)
        return;
      var dx = e.clientX / this.game.board.blockSize - this.x - this.width / 2;
      var dy = e.clientY / this.game.board.blockSize - this.y - this.height / 2;
      if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 0)
          this.moveBy(1, 0);
        else
          this.moveBy(-1, 0);
      } else {
        if (dy > 0)
          this.moveBy(0, 1);
        else
          this.moveBy(0, -1);
      }
    },
    canMoveTo: function(x, y) {
      var newBounds = new Rect(x, y, this.width, this.height);
      if (!this.game.board.bounds.contains(newBounds))
        return false;
      for (var $__1 = this.game.board.blocks[$traceurRuntime.toProperty($traceurRuntime.toProperty(Symbol.iterator))](),
          $__2; !($__2 = $__1.next()).done; ) {
        var block = $__2.value;
        {
          if (block == this)
            continue;
          if (newBounds.intersects(block.bounds))
            return false;
        }
      }
      return true;
    },
    moveTo: function(x, y) {
      if (this.canMoveTo(x, y)) {
        this.x = x;
        this.y = y;
        this.element.css('left', x * this.game.board.blockSize);
        this.element.css('top', y * this.game.board.blockSize);
        this.game.numMoves++;
        console.log('Moves:', this.game.numMoves);
        return true;
      } else
        return false;
    },
    moveBy: function(dx, dy) {
      return this.moveTo(this.x + dx, this.y + dy);
    },
    rotate: function() {
      if (this.className == 'block2x1') {
        this.element.removeClass(this.className);
        this.className = 'block1x2';
        this.element.addClass(this.className);
        this.width = 1;
        this.height = 2;
      } else if (this.className == 'block1x2') {
        this.element.removeClass(this.className);
        this.className = 'block2x1';
        this.element.addClass(this.className);
        this.width = 2;
        this.height = 1;
      }
    }
  }, {});
  return {get Block() {
      return Block;
    }};
});
System.get("../../js/Block.js" + '');
