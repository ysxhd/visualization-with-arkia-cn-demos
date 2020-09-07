import { loadImage, getImageData, traverse, getPixel } from '/util/index.js';
import { transformColor, brightness, saturate } from '/util/color-matrix.js';

const canvas = document.getElementById('paper');
const ctx = canvas.getContext('2d');

(async function () {
	const girlImg = await loadImage('/assets/girl1.jpg');
	const sunlight = await loadImage('/assets/sunlight.png');

	const girlImageData = getImageData(girlImg);
	const sunlightTexture = getImageData(sunlight);

	traverse(girlImageData, ({ r, g, b, a, index }) => {
		const texColor = getPixel(sunlightTexture, index);
		return transformColor([r, g, b, a], brightness(1 + 0.7 * texColor[3]), saturate(2 - texColor[3]));
	});

	canvas.width = girlImageData.width;
	canvas.height = girlImageData.height;
	ctx.putImageData(girlImageData, 0, 0);
})();
