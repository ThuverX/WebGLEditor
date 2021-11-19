import { QuadPrim } from "../App/Primitives/QuadPrim";
import { Shared } from "../App/Primitives/Shared";
import { ResourceHolder } from "../App/Resource/ResourceHolder";
import Context from "../Context";
import { Point } from "../Util/Point";
import { FontFile } from "./Font/FontFile";

import char_renderer_frag from './Resources/Shaders/char_renderer.frag.glsl?raw'

const { gl } = Context.documentInstance

export class CharacterQuad extends QuadPrim {

    private _location: Point = Point.Make(0)
    private _codepoint: number = 0
    private _charSize: number = 10
    private _fontfile: FontFile

    public set codepoint(codepoint: number) {
        this._codepoint = codepoint
        this.updateGlyph()
    }
    public get codepoint(): number { return this._codepoint }
    public get location(): Point { return this._location }

    constructor(fontfile: FontFile, codepoint: number, size: number, location: Point.Resolvable = 0) {
        super(0, size)

        this._charSize = size
        this._codepoint = codepoint
        this._location = Point.Make(location)
        this._fontfile = fontfile

        ResourceHolder.getOrCreateProgram('char_renderer',
        Shared.SHADER_VERTEX_BASIC,
        char_renderer_frag)

        this.program = 'char_renderer'
        
        this.updateGlyph()
    }

    private updateGlyph() {
        let glyph = this._fontfile.chars?.glyphs.find(x => x.unicode == this._codepoint)!
        if(glyph && glyph.atlasBounds) {

            let atlasSize = Point.Make([this._fontfile.chars?.atlas.width!, this._fontfile.chars?.atlas.height!])
            let atlasBounds = glyph.atlasBounds!
            let planeBounds = glyph.planeBounds!

            this.size = [
                (planeBounds.right - planeBounds.left) * this._charSize,
                (planeBounds.top - planeBounds.bottom) * this._charSize
            ]

            this.pos = [
                (this._location.x * this._charSize * glyph.advance) + this.pos.x + planeBounds.left * this._charSize ,
                (this._location.y * this._charSize * this._fontfile.chars?.metrics.lineHeight!) + this.pos.y + (1 - planeBounds.top) * this._charSize]

            let x = (atlasBounds.left) / atlasSize.x
            let y = (atlasSize.y - atlasBounds.top)  / atlasSize.y

            let w = (atlasBounds.right - atlasBounds.left) / atlasSize.x
            let h = (atlasBounds.top - atlasBounds.bottom) / atlasSize.y

            this.setAttribute('u_codepoint', {
                type: 'uniform',
                kind: 'vec4f',
                value: [x, y, w, h]
            })

            this.setAttribute('u_codepointmod', {
                type: 'uniform',
                kind: 'vec4f',
                value: [0, 0, 1, 1]
            })

            this.setAttribute('u_tex', {
                type: 'uniform',
                kind: 'int',
                value: 0
            })
        } else {
            this.setAttribute('u_codepointmod', {
                type: 'uniform',
                kind: 'vec4f',
                value: [0, 0, 0, 0]
            })
        }
    }
} 