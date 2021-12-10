import { App } from "../App/App"
import { BufferFormat } from "./Buffer/BufferFormat"
import { EditorBuffer } from "./Buffer/EditorBuffer"
import { InputHandler } from "./Buffer/InputHandler"
import { CharacterQuad } from "./CharacterQuad"
import { CursorQuad } from "./CursorQuad"
import { FontFile, FontType } from "./Font/FontFile"

export class EditorApp extends App {

    public fontsize: number = 100
    public currentFont: FontFile = new FontFile(
        "FiraCode Nerdfont Mono",
        FontType.MSDF)

    private activeEditorBuffer: EditorBuffer = new EditorBuffer()

    private _QuadBuffer: Array<Array<CharacterQuad>> = []
    private _CursorQuad: CursorQuad = new CursorQuad(this.currentFont, this.fontsize)

    async create() {
        await this.currentFont.loaded

        InputHandler.Init()

        InputHandler.OnKeyDown.subscribe((key: InputHandler.Key | null) => {
            if(!key) return

            this.activeEditorBuffer.Add(key)
        })

        this.activeEditorBuffer.Buffer.subscribe((data: BufferFormat) => {

            for(let y = 0; y < data.length; y++) {
                for(let x = 0; x < data[y].length; x++) {
                    if(!this._QuadBuffer[y]) this._QuadBuffer[y] = []
                    let item = data[y][x]

                    if(item) {
                        if(item.type === BufferFormat.BufferKeyType.STRING) {

                            if(!this._QuadBuffer[y][x]) {
                                this._QuadBuffer[y][x] = new CharacterQuad(this.currentFont, item.value.charCodeAt(0), this.fontsize, [x,y])
                            }
                            else {
                                this._QuadBuffer[y][x].codepoint = item.value.charCodeAt(0)
                            }
                        }
                    }
                }

                if(data[y].length !== this._QuadBuffer[y].length) {
                    for(let i = 0; i < Math.max(data[y].length, this._QuadBuffer[y].length + 1); i++) {
                        if(!data[y][i]) this._QuadBuffer[y].splice(i, 1)
                    }
                }
            }

        })

        this.clearColor = [20, 20, 20]
    }
    
    render(t: number, dt: number) {
        for(let y = 0; y < this._QuadBuffer.length; y++) {
            if(this._QuadBuffer[y]) {
                for(let x = 0; x < this._QuadBuffer[y].length; x++) {
                    if(this._QuadBuffer[y][x]) {
                        this._QuadBuffer[y][x].charsize = this.fontsize
                        this._QuadBuffer[y][x].draw()
                    }
                }
            }
        }
        
        // TODO: Cursor rendering breaks rendering?
        // this._CursorQuad.draw()
        // this._CursorQuad.charsize = this.fontsize

        // this._CursorQuad.location = this.activeEditorBuffer.Cursor
        
    }
}