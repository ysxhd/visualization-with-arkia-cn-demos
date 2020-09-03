precision highp float;

uniform sampler2D tMap;
uniform sampler2D tCat;
varying vec2 vUv;


void main() {
    vec4 color = texture2D(tMap, vUv);
    vec2 st = vUv * 3.0 - vec2(1.2, 0.5);
    vec4 catColor = texture2D(tCat, st);

    gl_FragColor.rgb = catColor.rgb;
    if (catColor.r < 0.5 && catColor.g > 0.6) {
        gl_FragColor.rgb = color.rgb;
    }
    gl_FragColor.a = color.a;
}