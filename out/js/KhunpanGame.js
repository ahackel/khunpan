System.registerModule("../../js/Rect", [], function() {
  "use strict";
  var __moduleName = "../../js/Rect";
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
  return {get Rect() {
      return Rect;
    }};
});
System.registerModule("../../js/Block", [], function() {
  "use strict";
  var __moduleName = "../../js/Block";
  var Rect = System.get("../../js/Rect").Rect;
  var Block = function Block(game, x, y, width, height, className) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.className = className;
    this.selected_ = false;
    this.element = $('<div/>').addClass('block').addClass(this.className).css('left', this.x + "em").css('top', this.y + "em");
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
        return ;
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
      for (var $__2 = this.game.board.blocks[$traceurRuntime.toProperty(Symbol.iterator)](),
          $__3 = void 0; !($__3 = $__2.next()).done; ) {
        var block = $__3.value;
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
        this.element.css('left', x + "em");
        this.element.css('top', y + "em");
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
System.registerModule("../../js/Board", [], function() {
  "use strict";
  var __moduleName = "../../js/Board";
  "use strict";
  var Board = function Board(width, height, blockSize) {
    this.blockSize = blockSize;
    this.blocks = [];
    this.element = $('#board');
    this.selectedBlock_ = null;
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
      this.blocks = [];
      this.element.empty();
    },
    addBlock: function(block) {
      this.blocks.push(block);
      this.element.append(block.element);
    },
    getBlockAt: function(x, y) {
      for (var i = 0; i < this.blocks.length; i++) {
        var block = this.blocks[i];
        if (block.x == x && block.y == y)
          return block;
      }
      return null;
    }
  }, {});
  return {get Board() {
      return Board;
    }};
});
System.registerModule("../../js/Game", [], function() {
  "use strict";
  var __moduleName = "../../js/Game";
  var Rect = System.get("../../js/Rect").Rect;
  var Block = System.get("../../js/Block").Block;
  var Board = System.get("../../js/Board").Board;
  "use strict";
  function clamp(v, min, max) {
    return Math.min(Math.max(v, min), max);
  }
  var Game = function Game(width, height, blockSize) {
    this.board = new Board(width, height, blockSize);
    this.board.element.on('touchstart mousedown', this, function(e) {
      var that = e.data;
      var pos = $(this).offset();
      var x = (e.pageX - pos.left) / that.board.blockSize;
      var y = (e.pageY - pos.top) / that.board.blockSize;
      var clampedX = clamp(Math.floor(x), 0, that.board.width - 1);
      var clampedY = clamp(Math.floor(y), 0, that.board.height - 1);
      var newEvent = {
        originalEvent: e,
        x: clampedX,
        y: clampedY,
        originalX: x,
        originalY: y,
        block: that.board.getBlockAt(clampedX, clampedY)
      };
      that.click(newEvent);
    });
    this.numMoves = 0;
    this.editMode_ = false;
    this.over = false;
  };
  ($traceurRuntime.createClass)(Game, {
    get editMode() {
      return this.editMode_;
    },
    set editMode(v) {
      this.editMode_ = v;
      this.board.setSize(v ? 8 : 4, 5);
      this.board.element.toggleClass('editmode', v);
    },
    reset: function() {
      this.board.clear();
      this.over = false;
    },
    click: function(e) {},
    won: function() {
      console.log('Game won!');
    }
  }, {});
  return {get Game() {
      return Game;
    }};
});
System.registerModule("../../js/MCTS", [], function() {
  "use strict";
  var __moduleName = "../../js/MCTS";
  function indentString(indent) {
    var s = "\n";
    for (var i = 0; i < indent; i++)
      s += "| ";
    return s;
  }
  var GameState = function GameState(move) {
    this.values = [];
  };
  var $GameState = GameState;
  ($traceurRuntime.createClass)(GameState, {
    copy: function() {
      var s = new $GameState();
      s.values = this.values.splice(0);
      return s;
    },
    getMoves: function() {
      return [];
    },
    getResult: function() {
      return 0;
    },
    doMove: function(move) {}
  }, {});
  var MCTreeNode = function MCTreeNode(state, parent, move) {
    this.move = move;
    this.parent = parent;
    this.children = [];
    this.visits = 0;
    this.untriedMoves = state.getMoves();
    this.player = state.player;
    this.totValue = 0;
    this.epsilon = 1e-6;
  };
  var $MCTreeNode = MCTreeNode;
  ($traceurRuntime.createClass)(MCTreeNode, {
    selectChild: function() {
      var $__0 = this;
      var uct = (function(c) {
        return c.totValue / c.visits + Math.sqrt(2 * Math.log($__0.visits) / c.visits);
      });
      this.children.sort((function(a, b) {
        return uct(b) - uct(a);
      }));
      return this.children[0];
    },
    addChild: function(move, state) {
      var n = new $MCTreeNode(state, this, move);
      this.untriedMoves.splice(this.untriedMoves.indexOf(move), 1);
      this.children.push(n);
      return n;
    },
    update: function(value) {
      this.visits++;
      this.totValue += value;
    },
    getResult: function(player) {
      return 0;
    },
    toString: function() {
      return "[M:" + this.move + " W/V:" + this.totValue + "/" + this.visits + " U:" + this.untriedMoves + " P:" + this.player + "]";
    },
    treeToString: function(indent) {
      var s = indentString(indent) + this;
      for (var $__2 = this.children[$traceurRuntime.toProperty(Symbol.iterator)](),
          $__3 = void 0; !($__3 = $__2.next()).done; ) {
        var c = $__3.value;
        s += c.treeToString(indent + 1);
      }
      return s;
    },
    bestTreeToString: function(indent) {
      var s = indentString(indent) + this;
      if (this.children.length > 0) {
        this.children.sort((function(a, b) {
          return b.visits - a.visits;
        }));
        s += this.children[0].bestTreeToString(indent + 1);
      }
      return s;
    }
  }, {});
  var MCTS = function MCTS() {};
  ($traceurRuntime.createClass)(MCTS, {}, {search: function(rootState) {
      var iterMax = arguments[1] !== (void 0) ? arguments[1] : 1000;
      iterMax = Math.max(1, iterMax);
      var rootNode = new MCTreeNode(rootState);
      for (var i = 0; i < iterMax; i++) {
        var node = rootNode;
        var state = rootState.copy();
        while (node.untriedMoves.length == 0 && node.children.length > 0) {
          node = node.selectChild();
          state.doMove(node.move);
        }
        if (node.untriedMoves.length > 0) {
          var m = node.untriedMoves[Math.floor(Math.random() * node.untriedMoves.length)];
          state.doMove(m);
          node = node.addChild(m, state);
        }
        while (true) {
          var moves = state.getMoves();
          if (moves == 0)
            break;
          state.doMove(moves[Math.floor(Math.random() * moves.length)]);
        }
        while (node != null) {
          var result = state.getResult(node.player);
          node.update(result);
          node = node.parent;
        }
      }
      if (rootNode.children.length == 0)
        return -1;
      rootNode.children.sort((function(a, b) {
        return b.visits - a.visits;
      }));
      return rootNode.children[0].move;
    }});
  return {
    get GameState() {
      return GameState;
    },
    get MCTreeNode() {
      return MCTreeNode;
    },
    get MCTS() {
      return MCTS;
    }
  };
});
System.registerModule("../../js/KhunpanGame.js", [], function() {
  "use strict";
  var __moduleName = "../../js/KhunpanGame.js";
  var Block = System.get("../../js/Block").Block;
  var Game = System.get("../../js/Game").Game;
  var $__2 = System.get("../../js/MCTS"),
      GameState = $__2.GameState,
      MCTS = $__2.MCTS;
  "use strict";
  var EMPTY = -1;
  var RED = 0;
  var YELLOW = 1;
  var BLUE = 2;
  var GREEN = 3;
  var WIDTH = 4;
  var HEIGHT = 5;
  var MAXITER = 300;
  var COLOR_NAMES = ['red', 'yellow', 'blue', 'green'];
  var KhunpanGameState = function KhunpanGameState() {
    $traceurRuntime.superConstructor($KhunpanGameState).call(this);
    this.lastPosition = null;
    for (var i = 0; i < WIDTH * HEIGHT; i++)
      this.values.push(EMPTY);
  };
  var $KhunpanGameState = KhunpanGameState;
  ($traceurRuntime.createClass)(KhunpanGameState, {
    get: function(x, y) {
      if (x < 0 || y < 0 || x > WIDTH - 1 || y > HEIGHT - 1)
        return null;
      return this.values[x + y * WIDTH];
    },
    getColumnCount: function(x) {
      var count = 0;
      for (var y = HEIGHT - 1; y >= -1; y--) {
        if (this.values[x + y * WIDTH] != EMPTY)
          count++;
        else
          return count;
      }
    },
    isColumnFree: function(x) {
      return this.getColumnCount(x) < HEIGHT;
    },
    getMoves: function() {
      var moves = [];
      if (this.winner == null) {
        for (var x = 0; x < WIDTH; x++) {
          if (this.isColumnFree(x)) {
            moves.push(x);
          }
        }
      }
      return moves;
    },
    doMove: function(move) {
      this.player = ((this.player + 1) % NUM_PLAYERS);
      var y = HEIGHT - this.getColumnCount(move) - 1;
      this.lastPosition = move + y * WIDTH;
      this.values[this.lastPosition] = this.player;
      this.winner = this.getWinner();
      return y;
    },
    copy: function() {
      var s = new $KhunpanGameState();
      s.values = this.values.slice(0);
      s.player = this.player;
      s.winner = this.winner;
      s.lastPosition = this.lastPosition;
      return s;
    },
    checkLine: function(dx, dy) {
      var count = 0;
      var x = this.lastPosition % WIDTH;
      var y = Math.floor(this.lastPosition / WIDTH);
      x -= dx * (CONNECT_LENGTH - 1);
      y -= dy * (CONNECT_LENGTH - 1);
      for (var i = 0; i < CONNECT_LENGTH * 2 - 1; i++) {
        if (this.get(x + dx * i, y + dy * i) == this.player)
          count++;
        else
          count = 0;
        if (count == CONNECT_LENGTH) {
          this.wonPosition = [];
          for (var p = 0; p < CONNECT_LENGTH; p++) {
            this.wonPosition.push({
              x: x + dx * (i - p),
              y: y + dy * (i - p)
            });
          }
          return true;
        }
      }
      return false;
    },
    getWinner: function() {
      if (this.checkLine(1, 0))
        return this.player;
      if (this.checkLine(0, 1))
        return this.player;
      if (this.checkLine(1, 1))
        return this.player;
      if (this.checkLine(1, -1))
        return this.player;
      if (this.isFull())
        return DRAW;
      else
        return null;
    },
    getResult: function(player) {
      if (this.winner == player)
        return 1;
      if (this.winner == DRAW || this.winner == null)
        return 0.5;
      return 0;
    },
    isFull: function() {
      for (var $__4 = this.values[$traceurRuntime.toProperty(Symbol.iterator)](),
          $__5 = void 0; !($__5 = $__4.next()).done; ) {
        var v = $__5.value;
        {
          if (v == EMPTY)
            return false;
        }
      }
      return true;
    },
    toString: function() {
      var s = "";
      for (var i = 0; i < this.values.length; i++) {
        var v = this.values[i];
        if (v == RED)
          s += 'X';
        else if (v == BLUE)
          s += 'O';
        else
          s += '.';
        if (i % WIDTH == WIDTH - 1)
          s += "\n";
      }
      return s;
    }
  }, {}, GameState);
  var Connect4Block = function Connect4Block(game, x, y, color) {
    var colorClass = COLOR_NAMES[color];
    $traceurRuntime.superConstructor($Connect4Block).call(this, game, x, y, 1, 1, 'block ' + colorClass);
    this.color = color;
    this.element.addClass('start');
    var that = this;
    setTimeout(function() {
      that.element.removeClass('start');
    }, 0);
  };
  var $Connect4Block = Connect4Block;
  ($traceurRuntime.createClass)(Connect4Block, {}, {}, Block);
  var KhunpanGame = function KhunpanGame(blockSize) {
    var that = this;
    this.gameOver = $('#gameover').hide().on('touchstart mousedown', function() {
      that.menu();
    });
    this.gameOverText = $('#gameover-text');
    $traceurRuntime.superConstructor($KhunpanGame).call(this, WIDTH, HEIGHT, blockSize);
    this.wins = [0, 0, 0, 0];
    this.menu();
  };
  var $KhunpanGame = KhunpanGame;
  ($traceurRuntime.createClass)(KhunpanGame, {
    startTimer: function() {
      if (!this.timer) {
        this.timer = setInterval($.proxy(this.tick, this), 1000);
      }
    },
    stopTimer: function() {
      clearInterval(this.timer);
      this.timer = null;
    },
    click: function(e) {
      if (e.originalEvent.which != 1 || e.originalEvent.ctrlKey)
        return ;
      if (this.over || this.gameState.player == RED)
        return ;
      if (this.placeBlock(e.x)) {
        this.stopTimer();
        this.startTimer();
      }
    },
    tick: function() {
      var nextPlayer = (this.gameState.player + 1) % NUM_PLAYERS;
      if (this.over || HUMAN_PLAYERS[nextPlayer]) {
        this.stopTimer();
        return ;
      }
      var move = MCTS.search(this.gameState, MAXITER);
      this.placeBlock(move);
    },
    placeBlock: function(x) {
      if (this.gameState.isColumnFree(x)) {
        var y = this.gameState.doMove(x);
        this.board.addBlock(new Connect4Block(this, x, y, this.gameState.player));
        this.checkGameOver();
        return true;
      }
      return false;
    },
    doMove: function(state, move, player, real) {
      var count = this.getColumnCount(state, move);
      var y = null;
      if (count < this.board.height) {
        y = this.board.height - count - 1;
        state.set(move, y, player);
        this.lastMove.x = move;
        this.lastMove.y = y;
        this.lastMove.color = player;
        if (real)
          this.board.addBlock(new Connect4Block(this, move, y, player));
      }
      return y;
    },
    checkGameOver: function() {
      if (this.gameState.winner != null) {
        if (this.gameState.wonPosition) {
          for (var $__4 = this.gameState.wonPosition[$traceurRuntime.toProperty(Symbol.iterator)](),
              $__5 = void 0; !($__5 = $__4.next()).done; ) {
            var p = $__5.value;
            {
              this.board.getBlockAt(p.x, p.y).element.addClass('won');
            }
          }
        }
        var s = 'DRAW';
        if (this.gameState.winner != DRAW) {
          var winningColor = COLOR_NAMES[this.gameState.winner];
          s = winningColor + " wins.";
          this.wins[this.gameState.winner]++;
          $('.wins.' + winningColor).text(this.wins[this.gameState.winner]);
        }
        this.gameOverText.text(s.toUpperCase());
        this.gameOver.show();
        this.over = true;
        return true;
      }
      return false;
    },
    reset: function() {
      $traceurRuntime.superGet(this, $KhunpanGame.prototype, "menu").call(this);
      this.gameOver.fadeOut(500);
      this.gameState = new KhunpanGameState(Math.floor(Math.random() * NUM_PLAYERS));
      this.startTimer();
    }
  }, {}, Game);
  return {get KhunpanGame() {
      return KhunpanGame;
    }};
});
System.get("../../js/KhunpanGame.js" + '');
