import { QuadPrim } from "../App/Primitives/QuadPrim";
import { Shared } from "../App/Primitives/Shared";
import { ResourceHolder } from "../App/Resource/ResourceHolder";
import Context from "../Context";
import { Point } from "../Util/Point";
import { FontFile } from "./Font/FontFile";

import cursor_renderer_frag from './Resources/Shaders/cursor_renderer.frag.glsl?raw'


export class CursorQuad extends QuadPrim {

    private _location: Point = Point.Make(0)
    private _charSize: number = 10
    private _fontfile: FontFile

    public get location(): Point { return this._location }
    public set location(pos: Point.Resolvable) { this._location = Point.Make(pos) }
    public get charsize(): number { return this._charSize }
    public set charsize(size: number) {
        this._charSize = size
        this.updateGlyph()
    }

    constructor(fontfile: FontFile, size: number) {
        super(0, size)

        this._charSize = size
        this._fontfile = fontfile

        ResourceHolder.getOrCreateProgram('cursor_renderer',
        Shared.SHADER_VERTEX_BASIC,
        cursor_renderer_frag)

        this.program = 'cursor_renderer'
        
        this.updateGlyph()

    }

    private updateGlyph() {
        let glyph = this._fontfile.chars?.glyphs.find(x => x.unicode == 48 /* 0 char */)!
        if(glyph && glyph.atlasBounds) {

            let planeBounds = glyph.planeBounds!

            this.size = [
                (planeBounds.right - planeBounds.left) * this._charSize,
                (planeBounds.top - planeBounds.bottom) * this._charSize
            ]

            this.pos = [
                (this._location.x * this._charSize * glyph.advance) + planeBounds.left * this._charSize,
                (this._location.y * this._charSize * this._fontfile.chars?.metrics.lineHeight!) + (1 - planeBounds.top) * this._charSize]
        }
    }
} 