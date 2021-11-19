import { BehaviorSubject, Subject } from "rxjs"
import Context from "../../Context"

const window = Context.windowInstance

export class InputHandler {

    // mods: shift, control, alt
    private static mods_down: [ boolean, boolean, boolean ] = [ false, false, false]

    public static ACTIONS: Map<string, string> = new Map<string, string>([
        [ JSON.stringify({ keyCode: 'Enter', mods: [ false, false, false ] }), 'ACT_NEWLINE' ],
    ])

    public static Init() {
        window.addEventListener('keydown',(event) => this.KeyDown(event.key))
        window.addEventListener('keyup',(event) => this.KeyUp(event.key))
    }

    public static OnKeyDown: BehaviorSubject<InputHandler.Key | null> = new BehaviorSubject<InputHandler.Key | null>(null)
    public static OnKeyUp: BehaviorSubject<InputHandler.Key | null> = new BehaviorSubject<InputHandler.Key | null>(null)

    private static flipMods(keyCode: string, direction: boolean): boolean {
        if(keyCode === 'Shift') {
            this.mods_down[0] = direction
            return true
        }

        if(keyCode === 'Control') {
            this.mods_down[1] = direction
            return true
        }

        if(keyCode === 'Alt') {
            this.mods_down[2] = direction
            return true
        }

        return false
    }

    public static RegisterAction(ref: InputHandler.KeyReference, action: string) {
        this.ACTIONS.set(JSON.stringify(ref), action)
    }

    public static GetAction(ref: InputHandler.KeyReference): string | undefined {
        return this.ACTIONS.get(JSON.stringify(ref))
    }

    public static KeyDown(keyCode: string) {
        if(this.flipMods(keyCode, true)) return

        let action = this.GetAction({ keyCode, mods: this.mods_down})

        if(action) {
            return this.OnKeyDown.next({
                kind: InputHandler.KeyKind.ACTION,
                mods: [...this.mods_down],
                value: action
            })
        }

        // Special actions
        {
            if(keyCode === 'Backspace') return this.OnKeyDown.next({
                kind: InputHandler.KeyKind.ACTION,
                mods: [...this.mods_down],
                value: 'BACKSPACE'
            })

            if(keyCode === 'Delete') return this.OnKeyDown.next({
                kind: InputHandler.KeyKind.ACTION,
                mods: [...this.mods_down],
                value: 'DELETE'
            })
        }

        if(keyCode.length === 1) return this.OnKeyDown.next({
            kind: InputHandler.KeyKind.CHARACTER,
            mods: [...this.mods_down],
            value: keyCode
        })
    }

    public static KeyUp(keyCode: string) {
        if(this.flipMods(keyCode, false)) return

        this.OnKeyUp.next({
            kind: InputHandler.KeyKind.CHARACTER,
            mods: [...this.mods_down],
            value: keyCode
        })
    }
}

export namespace InputHandler {

    // mods: shift, control, alt
    export interface KeyReference {
        keyCode: string,
        mods: [ boolean, boolean, boolean ]
    }

    export enum KeyKind {
        CHARACTER = 'character',
        ACTION = 'action'
    }

    export interface Key {
        kind: KeyKind,
        mods: [ boolean, boolean, boolean ],
        value: string
    }
}