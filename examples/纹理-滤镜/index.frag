precision highp float;

uniform sampler2D tMap;
uniform mat4 colorMartix;
varying vec2 vUv;

void main() {
    vec4 color = texture2D(tMap, vUv);
    gl_FragColor = colorMartix * vec4(color.rgb, 1.0);
    gl_FragColor.a = color.a;
}