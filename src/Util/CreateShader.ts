import { IShader } from "../App/Resource/IShader"
import Context from "../Context"
import fs from 'fs/promises'

const { gl, context_type } = Context.documentInstance

export function CreateShaderFromString(type: number, code: string): IShader {
    const _shader = gl.createShader(type)

    if(!_shader)
        throw 'Could not create shader'

    gl.shaderSource(_shader, code)
    gl.compileShader(_shader)

    if (!gl.getShaderParameter(_shader, gl.COMPILE_STATUS)) {
        let info = gl.getShaderInfoLog( _shader )
        throw 'Could not compile shader.\n\n' + info
    }

    return { code, type, compiled: _shader }
}

export async function CreateShaderFromFile(type: number, path: string): Promise<IShader> {
    if(context_type == 'browser') {
        throw 'cant load shader from file in browser'
    } else {
        let content = await fs.readFile(path)
        let code = content.toString('utf8')
        
        return CreateShaderFromString(type, code)
    }

}