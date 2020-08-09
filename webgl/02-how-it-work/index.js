'use strict'

function setGeometry(gl) {
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([0, -100, 150, 125, -175, 100]),
    gl.STATIC_DRAW
  )
}

function main() {
  const canvas = document.getElementById('canvas')
  const gl = canvas.getContext('webgl')
  if (!gl) {
    return
  }
  // 编译并链接两个着色器，生成着色器程序
  const program = webglUtils.createProgramFromScripts(gl, [
    '2d-vertex-shader',
    '2d-fragment-shader'
  ])
  // 初始化
  const positionAttributeLocation = gl.getAttribLocation(program, 'a_position')
  const matrixLocation = gl.getUniformLocation(program, 'u_matrix')

  // 创建buffer并绑定到ARRAY_BUFFER
  const positionBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
  setGeometry(gl)

  let translation = [200, 150]
  let angleInRadians = 0
  let scale = [1, 1]

  drawScene()

  // 设置控制组件
  webglLessonsUI.setupSlider('#x', {
    value: translation[0],
    slide: updatePosition(0),
    max: gl.canvas.width
  })
  webglLessonsUI.setupSlider('#y', {
    value: translation[1],
    slide: updatePosition(1),
    max: gl.canvas.height
  })
  webglLessonsUI.setupSlider('#angle', { slide: updateAngle, max: 360 })
  webglLessonsUI.setupSlider('#scaleX', {
    value: scale[0],
    slide: updateScale(0),
    min: -5,
    max: 5,
    step: 0.01,
    precision: 2
  })
  webglLessonsUI.setupSlider('#scaleY', {
    value: scale[1],
    slide: updateScale(1),
    min: -5,
    max: 5,
    step: 0.01,
    precision: 2
  })

  function updatePosition(index) {
    return function(event, ui) {
      translation[index] = ui.value
      drawScene()
    }
  }

  function updateAngle(event, ui) {
    var angleInDegrees = 360 - ui.value
    angleInRadians = angleInDegrees * Math.PI / 180
    drawScene()
  }

  function updateScale(index) {
    return function(event, ui) {
      scale[index] = ui.value
      drawScene()
    }
  }

  function drawScene() {
    webglUtils.resizeCanvasToDisplaySize(gl.canvas)
    // 将裁剪空间转换到像素空间
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
    gl.clear(gl.COLOR_BUFFER_BIT)

    // 使用着色器程序
    gl.useProgram(program)
    // 开启定点着色器
    gl.enableVertexAttribArray(positionAttributeLocation)
    // 绑定位置缓冲到绑定点，相当于ARRAY_BUFFER=positionBuffer
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)

    // 告诉属性如何读取数据
    const size = 2
    const type = gl.FLOAT
    const normalize = false
    const stride = 0
    const offset = 0
    gl.vertexAttribPointer(
      positionAttributeLocation,
      size,
      type,
      normalize,
      stride,
      offset
    )

    // 计算矩阵
    let matrix = m3.projection(gl.canvas.clientWidth, gl.canvas.clientHeight)
    matrix = m3.translate(matrix, translation[0], translation[1])
    matrix = m3.rotate(matrix, angleInRadians)
    matrix = m3.scale(matrix, scale[0], scale[1])
    gl.uniformMatrix3fv(matrixLocation, false, matrix)

    // 绘制三角形图元
    gl.drawArrays(gl.TRIANGLES, 0, 3)
  }
}

main()
