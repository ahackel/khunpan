import {Vector2} from './Vector2';
import {Rect} from './Rect';
import {Block} from './Block';
import {Board} from './Board';

"use strict";

const RED = 0;
const YELLOW = 1;
const BLUE = 2;
const GREEN = 3;
const WIDTH = 4;
const HEIGHT = 5;
const COLOR_NAMES = ['red', 'yellow', 'blue', 'green'];

const SQUARE_EMPTY = 0;
const SQUARE_SINGLE = 1;
const SQUARE_TWOTOP = 2;
const SQUARE_TWOBOTTOM = 3;
const SQUARE_TWOLEFT = 4;
const SQUARE_TWORIGHT = 5;
const SQUARE_FOURTOPLEFT = 6;
const SQUARE_FOURTOPRIGHT = 7;
const SQUARE_FOURBOTTOMLEFT = 8;
const SQUARE_FOURBOTTOMRIGHT = 9;

const WHOLE_SQUARES = [
	null,
	[{x:0, y:0}],
	[{x:0, y:0}, {x:0, y:1}],
	null,
	[{x:0, y:0}, {x:1, y:0}],
	null,
	[{x:0, y:0}, {x:1, y:0}, {x:0, y:1}, {x:1, y:1}],
	null,
	null,
	null];

const SQUARE_WIDTHS = [0, 1, 1, 0, 2, 0, 2, 0, 0, 0];
const SQUARE_HEIGHTS = [0, 1, 2, 0, 1, 0, 2, 0, 0, 0];

const LEVEL1 = [
	SQUARE_TWOTOP, SQUARE_TWOTOP, SQUARE_TWOTOP, SQUARE_TWOTOP,
	SQUARE_TWOBOTTOM, SQUARE_TWOBOTTOM, SQUARE_TWOBOTTOM, SQUARE_TWOBOTTOM,
	SQUARE_EMPTY, SQUARE_FOURTOPLEFT, SQUARE_FOURTOPRIGHT, SQUARE_EMPTY,
	SQUARE_SINGLE, SQUARE_FOURBOTTOMLEFT, SQUARE_FOURBOTTOMRIGHT, SQUARE_SINGLE,
	SQUARE_SINGLE, SQUARE_TWOLEFT, SQUARE_TWORIGHT, SQUARE_SINGLE
];

const LEVEL2 = [
	SQUARE_TWOTOP, SQUARE_FOURTOPLEFT, SQUARE_FOURTOPRIGHT, SQUARE_TWOTOP,
	SQUARE_TWOBOTTOM, SQUARE_FOURBOTTOMLEFT, SQUARE_FOURBOTTOMRIGHT, SQUARE_TWOBOTTOM,
	SQUARE_TWOTOP, SQUARE_TWOLEFT, SQUARE_TWORIGHT, SQUARE_TWOTOP,
	SQUARE_TWOBOTTOM, SQUARE_SINGLE, SQUARE_SINGLE, SQUARE_TWOBOTTOM,
	SQUARE_SINGLE, SQUARE_EMPTY, SQUARE_EMPTY, SQUARE_SINGLE
];

const LEVEL3 = [
	SQUARE_TWOTOP, SQUARE_FOURTOPLEFT, SQUARE_FOURTOPRIGHT, SQUARE_TWOTOP,
	SQUARE_TWOBOTTOM, SQUARE_FOURBOTTOMLEFT, SQUARE_FOURBOTTOMRIGHT, SQUARE_TWOBOTTOM,
	SQUARE_EMPTY, SQUARE_TWOLEFT, SQUARE_TWORIGHT, SQUARE_EMPTY,
	SQUARE_TWOLEFT, SQUARE_TWORIGHT, SQUARE_TWOLEFT, SQUARE_TWORIGHT,
	SQUARE_SINGLE, SQUARE_SINGLE, SQUARE_SINGLE, SQUARE_SINGLE
];

const DIRECTIONS = [
	{x: 1, y: 0},
	{x: 0, y: 1},
	{x: -1, y: 0},
	{x: 0, y: -1}
]

function clamp(v, min, max){
	return Math.min(Math.max(v, min), max);
}

function indexFromPos(pos){
	return pos.x + pos.y * WIDTH;
}

class KhunpanState {

