import { BehaviorSubject } from "rxjs"
import { BufferFormat } from "./BufferFormat"
import { EditorCursor } from "./EditorCursor"
import { InputHandler } from "./InputHandler"

export class EditorBuffer {
    private _size: number = 24
    private _buffer: BufferFormat = []
    private _cursor: EditorCursor = new EditorCursor(this)

    private _selection: [ EditorCursor?, EditorCursor? ] = []

    public Buffer: BehaviorSubject<BufferFormat> = new BehaviorSubject<BufferFormat>([])

    public Add(key: InputHandler.Key) {
        if(key.kind === InputHandler.KeyKind.CHARACTER) {
            this._buffer.push({
                value: key.value
            })
        } else if(key.kind === InputHandler.KeyKind.ACTION) {
            if(key.value === 'BACKSPACE') {
                this._buffer.pop()
            }

            if(key.value === 'ACT_NEWLINE') {
                this._buffer.push({
                    
                })
            }
        }

        this.updateBuffer()
    }

    private updateBuffer() {
        this.Buffer.next(this._buffer)
    }
}