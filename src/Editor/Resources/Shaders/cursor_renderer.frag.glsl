precision mediump float;

uniform vec4 u_codepoint;

uniform float u_time;

void main(void) {
    float alpha = mod(u_time, 1.0) < 0.5 ? 0.0 : 1.0;

    gl_FragColor = vec4(1,0,0, alpha);
}