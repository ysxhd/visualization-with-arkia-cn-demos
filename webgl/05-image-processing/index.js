async function render() {
  const canvas = document.getElementById('canvas')
  const gl = canvas.getContext('webgl')
  if (!gl) {
    return
  }
  // 初始化，创建着色器
  const program = webglUtils.createProgramFromScripts(gl, [
    '2d-vertex-shader',
    '2d-fragment-shader'
  ])

  // 加载纹理要使用的图像
  const path = 'https://webglfundamentals.org/webgl/resources/leaves.jpg'
  const response = await fetch(path)
  const blob = await response.blob()
  const image = await createImageBitmap(blob)

  // lookup attribute and uniform
  const positionLocation = gl.getAttribLocation(program, 'a_position')
  const texcoordLocation = gl.getAttribLocation(program, 'a_texCoord')

  // 创建 positionBuffer
  const positionBuffer = gl.createBuffer()
  // 将 positionBuffer 绑定到绑定点
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
  // 设置一个和图片大小相同的矩形
  setRectangle(gl, 0, 0, image.width, image.height)
  // 取消绑定点绑定的缓冲
  gl.bindBuffer(gl.ARRAY_BUFFER, null)

  // 创建texture
  const textureBuffer = gl.createBuffer()
  // 为矩形提供纹理坐标
  gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer)
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      0.0, 0.0,
      1.0, 0.0,
      0.0, 1.0,
      0.0, 1.0,
      1.0, 0.0,
      1.0, 1.0
    ]),
    gl.STATIC_DRAW
  )
  gl.bindBuffer(gl.ARRAY_BUFFER, null)

  function createAndSetupTexture(gl) {
    const texture = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, texture)
    // 设置这些属性使得纹理可以使用非2次幂图像
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
    return texture
  }

  // 创建纹理并将图像上传到该纹理上
  const originImageTexture = createAndSetupTexture(gl)
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)

  // 创建两个纹理并绑定到帧缓冲区
  const textures = []
  const framebuffers = []
  for (let ii = 0; ii < 2; ii++) {
    const texture = createAndSetupTexture(gl)
    // 将纹理设置为和图片大小相同
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, image.width, image.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null)
    textures.push(texture)

    const framebuffer = gl.createFramebuffer()
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer)
    framebuffers.push(framebuffer)

    // 将纹理绑定到帧缓冲
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0)
  }

  // lookup uniforms
  const resolutionLocation = gl.getUniformLocation(program, 'u_resolution')
  const flipYLocation = gl.getUniformLocation(program, 'u_flipY')
  const textureSizeLocation = gl.getUniformLocation(program, 'u_textureSize')
  const kernelLocation = gl.getUniformLocation(program, 'u_kernel[0]')
  const kernelWeightLocation = gl.getUniformLocation(program, 'u_kernelWeight')

  // Define several convolution kernels
  const kernels = {
    normal: [
      0, 0, 0,
      0, 1, 0,
      0, 0, 0
    ],
    gaussianBlur: [
      0.045, 0.122, 0.045,
      0.122, 0.332, 0.122,
      0.045, 0.122, 0.045
    ],
    gaussianBlur2: [
      1, 2, 1,
      2, 4, 2,
      1, 2, 1
    ],
    gaussianBlur3: [
      0, 1, 0,
      1, 1, 1,
      0, 1, 0
    ],
    unsharpen: [
      -1, -1, -1,
      -1, 9, -1,
      -1, -1, -1
    ],
    sharpness: [
      0, -1, 0,
      -1, 5, -1,
      0, -1, 0
    ],
    sharpen: [
      -1, -1, -1,
      -1, 16, -1,
      -1, -1, -1
    ],
    edgeDetect: [
      -0.125, -0.125, -0.125,
      -0.125, 1, -0.125,
      -0.125, -0.125, -0.125
    ],
    edgeDetect2: [
      -1, -1, -1,
      -1, 8, -1,
      -1, -1, -1
    ],
    edgeDetect3: [
      -5, 0, 0,
      0, 0, 0,
      0, 0, 5
    ],
    edgeDetect4: [
      -1, -1, -1,
      0, 0, 0,
      1, 1, 1
    ],
    edgeDetect5: [
      -1, -1, -1,
      2, 2, 2,
      -1, -1, -1
    ],
    edgeDetect6: [
      -5, -5, -5,
      -5, 39, -5,
      -5, -5, -5
    ],
    sobelHorizontal: [
      1, 2, 1,
      0, 0, 0,
      -1, -2, -1
    ],
    sobelVertical: [
      1, 0, -1,
      2, 0, -2,
      1, 0, -1
    ],
    previtHorizontal: [
      1, 1, 1,
      0, 0, 0,
      -1, -1, -1
    ],
    previtVertical: [
      1, 0, -1,
      1, 0, -1,
      1, 0, -1
    ],
    boxBlur: [
      0.111, 0.111, 0.111,
      0.111, 0.111, 0.111,
      0.111, 0.111, 0.111
    ],
    triangleBlur: [
      0.0625, 0.125, 0.0625,
      0.125, 0.25, 0.125,
      0.0625, 0.125, 0.0625
    ],
    emboss: [
      -2, -1, 0,
      -1, 1, 1,
      0, 1, 2
    ]
  };

  const effects = [
    { name: "gaussianBlur3", on: true },
    { name: "gaussianBlur3", on: true },
    { name: "gaussianBlur3", on: true },
    { name: "sharpness", },
    { name: "sharpness", },
    { name: "sharpness", },
    { name: "sharpen", },
    { name: "sharpen", },
    { name: "sharpen", },
    { name: "unsharpen", },
    { name: "unsharpen", },
    { name: "unsharpen", },
    { name: "emboss", on: true },
    { name: "edgeDetect", },
    { name: "edgeDetect", },
    { name: "edgeDetect3", },
    { name: "edgeDetect3", },
  ];

  // Setup a ui.
  const ui = document.getElementById('ui')
  const table = document.createElement('table')
  const tbody = document.createElement('tbody')
  for (let ii = 0; ii < effects.length; ++ii) {
    const effect = effects[ii]
    const tr = document.createElement('tr')
    const td = document.createElement('td')
    const chk = document.createElement('input')
    chk.value = effect.name
    chk.type = 'checkbox'
    if (effect.on) {
      chk.checked = 'true'
    }
    chk.onchange = drawEffects
    td.appendChild(chk)
    td.appendChild(document.createTextNode('≡ ' + effect.name))
    tr.appendChild(td)
    tbody.appendChild(tr)
  }
  table.appendChild(tbody)
  ui.appendChild(table)
  $('#ui table').tableDnD({ onDrop: drawEffects })
  drawEffects()

  function drawEffects(evt) {
    // 将drawingbuffer适应canvas大小
    webglUtils.resizeCanvasToDisplaySize(gl.canvas)

    // 清空画布
    gl.clearColor(0, 0, 0, 0)
    gl.clear(gl.COLOR_BUFFER_BIT)

    gl.useProgram(program)

    gl.enableVertexAttribArray(positionLocation)
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)

    gl.enableVertexAttribArray(texcoordLocation)
    gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer)
    gl.vertexAttribPointer(texcoordLocation, 2, gl.FLOAT, false, 0, 0)

    // 设置纹理大小
    gl.uniform2f(textureSizeLocation, image.width, image.height)
    // 从源图像开始
    gl.bindTexture(gl.TEXTURE_2D, originImageTexture)
    //
    gl.uniform1f(flipYLocation, 1)

    // 循环我们想使用的每个效果
    let count = 0
    for (let ii = 0; ii < tbody.rows.length; ii++) {
      const checkbox = tbody.rows[ii].firstChild.firstChild
      if (checkbox.checked) {
        // 将渲染效果循环放入某一个帧缓冲
        setFrameBuffer(framebuffers[count % 2], image.width, image.height)
        drawWithKernel(checkbox.value)
        // 下一次绘制使用刚才渲染的纹理
        gl.bindTexture(gl.TEXTURE_2D, textures[count % 2])
        count++
      }
    }

    gl.uniform1f(flipYLocation, -1)
    setFrameBuffer(null, gl.canvas.width, gl.canvas.height)
    drawWithKernel('normal')
  }

  function setFrameBuffer(framebuffer, weight, height) {
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer)
    gl.uniform2f(resolutionLocation, weight, height)
    gl.viewport(0, 0, weight, height)
  }

  function drawWithKernel(name) {
    // set the kernel and it's weight
    gl.uniform1fv(kernelLocation, kernels[name])
    gl.uniform1f(kernelWeightLocation, computeKernelWeight(kernels[name]))

    // Draw the rectangle.
    var primitiveType = gl.TRIANGLES
    var offset = 0
    var count = 6
    gl.drawArrays(primitiveType, offset, count)
  }
}

function computeKernelWeight(kernel) {
  const weight = kernel.reduce((prev, next) => prev + next)
  return weight <= 0 ? 1 : weight
}

function setRectangle(gl, x, y, width, height) {
  const x1 = x
  const x2 = x + width
  const y1 = y
  const y2 = y + height
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([x1, y1, x2, y1, x1, y2, x1, y2, x2, y1, x2, y2]),
    gl.STATIC_DRAW
  )
}

render()
