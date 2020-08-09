function render() {
  const canvas = document.querySelector('#canvas')
  const gl = canvas.getContext('webgl')
  if (!gl) {
    return;
  }

  const program = webglUtils.createProgramFromScripts(gl, ['2d-vertex-shader', '2d-fragment-shader'])

  // init
  const positionLocation = gl.getAttribLocation(program, 'a_position')
  const resolutionLocation = gl.getUniformLocation(program, 'u_resolution')
  const translationLocation = gl.getUniformLocation(program, 'u_translation')
  const rotationLocation = gl.getUniformLocation(program, 'u_rotation')
  const colorLocation = gl.getUniformLocation(program, 'u_color')

  gl.useProgram(program)

  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
  setGeometry(gl)
  gl.bindBuffer(gl.ARRAY_BUFFER, null)

  const translation = [100, 150]
  const rotation = [0, 1]
  const color = [Math.random(), Math.random(), Math.random(), 1]

  drawScene()

  webglLessonsUI.setupSlider('#x', { value: translation[0], slide: updatePosition(0), max: gl.canvas.width })
  webglLessonsUI.setupSlider('#y', { value: translation[1], slide: updatePosition(1), max: gl.canvas.height })
  $("#rotation").gmanUnitCircle({
    width: 200,
    height: 200,
    value: 0,
    slide: function(e,u) {
      rotation[0] = u.x;
      rotation[1] = u.y;
      drawScene();
    }
  })

  function updatePosition(index) {
    return function(event, ui) {
      translation[index] = ui.value
      drawScene()
    }
  }

  function drawScene() {
    webglUtils.resizeCanvasToDisplaySize(gl.canvas)
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.useProgram(program)

    gl.enableVertexAttribArray(positionLocation)
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)

    gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height)
    gl.uniform2fv(translationLocation, translation)
    gl.uniform2fv(rotationLocation, rotation)
    gl.uniform4fv(colorLocation, color)

    gl.drawArrays(gl.TRIANGLES, 0, 18)
  }

  // Fill the buffer with the values that define a letter 'F'.
  function setGeometry(gl) {
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([
            // left column
            0, 0,
            30, 0,
            0, 150,
            0, 150,
            30, 0,
            30, 150,

            // top rung
            30, 0,
            100, 0,
            30, 30,
            30, 30,
            100, 0,
            100, 30,

            // middle rung
            30, 60,
            67, 60,
            30, 90,
            30, 90,
            67, 60,
            67, 90,
        ]),
        gl.STATIC_DRAW);
  }
}

$(render)
