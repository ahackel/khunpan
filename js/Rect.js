import {Vector2} from './Vector2';

export class Rect {
	constructor(x, y, width, height){
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}

	offset(delta){
		this.x += delta.x;
		this.y += delta.y;
		return this;
	}

	intersects(rect){
		if (rect.x < this.x + this.width && this.x < rect.x + rect.width && rect.y < this.y + this.height)
			return this.y < rect.y + rect.height;
		else
			return false;
	}

	contains(rect){
		if (rect.x >= this.x && rect.x + rect.width <= this.x + this.width &&
			rect.y >= this.y && rect.y + rect.height <= this.y + this.height)
			return true;
		else
			return false;
	}
}