import { loadImage, getImageData, traverse, gaussianBlur } from '../../util/index.js';
import { transformColor, channel, brightness, saturate } from '../../util/color-matrix.js';

const canvas = document.getElementById('paper');
const context = canvas.getContext('2d');

(async function () {
	const img = await loadImage('https://p2.ssl.qhimg.com/d/inn/4b7e384c55dc/girl1.jpg');
	const imageData = getImageData(img);
	traverse(imageData, ({ r, g, b, a }) => {
		return transformColor([r, g, b, a], channel({ r: 1.2 }), brightness(1.2), saturate(1.2));
	});
	// const { data, width, height } = imageData;
	// gaussianBlur(data, width, height);
	canvas.width = imageData.width;
	canvas.height = imageData.height;
	context.putImageData(imageData, 0, 0);
})();
