import { proxy, useSnapshot } from "valtio";
import Color from "../comps/Color.jsx";
import Size from "../comps/Size.jsx";
import engine from "../lib/engine.js";
import Script from "../comps/Script.jsx";
import RectEntity from "./Rect.jsx";
import Entity  from "./Entity.jsx";
import { COMP_POS } from "../lib/consts.js";


// function SceneEntityComponent(ref) {
//     const size_prox =  {
//         w : useSnapshot(ref.comps.size.w),
//         h : useSnapshot(ref.comps.size.h),
//     };
//     const color_prox =  {
//         r : useSnapshot(ref.comps.color.r),
//         g : useSnapshot(ref.comps.color.g),
//         b : useSnapshot(ref.comps.color.b),
//     };


//     const entities = useSnapshot(ref.entities);

//     return  <div id="canvas" onMouseDown={(e) => {
//         engine.on_entity_select(ref,e);
//     }} className="scene-entity" style={{
//         width :  `${size_prox.w.val}px`, 
//         height : `${size_prox.h.val}px`, 
//         background : `rgb(${color_prox.r.val},${color_prox.g.val},${color_prox.b.val})`
//     }}>
//         {
//             entities.map((entity,idx) => {
//                 return <entity.renderer key={idx}/>
//             })    
//         }
//     </div>
// }
export default class SceneEntity extends Entity {
    update_renderer() {
        this.renderer = () => <this.base_renderer self={this} 
                                                  children={this.entities} 
                                                  jsx_props={{ 
                                                        onMouseDown : (e) => this.on_mouse_down(e),
                                                        className: "scene-entity", 
                                                }}/>;

        
    }
    
    constructor() {
        super();

        this.type = "scene";
        this.entities = proxy([]);
        this.comps = { size: new Size(400 , 600), color: new Color(255,255,255), };
        this.ignored_comps = [COMP_POS];

        this.update_renderer();
    }



    on_mouse_down(e) {
        engine.on_entity_select(this,e);
    }

    add_entity(entity) {
        this.entities.push(entity);
    }


    load(data) {
        super.load(data);

        for (let i = 0; i < data.children.length; i++) {
            if(data.children[i].type == "rect") {
                let rect = new RectEntity();
                rect.load(data.children[i]);
                this.entities.push(rect);
            } else {
                alert("[LOAD FROM LOCAL STORAGE] unkown type :(");
            }
        }
        this.update_renderer();
    }

    code() {
        let entity = super.code();

        let children = [];
        for (let i = 0; i < this.entities.length; i++) {
            children.push(this.entities[i].code());
        }

        return {
            ...entity,
            children,
        };
    }
}