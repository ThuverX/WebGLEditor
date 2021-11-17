// @ts-nocheck
export function GetWindowContext(): WindowInstance {
    if(window) {
        window.context_type = 'browser'
        return window
    }

    throw 'No window object'
}