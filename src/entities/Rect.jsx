import { useSnapshot } from "valtio";
import Position from "../comps/Position.jsx";
import Size from "../comps/Size.jsx";
import engine from "../lib/engine.js";
import Script from "../comps/Script.jsx";
import Color from "../comps/Color.jsx";


function RectEntityComponent(ref,pos,size,color) {
    const pos_prox =  {
        x : useSnapshot(pos.x),
        y : useSnapshot(pos.y)
    };
    const size_prox =  {
        w : useSnapshot(size.w),
        h : useSnapshot(size.h)
    };

    const color_prox =  {
        r : useSnapshot(color.r),
        g : useSnapshot(color.g),
        b : useSnapshot(color.b),
    };    


    function on_mouse_down(e) {
        engine.on_entity_select(ref,e);
        engine.dragged_entity_info.entity.val = ref;
        console.log(e);
        engine.dragged_entity_info.offset.x = e.nativeEvent.offsetX;
        engine.dragged_entity_info.offset.y = e.nativeEvent.offsetY;
    }

    return  <div onMouseDown={on_mouse_down} className="rect-entity" style={{
        left :   `${pos_prox.x.val}px` , 
        top :    `${pos_prox.y.val}px` , 
        width :  `${size_prox.w.val}px`, 
        height : `${size_prox.h.val}px`, 
        background : `rgb(${color_prox.r.val},${color_prox.g.val},${color_prox.b.val})`
    }}></div>
}
export default class RectEntity {
    constructor() {
        this.pos =  new Position(50,50);
        this.size = new Size(10 , 10);
        this.color = new Color(255,0,0);
        this.script = new Script("");
        this.comps = [
            this.pos,
            this.size,
            this.color,
            this.script,
        ]
        this.renderer = () => RectEntityComponent(this,this.pos,this.size,this.color);
    }

    render() {
        
    }
}