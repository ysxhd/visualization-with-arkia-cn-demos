export default class Vector2D extends Array {
	constructor(x = 1, y = 0) {
		super(x, y);
	}

	get x() {
		return this[0];
	}

	set x(val) {
		this[0] = val;
	}

	get y() {
		return this[1];
	}

	set y(val) {
		this[1] = val;
	}

	get length() {
		return Math.hypot(this.x, this.y);
	}

	get dir() {
		return Math.atan2(this.y, this.x);
	}

	copy() {
		return new Vector2D(this.x, this.y);
	}

	add(v) {
		this.x += v.x;
		this.y += v.y;
		return this;
	}

	scale(a) {
		this.x = this.x * a;
		this.y = this.y * a;
		return this;
	}

	rotate(rad) {
		const c = Math.cos(rad);
		const s = Math.sin(rad);
		const [x, y] = this;
		this.x = x * c + y * -s;
		this.y = x * s + y * c;
		return this;
	}

	cross(v) {
		return this.x * v.y - v.x * this.y;
	}

	dot(v) {
		return this.x * v.x + v.y * this.y;
	}

	normalize() {
		return this.scale(1 / this.length);
	}
}
