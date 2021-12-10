precision mediump float;

varying highp vec2 v_texcoord;

uniform float u_time;

void main(void) {
    float alpha = mod(u_time, 1.0) > 0.5 && v_texcoord.x < 0.1 ? 1.0 : 0.0;

    gl_FragColor = vec4(vec3(1), alpha);
}