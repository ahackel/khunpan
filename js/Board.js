import {Vector2} from './Vector2';
import {Rect} from './Rect';

"use strict";

export class Board {
	constructor(width, height, blockSize) {
		this.blockSize = blockSize;
		this.blocks = []; //new Set();
		this.element = $('#board');
		this.setSize(width, height);
	}

	setSize(width, height) {
		this.width = width;
		this.height = height;
		this.element.width(width + "em");
		this.element.height(height + "em");
	}

	get bounds() {
		return new Rect(0, 0, this.width, this.height);
	}

	clear(){
		this.blocks = []; //.clear();
		this.element.empty();
	}

	addBlock(block){
		this.blocks.push(block); //add(block);
		this.element.append(block.element);
	}

	getBlockAt(pos){
		//for (let block of this.blocks) {
		let r = new Rect(pos.x, pos.y, 1, 1);
		for (var i=0; i<this.blocks.length; i++){
			var block = this.blocks[i];
			if (block.bounds.contains(r))
				return block;
		}
		return null;
	}

	getBlocksWithin(rect, ignoreBlock){
		let blocks = [];
		for (var i=0; i<this.blocks.length; i++){
			var block = this.blocks[i];

			if (ignoreBlock && block == ignoreBlock)
				continue;

			if (block.bounds.intersects(rect))
				blocks.push(block);
		}
		return blocks;
	}

	canMoveBlock(block, dir){
		let targetArea = block.bounds.offset(dir);

		// is new position within the bounds?
		if (!this.bounds.contains(targetArea))
			return false;

		// check collision with other blocks:
		let collidingBlocks = this.getBlocksWithin(targetArea, block);
		for (let b of collidingBlocks)
			if (this.canMoveBlock(b, dir) == false)
				return false;
		return true;
	}

}