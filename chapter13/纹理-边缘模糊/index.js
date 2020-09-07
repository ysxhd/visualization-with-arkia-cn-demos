import { loadImage, getImageData, traverse } from '../../util/index.js';

(async function () {
	const canvas = document.querySelector('#paper');
	const ctx = canvas.getContext('2d');
	const img = await loadImage('/assets/girl1.jpg');
	const imageData = getImageData(img);
	traverse(imageData, ({ r, g, b, a, x, y }) => {
		const d = Math.hypot(y - 0.5, x - 0.5);
		a *= 1.0 - 2.0 * d;
		return [r, g, b, a];
	});
	canvas.width = imageData.width;
	canvas.height = imageData.height;
	ctx.putImageData(imageData, 0, 0);
})();
