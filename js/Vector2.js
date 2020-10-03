export class Vector2{

	constructor(x, y){
		this.x = x;
		this.y = y;
	}

	static copy(v){
		return new Vector2(v.x, v.y);
	}

	static add(a, b){
		return new Vector2(a.x + b.x, a.y + b.y);
	}

	static sub(a, b){
		return new Vector2(a.x - b.x, a.y - b.y);
	}

	add(v){
		this.x += v.x;
		this.y += v.y;
		return this;
	}

	sub(v){
		this.x -= v.x;
		this.y -= v.y;
		return this;
	}

	multScalar(s){
		this.x *= s;
		this.y *= s;
		return this;
	}

	negate(){
		this.x *= -1;
		this.y *= -1;
		return this;
	}

	dot(v){
		return this.x * v.x + this.y * v.y;
	}

	lengthSq() {
		return this.x * this.x + this.y * this.y;
	}

	length() {
		return Math.sqrt( this.lengthSq() );
	}

	equals(v) {
		return ( ( v.x === this.x ) && ( v.y === this.y ) );
	}

}