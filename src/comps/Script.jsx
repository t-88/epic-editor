import { proxy, useSnapshot } from "valtio";
import engine from "../lib/engine";



const DEFAULT_SCRIPT = `func on_init(ID) {

}

func on_update(ID) {

}
`

function ScriptComponent(ref) {
    const script_prox = useSnapshot(ref.script);

    // when change store
    engine.update_store();


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

}

