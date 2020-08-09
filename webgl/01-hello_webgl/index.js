// https://webglfundamentals.org/webgl/lessons/zh_cn/webgl-fundamentals.html
// 创建着色器方法，参数：渲染上下文，类型，数据源
function createShader(gl, type, source) {
  // 创建着色器对象
  const shader = gl.createShader(type)
  // 提供数据源
  gl.shaderSource(shader, source)
  // 编译生成着色器
  gl.compileShader(shader)
  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
  if (success) {
    return shader
  }
  console.log(gl.getShaderInfoLog(shader))
  gl.deleteShader(shader)
}

function createProgram(gl, vertexShader, fragmentShader) {
  const program = gl.createProgram()
  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)
  const success = gl.getProgramParameter(program, gl.LINK_STATUS)
  if (success) {
    return program
  }
  console.log(gl.getProgramInfoLog(program))
  gl.deleteProgram(program)
}

function resize(gl) {
  const realToCSSPixels = window.devicePixelRatio

  // 获取浏览器显示的画布的CSS像素值
  // 然后计算出设备像素设置drawingbuffer
  const displayWidth = Math.floor(gl.canvas.clientWidth * realToCSSPixels)
  const displayHeight = Math.floor(gl.canvas.clientHeight * realToCSSPixels)

  // 检查画布尺寸是否相同
  if (gl.canvas.width !== displayWidth || gl.canvas.height !== displayHeight) {
    // 设置为相同的尺寸
    gl.canvas.width = displayWidth
    gl.canvas.height = displayHeight
  }
}

// 返回 0 到 range 范围内的随机整数
function randomInt(range) {
  return Math.floor(Math.random() * range)
}

// 用参数生成矩形顶点并写进缓冲
function setRectangle(gl, x, y, width, height) {
  var x1 = x
  var x2 = x + width
  var y1 = y
  var y2 = y + height

  // 注意: gl.bufferData(gl.ARRAY_BUFFER, ...) 将会影响到
  // 当前绑定点`ARRAY_BUFFER`的绑定缓冲
  // 目前我们只有一个缓冲，如果我们有多个缓冲
  // 我们需要先将所需缓冲绑定到`ARRAY_BUFFER`
  // 就是说要往哪个缓冲写数据，就要把缓冲绑定到绑定点上

  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([x1, y1, x2, y1, x1, y2, x1, y2, x2, y1, x2, y2]),
    gl.STATIC_DRAW
  )
}

function main() {
  // 获取webgl上下文
  const canvas = document.querySelector('canvas')
  const gl = canvas.getContext('webgl')

  if (!gl) {
    return
  }

  // 生成着色器程序，一对着色器vertex-shader和fragment-shader
  const vertexShaderSource = document.getElementById('2d-vertex-shader').text
  const fragmentShaderSource = document.getElementById('2d-fragment-shader')
    .text
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource)
  const fragmentShader = createShader(
    gl,
    gl.FRAGMENT_SHADER,
    fragmentShaderSource
  )
  const program = createProgram(gl, vertexShader, fragmentShader)

  // const program = webglUtils.createProgramFromScripts(gl, [
  //   '2d-vertex-shader',
  //   '2d-fragment-shader'
  // ]);

  // 初始化，获取所有属性和全局变量的位置
  const positionAttributeLocation = gl.getAttribLocation(program, 'a_position')
  const colorUniformLocation = gl.getUniformLocation(program, 'u_color')
  const resolutionUniformLocation = gl.getUniformLocation(
    program,
    'u_resolution'
  )

  // 创建一个缓冲将它绑定到绑定点上，我们需要通过绑定点向缓冲中放入数据
  const positionBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)

  // 调整drawingBuffer和显示尺寸的大小，重设视域
  webglUtils.resizeCanvasToDisplaySize(gl.canvas)
  // 告诉webgl如何将裁剪空间转换到像素
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)

  // 清空画布
  gl.clearColor(0, 0, 0, 0)
  gl.clear(gl.COLOR_BUFFER_BIT)

  // 使用着色程序
  gl.useProgram(program)
  // 启用对应属性
  gl.enableVertexAttribArray(positionAttributeLocation)
  // 将buffer绑定到绑定点
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)

  // 告诉属性如何从positionBuffer中读取数据
  const size = 2 // 每次迭代运行提取两个单位的数据
  const type = gl.FLOAT // 数据类型，每个单位的数据是32位的浮点数
  const normlize = false // 是否归一化
  const stride = 0 // 0 = 移动单位数量 * 每个单位占用内存（sizeof(type)）
  // 每次迭代运行运动多少内存到下一个数据开始点
  const offset = 0 // 从缓冲起始位置开始读取

  // 降属性绑定到ARRAY_BUFFER上，也就是绑定到positionBuffer上，此时将ARRAY_BUFFER绑定到其他数据上
  // 该属性依旧从positionBuffer上读取数据
  gl.vertexAttribPointer(
    positionAttributeLocation,
    size,
    type,
    normlize,
    stride,
    offset
  )

  // 设置u_resolution全局变量，只能在使用program后，才可以注入数据
  gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height)

  // 绘制50个随机颜色矩形
  for (var ii = 0; ii < 50; ++ii) {
    // 创建一个随机矩形
    // 并将写入位置缓冲
    // 因为位置缓冲是我们绑定在
    // `ARRAY_BUFFER`绑定点上的最后一个缓冲
    setRectangle(
      gl,
      randomInt(300),
      randomInt(300),
      randomInt(300),
      randomInt(300)
    )

    // 设置一个随机颜色
    gl.uniform4f(
      colorUniformLocation,
      Math.random(),
      Math.random(),
      Math.random(),
      1
    )

    // 绘制矩形
    gl.drawArrays(gl.TRIANGLES, 0, 6)
  }
}

main()
