function render() {
  const canvas = document.querySelector('#canvas')
  const gl = canvas.getContext('webgl')

  // 如果获取不到上下文，gl为null
  if (!gl) {
    return
  }

  const program = webglUtils.createProgramFromScripts(gl, ['2d-vertex-shader', '2d-fragment-shader'])
  // console.log(program);

  // init
  const positionLocation = gl.getAttribLocation(program, 'a_position')

  const resolutionLocation = gl.getUniformLocation(program, 'u_resolution')
  const translationLocation = gl.getUniformLocation(program, 'u_translation')
  const colorLocation = gl.getUniformLocation(program, 'u_color')

  gl.useProgram(program)

  const positionBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
  setGeometry(gl)

  const translation = [0, 0]
  const color = [Math.random(), Math.random(), Math.random(), 1]
  drawScene()

  webglLessonsUI.setupSlider('#x', { slide: updatePosition(0), max: gl.canvas.width })
  webglLessonsUI.setupSlider('#y', { slide: updatePosition(1), max: gl.canvas.height })


  function updatePosition(index) {
    return function(event, ui) {
      translation[index] = ui.value;
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

    gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.width)
    gl.uniform4fv(colorLocation, color)
    gl.uniform2fv(translationLocation, translation)

    gl.drawArrays(gl.TRIANGLES, 0, 18)
  }

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

render();
