precision highp float;

attribute vec2 a_vertexPosition;
attribute vec2 a_uv;

varying vec2 vUv;

void main() {
    vUv = a_uv;
    gl_Position = vec4(a_vertexPosition, 1.0, 1.0);
}