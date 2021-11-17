export namespace Point {
    export type Resolvable = [ number, number ] | Point | number

    export function Make(input?: Resolvable): Point {
        if(input == null) return {
            x: 0,
            y: 0
        }

        if(typeof input == 'number') return {
            x: input,
            y: input
        }

        if(Array.isArray(input)) return {
            x: input[0],
            y: input[1]
        }

        if(typeof input == 'object' && 'x' in input && 'y' in input) return {
            x: input.x || 0,
            y: input.y || 0
        }

        return input
    }
}

export interface Point {
    x: number,
    y: number
}