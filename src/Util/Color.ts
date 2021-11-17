export namespace Color {
    export function HEXtoRGB(hexColor: HEX): RGB {
        if(!hexColor.startsWith('#')) hexColor = '#' + hexColor

        const r = parseInt(hexColor.slice(1, 3), 16),
              g = parseInt(hexColor.slice(3, 5), 16),
              b = parseInt(hexColor.slice(5, 7), 16)

        return { r, g, b }
    }

    export function HEXtoRGBA(hexColor: HEX): RGBA {
        if(!hexColor.startsWith('#')) hexColor = '#' + hexColor

        const r = parseInt(hexColor.slice(1, 3), 16),
              g = parseInt(hexColor.slice(3, 5), 16),
              b = parseInt(hexColor.slice(5, 7), 16),
              a = parseInt(hexColor.slice(7, 9), 16)

        return { r, g, b, a }
    }

    export type Array = [number, number, number, number? ]
    export type Resolvable = number | (RGBA & { a?: number }) | HEX | Color.Array

    export function AsArray(input: Resolvable): [ number, number, number, number ] {
        let col = Make(input)
        return [ col.r, col.g, col.b, col.a ]
    }

    export function AsNormalizedArray(input: Resolvable): [ number, number, number, number ] {
        let col = Make(input)
        return [ col.r / 255, col.g / 255, col.b / 255, col.a ]
    }

    export function ColorIntToRGBA(colorInt: number): RGBA {
        colorInt >>>= 0
        const b =   colorInt & 0xFF,
              g = ( colorInt & 0xFF00)     >>> 8,
              r = ( colorInt & 0xFF0000)   >>> 16,
              a = ((colorInt & 0xFF000000) >>> 24 ) / 255

        return { r, g, b, a }
    }

    export function Make(input: Resolvable): RGBA {
        if(typeof input === 'number') return ColorIntToRGBA(input)

        if(Array.isArray(input)) return {
            r: input[0] || 0,
            g: input[1] || 0,
            b: input[2] || 0,
            a: input[3] || 1
        }

        if(typeof input === 'string') return input.length === 9 ? 
            HEXtoRGBA(input) :
            {... HEXtoRGB(input), a: 1 }

        if(typeof input === 'object') return {
            r: input.r || 0,
            g: input.g || 0,
            b: input.b || 0,
            a: input.a || 1
        }

        return input
    }

    export function RGBtoHEX(r: number | RGB, g?: number, b?: number) : HEX {
        if('r' in (r as RGB)) {
            let col = r as RGB
            b = col.b
            g = col.g
            r = col.r
        }

        r = r as number

        return "#" + ((1 << 24) + (r << 16) + (g! << 8) + b!).toString(16).slice(1)
    }

    /**
     * Hex string as #FFFFFF or #FFFFFFFF
    */
    export type HEX = string

    /**
     * Color object with colors ranged 0 - 255
     */
    export interface RGB {
        r: number,
        g: number,
        b: number
    }

    /**
     * Color object with colors ranged 0 - 255
     * And alpha ranged 0 - 1
     */
    export interface RGBA extends RGB {
        a: number
    }
}