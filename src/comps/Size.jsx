import { proxy, useSnapshot } from "valtio";
import engine from "../lib/engine";


function SizeComponent(self,w,h) {
    function on_change_w(e) {
        e.target.value = Math.max(0,parseInt(e.target.value)); 
        w.val = parseInt(e.target.value);
        engine.update_store();
    }
    function on_change_h(e) {
        e.target.value = Math.max(0,parseInt(e.target.value)); 
        h.val = parseInt(e.target.value)
       engine.update_store();
    }


    return <div className="component">         
        <p className="title">Size</p>
        <section className="component-props-row">
        <div className="inline-input">
            <p>w</p> <input type="number" defaultValue={w.val} onChange={on_change_w} />    
        </div>
        <div className="inline-input">
            <p>h</p> <input type="number" defaultValue={h.val} onChange={on_change_h} />    
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
            w : this.w.val,
            h : this.h.val,
        }
    }

}