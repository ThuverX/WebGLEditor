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
    public get Cursor(): EditorCursor { return this._cursor }

    // TODO: Decouple screen buffer from editor logic
    //       Use old editor code for string behaviour
    //       Then push that array into the screen buffer
    
    private createLine(index: number) {
        if(!this._buffer[index]) this._buffer[index] = []
    }

    public Add(key: InputHandler.Key) {
        this.createLine(this._cursor.y)

        if(key.kind === InputHandler.KeyKind.CHARACTER) {
            this._buffer[this._cursor.y][this._cursor.x] = {
                type: BufferFormat.BufferKeyType.STRING,
                value: key.value
            }

            this._cursor.Move(key.value.length)
        } else if(key.kind === InputHandler.KeyKind.ACTION) {
            if(key.value === 'MAKE_NEWLINE') {
                this._buffer[this._cursor.y][this._cursor.x] = {
                    type: BufferFormat.BufferKeyType.SPECIAL,
                    kind: BufferFormat.SpecialKind.NEWLINE
                }

                this._cursor.Set(0, this._cursor.y + 1)
            }

            if(key.value === 'MOVE_CURSOR_UP') this._cursor.Move(0, -1)
            if(key.value === 'MOVE_CURSOR_DOWN') this._cursor.Move(0, 1)
            if(key.value === 'MOVE_CURSOR_LEFT') this._cursor.Move(-1, 0)
            if(key.value === 'MOVE_CURSOR_RIGHT') this._cursor.Move(1, 0)

            if(key.value === 'DELETE_LEFT') {
                if(this._buffer[this._cursor.y][this._cursor.x - 1]) {
                    this._cursor.Move(-1, 0)
                    this._buffer[this._cursor.y].splice(this._cursor.x, 1)
                }
            }

            if(key.value === 'DELETE_RIGHT') {
                if(this._buffer[this._cursor.y][this._cursor.x + 1]) {
                    this._cursor.Move(1, 0)
                    this._buffer[this._cursor.y].splice(this._cursor.x, 1)
                }
            }
        }

        this.updateBuffer()
    }

    private updateBuffer() {
        this.Buffer.next(this._buffer)
    }
}