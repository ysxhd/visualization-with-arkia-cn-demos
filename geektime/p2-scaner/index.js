import Vector2D from '../../util/vector2.js';

const defaultOptions = {
	maxPoints: 10
};

class Scanner {
	constructor(options = defaultOptions) {
		const { canvas, ...restOptions } = options;
		this.ctx = canvas.getContext('2d');
		this.width = canvas.width;
		this.height = canvas.height;
		this.options = Object.assign({}, defaultOptions, restOptions);
	}
	createPoints() {}
	updatePoints() {}
	drawCoordinate() {
		const x = this.width / 2;
		const y = this.height / 2;
		this.ctx.save();
		this.ctx.strokeStyle = 'black';
		this.ctx.moveTo(-x, 0);
		this.ctx.lineTo(x, 0);
		this.ctx.moveTo(0, -y);
		this.ctx.lineTo(0, y);
		this.ctx.stroke();
		this.ctx.restore();
	}
	drawScaner() {
		const x = this.width / 2;
		const y = this.height / 2;
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
	drawPoints() {}
	draw() {
		this.ctx.translate(this.width / 2, this.height / 2);
		this.ctx.scale(1, -1);
		this.drawCoordinate();
		this.drawScaner();
		this.drawPoints();
	}
}

const canvas = document.querySelector('canvas');
const scaner = new Scanner({ canvas });
scaner.draw();
