export interface CharsFile {
    atlas:   Atlas,
    metrics: Metrics,
    glyphs:  Glyph[],
    kerning: any[]
}

export interface Atlas {
    type:          string,
    distanceRange: number,
    size:          number,
    width:         number,
    height:        number,
    yOrigin:       string
}

export interface Glyph {
    unicode:      number,
    advance:      number,
    planeBounds?: Bounds,
    atlasBounds?: Bounds
}

export interface Bounds {
    left:   number,
    bottom: number,
    right:  number,
    top:    number,
}

export interface Metrics {
    emSize:             number,
    lineHeight:         number,
    ascender:           number,
    descender:          number,
    underlineY:         number,
    underlineThickness: number
}
