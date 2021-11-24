import { Color } from "../../Util/Color"

export namespace BufferFormat {

    export enum BufferKeyType {
        STRING,
        SPECIAL,
        COLOR,
        MODIFIER
    }

    export interface String {
        type: BufferKeyType.STRING,
        value: string,
    }

    export enum SpecialKind {
        NEWLINE = 'newline',
        SPACE_BULLET = 'space_bullet'
    }

    export interface Special {
        type: BufferKeyType.SPECIAL,
        kind: SpecialKind
    }

    export interface Color {
        type: BufferKeyType.COLOR,
        color: Color.RGBA,
    }

    export interface Modifier {
        type: BufferKeyType.MODIFIER
        bold?: boolean,
        underline?: boolean
    }

    export type Key = BufferFormat.String
        | BufferFormat.Special
        | BufferFormat.Color
        | BufferFormat.Modifier
        | null
}


export type BufferFormat = Array<Array<BufferFormat.Key>>