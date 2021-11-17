// @ts-nocheck
export function GetDocumentContext(): { document: Document, canvas: HTMLCanvasElement, gl: WebGLRenderingContext } & GLFWDocument
{
    // We are a browser
    if(window && document) {
        const canvas = document.createElement('canvas')
        
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight

        document.body.appendChild(canvas)

        const gl = canvas.getContext('webgl')
        
        return {
            document,
            canvas,
            gl,
            context_type: 'browser',
            ...window
        } as any
    }
    
    // We are a desktop app
    const webgl = require('webgl-raub')
    const { Document: GLFWDocument } = require('glfw-raub')

    GLFWDocument.setWebgl(webgl)

    const _document = new GLFWDocument()
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl')

    return { document: _document, canvas, gl, ..._document, context_type: 'native' } as any
}