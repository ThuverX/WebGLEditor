import { Point } from "../../Util/Point"
import { EditorBuffer } from "./EditorBuffer"

export class EditorCursor {
    private _buffer: EditorBuffer
    private _position: Point = Point.Make(0)

    public get x(): number { return Math.round(this._position.x) }
    public get y(): number { return Math.round(this._position.y) }

    constructor(parent: EditorBuffer) {
        this._buffer = parent
    }

    // Implement Safety Check
    public Move(x: number, y: number = 0) {
        this._position.x += x
        this._position.y += y
    }

    // Implement Safety Check
    public Set(x: number, y: number = 0) {
        this._position.x = x
        this._position.y = y
    }
}