import { proxy } from 'valtio'
import RectEntity from '../entities/Rect';
import SceneEntity from '../entities/Scene';




function PopupMenu({coords,menu_data}) {
    return   <div 
        className="popup-menu" 
        onClick={(e) => {e.stopPropagation();}}
        style={{
            left:`${coords[0] - 60}px`,
            top:`${coords[1]}px`,
        }}
        >

        {menu_data.map((option,idx) => {
            return <p key={idx} onClick={option.callback}>
                {option.title}
            </p>
        }) }
</div>
}


class Engine {
    constructor() {
        this.active_scene = proxy({val : new SceneEntity()});
        this.selected_entity = proxy({val : this.active_scene.val});
        this.is_code_editor_visible = proxy({val: false});
        
        this.cur_script_prox = proxy({val: undefined});
        this.selected_element = "";

        this.keep_menu_visible = proxy({val: false});
        this.popup_menu = {
            coords : proxy([0,0]),
            data : [],
            visible : proxy({val: false}),
            renderer : PopupMenu,
        };

        this.code_editor_pos = proxy({
            x: 100,
            y: 100,
        });
        

        this.mouse_down = false; 
        this.mouse = {
            down : false,
        }

        this.dragged_entity_info = {
            entity : proxy({val : undefined}),
            offset : {
                x: 0,
                y: 0,
            }
        }
        this.canvas_rect = { x: 0, y: 0};

        this.events();
    }

    events() {
        document.body.onmousedown = () => {
            this.mouse_down = true;
        }
        document.body.onmouseup = () => {
            this.mouse_down = false;
            this.dragged_entity_info.entity.val = undefined;
        }

        document.body.onmousemove = (e) => {
            this.mouse_move(e);
        }
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
        this.popup_menu.visible.val = false;
        this.selected_entity.val = ref;
        
        
        this.mouse_down = true;
        mouse_event.stopPropagation();
    }

    hide_code_editor() {
        this.is_code_editor_visible.val = false;
    }
    show_code_editor(script_prox) {
        this.is_code_editor_visible.val = true;
        this.cur_script_prox.val = script_prox;
    }
    window_clicked() {
        this.popup_menu.visible.val = false;
    }


    hide_popup_menu() {
        this.popup_menu.visible.val = false;
    }
    pop_menu(e,coords,menu_data) {
        

        this.popup_menu.coords[0] = coords.x;
        this.popup_menu.coords[1] = coords.y;
        this.popup_menu.visible.val = true;
        this.popup_menu.data = menu_data;

        e.stopPropagation();
    }


    code_editor_drag(mouse_event) {
        let x = mouse_event.clientX;
        let y = mouse_event.clientY;
        
        // ignore stop drop event 
        if(x == 0 && y == 0) return; 

        this.code_editor_pos.x = x;
        this.code_editor_pos.y = y;
    }


    mouse_move(e) {
        if(!this.dragged_entity_info.entity.val || !this.mouse_down) return;
        console.log(this.dragged_entity_info.offset.x);
        this.dragged_entity_info.entity.val.pos.x.val = Math.round(e.clientX - this.canvas_rect.x - this.dragged_entity_info.offset.x);
        this.dragged_entity_info.entity.val.pos.y.val = Math.round(e.clientY - this.canvas_rect.y - this.dragged_entity_info.offset.y);
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