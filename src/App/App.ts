import Context from "../Context"
import { Color } from "../Util/Color"
import { ERenderState } from "./ERenderState"
import { Shared } from "./Primitives/Shared"
import { Program } from "./Resource/Program"
import { ResourceHolder } from "./Resource/ResourceHolder"

const { gl, canvas, requestAnimationFrame } = Context.documentInstance
const window = Context.windowInstance

export class App {

    private render_state: ERenderState = ERenderState.STOPPED
    private previous_render_time: number = 0
    private start_time: number = 0
    private time_seconds: number = 0

    private _clear_color: Color.RGBA = Color.Make([0,0,0,0])

    private _resolutionuniform: WebGLUniformLocation | null = null
    private _timeuniform: WebGLUniformLocation | null = null

    public get clearColor() { return this._clear_color }
    public set clearColor(clear_color: Color.Resolvable) { this._clear_color = Color.Make(clear_color) }

    constructor() {
        ResourceHolder.CreateProgram("shader_basic",
            ResourceHolder.CreateShaderFromString(gl.VERTEX_SHADER, Shared.SHADER_VERTEX_BASIC),
            ResourceHolder.CreateShaderFromString(gl.FRAGMENT_SHADER, Shared.SHADER_FRAGMENT_BASIC))
    }

    public async init() {
        let start = performance.now()

        await this.create()

        gl.viewport(0, 0, canvas.width, canvas.height)

        window.addEventListener("resize", () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
            gl.viewport(0, 0, canvas.width, canvas.height)
            gl.uniform2f(this._resolutionuniform, canvas.width, canvas.height)
        })

        this.kickstart()

        console.log(`Startup took ${(performance.now() - start).toFixed(1)}ms`)
    }

    protected SetGeneralAttributes() {
        let positionattribute = gl.getAttribLocation(ResourceHolder.WebGLProgram, 'a_position')
        gl.vertexAttribPointer(positionattribute, 2, gl.FLOAT, false, 0, 0)
        gl.enableVertexAttribArray(positionattribute)

        let uvattribute = gl.getAttribLocation(ResourceHolder.WebGLProgram, 'a_texcoord')
        gl.vertexAttribPointer(uvattribute, 2, gl.FLOAT, false, 0, 0)
        gl.enableVertexAttribArray(uvattribute)

        this._resolutionuniform = gl.getUniformLocation(ResourceHolder.WebGLProgram, 'u_resolution')
        gl.uniform2f(this._resolutionuniform, canvas.width, canvas.height)

        this._timeuniform = gl.getUniformLocation(ResourceHolder.WebGLProgram, 'u_time')
        gl.uniform1f(this._timeuniform, this.time_seconds)
    }

    private kickstart() {
        this.render_state = ERenderState.RUNNING
        this.start_time = Date.now()

        gl.enable(gl.BLEND)
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
        
        this.loop()

    }

    public ClearScreen() {
        gl.clearColor(...Color.AsNormalizedArray(this._clear_color))
        gl.clear(gl.COLOR_BUFFER_BIT)
    }

    private loop() {
        let t = Date.now()
        this.time_seconds = (t - this.start_time) / 1000

        if(this.render_state !== ERenderState.RUNNING) return

        this.ClearScreen()

        let dt = (t - this.previous_render_time) / 1000

        this.SetGeneralAttributes()
        this.render(t - this.start_time, dt)

        this.previous_render_time = t

        requestAnimationFrame(this.loop.bind(this))
    }

    protected create() { throw 'Implement Create' }
    protected render(t: number, dt: number) { throw 'Implement Render' }
}

