import Context from "../../Context"
import { IShader } from "./IShader"
import { ResourceHolder } from "./ResourceHolder"

const { gl } = Context.documentInstance

export class Program {
    private _program: WebGLProgram
    private _vertexShader!: IShader
    private _fragmentShader!: IShader

    constructor(vertexShader: IShader, fragmentShader: IShader) {
        this._vertexShader = vertexShader
        this._fragmentShader = fragmentShader
        this._program = gl.createProgram()!

        gl.attachShader(this._program, this._vertexShader.compiled)
        gl.attachShader(this._program, this._fragmentShader.compiled)

        gl.linkProgram(this._program)

        if(!ResourceHolder.CurrentProgram) this.use()
    }

    public get() { return this._program }

    public use() {
        gl.useProgram(this._program)
        ResourceHolder.useProgram(this)
    }
}