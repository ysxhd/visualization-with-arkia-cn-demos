const canvas = document.getElementById('paper');
const renderer = new GlRenderer(canvas);

(async function () {
	const program = await renderer.load('./index.frag', './index.vert');
	renderer.useProgram(program);
	const texture = await renderer.loadTexture('/assets/girl1.jpg');
	renderer.uniforms.tMap = texture;
	const r = 0.2126,
		g = 0.7152,
		b = 0.0722;
	renderer.uniforms.colorMartix = [r, r, r, 0, g, g, g, 0, b, b, b, 0, 0, 0, 0, 1];

	renderer.setMeshData([
		{
			positions: [
				[-1, -1],
				[-1, 1],
				[1, 1],
				[1, -1]
			],
			attributes: {
				a_uv: [
					[0, 0],
					[0, 1],
					[1, 1],
					[1, 0]
				]
			},
			cells: [
				[0, 1, 2],
				[2, 0, 3]
			]
		}
	]);

	renderer.render();
})();
