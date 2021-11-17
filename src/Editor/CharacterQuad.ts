import { QuadPrim } from "../App/Primitives/QuadPrim";
import { Shared } from "../App/Primitives/Shared";
import { ResourceHolder } from "../App/Resource/ResourceHolder";
import Context from "../Context";
import { Point } from "../Util/Point";

import char_renderer_frag from './Resources/Shaders/char_renderer.frag.glsl?raw'

const { gl } = Context.documentInstance

export class CharacterQuad extends QuadPrim {

    private _location: Point = Point.Make(0)
    private _codepoint: number = 0
    private _charSize: number = 10

    public get location(): Point { return this._location }
    public set location(location: Point.Resolvable) {
        this._location = Point.Make(location)
        this.pos = [this._location.x * this._charSize, this.location.y * this._charSize]
    }

    constructor(codepoint: number, size: number, location: Point.Resolvable = 0) {
        super(0, size)

        this._charSize = size
        this._codepoint = codepoint
        this.location = location

        ResourceHolder.getOrCreateProgram('char_renderer',
            ResourceHolder.CreateShaderFromString(gl.VERTEX_SHADER, Shared.SHADER_VERTEX_BASIC),
            ResourceHolder.CreateShaderFromString(gl.FRAGMENT_SHADER, char_renderer_frag))

        this.program = 'char_renderer'

        this.setAttribute('u_codepoint', {
            type: 'uniform',
            kind: 'int',
            value: this._codepoint
        })
    }
} 