export interface ShaderAttribute {
    type: 'uniform' | 'attribute',
    kind: 'float' | 'vec1f' | 'vec2f' | 'vec3f' | 'vec4f' |
          'int' | 'vec1i' | 'vec2i' | 'vec3i' | 'vec4i',
    array?: boolean,
    value: any
}

export type ShaderAttributes = {[key:string]: ShaderAttribute}