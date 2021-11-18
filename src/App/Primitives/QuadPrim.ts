import Context from "../../Context";
import { Geometry } from "../../Util/Geometry";
import { Point } from "../../Util/Point";
import { App } from "../App";
import { ResourceHolder } from "../Resource/ResourceHolder";
import { ShaderAttribute, ShaderAttributes } from "../ShaderAttributes";

const { gl } = Context.documentInstance

export class QuadPrim {

    public static QUAD_VERTS = [
        0, 0,
        1, 0,
        0, 1,
        0, 1,
        1, 0,
        1, 1
    ]

    public static QUAD_UVS = [
        0, 0,
        0, 1,
        1, 0,
        0, 1,
        1, 1,
        1, 0,
    ]

    private _pos: Point = Point.Make()
    private _size: Point = Point.Make(100)

    public program: string = "shader_basic"

    public static vertexBuffer = gl.createBuffer()
    public static uvBuffer = gl.createBuffer()

    public set pos(point: Point.Resolvable) { this._pos = Point.Make(point) }
    public get pos(): Point { return this._pos }
    public set size(point: Point.Resolvable) { this._size = Point.Make(point) }
    public get size(): Point { return this._size }

    private attributes: ShaderAttributes = {
        'u_translation': {
            type: 'uniform',
            kind: 'vec4f',
            value: []
        }
    }

    public setAttribute(name: string, value: ShaderAttribute) {
        this.attributes[name] = value
    }

    public setAttributeValue(name: string, value: any) {
        if(!this.attributes[name]) return
        this.attributes[name].value = value
    }

    public getAttribute(name: string): ShaderAttribute {
        return this.attributes[name]
    }

    public getAttributes(): ShaderAttributes {
        return this.attributes
    }

    public updateAttributes() {

    }

    public applyAttribute(name: string) {
        let prog = ResourceHolder.getProgram(this.program)
        let attr = this.getAttribute(name)

        if(attr.type === 'uniform') {
            if(attr.kind.startsWith('vec')) {
                if(attr.array) {
                    // @ts-ignore
                    gl['uniform' + attr.kind.slice(-2) + 'v'](gl.getUniformLocation(prog.get(), name), new Float32Array(attr.value))
                } else {
                    // @ts-ignore
                    gl['uniform' + attr.kind.slice(-2)](gl.getUniformLocation(prog.get(), name), ...attr.value)
                }
            } else if(attr.kind === 'float') {
                gl.uniform1f(gl.getUniformLocation(prog.get(), name), attr.value)
            } else if(attr.kind === 'int') {
                gl.uniform1i(gl.getUniformLocation(prog.get(), name), attr.value)
            }
        } else {

        }
    }

    public applyAttributes() {
        let prog = ResourceHolder.getProgram(this.program)
        prog.use()

        this.setAttributeValue('u_translation', [this._pos.x, this._pos.y, this._size.x, this._size.y])
        for(let key of Object.keys(this.attributes)) {
            this.applyAttribute(key)
        }
    }
    
    constructor(pos: Point.Resolvable, size: Point.Resolvable) {
        this.pos = pos
        this.size = size
    }

    public draw(): void {
        this.updateAttributes()
        this.applyAttributes()

        gl.drawArrays(gl.TRIANGLES, 0, 6)
    }
}

gl.bindBuffer(gl.ARRAY_BUFFER, QuadPrim.vertexBuffer)
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(QuadPrim.QUAD_VERTS), gl.STATIC_DRAW)

gl.bindBuffer(gl.ARRAY_BUFFER, QuadPrim.uvBuffer)
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(QuadPrim.QUAD_UVS), gl.STATIC_DRAW)
