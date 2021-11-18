import { App } from "../App/App"
import Context from "../Context"
import { CharacterQuad } from "./CharacterQuad"
import { FontFile, FontType } from "./Font/FontFile"

const s = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>WEBGL Editor</title>
    <style>
        canvas {
            position: absolute;
            left:0;
            top:0;
            width:100%;
            height:100%;
        }
    </style>
  <script type="module" crossorigin src="/assets/index.08f0c933.js"></script>
  <link rel="modulepreload" href="/assets/vendor.0c272f2f.js">
</head>
<body>
    
</body>
</html>
`

export class EditorApp extends App {

    private currentFont: FontFile = new FontFile(
        "FiraCode Nerdfont Mono",
        FontType.MSDF)
    private drawbuffer: Array<CharacterQuad> = []

    async create() {
        await this.currentFont.loaded

        let start = performance.now()

        const sentence = (str: string, line: number) => {
            for(let i = 0; i < str.length; i++) {
                if(str.charCodeAt(i) !== 32)
                    this.drawbuffer.push(new CharacterQuad(this.currentFont, str.charCodeAt(i), 32, [i,line]))
            }
        }

        let text = s.split('\n')

        for(let i = 0; i < text.length; i++) {
            sentence(text[i],i)
        }

        console.log('full', performance.now() - start)
        
        this.clearColor = [0, 0, 0]
    }
    
    render(t: number, dt: number) {
        for(let char of this.drawbuffer) char.draw()
    }
}