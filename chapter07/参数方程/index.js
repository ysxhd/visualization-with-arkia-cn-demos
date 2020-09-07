import Vector2D from '../../util/vector2.js';

function draw(points, context, { strokeStyle = 'black', fillStyle = null, close = false } = {}) {
	context.strokeStyle = strokeStyle;
	context.beginPath();
	context.moveTo(...points[0]);
	for (let i = 1; i < points.length; i++) {
		context.lineTo(...points[i]);
	}
	if (close) context.closePath();
	if (fillStyle) {
		context.fillStyle = fillStyle;
		context.fill();
	}
	context.stroke();
}

function parametric(xFunc, yFunc) {
	return function (start, end, seg = 100, ...args) {
		const points = [];
		for (let i = 0; i < seg; i++) {
			const p = i / seg;
			const t = (1 - p) * start + p * end;
			const x = xFunc(t, ...args);
			const y = yFunc(t, ...args);
			points.push([x, y]);
		}
		return {
			points,
			draw: draw.bind(null, points)
		};
	};
}

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const { width, height } = canvas;
ctx.translate(width / 2, height / 2);
ctx.scale(1, -1);

// const pora = parametric(
// 	t => 25 * t,
// 	t => 25 * t ** 2
// );
// pora(-10, 10).draw(ctx);

// const helical = parametric(
// 	(t, l) => l * t * Math.cos(t),
// 	(t, l) => l * t * Math.sin(t)
// );
// helical(0, 50, 500, 5).draw(ctx, { strokeStyle: 'blue' });

// const star = parametric(
// 	(t, l) => l * Math.cos(t) ** 3,
// 	(t, l) => l * Math.sin(t) ** 3
// );
// star(0, Math.PI * 2, 50, 150).draw(ctx, { strokeStyle: 'red' });

// const quadricBezier = parametric(
// 	(t, [{ x: x0 }, { x: x1 }, { x: x2 }]) => (1 - t) ** 2 * x0 + 2 * t * (1 - t) * x1 + t ** 2 * x2,
// 	(t, [{ y: y0 }, { y: y1 }, { y: y2 }]) => (1 - t) ** 2 * y0 + 2 * t * (1 - t) * y1 + t ** 2 * y2
// );

// const p0 = new Vector2D(0, 0);
// const p1 = new Vector2D(100, 0);
// p1.rotate(0.75);
// const p2 = new Vector2D(200, 0);
// const count = 30;
// for (let i = 0; i < count; i++) {
// 	p1.rotate((2 / count) * Math.PI);
// 	p2.rotate((2 / count) * Math.PI);
// 	quadricBezier(0, 1, 100, [p0, p1, p2]).draw(ctx);
// }

const cubicBezier = parametric(
	(t, [{ x: x0 }, { x: x1 }, { x: x2 }, { x: x3 }]) =>
		(1 - t) ** 3 * x0 + 3 * t * (1 - t) ** 2 * x1 + 3 * (1 - t) * t ** 2 * x2 + t ** 3 * x3,
	(t, [{ y: y0 }, { y: y1 }, { y: y2 }, { y: y3 }]) =>
		(1 - t) ** 3 * y0 + 3 * t * (1 - t) ** 2 * y1 + 3 * (1 - t) * t ** 2 * y2 + t ** 3 * y3
);

const p0 = new Vector2D(0, 0);
const p1 = new Vector2D(100, 0);
p1.rotate(0.75);
const p2 = new Vector2D(150, 0);
p2.rotate(-0.75);
const p3 = new Vector2D(200, 0);
const count = 30;
for (let i = 0; i < count; i++) {
	p1.rotate((2 / count) * Math.PI);
	p2.rotate((2 / count) * Math.PI);
	p3.rotate((2 / count) * Math.PI);
	cubicBezier(0, 1, 100, [p0, p1, p2, p3]).draw(ctx);
}
