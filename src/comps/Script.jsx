import { proxy, useSnapshot } from "valtio";
import engine from "../lib/engine";
import OPParser from "../lib/op_lang/parser";
import OPTraspiler from "../lib/op_lang/transpiler";



const DEFAULT_SCRIPT = `func on_init(ID) {

}

func on_update(ID) {

}
`

function ScriptComponent(ref) {
    return <div className="component">
        <p className="title">Script</p>
    </div>
}
export default class Script {
    constructor(script = "") {
        this.type = "script";
        this.script = proxy({ val: DEFAULT_SCRIPT });
        this.renderer = () => ScriptComponent(this);
    }

    proxy_list() {
        return [this.script];
    }
    get_style_props() {
        return {};
    }
    load(script) {
        this.script.val = script;
    }

    code() {
        return this.script.val;
    }

    evalute() {
        let parser = new OPParser();
        let transpiler = new OPTraspiler();
        parser.parse(this.script.val);
        transpiler.transpile(parser.program);

        if(!Object.keys(transpiler.functions).includes("on_init")) {
            return [false,`on_init`];
        } 
        if(!Object.keys(transpiler.functions).includes("on_update")) {
            return [false,"on_update"];
        } 

        return [true , ""];
    }
}

