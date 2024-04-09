import { proxy, useSnapshot } from "valtio";
import add_icon from "../assets/plus.png";

import engine from "../lib/engine";
import ColorSelector from "../elements/ColorSelector";
import { useRef } from "react";



function ColorComponent(ref, r, g, b) {
    const r_ref = useRef();
    const g_ref = useRef();
    const b_ref = useRef();
    function on_change(r, g ,b ){
        r_ref.current.value = r; 
        g_ref.current.value = g; 
        b_ref.current.value = b; 
    }


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
            <ColorSelector on_change={on_change} r={r} g={g} b={b} />
        </section>

        <section className="component-props-row">
            <div className="inline-input">
                <p>r </p> <input ref={r_ref} type="number" defaultValue={r.val} onChange={on_change_r} />
            </div>
            <div className="inline-input">
                <p>g </p> <input ref={g_ref} type="number" defaultValue={g.val} onChange={on_change_g} />
            </div>
            <div className="inline-input">
                <p>b </p> <input ref={b_ref} type="number" defaultValue={b.val} onChange={on_change_b} />
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

