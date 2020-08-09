function setRectangle(gl, x, y, width, height) {
  const x1 = x
  const x2 = x + width
  const y1 = y
  const y2 = y + height
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([x1, y1, x2, y1, x1, y2, x1, y2, x2, y1, x2, y2]), // 两个三角形六个点构成一个矩形
    gl.STATIC_DRAW
  )
}

async function render() {
  // Get A WebGL context
  const canvas = document.getElementById('canvas')
  const gl = canvas.getContext('webgl')
  if (!gl) {
    return
  }

  // 初始化, 加载图片资源
  const response = await fetch('./pikaqiu.jpg')
  const blob = await response.blob()
  const image = await createImageBitmap(blob)

  // setup GLSL program
  const program = webglUtils.createProgramFromScripts(gl, [
    '2d-vertex-shader',
    '2d-fragment-shader'
  ])

  // look up where the vertex data needs to go.
  const positionLocation = gl.getAttribLocation(program, 'a_position')
  const texcoordLocation = gl.getAttribLocation(program, 'a_texCoord')

  // Create a buffer to put three 2d clip space points in
  const positionBuffer = gl.createBuffer()

  // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
  // Set a rectangle the same size as the image.
  setRectangle(gl, 0, 0, image.width, image.height)

  // provide texture coordinates for the rectangle.
  var texcoordBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer)
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      0.0,
      0.0,
      1.0,
      0.0,
      0.0,
      1.0,
      0.0,
      1.0,
      1.0,
      0.0,
      1.0,
      1.0
    ]),
    gl.STATIC_DRAW
  )

  // Create a texture.
  var texture = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, texture)

  // Set the parameters so we can render any size image.
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)

  // Upload the image into the texture.
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)

  // lookup uniforms
  var resolutionLocation = gl.getUniformLocation(program, 'u_resolution')

  webglUtils.resizeCanvasToDisplaySize(gl.canvas)

  // Tell WebGL how to convert from clip space to pixels
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)

  // Clear the canvas
  gl.clearColor(0, 0, 0, 0)
  gl.clear(gl.COLOR_BUFFER_BIT)

  // Tell it to use our program (pair of shaders)
  gl.useProgram(program)

  // Turn on the position attribute
  gl.enableVertexAttribArray(positionLocation)

  // Bind the position buffer.
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)

  // start at the beginning of the buffer
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)

  // Turn on the teccord attribute
  gl.enableVertexAttribArray(texcoordLocation)

  // Bind the position buffer.
  gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer)

  // start at the beginning of the buffer
  gl.vertexAttribPointer(texcoordLocation, 2, gl.FLOAT, false, 0, 0)

  // set the resolution
  gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height)

  // Draw the rectangle.
  gl.drawArrays(gl.TRIANGLES, 0, 6)
}

render()
