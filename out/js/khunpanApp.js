System.registerModule("../../js/Vector2", [], function() {
  "use strict";
  var __moduleName = "../../js/Vector2";
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
    },
    negate: function() {
      this.x *= -1;
      this.y *= -1;
      return this;
    },
    dot: function(v) {
      return this.x * v.x + this.y * v.y;
    },
    lengthSq: function() {
      return this.x * this.x + this.y * this.y;
    },
    length: function() {
      return Math.sqrt(this.lengthSq());
    },
    equals: function(v) {
      return ((v.x === this.x) && (v.y === this.y));
    }
  }, {
    copy: function(v) {
      return new $Vector2(v.x, v.y);
    },
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
System.registerModule("../../js/Rect", [], function() {
  "use strict";
  var __moduleName = "../../js/Rect";
  var Vector2 = System.get("../../js/Vector2").Vector2;
  var Rect = function Rect(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  };
  ($traceurRuntime.createClass)(Rect, {
    offset: function(delta) {
      this.x += delta.x;
      this.y += delta.y;
      return this;
    },
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
  return {get Rect() {
      return Rect;
    }};
});
System.registerModule("../../js/Block", [], function() {
  "use strict";
  var __moduleName = "../../js/Block";
  var Vector2 = System.get("../../js/Vector2").Vector2;
  var Rect = System.get("../../js/Rect").Rect;
  var Block = function Block(x, y, width, height, color) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.className = ['red', 'yellow', 'blue', 'green'][this.color];
    this.element = $('<div/>').addClass('block').addClass(this.className).css('left', this.x + "em").css('top', this.y + "em").css('width', this.width + "em").css('height', this.height + "em");
  };
  ($traceurRuntime.createClass)(Block, {
    get pos() {
      return new Vector2(this.x, this.y);
    },
    get bounds() {
      return new Rect(this.x, this.y, this.width, this.height);
    },
    moveTo: function(x, y) {
      this.x = x;
      this.y = y;
      this.element.css('left', this.x + "em");
      this.element.css('top', this.y + "em");
    },
    moveBy: function(v) {
      this.moveTo(this.x + v.x, this.y + v.y);
    }
  }, {});
  return {get Block() {
      return Block;
    }};
});
System.registerModule("../../js/Board", [], function() {
  "use strict";
  var __moduleName = "../../js/Board";
  var Vector2 = System.get("../../js/Vector2").Vector2;
  var Rect = System.get("../../js/Rect").Rect;
  "use strict";
  var Board = function Board(width, height, blockSize) {
    this.blockSize = blockSize;
    this.blocks = [];
    this.element = $('#board');
    this.setSize(width, height);
  };
  ($traceurRuntime.createClass)(Board, {
    setSize: function(width, height) {
      this.width = width;
      this.height = height;
      this.element.width(width + "em");
      this.element.height(height + "em");
    },
    get bounds() {
      return new Rect(0, 0, this.width, this.height);
    },
    clear: function() {
      this.blocks = [];
      this.element.empty();
    },
    addBlock: function(block) {
      this.blocks.push(block);
      this.element.append(block.element);
    },
    getBlockAt: function(pos) {
      var r = new Rect(pos.x, pos.y, 1, 1);
      for (var i = 0; i < this.blocks.length; i++) {
        var block = this.blocks[i];
        if (block.bounds.contains(r))
          return block;
      }
      return null;
    },
    getBlocksWithin: function(rect, ignoreBlock) {
      var blocks = [];
      for (var i = 0; i < this.blocks.length; i++) {
        var block = this.blocks[i];
        if (ignoreBlock && block == ignoreBlock)
          continue;
        if (block.bounds.intersects(rect))
          blocks.push(block);
      }
      return blocks;
    },
    canMoveBlock: function(block, dir) {
      var targetArea = block.bounds.offset(dir);
      if (!this.bounds.contains(targetArea))
        return false;
      var collidingBlocks = this.getBlocksWithin(targetArea, block);
      for (var $__3 = collidingBlocks[$traceurRuntime.toProperty(Symbol.iterator)](),
          $__4 = void 0; !($__4 = $__3.next()).done; ) {
        var b = $__4.value;
        if (this.canMoveBlock(b, dir) == false)
          return false;
      }
      return true;
    }
  }, {});
  return {get Board() {
      return Board;
    }};
});
System.registerModule("../../js/KhunpanGame", [], function() {
  "use strict";
  var __moduleName = "../../js/KhunpanGame";
  var Vector2 = System.get("../../js/Vector2").Vector2;
  var Rect = System.get("../../js/Rect").Rect;
  var Block = System.get("../../js/Block").Block;
  var Board = System.get("../../js/Board").Board;
  "use strict";
  var RED = 0;
  var YELLOW = 1;
  var BLUE = 2;
  var GREEN = 3;
  var WIDTH = 4;
  var HEIGHT = 5;
  var COLOR_NAMES = ['red', 'yellow', 'blue', 'green'];
  var SQUARE_EMPTY = 0;
  var SQUARE_SINGLE = 1;
  var SQUARE_TWOTOP = 2;
  var SQUARE_TWOBOTTOM = 3;
  var SQUARE_TWOLEFT = 4;
  var SQUARE_TWORIGHT = 5;
  var SQUARE_FOURTOPLEFT = 6;
  var SQUARE_FOURTOPRIGHT = 7;
  var SQUARE_FOURBOTTOMLEFT = 8;
  var SQUARE_FOURBOTTOMRIGHT = 9;
  var WHOLE_SQUARES = [null, [{
    x: 0,
    y: 0
  }], [{
    x: 0,
    y: 0
  }, {
    x: 0,
    y: 1
  }], null, [{
    x: 0,
    y: 0
  }, {
    x: 1,
    y: 0
  }], null, [{
    x: 0,
    y: 0
  }, {
    x: 1,
    y: 0
  }, {
    x: 0,
    y: 1
  }, {
    x: 1,
    y: 1
  }], null, null, null];
  var SQUARE_WIDTHS = [0, 1, 1, 0, 2, 0, 2, 0, 0, 0];
  var SQUARE_HEIGHTS = [0, 1, 2, 0, 1, 0, 2, 0, 0, 0];
  var LEVEL1 = [SQUARE_TWOTOP, SQUARE_TWOTOP, SQUARE_TWOTOP, SQUARE_TWOTOP, SQUARE_TWOBOTTOM, SQUARE_TWOBOTTOM, SQUARE_TWOBOTTOM, SQUARE_TWOBOTTOM, SQUARE_EMPTY, SQUARE_FOURTOPLEFT, SQUARE_FOURTOPRIGHT, SQUARE_EMPTY, SQUARE_SINGLE, SQUARE_FOURBOTTOMLEFT, SQUARE_FOURBOTTOMRIGHT, SQUARE_SINGLE, SQUARE_SINGLE, SQUARE_TWOLEFT, SQUARE_TWORIGHT, SQUARE_SINGLE];
  var LEVEL2 = [SQUARE_TWOTOP, SQUARE_FOURTOPLEFT, SQUARE_FOURTOPRIGHT, SQUARE_TWOTOP, SQUARE_TWOBOTTOM, SQUARE_FOURBOTTOMLEFT, SQUARE_FOURBOTTOMRIGHT, SQUARE_TWOBOTTOM, SQUARE_TWOTOP, SQUARE_TWOLEFT, SQUARE_TWORIGHT, SQUARE_TWOTOP, SQUARE_TWOBOTTOM, SQUARE_SINGLE, SQUARE_SINGLE, SQUARE_TWOBOTTOM, SQUARE_SINGLE, SQUARE_EMPTY, SQUARE_EMPTY, SQUARE_SINGLE];
  var LEVEL3 = [SQUARE_TWOTOP, SQUARE_FOURTOPLEFT, SQUARE_FOURTOPRIGHT, SQUARE_TWOTOP, SQUARE_TWOBOTTOM, SQUARE_FOURBOTTOMLEFT, SQUARE_FOURBOTTOMRIGHT, SQUARE_TWOBOTTOM, SQUARE_EMPTY, SQUARE_TWOLEFT, SQUARE_TWORIGHT, SQUARE_EMPTY, SQUARE_TWOLEFT, SQUARE_TWORIGHT, SQUARE_TWOLEFT, SQUARE_TWORIGHT, SQUARE_SINGLE, SQUARE_SINGLE, SQUARE_SINGLE, SQUARE_SINGLE];
  var DIRECTIONS = [{
    x: 1,
    y: 0
  }, {
    x: 0,
    y: 1
  }, {
    x: -1,
    y: 0
  }, {
    x: 0,
    y: -1
  }];
  function clamp(v, min, max) {
    return Math.min(Math.max(v, min), max);
  }
  function indexFromPos(pos) {
    return pos.x + pos.y * WIDTH;
  }
  var KhunpanState = function KhunpanState(level) {
    this.position = new Int8Array(level || 20);
    this.startPosition = this.position;
    this.numMoves = 0;
    this.maxMoves = 0;
    this.moves = [{position: this.position}];
    this.isSolved = false;
  };
  ($traceurRuntime.createClass)(KhunpanState, {
    doMove: function(move) {
      if (move == null)
        return false;
      var newPosition = this._move(this.position, move.pos, move.dir);
      if (newPosition) {
        move.position = newPosition;
        this.moves.length = this.numMoves + 1;
        this.moves.push(move);
        this.position = newPosition;
        this.numMoves++;
        this.isSolved = this.isWinningPosition(this.position);
        return true;
      } else
        return false;
    },
    undo: function() {
      if (this.numMoves > 0) {
        var move = this.moves[this.numMoves];
        this.position = this.moves[this.numMoves - 1].position;
        this.numMoves--;
        this.isSolved = this.isWinningPosition(this.position);
        var revMove = {
          position: this.position,
          pos: move.pos,
          dir: move.dir
        };
        revMove.pos = Vector2.add(move.pos, move.dir);
        revMove.dir = Vector2.copy(move.dir);
        revMove.dir.multScalar(-1);
        return revMove;
      }
      return null;
    },
    redo: function() {
      if (this.moves.length > this.numMoves + 1) {
        this.numMoves++;
        var move = this.moves[this.numMoves];
        this.position = move.position;
        this.isSolved = this.isWinningPosition(this.position);
        return move;
      }
      return null;
    },
    printPosition: function(position) {
      var s = '';
      var i = 0;
      for (var $__5 = position[$traceurRuntime.toProperty(Symbol.iterator)](),
          $__6 = void 0; !($__6 = $__5.next()).done; ) {
        var p = $__6.value;
        {
          s += p;
          if (i % WIDTH == WIDTH - 1)
            s += "\n ";
          i++;
        }
      }
      console.log(s);
    },
    isWinningPosition: function(position) {
      return position[indexFromPos({
        x: 1,
        y: 3
      })] == SQUARE_FOURTOPLEFT;
    },
    _move: function(position, pos, dir) {
      var square = position[indexFromPos(pos)];
      if (square == null)
        return null;
      var wholeSquare = WHOLE_SQUARES[square];
      if (wholeSquare == null)
        return null;
      var targetPos = Vector2.add(pos, dir);
      var newPosition = new Int8Array(position);
      for (var $__5 = wholeSquare[$traceurRuntime.toProperty(Symbol.iterator)](),
          $__6 = void 0; !($__6 = $__5.next()).done; ) {
        var w = $__6.value;
        {
          newPosition[indexFromPos(Vector2.add(pos, w))] = SQUARE_EMPTY;
        }
      }
      for (var $__7 = wholeSquare[$traceurRuntime.toProperty(Symbol.iterator)](),
          $__8 = void 0; !($__8 = $__7.next()).done; ) {
        var w$__9 = $__8.value;
        {
          var s = position[indexFromPos(Vector2.add(pos, w$__9))];
          newPosition[indexFromPos(Vector2.add(targetPos, w$__9))] = s;
        }
      }
      return newPosition;
    },
    solve: function(update, success, fail, maxMoves) {
      this.worker = new Worker('solver.js');
      this.worker.postMessage({
        position: this.position,
        maxMoves: maxMoves || 200
      });
      this.solveFailed = fail;
      this.worker.onmessage = $.proxy(function(e) {
        if (e.data.msg == 'update') {
          if (update)
            update(e.data.numMoves);
        }
        if (e.data.msg == 'failed') {
          this.worker.terminate();
          this.worker = null;
          if (fail)
            fail(e.data.numMoves);
        }
        if (e.data.msg == 'solved') {
          this.worker.terminate();
          this.worker = null;
          var move = e.data.move;
          if (move != null) {
            var newMoves = [];
            while (move.dir != null) {
              newMoves.unshift({
                pos: move.pos,
                dir: move.dir,
                position: move.position
              });
              move = move.parent;
            }
            this.moves.length = this.numMoves + 1;
            this.moves = this.moves.concat(newMoves);
            if (success)
              success();
          }
        }
      }, this);
    },
    stopSolving: function() {
      if (this.worker != null) {
        this.worker.terminate();
        this.worker = null;
        if (this.solveFailed)
          this.solveFailed();
        this.solveFailed = null;
      }
    }
  }, {});
  var KhunpanGame = function KhunpanGame(blockSize) {
    this.board = new Board(WIDTH, HEIGHT, blockSize);
    this.isPlaying = false;
    $(document).keydown($.proxy(this.keyDown, this));
    if ('ontouchstart' in window) {
      this.board.element.on('touchmove', $.proxy(this.mouseMove, this));
      this.board.element.on('touchstart', $.proxy(this.mouseDown, this));
      this.board.element.on('touchend touchcancel', $.proxy(this.mouseUp, this));
    } else {
      this.board.element.on('mousemove', $.proxy(this.mouseMove, this));
      this.board.element.on('mousedown', $.proxy(this.mouseDown, this));
      this.board.element.on('mouseup', $.proxy(this.mouseUp, this));
    }
    $('#btn-undo').click($.proxy(this.undo, this));
    $('#btn-redo').click($.proxy(this.redo, this));
    $('#btn-replay').click($.proxy(this.replay, this));
    $('#btn-reset').click($.proxy(this.reset, this));
    $('#btn-solve').click($.proxy(this.solve, this));
    $('#btn-menu').click($.proxy(this.menu, this));
    $('#level1').click($.proxy(this.level1, this));
    $('#level2').click($.proxy(this.level2, this));
    $('#level3').click($.proxy(this.level3, this));
    $('#solving').click($.proxy(this.stopSolving, this));
    this.menu();
  };
  ($traceurRuntime.createClass)(KhunpanGame, {
    updateUI: function() {
      $('.moves').text(this.state.numMoves + ' | ' + this.state.maxMoves);
      var solved = this.state.isSolved;
      if (solved) {
        setTimeout($.proxy(function() {
          this.board.element.addClass('solved');
        }, this), 500);
      } else {
        this.board.element.removeClass('solved');
      }
      $('#btn-undo, #btn-reset').toggleClass('disabled', this.state.numMoves == 0);
      $('#btn-redo').toggleClass('disabled', this.state.numMoves == this.state.moves.length - 1);
      $('#btn-solve').toggleClass('disabled', this.state.isSolved);
    },
    keyDown: function(e) {
      switch (e.which) {
        case 27:
          this.menu();
          break;
        case 37:
          this.undo();
          break;
        case 39:
          this.redo();
          break;
        case 83:
          this.solve();
          break;
        case 32:
          this.replay();
          break;
      }
    },
    undo: function() {
      var revMove = this.state.undo();
      if (revMove) {
        var block = this.board.getBlockAt(revMove.pos);
        block.moveBy(revMove.dir);
        this.updateUI();
        return true;
      }
      return false;
    },
    redo: function() {
      var move = this.state.redo();
      if (move) {
        var block = this.board.getBlockAt(move.pos);
        block.moveBy(move.dir);
        this.updateUI();
        return true;
      }
      return false;
    },
    replay: function() {
      this.isPlaying = !this.isPlaying;
    },
    solve: function() {
      if (this.state.isSolved)
        return ;
      $('#solving').fadeIn();
      this.state.solve($.proxy(function(numMoves) {
        $('#solving-text').text('Solving...');
        $('#Moves').text(numMoves);
      }, this), $.proxy(function() {
        $('#solving').fadeOut();
        console.log('Solved');
        this.isPlaying = true;
      }, this), $.proxy(function() {
        $('#solving-text').text('Could not be solved.');
        $('solving').delay(1000).fadeOut();
        console.log('Could not solve.');
      }, this), 200);
    },
    stopSolving: function() {
      this.state.stopSolving();
    },
    startGame: function(level) {
      this.state = new KhunpanState(level);
      $('#menu').fadeOut();
      $('#button-bar').fadeIn();
      this.updateUI();
      this.board.clear();
      for (var y = 0; y < 5; y++) {
        for (var x = 0; x < 4; x++) {
          var square = this.state.position[indexFromPos({
            x: x,
            y: y
          })];
          switch (square) {
            case SQUARE_SINGLE:
              this.board.addBlock(new Block(x, y, 1, 1, BLUE));
              break;
            case SQUARE_TWOTOP:
              this.board.addBlock(new Block(x, y, 1, 2, RED));
              break;
            case SQUARE_TWOLEFT:
              this.board.addBlock(new Block(x, y, 2, 1, RED));
              break;
            case SQUARE_FOURTOPLEFT:
              this.board.addBlock(new Block(x, y, 2, 2, YELLOW));
              break;
          }
        }
      }
      this.startTimer();
    },
    level1: function() {
      this.levelRandom(10, 20);
    },
    level2: function() {
      this.levelRandom(40, 60);
    },
    level3: function() {
      this.levelRandom(100, 200);
    },
    levelRandom: function(min, max) {
      function generateLevel() {
        var level = new Int8Array(WIDTH * HEIGHT);
        function randomIndex(w, h) {
          return Math.floor(Math.random() * w) + Math.floor(Math.random() * h) * WIDTH;
        }
        function addBlockFour() {
          while (true) {
            var i = randomIndex(3, 4);
            if (i == 1 + 3 * WIDTH)
              continue;
            level[i] = SQUARE_FOURTOPLEFT;
            level[i + 1] = SQUARE_FOURTOPRIGHT;
            level[i + 4] = SQUARE_FOURBOTTOMLEFT;
            level[i + 5] = SQUARE_FOURBOTTOMRIGHT;
            return true;
          }
        }
        function addBlockTwo() {
          while (true) {
            if (Math.random() > 0.5) {
              var i = randomIndex(3, 5);
              if (level[i] == 0 && level[i + 1] == 0) {
                level[i] = SQUARE_TWOLEFT;
                level[i + 1] = SQUARE_TWORIGHT;
                return ;
              }
            } else {
              var i$__10 = randomIndex(4, 4);
              if (level[i$__10] == 0 && level[i$__10 + 4] == 0) {
                level[i$__10] = SQUARE_TWOTOP;
                level[i$__10 + 4] = SQUARE_TWOBOTTOM;
                return ;
              }
            }
          }
        }
        function addBlockSingle() {
          while (true) {
            var i = randomIndex(4, 5);
            if (level[i] == 0) {
              level[i] = SQUARE_SINGLE;
              return ;
            }
          }
        }
        addBlockFour();
        addBlockTwo();
        addBlockTwo();
        addBlockTwo();
        addBlockTwo();
        addBlockTwo();
        addBlockSingle();
        addBlockSingle();
        addBlockSingle();
        addBlockSingle();
        return level;
      }
      var level = generateLevel();
      this.state = new KhunpanState(level);
      $('#solving').show().children().text('Generating level...');
      this.state.solve($.proxy(function(numMoves) {}, this), $.proxy(function() {
        console.log('Solved');
        console.log(min, this.state.moves.length, max);
        if (this.state.moves.length - 1 > max || this.state.moves.length - 1 < min)
          this.levelRandom(min, max);
        else {
          var maxMoves = this.state.moves.length - 1;
          $('#solving-text').text('Solve in ' + maxMoves + ' moves!');
          $('#solving').delay(2000).fadeOut();
          this.startGame(this.state.position);
          this.state.maxMoves = maxMoves;
          this.updateUI();
        }
      }, this), $.proxy(function() {
        console.log('Could not solve.');
        this.levelRandom(min, max);
      }, this), max);
    },
    startTimer: function() {
      if (!this.timer) {
        this.timer = setInterval($.proxy(this.tick, this), 100);
      }
    },
    stopTimer: function() {
      clearInterval(this.timer);
      this.timer = null;
    },
    mouseDown: function(e) {
      e.preventDefault();
      this.mouseStart = new Vector2(e.pageX, e.pageY);
      if (e.type == "touchstart") {
        this.mouseStart = new Vector2(e.originalEvent.touches[0].pageX, e.originalEvent.touches[0].pageY);
      }
    },
    mouseUp: function(e) {
      this.mouseStart = null;
    },
    moveBlock: function(block, dir) {
      if (this.board.canMoveBlock(block, dir)) {
        var targetArea = block.bounds.offset(dir);
        var collidingBlocks = this.board.getBlocksWithin(targetArea, block);
        for (var $__5 = collidingBlocks[$traceurRuntime.toProperty(Symbol.iterator)](),
            $__6 = void 0; !($__6 = $__5.next()).done; ) {
          var b = $__6.value;
          this.moveBlock(b, dir);
        }
        this.state.doMove({
          pos: block.pos,
          dir: dir
        });
        block.moveBy(dir);
        this.updateUI();
      } else
        return false;
    },
    mouseMove: function(e) {
      e.preventDefault();
      if (this.over)
        return ;
      this.mousePos = new Vector2(e.pageX, e.pageY);
      if (e.type == "touchmove") {
        this.mousePos = new Vector2(e.originalEvent.touches[0].pageX, e.originalEvent.touches[0].pageY);
      } else {
        if (e.originalEvent.which != 1 || e.originalEvent.ctrlKey)
          return ;
      }
      if (this.mouseStart == null)
        return ;
      var offset = Vector2.sub(this.mousePos, this.mouseStart);
      var movedDistance = offset.length();
      if (movedDistance < this.board.blockSize / 2)
        return ;
      var pos = this.board.element.offset();
      var x = (this.mouseStart.x - pos.left) / this.board.blockSize;
      var y = (this.mouseStart.y - pos.top) / this.board.blockSize;
      var clampedX = clamp(Math.floor(x), 0, this.board.width - 1);
      var clampedY = clamp(Math.floor(y), 0, this.board.height - 1);
      var blockPos = new Vector2(clampedX, clampedY);
      var block = this.board.getBlockAt(blockPos);
      if (block == null)
        return ;
      blockPos.x = block.x;
      blockPos.y = block.y;
      var dir = new Vector2(0, 0);
      if (Math.abs(offset.x) > Math.abs(offset.y)) {
        dir.x = (offset.x > 0) ? 1 : -1;
      } else {
        dir.y = (offset.y > 0) ? 1 : -1;
      }
      this.moveBlock(block, dir);
    },
    tick: function() {
      if (this.isPlaying) {
        if (!this.redo())
          this.isPlaying = false;
      }
    },
    menu: function() {
      this.board.clear();
      this.state = new KhunpanState();
      $('.moves').text(' ');
      $('#menu').show();
      $('#button-bar').fadeOut();
    },
    reset: function() {
      var maxMoves = this.state.maxMoves;
      this.startGame(this.state.startPosition);
      this.state.maxMoves = maxMoves;
      this.updateUI();
    }
  }, {});
  return {get KhunpanGame() {
      return KhunpanGame;
    }};
});
System.registerModule("../../js/khunpanApp.js", [], function() {
  "use strict";
  var __moduleName = "../../js/khunpanApp.js";
  var KhunpanGame = System.get("../../js/KhunpanGame").KhunpanGame;
  var blockSize;
  var game;
  function adjustSize() {
    var portrait = window.innerWidth < window.innerHeight;
    var nx = window.innerWidth / ((portrait) ? 5 : 5);
    var ny = window.innerHeight / 7;
    var n = (portrait) ? nx : ny;
    blockSize = Math.min(128, Math.floor(n));
    $('html').css('font-size', blockSize);
    if (game != null)
      game.board.blockSize = blockSize;
    window.scrollTo(0, 0);
  }
  $(document).ready(function() {
    FastClick.attach(document.body);
    adjustSize();
    document.ontouchmove = function(e) {
      e.preventDefault();
    };
    game = new KhunpanGame(blockSize);
    $(window).on('resize', adjustSize);
  });
  return {};
});
System.get("../../js/khunpanApp.js" + '');
