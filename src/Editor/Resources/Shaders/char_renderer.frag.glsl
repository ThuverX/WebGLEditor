precision mediump float;

uniform vec4 u_codepoint;
uniform vec4 u_codepointmod;

uniform float u_time;

varying highp vec2 v_texcoord;
uniform sampler2D u_tex;

float median(float r, float g, float b) {
    return max(min(r, g), min(max(r, g), b));
}


void main(void) {
    vec4 texColor = texture2D(u_tex, (v_texcoord * u_codepoint.zw + u_codepoint.xy) * u_codepointmod.zw + u_codepointmod.xy);
    // vec4 texColor = vec4(1);
    vec3 color = vec3(sin(u_time), cos(u_time + 20.0) , sin(u_time + 200.0));

    float sigDist = median(texColor.r, texColor.g, texColor.b) - 0.5;
    float alpha = step(0.5, sigDist);
    gl_FragColor = vec4(color, alpha);
    if (gl_FragColor.a < 0.01) discard;
    // gl_FragColor = vec4(vec3(1), 1);
}