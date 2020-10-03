
var visitedPositions;
var MAX_STEPS = 200;
var WIDTH = 4;
var HEIGHT = 5;

var WINNING_INDEX = 1 + 3 * WIDTH;

var DIRECTIONS = [
	{x: 1, y: 0},
	{x: 0, y: 1},
	{x: -1, y: 0},
	{x: 0, y: -1}
];

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

var WHOLE_SQUARES = [51, 17, 3, 1];
var SQUARE_WIDTHS = [2, 1, 2, 1];
var SQUARE_HEIGHTS = [2, 2, 1, 1];

function hashFromArray(a){
	return "" + a[0] + '-' + a[1] + '-' + a[2] + '-' + a[3];
}

function createBinaryString (nMask) {
	// nMask must be between -2147483648 and 2147483647
	for (var nFlag = 0, nShifted = nMask, sMask = ""; nFlag < 32;
		 nFlag++, sMask += String(nShifted >>> 31), nShifted <<= 1);
	return sMask;
}

function positionInList(a, positions){
	var l = positions.length;
	for (var i = l-1; i >= 0; i--){
		var b = positions[i];
		//if (positionEquals(a, b))
		if (a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3])
			return true;
	}
	return false;
}

function positionEquals(a, b){
	return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3] && a[4] === b[4];
}

/*function positionEquals(a, b){
	var l = a.length;
	for (var i=0; i<l; i++)
		if (a[i] !== b[i]){
			return false;
		}

	return true;
}*/

function addVector(a, b){
	return { x: a.x + b.x, y: a.y + b.y };
}

function isWinningPosition(position){
	return position[0] & 1 << WINNING_INDEX;
}

function _move(position, pos, dir){
	var indexPos = pos.x + pos.y * WIDTH;

	var posBit = 1 << indexPos;
	var square = null;

	// get type of square at position:
	if (position[0] & posBit) square = 0;
	else if (position[1] & posBit) square = 1;
	else if (position[2] & posBit) square = 2;
	else if (position[3] & posBit) square = 3;
	else
		return null;

	var targetPos = addVector(pos, dir);

	// check if new Pos is out of bounds:
	if (targetPos.x < 0 || targetPos.y < 0 ||
		targetPos.x + SQUARE_WIDTHS[square]-1 >= WIDTH ||
		targetPos.y + SQUARE_HEIGHTS[square]-1 >= HEIGHT)
		return null;

	var indexDir = dir.x + dir.y * WIDTH;
	var indexTarget = indexPos + indexDir;

	var occupiedMask = position[4];

	// remove current squares:
	occupiedMask &= ~(WHOLE_SQUARES[square] << indexPos);
	var newSquareMask = WHOLE_SQUARES[square] << indexTarget;

	// check if new position is free:
	if (occupiedMask & newSquareMask)
		return null;

	// paste into new position:
	var newPosition = new Int32Array(5);

	newPosition[0] = position[0] & occupiedMask;
	newPosition[1] = position[1] & occupiedMask;
	newPosition[2] = position[2] & occupiedMask;
	newPosition[3] = position[3] & occupiedMask;
	newPosition[4] = (position[4] & occupiedMask) | newSquareMask;
	newPosition[square] |= 1 << indexTarget;

	return newPosition;
}

function getAllMoves(moves){
	var newMoves = [];
	for (var m = 0; m < moves.length; m++){
		var move = moves[m];

		for (var y = 0; y < HEIGHT; y++) {
			for (var x = 0; x < WIDTH; x++) {

				var pos = {x: x, y: y};

				for (var d = 0; d < 4; d++){
					var dir = DIRECTIONS[d];

					var newPosition = _move(move.position, pos, dir);

					if (newPosition == null)
						continue;

					//if (positionInMoveList(newPosition, newMoves))
					//	continue;

					var hash = hashFromArray(newPosition);

					if (visitedPositions.has(hash) == false) {
						var newMove = {
							position: newPosition,
							pos: pos,
							dir: dir,
							parent: move,
							numMoves: move.numMoves + 1
						};

						newMoves.push(newMove);
						visitedPositions.add(hash);

					}
				}
			}
		}
	}
	return newMoves;
}

function bitToArrayPosition(position) {
	var newPosition = new Int8Array(WIDTH * HEIGHT);
	for (var i = 0; i < newPosition.length; i++) {
		if (newPosition[i] != 0)
			continue;

		var posBit = 1 << i;
		var square = SQUARE_EMPTY;

		// get type of square at position:
		if (position[0] & posBit) square = SQUARE_FOURTOPLEFT;
		else if (position[1] & posBit) square = SQUARE_TWOTOP;
		else if (position[2] & posBit) square = SQUARE_TWOLEFT;
		else if (position[3] & posBit) square = SQUARE_SINGLE;

		newPosition[i] = square;

		// fill gaps
		if (square == SQUARE_FOURTOPLEFT){
			newPosition[i + 1] = SQUARE_FOURTOPRIGHT;
			newPosition[i + 4] = SQUARE_FOURBOTTOMLEFT;
			newPosition[i + 5] = SQUARE_FOURBOTTOMRIGHT;
		}
		else if (square == SQUARE_TWOTOP){
			newPosition[i + 4] = SQUARE_TWOBOTTOM;
		}
		else if (square == SQUARE_TWOLEFT){
			newPosition[i + 1] = SQUARE_TWORIGHT;
		}

	}
	return newPosition;
}

function convertPositions(move){
	while (move != null) {
		move.position = bitToArrayPosition(move.position);
		move = move.parent;
	}
}

onmessage = function(e){

	var position = e.data.position;
	var byteArrayPosition = new Int32Array(5);
	for (var i = 0; i < position.length; i++){
		byteArrayPosition[0] |= (position[i] == SQUARE_FOURTOPLEFT) << i;
		byteArrayPosition[1] |= (position[i] == SQUARE_TWOTOP) << i;
		byteArrayPosition[2] |= (position[i] == SQUARE_TWOLEFT) << i;
		byteArrayPosition[3] |= (position[i] == SQUARE_SINGLE) << i;
		byteArrayPosition[4] |= (position[i] != SQUARE_EMPTY) << i;
	}

	var firstMove = { position: byteArrayPosition, numMoves: 0 };

	// stop search immediately if is already solved:
	if (isWinningPosition(byteArrayPosition)){
		postMessage({ msg: 'solved', move: firstMove });
		return;
	}

	if (!!self.Set){
		visitedPositions = new Set();
	}
	else {
		//console.log('Set not available using polyfill')
		visitedPositions = {};
		visitedPositions.has = function(key){
			return (key in this);
		};
		visitedPositions.add = function(key){
			this[key] = true;
		};
	}
	visitedPositions.add(hashFromArray(byteArrayPosition));

	var numSteps = 0;
	var moves = [firstMove];

	while (numSteps < e.data.maxMoves){
		numSteps++;
		postMessage({ msg: 'update', numMoves: numSteps });


		moves = getAllMoves(moves);

		// check if winning position is reached:
		for (var n = 0; n < moves.length; n++){
			var newMove = moves[n];

			if (isWinningPosition(newMove.position)) {

				convertPositions(newMove);

				postMessage({ msg: 'solved', move: newMove });
				return;
			}
		}
	}
	postMessage({ msg: 'failed'});
}
