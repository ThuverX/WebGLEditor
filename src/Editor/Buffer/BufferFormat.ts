import { Color } from "../../Util/Color"

export namespace BufferFormat {

    export interface String {
        value: string,
    }

    export enum SpecialKind {
        NEWLINE = 'newline',
        SPACE_BULLET = 'space_bullet'
    }

    export interface Special {
        kind: SpecialKind
    }

    export interface Color {
        color: Color.RGBA,
    }

    export interface Modifier {
        bold?: boolean,
        underline?: boolean
    }

    export type Key = BufferFormat.String
        | BufferFormat.Special
        | BufferFormat.Color
        | BufferFormat.Modifier
}


export type BufferFormat = Array<BufferFormat.Key>