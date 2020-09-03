precision highp float;

uniform sampler2D tMap;
uniform float uTime;
varying vec2 vUv;

float random (vec2 st) {
    return fract(
        sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123
    );
}

void main() {
    vec2 st = vUv * vec2(100, 55.4);
    vec2 uv = vUv + 1.0 - 2.0 * random(floor(st));
    vec4 color = texture2D(tMap, mix(uv, vUv, min(uTime, 1.0)));
    gl_FragColor.rgb = color.rgb;
    gl_FragColor.a = color.a * uTime;
}