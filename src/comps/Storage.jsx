import { proxy, useSnapshot } from "valtio";
import add_icon from "../assets/plus.png";
import engine from "../lib/engine";



function StorageComponent(ref) {
    useSnapshot(ref.map);


    function on_change_key(e,idx) {
        ref.map[idx].key = e.target.value;
        engine.update_store();
    }
    function on_change_value(e,idx) {
        ref.map[idx].val = e.target.value;
        engine.update_store();
    }


    return <div className="component">
        <section className="title-icon">
            <p>Storage</p>
            <img
                src={add_icon} width={25} height={25}
                onClick={() => {
                    ref.map.push({
                        key: "name",
                        val: "value"
                    });
                }}/>
        </section>
        <section className="storage">
            {
                ref.map.map((storage_val, idx) => {
                    return <div key={idx}>
                        <div className="inline-input storage-input">
                            <input defaultValue={storage_val.key} onChange={(e) => on_change_key(e,idx)} />
                            <input defaultValue={storage_val.val} onChange={(e) => on_change_value(e,idx)} />
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
    load(map) {
        this.map.length = 0;
        for (let i = 0; i < map.length; i++) {

            this.map.push(map[i]);
        }
    }

    code() { 
        return  [...this.map]; 
    }
}

