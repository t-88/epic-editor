import { proxy, useSnapshot } from "valtio";
import Color from "../comps/Color.jsx";
import Size from "../comps/Size.jsx";
import engine from "../lib/engine.js";
import Script from "../comps/Script.jsx";
import RectEntity from "./Rect.jsx";
import Entity  from "./Entity.jsx";
import { COMP_POS } from "../lib/consts.js";


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

        this.type = "Scene";

        this.entities = proxy([]);
        this.comps.size = new Size(400,600);
        this.comps.color =  new Color(255,255,255);
        this.comps.id.id.val = "Scene";

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
            if(data.children[i].type == "Rect") {
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

