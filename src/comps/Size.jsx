import { proxy, useSnapshot } from "valtio";
import engine from "../lib/engine";


function SizeComponent(ref,w,h) {
    const w_prox = useSnapshot(w);
    const h_prox = useSnapshot(h);

    // when change store
    engine.update_store();

    return <div className="component">         
        <p className="title">Size</p>
        <section className="component-props-row">
        <div className="inline-input">
            <p>w</p> <input value={w_prox.val} onChange={(e) =>  w.val = parseInt(e.target.value)} />    
        </div>
        <div className="inline-input">
            <p>h</p> <input value={h_prox.val} onChange={(e) =>  h.val = parseInt(e.target.value)} />    
        </div>        
        </section>
    </div>
}

export default  class Size {
    constructor(w = 0, h = 0) {
        this.type = "size";

        this.w = proxy({val : w});
        this.h = proxy({val : h});
        this.renderer = () => SizeComponent(this,this.w,this.h);
    }
    proxy_list() {
        return [this.w,this.h];
    }
    
    load(data) {
        this.w.val = data.w;
        this.h.val = data.h;
    }



    get_style_props() {
        return {
            width :  `${this.w.val}px`, 
            height : `${this.h.val}px`, 
        };
    }


    code() {
        return {
            type: this.type,
            w : this.w.val,
            h : this.h.val,
        }
    }

}