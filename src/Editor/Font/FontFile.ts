import Module from "module"
import { firstValueFrom, Subject } from "rxjs"
import { LoadTexture } from "../../Util/LoadTexture"
import { CharsFile } from "./CharsFile"

export enum FontType {
    MSDF = "msdf",
    BITMAP = "bitmap"
}

export class FontFile {
    public fontname: string
    public type: FontType = FontType.MSDF

    private atlas?: any
    public chars?: CharsFile

    public texture: WebGLTexture | null = null

    private _loaded: Subject<boolean> = new Subject<boolean>()
    
    constructor(fontname: string, fontType: FontType) {
        this.fontname = fontname
        this.type = fontType

        this.init()
    }

    private async init() {
        this.chars = await import(`../Resources/Fonts/${this.fontname}/chars.json`)
        this.atlas = await import(`../Resources/Fonts/${this.fontname}/atlas.png`)

        this.texture = LoadTexture(this.atlas.default)

        this._loaded.next(true)
    }

    public get loaded(): Promise<boolean> {
        return firstValueFrom(this._loaded)
    }
}