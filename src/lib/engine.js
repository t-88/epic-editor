import { proxy } from 'valtio'
import RectEntity from '../entities/Rect';
import SceneEntity from '../entities/Scene';
import PopupMenu from "../elements/PopupMenu";
import { COMP_SCRIPT } from './consts';
import Msg from './../models/Msg';



function download_text_file(filename, text) {
    console.log(text);
    var elem = document.createElement("a");
    elem.setAttribute("href", "data:text/plain;charset=utf8," + encodeURIComponent(text));
    elem.setAttribute("download", filename);
    elem.style.display = "none";
    document.body.appendChild(elem);
    elem.click()
    document.body.removeChild(elem);
}

class Engine {
    constructor() {
        this.active_scene = proxy({ val: undefined });
        this.load_from_local_storage();

        this.selected_entity = proxy({ val: this.active_scene.val });
        this.is_code_editor_visible = proxy({ val: false });
        this.cur_script_prox = proxy({ val: undefined });
        this.selected_element = "";
        this.keep_menu_visible = proxy({ val: false });

        this.popup_menu = {
            coords: proxy([0, 0]),
            data: [],
            visible: proxy({ val: false }),
            renderer: PopupMenu,
        };

        this.code_editor_pos = proxy({ x: 100, y: 100 });
        this.mouse_down = false;

        this.dragged_entity_info = {
            entity: proxy({ val: undefined }),
            offset: { x: 0, y: 0, }
        }
        this.canvas_rect = { x: 0, y: 0 };


        this.code_editor = proxy({
            height: 100,
            y_offset: 0,
            dragged: false,
        });


        this.error_messages = proxy([]);
        this.events();
    }

    events() {
        document.body.onmousedown = () => {
            this.mouse_down = true;
        }
        document.body.onmouseup = () => {
            this.mouse_down = false;
            this.dragged_entity_info.entity.val = undefined;
            this.code_editor.dragged = false;
        }

        document.body.onmousemove = (e) => {
            this.mouse_move(e);
        }
    }
    load_from_local_storage() {
        this.active_scene.val = new SceneEntity();
        if (!localStorage.getItem("saved-scene")) { 
            this.update_store();
        }
        try {
            this.active_scene.val.load(JSON.parse(localStorage.getItem("saved-scene")));
        } catch(e) {
            this.update_store();
        }
    }


    select_element(element_type) {
        this.selected_element = element_type;
        this.active_scene.val.add_entity(new RectEntity());
        engine.update_store();
    }
    on_canvas_click(mouse_event) {
        if (this.selected_element == "") return
        this.selected_element = "";
    }
    on_entity_select(ref, mouse_event) {
        this.popup_menu.visible.val = false;
        this.selected_entity.val = ref;


        if (this.selected_entity.val.comps[COMP_SCRIPT]) {
            this.cur_script_prox.val = this.selected_entity.val.comps[COMP_SCRIPT];
        } else {
            this.cur_script_prox.val = undefined;
        }


        this.mouse_down = true;
        mouse_event.stopPropagation();
    }

    window_clicked() {
        this.popup_menu.visible.val = false;
    }


    hide_popup_menu() {
        this.popup_menu.visible.val = false;
    }
    pop_menu(e, coords, menu_data) {


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
        if (x == 0 && y == 0) return;

        this.code_editor_pos.x = x;
        this.code_editor_pos.y = y;
    }

    mouse_move(e) {
        if (this.mouse_down) {
            if (this.dragged_entity_info.entity.val) {
                this.dragged_entity_info.entity.val.comps.pos.x.val = Math.round(e.clientX - this.canvas_rect.x - this.dragged_entity_info.offset.x);
                this.dragged_entity_info.entity.val.comps.pos.y.val = Math.round(e.clientY - this.canvas_rect.y - this.dragged_entity_info.offset.y);
                engine.update_store();
            }

            if (this.code_editor.dragged) {
                this.code_editor.height = window.innerHeight - e.clientY;
            }
        }
    }

    update_store() {
        localStorage.setItem("saved-scene", JSON.stringify(this.active_scene.val.code()));
    }

    add_component(type) {
        this.hide_popup_menu();
        this.selected_entity.val.add_component(type);

        if (type == COMP_SCRIPT) {
            this.cur_script_prox.val = this.selected_entity.val.comps[COMP_SCRIPT];
        }

    }


    reset_local_storage() {
        localStorage.clear();
        this.active_scene.val = new SceneEntity();
        this.selected_entity.val = this.active_scene.val;
        this.update_store();
    }


    code_editor_resize_grap(e) {
        if (this.code_editor.dragged) return;
        this.code_editor.offset = e.clientY;
        this.code_editor.dragged = true;
    }


    reset() {
        engine.reset_local_storage();
        this.cur_script_prox.val = undefined;

    }

    generate_src() {
        download_text_file("src.json", localStorage.getItem("saved-scene"));
    }


    evalute_scripts() {
        this.error_messages.length = 0;

        if (this.active_scene.val.comps.script) {
            let [valid, reason] = this.active_scene.val.comps.script.evalute();
            if (!valid) {
                this.error_messages.push(new Msg(
                    `expected ${reason} function on scene ${!this.active_scene.val.comps.id ? "" : `with id '${this.active_scene.val.comps.id.id.val}'`}`,
                    (e) => {
                        this.on_entity_select(this.active_scene.val, e);
                    }
                ));
            }
        }
        for (let i = 0; i < this.active_scene.val.entities.length; i++) {
            if (this.active_scene.val.entities[i].comps.script) {
                let [valid, reason] = this.active_scene.val.entities[i].comps.script.evalute();
                if (!valid) {
                    this.error_messages.push(new Msg(
                        `expected ${reason} function on scene ${!this.active_scene.val.entities[i].comps.id ? "" : `with id '${this.active_scene.val.entities[i].comps.id.id.val}'`}`,
                        (e) => {
                            this.on_entity_select(this.active_scene.val.entities[i], e);
                        }
                    ));                    
                }
            }
        }
        return this.error_messages.length == 0;
    }
}


const engine = new Engine();
export default engine;