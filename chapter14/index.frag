// Author: lidongjies@gmail.com
// Title: SDF Rectangle

precision highp float;

uniform vec2 u_resolution;

float line_distance(vec2 st, vec2 a, vec2 b) {
    vec3 ab = vec3(b - a, 0.0);
    vec3 p = vec3(st - a, 0.0);
    return cross(p, normalize(ab)).z;
}

float seg_distance(vec2 st, vec2 a, vec2 b) {
    vec3 ab = vec3(b - a, 0.0);
    vec3 p = vec3(st - a, 0.0);
    float l = length(ab);
    float proj = dot(p, ab) / l;
    float d = abs(cross(p, normalize(ab)).z);
    if (proj >= 0.0 && proj <= l) return d;
    return min(distance(st, a), distance(st, b));
}

float rectangle_sdf(vec2 st, vec2 a, vec2 b, vec2 c) {
    float d1 = line_distance(st, a, b);
    float d2 = line_distance(st, b, c);
    float d3 = line_distance(st, c, a);
    
    if (d1 >= 0.0 && d2 >= 0.0 && d3 >= 0.0 || d1 <= 0.0 && d2 <= 0.0 && d3 <= 0.0) {
        return -min(abs(d1), min(abs(d2), abs(d3)));
    }
    
    return min(seg_distance(st, a, b), min(seg_distance(st, b, c), seg_distance(st, c, a)));
}

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    vec2 a = vec2(-1.577, 0) - vec2(0.5);
    float d = rectangle_sdf(st, vec2(0.3, 0.3), vec2(0.5, 0.7), vec2(0.7, 0.3));
    vec3 color = (1.0 - smoothstep(0.0, 0.01, d)) * vec3(1.0);
    gl_FragColor.rgb = color;
    gl_FragColor.a = 1.0;
}