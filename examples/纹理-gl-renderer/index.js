const canvas = document.getElementById('paper');
const renderer = new GlRenderer(canvas);

(async function () {
	const program = await renderer.load('./index.frag', './index.vert');
	renderer.useProgram(program);

	const texture = await renderer.loadTexture('/assets/girl1.jpg');
	renderer.uniforms.tMap = texture;

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
