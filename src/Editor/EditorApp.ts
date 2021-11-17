import { App } from "../App/App"
import Context from "../Context"
import { CharacterQuad } from "./CharacterQuad"

const { gl } = Context.documentInstance

export class EditorApp extends App {

    private drawbuffer: Array<CharacterQuad> = []

    create() {
        this.drawbuffer.push(new CharacterQuad(1, 64, [0,0]))
        this.drawbuffer.push(new CharacterQuad(0, 64, [1,0]))
        this.drawbuffer.push(new CharacterQuad(1, 64, [2,0]))
        
        this.clearColor = [0, 0, 0]
    }
    
    render(t: number, dt: number) {
        for(let char of this.drawbuffer) char.draw()
    }
}