import Vector2D from '../../util/vector2.js';

const defaultOptions = {
	maxPoints: 10
};

class Scanner {
	constructor(options = defaultOptions) {
		const { context, ...restOptions } = options;
		this.ctx = context;
		this.options = Object.assign({}, defaultOptions, restOptions);
	}
	drawCoordinate() {
		const x = this.options.width / 2;
		const y = this.options.height / 2;
		this.ctx.save();
		this.ctx.strokeStyle = 'red';
		this.ctx.moveTo(-x, 0);
		this.ctx.lineTo(x, 0);
		this.ctx.moveTo(0, -y);
		this.ctx.lineTo(0, y);
		this.ctx.stroke();
		this.ctx.restore();
	}
	drawScaner() {
		const x = this.options.width / 2;
		const y = this.options.height / 2;
		const line = new Vector2D(Math.sqrt(x ** 2 + y ** 2), 0);

		this.ctx.save();
		this.ctx.strokeStyle = 'black';
		const line1 = line.copy().rotate(Math.PI / 3);
		this.ctx.moveTo(0, 0);
		this.ctx.lineTo(line1[0], line1[1]);

		const line2 = line.copy().rotate((Math.PI / 3) * 2);
		this.ctx.moveTo(0, 0);
		this.ctx.lineTo(line2[0], line2[1]);
		this.ctx.stroke();
		this.ctx.restore();
	}
	aim(point) {
		// return Math.abs(new Vector2D(0, 1).cross(point.normalize()) <= 0.5); // bug
		return new Vector2D(0, 1).dot(point.normalize()) >= Math.cos(Math.PI / 6);
	}
	genPoints() {
		return new Array(this.options.maxPoints).fill().map(() => {
			return new Vector2D(10, 200);
		});
	}
	drawPoints() {
		const points = this.genPoints();
		this.ctx.save();
		points.forEach(point => {
			const isAim = this.aim(point);
			this.ctx.moveTo(point[0], point[1]);
			this.ctx.fillStyle = isAim ? 'green' : 'black';
			this.ctx.arc(point[0], point[1], 3, 0, Math.PI * 2);
			this.ctx.fill();
		});
		this.ctx.restore();
	}
	draw() {
		this.drawCoordinate();
		this.drawScaner();
		this.drawPoints();
	}
}

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');
const { width, height } = canvas;
context.translate(width / 2, height / 2);
context.scale(1, -1);
const scaner = new Scanner({ context, width, height });
scaner.draw();
