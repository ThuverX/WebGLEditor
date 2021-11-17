import { GetDocumentContext } from "./Util/DocumentContext"
import { Document as GLFWDocument } from "glfw-raub"
import { GetWindowContext } from "./Util/WindowContext"

type ContextInstance = { document: Document, canvas: HTMLCanvasElement, gl: WebGLRenderingContext } & GLFWDocument & { context_type: 'browser' | 'native'}
type WindowInstance = Window & { context_type: 'browser' | 'native'}

export default class Context {
    private static _documentInstance: ContextInstance
    private static _windowInstance: WindowInstance

    public static get documentInstance(): ContextInstance {
        return this._documentInstance || (this._documentInstance = GetDocumentContext())
    }

    public static get windowInstance(): WindowInstance {
        return this._windowInstance || (this._windowInstance = GetWindowContext())
    }
}