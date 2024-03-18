import { proxy, useSnapshot } from "valtio";


function ScriptComponent(ref) {
    const script_store = useSnapshot(ref.script);

    return  <div className="component">    
        <p className="title">Script</p>  
        
    </div>
}
export default class Script {
    constructor(script = "") {
        this.name = "script";

        this.script = proxy({val: script})
        this.renderer = () => ScriptComponent(this);
    }
    code() {
        return {
            script : this.script.val,
        }
    }

}

