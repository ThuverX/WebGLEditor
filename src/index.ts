import { EditorApp } from "./Editor/EditorApp"
import { TestApp } from "./TestApp"

// let app = new TestApp().init()
let app = new EditorApp().init()

//@ts-ignore
window['app'] = app