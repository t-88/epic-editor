import { proxy } from 'valtio'
import RectEntity from '../entities/Rect';
import SceneEntity from '../entities/Scene';
import PopupMenu from "../elements/PopupMenu";




// TODO: generate code 
class Engine {
    constructor() {
        this.active_scene = undefined;
        this.load_from_local_storage();

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

        this.code_editor_pos = proxy({ x: 100, y: 100});
        this.mouse_down = false; 

        this.dragged_entity_info = {
            entity : proxy({val : undefined}),
            offset : {x: 0,y: 0,}
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
    load_from_local_storage() {
        this.active_scene = proxy({val: new SceneEntity()});
        if(!localStorage.getItem("saved-scene")) { return; }

        this.active_scene.val.load(JSON.parse(localStorage.getItem("saved-scene")));
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
        this.dragged_entity_info.entity.val.comps.pos.x.val = Math.round(e.clientX - this.canvas_rect.x - this.dragged_entity_info.offset.x);
        this.dragged_entity_info.entity.val.comps.pos.y.val = Math.round(e.clientY - this.canvas_rect.y - this.dragged_entity_info.offset.y);
    }

    update_store() {
        localStorage.setItem("saved-scene",JSON.stringify(this.active_scene.val.code()));
    }

    add_component(type) {
        this.hide_popup_menu();
        this.selected_entity.val.add_component(type);
    }


    reset_local_storage() {
        localStorage.clear();
        this.active_scene.val = new SceneEntity();
        this.selected_entity.val = this.active_scene.val; 
    }

}


const engine = new Engine();
export default engine;