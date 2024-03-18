import { proxy } from 'valtio'
import RectEntity from '../entities/Rect';
import SceneEntity from '../entities/Scene';


class Engine {
    constructor() {
        this.active_scene = proxy({val : new SceneEntity()});
        this.selected_element = "";
        this.selected_entity = proxy({val : this.active_scene.val});
    }
    select_element(element_type) {
        this.selected_element = element_type;

        this.active_scene.val.add_entity(new RectEntity());
    }
    on_canvas_click(mouse_event) {
        if(this.selected_element ==  "") return
        let x = mouse_event.nativeEvent.offsetX;
        let y = mouse_event.nativeEvent.offsetY;
        this.selected_element =  "";
    } 
    on_entity_select(ref,mouse_event) {
        mouse_event.stopPropagation();
        this.selected_entity.val = ref;
    }


    //TODO: generate code 
    // generate_code()  {
    //     let entities = [];
    //     for (let i = 0; i < this.entities.length; i++) {
    //         let entity = {};
    //         for (let j = 0; j < this.entities[i].comps.length; j++) {
    //             const comp = this.entities[i].comps[j];
    //             entity[comp.name] = comp.code();
    //         }
    //         entities.push(entity)
    //     }

    //     let src = {
    //         entities : entities,
    //     }

    //     fetch("http://127.0.0.1:5000/py",{
    //         method: "POST",
    //         headers: {"Content-Type": "application/json"},
    //         body: JSON.stringify(src),
    //     });
    // }
}


const engine = new Engine();
export default engine;