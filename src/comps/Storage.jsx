import { proxy, useSnapshot } from "valtio";
import add_icon from "../assets/plus.png";
import more_icon from "../assets/more.png";
import engine from "../lib/engine";
import ScriptData from "../models/ScriptData";



function StorageComponent(ref) {
    const map_prox = useSnapshot(ref.map);
    // when change store
    engine.update_store();

    return <div className="component">
        <section className="title-icon">
            <p>Storage</p>
            <img
                src={add_icon} width={25} height={25}
                onClick={() => {
                    ref.map.push({
                        key: "name",
                        val: "value"
                    })
                }}/>
        </section>
        <section className="storage">
            {
                ref.map.map((storage_val, idx) => {
                    return <div key={idx}>
                        <div className="inline-input storage-input">
                            <input value={storage_val.key} onChange={(e) => ref.map[idx].key = e.target.value} />
                            <input value={storage_val.val} onChange={(e) => ref.map[idx].val = e.target.value} />
                        </div>
                    </div>
                })
            }
        </section>
    </div>
}

export default class Storage {
    constructor(map = []) {
        this.type = "storage";
        this.map = proxy([...map]);
        this.renderer = () => StorageComponent(this);
    }

    proxy_list() {
        return [this.map];
    }


    get_style_props() {
        return {};
    }
    load(data) {
        this.map.length = 0;
        for (let i = 0; i < data.map.length; i++) {
            this.map.push(data.map[i]);
        }
    }

    code() { 
        return { type: this.type, map: [...this.map] }; 
    }
}

