import { useRef } from "react"
import { useSnapshot } from "valtio";
import { useProxy } from "valtio/utils";
import engine from "../lib/engine";


export default function ColorSelector({r , g , b, on_change}) {
    const r_prox = useSnapshot(r);
    const g_prox = useSnapshot(g);
    const b_prox = useSnapshot(b);

    const ref = useRef();
    function on_select_color(e) {
        let value = ref.current.value.substr(1);
        value = parseInt("0x" + value);
        r.val =  (value >> 8 * 2) & 0xFF;
        g.val =  (value >> 8 * 1) & 0xFF;
        b.val =  (value >> 8 * 0) & 0xFF;
        engine.update_store();
        on_change(r.val,g.val,b.val);
    }

    function show_color_selector() {
        ref.current.click();
    }

    return <div  role="presentation" style={{background: `rgb(${r_prox.val},${g_prox.val},${b_prox.val})`}} className="color-selector bordered" onClick={show_color_selector}>
        <input ref={ref} type="color" onChange={on_select_color} />
    </div>
}