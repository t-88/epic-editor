import { proxy, useSnapshot } from "valtio";
import Color from "../comps/Color.jsx";
import Size from "../comps/Size.jsx";
import engine from "../lib/engine.js";
import Script from "../comps/Script.jsx";


function SceneEntityComponent(ref) {
    const size_prox =  {
        w : useSnapshot(ref.size.w),
        h : useSnapshot(ref.size.h),
    };
    const bg_color_prox =  {
        r : useSnapshot(ref.bg_color.r),
        g : useSnapshot(ref.bg_color.g),
        b : useSnapshot(ref.bg_color.b),
    };


    const entities = useSnapshot(ref.entities);

    return  <div id="canvas" onMouseDown={(e) => {
        engine.on_entity_select(ref,e);
    }} className="scene-entity" style={{
        width :  `${size_prox.w.val}px`, 
        height : `${size_prox.h.val}px`, 
        background : `rgb(${bg_color_prox.r.val},${bg_color_prox.g.val},${bg_color_prox.b.val})`
    }}>
        {
            entities.map((entity,idx) => {
                return <entity.renderer key={idx}/>
            })    
        }

    </div>
}
export default class SceneEntity {
    constructor() {
        
        this.size = new Size(400 , 600);
        this.script = new Script("");
        this.bg_color = new Color(255,255,255);
        this.entities = proxy([]);
        this.comps = [
            this.size,
            this.bg_color,
            this.script,
        ]
        this.renderer = () => SceneEntityComponent(this);
    }


    add_entity(entity) {
        this.entities.push(entity);
    }
    render() {
        
    }
}