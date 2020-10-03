import {Vector2} from './Vector2';
import {Rect} from './Rect';

export class Block {
	constructor (x, y, width, height, color){
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.color = color;
		this.className = ['red', 'yellow', 'blue', 'green'][this.color];

		//this.selected_ = false;

		this.element = $('<div/>')
			.addClass('block')
			.addClass(this.className)
			.css('left', this.x + "em")
			.css('top', this.y + "em")
			.css('width', this.width + "em")
			.css('height', this.height + "em");
//			.click(this, function(e) { e.data.click(e); })
//			.mousedown(this, function(e) { e.data.mouseDown(e); })
//			.mouseup(this, function(e) { e.data.mouseUp(e); })
//			.mousemove(this, function(e) { e.data.mouseMove(e); });
	}

	get pos(){
		return new Vector2(this.x, this.y);
	}

	get bounds(){
		return new Rect(this.x, this.y, this.width, this.height);
	}

	moveTo(x, y){
		this.x = x;
		this.y = y;
		this.element.css('left', this.x + "em");
		this.element.css('top', this.y + "em");
	}

	moveBy(v){
		this.moveTo(this.x + v.x, this.y + v.y);
	}

	/*get selected(){ return this.selected_; }
	set selected(v) {
		this.selected_ = v;
		this.element.toggleClass('selected', v);
	}

	mouseDown(e){
		if (this.game.editMode)
			this.game.board.selectedBlock = this;
	}

	mouseUp(e){
		if (this.game.editMode) {
			var x = e.clientX / this.game.board.blockSize - this.width / 2;
			var y = e.clientY / this.game.board.blockSize - this.height / 2;

			if (this.moveTo(Math.round(x), Math.round(y)) == false){
				this.element.css('left', this.x * this.game.board.blockSize);
				this.element.css('top', this.y * this.game.board.blockSize);
			}

			this.game.board.selectedBlock = null;
		}
	}

	mouseMove(e){
		if (this.selected) {
			var x = e.clientX / this.game.board.blockSize - this.width / 2;
			var y = e.clientY / this.game.board.blockSize - this.height / 2;
			this.element.css('left', x * this.game.board.blockSize);
			this.element.css('top', y * this.game.board.blockSize);
		}
	}

	click (e){
		if (this.game.editMode)
			return;

		var dx = e.clientX / this.game.board.blockSize - this.x - this.width / 2;
		var dy = e.clientY / this.game.board.blockSize - this.y - this.height / 2;

		if (Math.abs(dx) > Math.abs(dy)) {
			if (dx > 0)
				this.moveBy(1, 0);
			else
				this.moveBy(-1, 0);
		}
		else {
			if (dy > 0)
				this.moveBy(0, 1);
			else
				this.moveBy(0, -1);
		}
	}

	canMoveTo(x, y) {
		let newBounds = new Rect(x, y, this.width, this.height);

		if (!this.game.board.bounds.contains(newBounds))
			return false;

		for (let block of this.game.board.blocks) {
			if (block == this) continue;
			if (newBounds.intersects(block.bounds)) return false;
		}
		return true;
	}

	moveTo(x, y) {
		if (this.canMoveTo(x, y)) {
			this.x = x;
			this.y = y;
			this.element.css('left', x + "em");
			this.element.css('top', y + "em");
			this.game.numMoves++;
			console.log('Moves:', this.game.numMoves)
			return true;
		}
		else
			return false;
	}

	moveBy(dx, dy) {
		return this.moveTo(this.x + dx, this.y + dy);
	}

	rotate(){
		if (this.className == 'block2x1') {
			this.element.removeClass(this.className);
			this.className = 'block1x2';
			this.element.addClass(this.className);
			this.width = 1;
			this.height = 2;
		}
		else if (this.className == 'block1x2') {
			this.element.removeClass(this.className);
			this.className = 'block2x1';
			this.element.addClass(this.className);
			this.width = 2;
			this.height = 1;
		}
	} */
}
