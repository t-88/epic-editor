import { proxy, useSnapshot } from "valtio";
import Color from "../comps/Color.jsx";
import Size from "../comps/Size.jsx";
import engine from "../lib/engine.js";
import Script from "../comps/Script.jsx";
import RectEntity from "./Rect.jsx";


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
        this.type = "scene";
        this.size = new Size(400 , 600);
        this.script = new Script("");
        this.bg_color = new Color(255,255,255);
        this.entities = proxy([]);

        this.skipable_components = ["Position"];
        this.comps = [
            this.size,
            this.bg_color,
            this.script,
        ]
        this.renderer = () => SceneEntityComponent(this);
    }

    add_component(type) {
        if(this.skipable_components.includes(type)) return;
    }
    add_entity(entity) {
        this.entities.push(entity);
    }


    static load(data) {
        let entity =  new SceneEntity();
        entity.size.load(data.size); 
        entity.script.load(data.script); 
        entity.bg_color.load(data.bg_color); 
        for (let i = 0; i < data.children.length; i++) {
            if(data.children[i].type == "rect") {
                entity.entities.push(RectEntity.load(data.children[i]));
            } else {
                alert("[LOAD FROM LOCAL STORAGE] unkown type :(");
            }
        }

        return entity;
    }

    code() {
        let  entity = {
            type : this.type,
            size : this.size.code(),
            bg_color : this.bg_color.code(), 
            script : this.script.code(), 
            children : [],
        };
        for (let i = 0; i < this.entities.length; i++) {
            entity.children.push(this.entities[i].code());
        }

        return entity;
    }
}