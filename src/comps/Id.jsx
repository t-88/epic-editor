import { proxy, useSnapshot } from "valtio";
import engine from "../lib/engine";


function IdComponent(self) {
    const id_prox = useSnapshot(self.id);

    // when change store
    engine.update_store();

    return <div className="component"> 
    <p className="title">Id</p>
        <section className="component-props-row">
            <div className="inline-input expanded-input">
                <p>id </p> <input value={id_prox.val} onChange={(e) =>  self.id.val = e.target.value} />    
            </div>
        </section>
    </div>
}
export default class Id {
    constructor(id = "") {
        this.type = "id";
        this.id = proxy({val : id});
        this.renderer = () => IdComponent(this);
    }

    proxy_list() {
        return [this.id];
    }

    get_style_props() {
        return {};
    }
    load(data) {
        this.id.val = data.id;
    }

    code() {
        return {
            type : this.type,
            id : this.id.val,
        }
    }
}

