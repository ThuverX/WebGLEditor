import Context from "../../Context"
import { CreateShaderFromString, CreateShaderFromFile } from "../../Util/CreateShader"
import { IShader } from "./IShader"
import { Program } from "./Program"

const { gl } = Context.documentInstance
export class ResourceHolder {
    private static _currentProgram: Program

    private static programs: Map<string, Program> = new Map<string, Program>()

    public static CreateShaderFromString(type: number, code: string): IShader {
        return CreateShaderFromString(type, code)
    }

    public static get CurrentProgram(): Program { return this._currentProgram }
    public static get WebGLProgram(): WebGLProgram { return this._currentProgram.get() }

    public static useProgram(program: Program) {
        this._currentProgram = program
    }

    public static getProgram(name: string): Program {
        return this.programs.get(name)!
    }

    public static getOrCreateProgram(name: string, vertex: string, fragment: string): Program {
        let exist = this.getProgram(name)
        if(exist) return exist

        return this.CreateProgram(name, 
            this.CreateShaderFromString(gl.VERTEX_SHADER, vertex), 
            this.CreateShaderFromString(gl.FRAGMENT_SHADER, fragment))
    }
    
    public static async CreateShaderFromFile(type: number, path: string): Promise<IShader> {
        return await CreateShaderFromFile(type, path)
    }

    public static CreateProgram(name: string, vertex: IShader, fragment: IShader): Program {
        let prog = new Program(vertex, fragment)
        this.programs.set(name, prog)

        return prog
    }
}

// @ts-ignore
window.ResourceHolder = ResourceHolder