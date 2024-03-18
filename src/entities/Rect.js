import { useSnapshot } from "valtio";
import Position from "../comps/Position.js";
import Size from "../comps/Size.js";
import engine from "../lib/engine.js";
import Script from "../comps/Script.js";


function RectEntityComponent(ref,pos,size) {
    const pos_prox =  {
        x : useSnapshot(pos.x),
        y : useSnapshot(pos.y)
    };
    const size_prox =  {
        w : useSnapshot(size.w),
        h : useSnapshot(size.h)
    };
    return  <div onClick={(e) => engine.on_entity_select(ref,e)} className="rect-entity" style={{
        left :   `${pos_prox.x.val}px` , 
        top :    `${pos_prox.y.val}px` , 
        width :  `${size_prox.w.val}px`, 
        height : `${size_prox.h.val}px`, 
        background : "#FF0000"
    }}></div>
}
export default class RectEntity {
    constructor() {
        this.pos =  new Position(50,50);
        this.size = new Size(10 , 10);
        this.script = new Script("");
        this.comps = [
            this.pos,
            this.size,
            this.script,
        ]
        this.renderer = () => RectEntityComponent(this,this.pos,this.size);
    }

    render() {
        
    }
}