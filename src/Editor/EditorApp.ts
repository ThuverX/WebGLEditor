import { App } from "../App/App"
import Context from "../Context"
import { BufferFormat } from "./Buffer/BufferFormat"
import { EditorBuffer } from "./Buffer/EditorBuffer"
import { InputHandler } from "./Buffer/InputHandler"
import { CharacterQuad } from "./CharacterQuad"
import { FontFile, FontType } from "./Font/FontFile"

const window = Context.windowInstance

export class EditorApp extends App {

    private fontsize: number = 24
    private currentFont: FontFile = new FontFile(
        "FiraCode Nerdfont Mono",
        FontType.MSDF)
    private activeEditorBuffer: EditorBuffer = new EditorBuffer()

    private _QuadBuffer: Array<CharacterQuad> = []

    async create() {
        await this.currentFont.loaded

        InputHandler.Init()

        InputHandler.OnKeyDown.subscribe((key: InputHandler.Key | null) => {
            if(!key) return

            this.activeEditorBuffer.Add(key)
        })

        let w = window.innerWidth / this.fontsize
        let h = window.innerHeight / this.fontsize

        for(let x = 0; x < w; x++) {
            for(let y = 0; y < h; y++) {
                this._QuadBuffer.push(new CharacterQuad(this.currentFont, -1, this.fontsize, [y, x]))
            }
        }

        // TODO: Figure out how to do this fucking shit
        //       Pretty sure we should have some kind of big grid
        //       And just update items in the grid
        this.activeEditorBuffer.Buffer.subscribe((data: BufferFormat) => {
            for(let i = 0; i < data.length; i++) {
                if('value' in data[i]) {
                    let string = data[i] as BufferFormat.String
                    let codepoint = string.value.charCodeAt(0)

                    if(this._QuadBuffer[i]) {
                        if(this._QuadBuffer[i].codepoint !== codepoint) {
                            this._QuadBuffer[i].codepoint = codepoint
                        }
                    }
                }
            }
        })


        // const place = (key: string) => {
        //     if(key !== ' ' && key.length === 1) {
        //         this.drawbuffer.push(new CharacterQuad(this.currentFont, key.charCodeAt(0), 24, [this.pointer,0]))
        //     }

        //     this.pointer++
        // }

        // window.addEventListener('keydown', (event) => {
        //     place(event.key)
        // })
        // place(' ')
        // place('\ue0c4')
        // place(' ')
        // place(' ')
        // place('\ue718')
        // place('\ue719')

        this.clearColor = [20, 20, 20]
    }
    
    render(t: number, dt: number) {
        for(let i = 0; i < this._QuadBuffer.length; i++) {
            this._QuadBuffer[i].draw()
        }
    }
}