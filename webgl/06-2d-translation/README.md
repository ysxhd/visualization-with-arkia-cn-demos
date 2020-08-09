## 二维平移

做二位平移时，最好的方式就是将平移向量通过uniform传递到顶点着色器内部，顶点着色器通过原始位置和便宜向量运算得到最终的顶点位置，这样我们的代码主体不用改变，大量的运算交给webgl做，就如同这个例子的写法。

```glsl
attribute vec2 a_position;
uniform vec2 u_resolution;
uniform vec2 u_translation;

void main(void) {
    vec2 position = a_position + u_translation;
    vec2 zeroToOne = position / u_resolution;
    vec2 zeroToTwo = zeroToOne * 2.0;
    vec2 clipSpace = zeroToTwo - 1.0;
    // 将webgl的坐标系映射到普通坐标系，反转坐标系
    // vec4 第三个参数是z轴位置，第四个参数是齐次数
    gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
}
```

```js
const translation = [0, 0]
// ...
gl.uniform2fv(translationLocation, translation)

```

最差的方式就是每次通过setRectangle函数进行位置运算，然后重新设置到positionBuffer中，这样消耗了js的运算能力，况且js不适合做运算，而且还容易出bug。
