import { proxy, useSnapshot } from "valtio";


function PositionComponent(ref,x,y) {
    const x_prox = useSnapshot(x);
    const y_prox = useSnapshot(y);

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
        this.name = "pos";


        this.x = proxy({val : x});
        this.y = proxy({val : y});
        this.renderer = () => PositionComponent(this,this.x,this.y);
    }

    code() {
        return {
            x : this.x.val,
            y : this.y.val,
        }
    }
}

