import { App } from "./App/App"
import { QuadPrim } from "./App/Primitives/QuadPrim"
import { Shared } from "./App/Primitives/Shared"
import { ResourceHolder } from "./App/Resource/ResourceHolder"
import Context from "./Context"

const { gl } = Context.documentInstance

const frag = `
precision mediump float;
uniform float u_time;

const float blinktime = 0.5;

void main(void) {
    gl_FragColor = vec4(0, 0, sin(u_time / blinktime), 1);
}
`

export class TestApp extends App {
    private square!: QuadPrim
    private square_two!: QuadPrim

    create() {
        ResourceHolder.CreateProgram("test",
        ResourceHolder.CreateShaderFromString(gl.VERTEX_SHADER, Shared.SHADER_VERTEX_BASIC),
            ResourceHolder.CreateShaderFromString(gl.FRAGMENT_SHADER, frag))
        
        // ResourceHolder.getProgram("test").use()
        

        this.square = new QuadPrim(0, 500)
        this.square_two = new QuadPrim([500,0], 500)
            
        this.square.program = "test"
        
        this.clearColor = [0, 0, 0]
    }
    
    render(t: number, dt: number) {
        this.square_two.draw()
        this.square.draw()
    }
}