	constructor(level) {
		this.position = new Int8Array(level || 20);
		this.startPosition = this.position;
		this.numMoves = 0;
		this.maxMoves = 0;
		this.moves = [{position: this.position}];
		this.isSolved = false;
	}

	doMove(move){
		if (move == null) return false;
		let newPosition = this._move(this.position, move.pos, move.dir);

		if (newPosition){
			move.position = newPosition;//this.position;

			// delete redo buffer:
			this.moves.length = this.numMoves + 1;

			this.moves.push( move );
			this.position = newPosition;
			this.numMoves++;
			this.isSolved = this.isWinningPosition(this.position);
			//console.log('Moves', this.numMoves);
			return true;
		}
		else
			return false;
	}

	undo(){
		if (this.numMoves > 0){
			let move = this.moves[this.numMoves];
			this.position = this.moves[this.numMoves-1].position;
			this.numMoves--;
			this.isSolved = this.isWinningPosition(this.position);

			let revMove = { position: this.position, pos: move.pos, dir: move.dir };

			revMove.pos = Vector2.add(move.pos, move.dir);
			revMove.dir = Vector2.copy(move.dir);
			revMove.dir.multScalar(-1);
			return revMove;
		}
		return null;
	}

	redo(){
		if (this.moves.length > this.numMoves + 1){
			this.numMoves++;
			let move = this.moves[this.numMoves];
			this.position = move.position;
			this.isSolved = this.isWinningPosition(this.position);
			return move;
		}
		return null;
	}

	printPosition(position) {
		let s = '';
		let i = 0;
		for (let p of position) {
			s += p;
			if (i % WIDTH == WIDTH - 1)
				s += "\n ";
			i++;
		}
		console.log(s);
	}

	isWinningPosition(position){
		return position[indexFromPos({ x: 1, y: 3})] == SQUARE_FOURTOPLEFT;
	}

	_move(position, pos, dir){
		let square = position[indexFromPos(pos)];
		if (square == null)
			return null;

		let wholeSquare = WHOLE_SQUARES[square];
		if (wholeSquare == null)
			return null;

		let targetPos = Vector2.add(pos, dir);

		let newPosition = new Int8Array(position);

		// remove current squares:
		for (let w of wholeSquare) {
			newPosition[indexFromPos(Vector2.add(pos, w))] = SQUARE_EMPTY;
		}

		// paste into new position:
		for (let w of wholeSquare) {
			let s =	position[indexFromPos(Vector2.add(pos, w))];
			newPosition[indexFromPos(Vector2.add(targetPos, w))] = s;
		}

		return newPosition;
	}

	solve(update, success, fail, maxMoves) {
		this.worker = new Worker('solver.js');
		this.worker.postMessage({ position: this.position, maxMoves: maxMoves || 200 } );
		this.solveFailed = fail;

		this.worker.onmessage = $.proxy(function(e){

			if (e.data.msg == 'update'){
				if (update)
					update(e.data.numMoves);
			}

			if (e.data.msg == 'failed'){
				this.worker.terminate();
				this.worker = null;

				if (fail)
					fail(e.data.numMoves);
			}

			if (e.data.msg == 'solved') {
				this.worker.terminate();
				this.worker = null;

				let move = e.data.move;
				if (move != null) {
					let newMoves = [];
					while (move.dir != null) {
						newMoves.unshift({pos: move.pos, dir: move.dir, position: move.position});
						move = move.parent;
					}

					// delete redo buffer:
					this.moves.length = this.numMoves + 1;

					this.moves = this.moves.concat(newMoves);
					if (success)
						success();
				}
			}
		}, this);
	}

	stopSolving(){
		if (this.worker != null) {
			this.worker.terminate();
			this.worker = null;
			if (this.solveFailed)
				this.solveFailed();
			this.solveFailed = null;
		}
	}
}

export class KhunpanGame  {
	constructor(blockSize) {
		this.board = new Board(WIDTH, HEIGHT, blockSize);

		this.isPlaying = false;

		/*let jsonMoves = localStorage.getItem('moves');

		if (jsonMoves){
			this.moves = JSON.parse(jsonMoves);
		}
		else {
			console.log('solving...');
			}
			localStorage.setItem('moves', JSON.stringify(this.moves));
		}*/

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
	}

