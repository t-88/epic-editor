import { useSnapshot } from "valtio";
import engine from "../lib/engine";
import CodeMirror from "@uiw/react-codemirror";


export default function CodeEditor() {
    const script = useSnapshot(engine.cur_script_prox);

    return <CodeMirror
        editable={script.val != undefined}
        theme={"dark"}
        value={script.val ? script.val.body : ""}
        onChange={(code) => {
            if(!engine.cur_script_prox.val) return;
            engine.cur_script_prox.val.body = code;
        }}
        id="code-container"
    />
}