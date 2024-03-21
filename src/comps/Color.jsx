import { proxy, useSnapshot } from "valtio";
import engine from "../lib/engine";


function ColorComponent(ref,r,g,b) {
    const r_prox = useSnapshot(r);
    const g_prox = useSnapshot(g);
    const b_prox = useSnapshot(b);

    // when change store
    engine.update_store();

    
    return <div className="component"> 
    <p className="title">Color</p>

        <section className="component-props-row">
        <div className="inline-input">
            <p>r </p> <input value={r_prox.val} onChange={(e) =>  r.val = parseInt(e.target.value)} />    
        </div>
        <div className="inline-input">
            <p>g </p> <input value={g_prox.val} onChange={(e) =>  g.val = parseInt(e.target.value)} />    
        </div>  
        <div className="inline-input">
            <p>b </p> <input value={b_prox.val} onChange={(e) =>  b.val = parseInt(e.target.value)} />    
        </div>        
        </section>
    </div>
}
export default class Color {
    constructor(r = 0, g = 0, b = 0) {
        this.type = "color";

        this.r = proxy({val : r});
        this.g = proxy({val : g});
        this.b = proxy({val : b});
        this.renderer = () => ColorComponent(this,this.r,this.g,this.b);
    }



    static load(data) {
        return new Color(data.r,data.g,data.b);
    }

    code() {
        return {
            type : this.type,
            r : this.r.val,
            g : this.g.val,
            b : this.b.val,
        }
    }
}

