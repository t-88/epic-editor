import { useSnapshot } from "valtio";
import Position from "../comps/Position.jsx";
import Size from "../comps/Size.jsx";
import engine from "../lib/engine.js";
import Script from "../comps/Script.jsx";
import Color from "../comps/Color.jsx";
import Entity from "./Entity.jsx";


function RectEntityComponent(ref) {
    const pos_prox =  {
        x : useSnapshot(ref.comps["pos"].x),
        y : useSnapshot(ref.comps["pos"].y)
    };
    const size_prox =  {
        w : useSnapshot(ref.comps["size"].w),
        h : useSnapshot(ref.comps["size"].h)
    };

    const color_prox =  {
        r : useSnapshot(ref.comps["color"].r),
        g : useSnapshot(ref.comps["color"].g),
        b : useSnapshot(ref.comps["color"].b),
    };    


    function on_mouse_down(e) {
        engine.on_entity_select(ref,e);
        engine.dragged_entity_info.entity.val = ref;
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

export default class RectEntity extends Entity {
    constructor() {
        super();
        this.type = "rect";
        this.comps = {
            pos: new Position(0,0),
            size: new Size(50,50),
            color: new Color(125,125,125),
            script: new Script(),
        };
        this.renderer = () => RectEntityComponent(this);
    }



}