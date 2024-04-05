import { proxy } from "valtio";
import add_icon from "../assets/plus.png";

import engine from "../lib/engine";


function ColorComponent(ref, r, g, b) {
    function on_change_r(e) {
        e.target.value = Math.max(0, Math.min(255, parseInt(e.target.value)));
        r.val = parseInt(e.target.value);
        engine.update_store();
    }
    function on_change_g(e) {
        e.target.value = Math.max(0, Math.min(255, parseInt(e.target.value)));
        g.val = parseInt(e.target.value)
        engine.update_store();
    }
    function on_change_b(e) {
        e.target.value = Math.max(0, Math.min(255, parseInt(e.target.value)));
        b.val = parseInt(e.target.value)
        engine.update_store();
    }


    return <div className="component">
        <section className="title-icon">
            <p>Color</p>
            <img
                src={add_icon} width={25} height={25}
                onClick={() => {
                    console.log("urmom")
                }} />
        </section>

        <section className="component-props-row">
            <div className="inline-input">
                <p>r </p> <input type="number" defaultValue={r.val} onChange={on_change_r} />
            </div>
            <div className="inline-input">
                <p>g </p> <input type="number" defaultValue={g.val} onChange={on_change_g} />
            </div>
            <div className="inline-input">
                <p>b </p> <input type="number" defaultValue={b.val} onChange={on_change_b} />
            </div>
        </section>
    </div>
}
export default class Color {
    constructor(r = 0, g = 0, b = 0) {
        this.type = "color";

        this.r = proxy({ val: r });
        this.g = proxy({ val: g });
        this.b = proxy({ val: b });


        this.renderer = () => ColorComponent(this, this.r, this.g, this.b);
    }

    proxy_list() {
        return [this.r, this.g, this.b];
    }

    get_style_props() {
        return {
            background: `rgb(${this.r.val},${this.g.val},${this.b.val})`
        };
    }
    load(data) {
        this.r.val = data.r;
        this.g.val = data.g;
        this.b.val = data.b;
    }

    code() {
        return {
            r: this.r.val,
            g: this.g.val,
            b: this.b.val,
        }
    }
}

