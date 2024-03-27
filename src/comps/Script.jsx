import { proxy, useSnapshot } from "valtio";
import add_icon from "../assets/plus.png";
import more_icon from "../assets/more.png";
import engine from "../lib/engine";
import ScriptData from "../models/ScriptData";



function ScriptComponent(ref) {
    const script_prox = useSnapshot(ref.script);

    // when change store
    engine.update_store();


    return <div className="component">
        <p className="title">Script</p>
        <section className="script">
            <div className="script-view">
                <p>script</p>
            </div>
        </section>
    </div>
}
export default class Script {
    constructor(script = "") {
        this.type = "script";
        this.script = proxy({ val: script,  });
        this.renderer = () => ScriptComponent(this);
    }

    proxy_list() {
        return [this.script];
    }
    get_style_props() {
        return {};
    }
    load(data) {
        this.script.val = data.script;
    }

    code() {
        return { type: this.type, script: this.script.val };
    }

}

