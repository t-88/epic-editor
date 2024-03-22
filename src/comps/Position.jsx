import { proxy, useSnapshot } from "valtio";
import engine from "../lib/engine";


function PositionComponent(ref,x,y) {
    const x_prox = useSnapshot(x);
    const y_prox = useSnapshot(y);

    // when change store
    engine.update_store();


    return <div className="component">
        <p className="title">Position</p>
        <section className="component-props-row">
            <div className="inline-input">
                <p>x</p> 
                <input value={x_prox.val} onChange={(e) =>  x.val = parseInt(e.target.value)} />    
            </div>
            <div className="inline-input">
                <p>y</p> <input value={y_prox.val} onChange={(e) =>  y.val = parseInt(e.target.value)} />    
            </div>        
        </section>
    </div>
}
export default class Position {
    constructor(x = 0, y = 0) {
        this.type = "pos";

        this.x = proxy({val : x});
        this.y = proxy({val : y});
        
        this.renderer = () => PositionComponent(this,this.x,this.y);
    }

    proxy_list() {
        return [this.x,this.y];
    }

    get_style_props() {
        return {
            left :   `${this.x.val}px` , 
            top :    `${this.y.val}px` , 
    
        };
    }


    load(data) {
        this.x.val = data.x;
        this.y.val = data.y;
    }

    code() {
        return {
            type : this.type,
            x : this.x.val,
            y : this.y.val,
        }
    }
}

