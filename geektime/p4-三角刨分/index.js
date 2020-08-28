import Vector2D from '../../util/vector2.js';

function draw(context, points, { fillStyle = 'black', close = false, rule = 'nonzero' } = {}) {
	context.beginPath();
	context.moveTo(...points[0]);
	for (let i = 1; i < points.length; i++) {
		context.lineTo(...points[i]);
	}
	if (close) context.closePath();
	context.fillStyle = fillStyle;
	context.fill(rule);
}

function inTriangle(p1, p2, p3, point) {
	const a = p2.copy().sub(p1);
	const b = p3.copy().sub(p2);
	const c = p1.copy().sub(p3);

	const u1 = point.copy().sub(p1);
	const u2 = point.copy().sub(p2);
	const u3 = point.copy().sub(p3);

	const s1 = Math.sign(a.cross(u1));
	let p = a.dot(u1) / a.length ** 2;
	if (s1 === 0 && p >= 0 && p <= 1) return true;

	const s2 = Math.sign(b.cross(u2));
	p = b.dot(u1) / b.length ** 2;
	if (s2 === 0 && p >= 0 && p <= 1) return true;

	const s3 = Math.sign(c.cross(u3));
	p = c.dot(u1) / c.length ** 2;
	if (s3 === 0 && p >= 0 && p <= 1) return true;

	return s1 === s2 && s2 === s3;
}

function isPointInPath({ vertices, cells }, point) {
	let ret = false;
	for (let i = 0; i < cells.length; i += 3) {
		const p1 = new Vector2D(...vertices[cells[i]]);
		const p2 = new Vector2D(...vertices[cells[i + 1]]);
		const p3 = new Vector2D(...vertices[cells[i + 2]]);
		if (inTriangle(p1, p2, p3, point)) {
			ret = true;
			break;
		}
	}
	return ret;
}

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const { width, height } = canvas;
ctx.translate(width * 0.5, height * 0.5);
ctx.scale(1, -1);

const vertices = [
	[-0.7, 0.5],
	[-0.4, 0.3],
	[-0.25, 0.71],
	[-0.1, 0.56],
	[-0.1, 0.13],
	[0.4, 0.21],
	[0, -0.6],
	[-0.3, -0.3],
	[-0.6, -0.3],
	[-0.45, 0.0]
];
const poitions = vertices.map(([x, y]) => [(x * width) / 2, (y * height) / 2]);

const { left, top } = canvas.getBoundingClientRect();

canvas.addEventListener('mousemove', evt => {
	const { x, y } = evt;
	const offsetX = (2 * (x - left)) / canvas.width - 1.0;
	const offsetY = 1.0 - (2 * (y - top)) / canvas.height;
	const point = new Vector2D(offsetX, offsetY);

	ctx.clearRect(-256, 256, 256, -256);
	const cells = earcut(poitions.flat());
	const res = isPointInPath({ vertices, cells }, point);
	if (res) {
		draw(ctx, poitions, { fillStyle: 'orange' });
	} else {
		draw(ctx, poitions, { fillStyle: 'red' });
	}
});