	updateUI(){
		$('.moves').text(this.state.numMoves + ' | ' + this.state.maxMoves);
		let solved = this.state.isSolved;
		if (solved){
			setTimeout($.proxy(function(){
				this.board.element.addClass('solved');
			}, this), 500);

			//$('#solving').fadeIn();
			//$('#solving-text').text('Solved.');

		}
		else {
			this.board.element.removeClass('solved');
			//$('#solving').fadeOut();
		}
		$('#btn-undo, #btn-reset').toggleClass('disabled', this.state.numMoves == 0);
		$('#btn-redo').toggleClass('disabled', this.state.numMoves == this.state.moves.length - 1);
		$('#btn-solve').toggleClass('disabled', this.state.isSolved);
	}

	keyDown(e){
		switch(e.which) {
			case 27: // Escape
				this.menu();
				break;
			case 37: // Cursor left
				this.undo();
				break;
			case 39: // Cursor right
				this.redo();
				break;
			case 83: // s
				this.solve();
				break;
			case 32: // space
				this.replay();
				break;
		}
	}

	undo(){
		let revMove = this.state.undo();
		if (revMove) {
			let block = this.board.getBlockAt(revMove.pos);
			block.moveBy(revMove.dir);
			this.updateUI();
			return true;
		}
		return false;
	}

	redo(){
		let move = this.state.redo();
		if (move) {
			let block = this.board.getBlockAt(move.pos);
			block.moveBy(move.dir);
			this.updateUI();
			return true;
		}
		return false;
	}

	replay(){
		this.isPlaying = !this.isPlaying;
	}

	solve(){
		if (this.state.isSolved)
			return;

		$('#solving').fadeIn();
		this.state.solve(
			$.proxy(function(numMoves){
				//console.log('#Moves', numMoves);
				$('#solving-text').text('Solving...');
				$('#Moves').text(numMoves);
			}, this),

			$.proxy(function(){
				$('#solving').fadeOut();
				console.log('Solved');
				this.isPlaying = true;
			}, this),

			$.proxy(function(){
				$('#solving-text').text('Could not be solved.');
				$('solving').delay(1000).fadeOut();
				console.log('Could not solve.');
		}, this), 200);
	}

	stopSolving(){
		this.state.stopSolving();
	}

