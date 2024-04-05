import { proxy, useSnapshot } from "valtio";
import engine from "../lib/engine";


function IdComponent(self) {
    function on_change(e) {
        self.id.val = e.target.value;
        engine.update_store();
    }
    return <div className="component">
        <p className="title">Id</p>
        <section className="component-props-row">
            <div className="inline-input expanded-input">
                <p>id </p> 
                <input  defaultValue={self.id.val} onChange={on_change} />
            </div>
        </section>
    </div>
}
export default class Id {
    constructor(id = "") {
        this.type = "id";
        this.id = proxy({ val: id });
        this.renderer = () => IdComponent(this);
    }

    proxy_list() {
        return [this.id];
    }

    get_style_props() {
        return {};
    }
    load(id) {
        this.id.val = id;
    }

    code() {
        return this.id.val;
    }
}

