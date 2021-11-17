export namespace Shared {
    export const SHADER_VERTEX_BASIC = `
    attribute vec2 a_position;
    uniform vec2 u_resolution;
    uniform vec4 u_translation;


    void main(void) {
        vec2 position = a_position * u_translation.zw + u_translation.xy;

        vec2 clipSpace = (position / u_resolution) * 2.0 - 1.0;

        gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
    }`

    export const SHADER_FRAGMENT_BASIC = `
    void main(void) {
        gl_FragColor = vec4(1, 1, 1, 1);
    }
    `
}