	startGame(level){
		this.state = new KhunpanState(level);
		$('#menu').fadeOut();
		$('#button-bar').fadeIn();
		this.updateUI();

		this.board.clear();
		for (let y = 0; y < 5; y++) {
			for (let x = 0; x < 4; x++) {
				let square = this.state.position[indexFromPos({x: x, y: y})];
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
	}

	level1(){
		//this.startGame(LEVEL1);
		this.levelRandom(10, 20);
	}

	level2(){
		//this.startGame(LEVEL2);
		this.levelRandom(40, 60);
	}

	level3(){
		//this.startGame(LEVEL3);
		this.levelRandom(100, 200);
	}

	levelRandom(min, max){

		function generateLevel() {

			let level = new Int8Array(WIDTH * HEIGHT);

			function randomIndex(w, h){
				return Math.floor(Math.random() * w) + Math.floor(Math.random() * h) * WIDTH;
			}

			function addBlockFour(){
				while (true) {

					let i = randomIndex(3, 4);
					if (i == 1 + 3 * WIDTH)
						continue;

					level[i] = SQUARE_FOURTOPLEFT;
					level[i + 1] = SQUARE_FOURTOPRIGHT;
					level[i + 4] = SQUARE_FOURBOTTOMLEFT;
					level[i + 5] = SQUARE_FOURBOTTOMRIGHT;
					return true;
				}
			}

			function addBlockTwo(){
				while (true) {
					if (Math.random() > 0.5){
						let i = randomIndex(3, 5);

						if (level[i] == 0 && level[i + 1] == 0) {
							level[i] = SQUARE_TWOLEFT;
							level[i+1] = SQUARE_TWORIGHT;
							return;
						}
					}
					else {
						let i = randomIndex(4, 4);

						if (level[i] == 0 && level[i + 4] == 0) {
							level[i] = SQUARE_TWOTOP;
							level[i+4] = SQUARE_TWOBOTTOM;
							return;
						}
					}

				}
			}

			function addBlockSingle() {
				while (true) {
					let i = randomIndex(4, 5);

					if (level[i] == 0) {
						level[i] = SQUARE_SINGLE;
						return;
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

		let level = generateLevel();
		this.state = new KhunpanState(level);

		$('#solving').show().children().text('Generating level...');
		this.state.solve(
			$.proxy(function(numMoves){
				//console.log('#Moves', numMoves);
			}, this),

			$.proxy(function(){
				console.log('Solved');
				console.log(min, this.state.moves.length, max);
				if (this.state.moves.length-1 > max || this.state.moves.length-1 < min)
					this.levelRandom(min, max);
				else {
					let maxMoves = this.state.moves.length - 1;
					$('#solving-text').text('Solve in ' + maxMoves + ' moves!');
					$('#solving').delay(2000).fadeOut();
					this.startGame(this.state.position);

					// prevent maxMoves from being reset:
					this.state.maxMoves = maxMoves;
					this.updateUI();
				}
			}, this),

			$.proxy(function(){
				console.log('Could not solve.');
				this.levelRandom(min, max);
			}, this), max);
	}

	startTimer(){
		if (!this.timer) {
			this.timer = setInterval($.proxy(this.tick, this), 100);
		}
	}

	stopTimer(){
		clearInterval(this.timer);
		this.timer = null;
	}

	mouseDown(e) {
		e.preventDefault();

		this.mouseStart = new Vector2(e.pageX, e.pageY);
		if (e.type == "touchstart") {
			this.mouseStart = new Vector2(e.originalEvent.touches[0].pageX, e.originalEvent.touches[0].pageY);
		}
	}

	mouseUp(e) {
		this.mouseStart = null;
		//console.log('mouse out');
	}

	moveBlock(block, dir){
		if (this.board.canMoveBlock(block, dir)){
			let targetArea = block.bounds.offset(dir);

			// check collision with other blocks:
			let collidingBlocks = this.board.getBlocksWithin(targetArea, block);
			for (let b of collidingBlocks)
				this.moveBlock(b, dir);

			// update state;
			this.state.doMove({ pos: block.pos, dir: dir });

			block.moveBy(dir);
			this.updateUI();
		}
		else
			return false;
	}

	mouseMove(e)
	{
		e.preventDefault();

		if (this.over)
			return;


		this.mousePos = new Vector2(e.pageX, e.pageY);
		if (e.type == "touchmove") {
			this.mousePos = new Vector2(e.originalEvent.touches[0].pageX, e.originalEvent.touches[0].pageY);
		}
		else {
			// the player can only move if the last player has been the computer:
			if (e.originalEvent.which != 1 || e.originalEvent.ctrlKey)
				return;
		}

		if (this.mouseStart == null)
			return;

		let offset = Vector2.sub(this.mousePos, this.mouseStart);

		let movedDistance = offset.length();
		//console.log(movedDistance);
		if  (movedDistance < this.board.blockSize / 2)
			return;


		let pos = this.board.element.offset();
		let x = (this.mouseStart.x - pos.left) / this.board.blockSize;
		let y = (this.mouseStart.y - pos.top) / this.board.blockSize;
		let clampedX = clamp(Math.floor(x), 0, this.board.width - 1);
		let clampedY = clamp(Math.floor(y), 0, this.board.height - 1);
		let blockPos = new Vector2(clampedX, clampedY);

		//this.mouseStart = this.mousePos;

		let block = this.board.getBlockAt(blockPos);

		if (block == null)
			return;

		blockPos.x = block.x;
		blockPos.y = block.y;

		let dir = new Vector2(0, 0);
		if (Math.abs(offset.x) > Math.abs(offset.y)) {
			dir.x = (offset.x > 0) ? 1 : -1;
		}
		else {
			dir.y = (offset.y > 0) ? 1 : -1;
		}

		this.moveBlock(block, dir);
	}

	tick(){
		if (this.isPlaying){
			if (!this.redo())
				this.isPlaying = false;
		}
	}

	menu() {
		this.board.clear();
		this.state = new KhunpanState();
		$('.moves').text(' ');
		$('#menu').show();//fadeIn();
		$('#button-bar').fadeOut();
	}

	reset(){
		let maxMoves = this.state.maxMoves;
		this.startGame(this.state.startPosition);
		this.state.maxMoves = maxMoves;
		this.updateUI();

	}


}