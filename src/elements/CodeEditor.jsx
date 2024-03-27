import { useSnapshot } from "valtio";
import engine from "../lib/engine";
import CodeMirror from "@uiw/react-codemirror";


export default function CodeEditor() {
    const script_prox = useSnapshot(engine.cur_script_prox);
    
    return <CodeMirror
        editable={script_prox.val != undefined}
        theme={"dark"}
        value={script_prox.val == undefined ? "" : script_prox.val.script.val}
        onChange={(code) => {
            if(!script_prox.val) return;
            engine.cur_script_prox.val.script.val = code;
            engine.update_store();
        }}
        id="code-container"
    />
}