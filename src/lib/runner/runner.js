import Id from "./components/Id";
import OPParser from "../op_lang/parser";
import OPTraspiler from "../op_lang/transpiler";
import Color from "./components/Color";
import Position from "./components/Position";
import Size from "./components/Size";
import Storagee from "./components/Storage";
import Rect from "./entities/RectEntity";
import SceneEntity from "./entities/SceneEntity";
import Functions from "./utils/functions";
import shared_globals from "./utils/globals";


class Runner extends Functions {
    constructor() {
        super();

        this.canvas_ref = undefined;
        this.ctx = undefined;
        this.scene = undefined;



        this.init_callback = () => { };
        this.update_callback = () => { };
        this.entities = {};
        this.pressed_keys = [];
        this.is_running = false;

        this.init_events();

        this.animation_frame_id = undefined;

        this.intial_state = {};
    }



    init_events() {
        document.addEventListener("keydown", (e) => {
            if (this.pressed_keys.includes(e.code)) return;
            this.pressed_keys.push(e.code);
        }, false);
        document.addEventListener("keyup", (e) => {
            if (!this.pressed_keys.includes(e.code)) return;
            this.pressed_keys.splice(this.pressed_keys.indexOf(e.code), 1);
        }, false);
    }


    new_rect({ x, y, w, h, r, g, b, id , storage = [], on_init, on_update }) {
        let rect = new Rect();
        rect.comps["pos"] = new Position({x, y});
        rect.comps["size"] = new Size({w, h});
        rect.comps["color"] = new Color({r, g, b});
        rect.comps["storage"] = new Storagee({map : storage});
        
        if (id) { rect.comps["id"] = new Id({id}); }
        rect.update = on_update;
        rect.init = on_init;
        this.entities[rect.id] = rect;
    }
    new_scene({ w, h, r, g, b,id = "", storage = [], on_init, on_update }) {
        this.canvas_ref.width = w;
        this.canvas_ref.height = h;
        this.canvas_ref.style.background = `rgb(${r},${g},${b})`;

        let scene = new SceneEntity();
        scene.comps["size"] = new Size({w, h});
        scene.comps["color"] = new Color({r, g, b});
        scene.comps["storage"] = new Storagee({map : storage});
        if (id) { scene.comps["id"] = new Id({id}); }

        this.init_callback = on_init;
        this.update_callback = on_update;
        this.entities[scene.id] = scene;
    }

    is_pressed(key) {
        return this.pressed_keys.includes(key);
    }
    get_entity_by_id(id) {
        for (let key in this.entities) {
            if (!this.entities[key].comps.id) continue;

            if (id == this.entities[key].comps.id.id) {
                return this.entities[key].id
            }
        }

        alert("entity not found");
    }
    get_component(id, type) {
        if (type == "storage") {
            return this.entities[id].comps[type].map;
        }
      
        return this.entities[id].comps[type];
    }
    create_entity(x, y, w, h, r, g, b,on_init = () => {}, on_update = ()=>{}) {
        this.new_rect({ x, y, w, h, r, g, b, on_init: on_init, on_update: on_update });
    }
    remove_entity(id) {
        delete this.entities[id];
    }
    init() {
        location.reload();
    }
    clear_entities() {
        
    }




    load_app() {
        this.ctx = this.canvas_ref.getContext("2d");

        let init_src = "";
        let parser = new OPParser();
        let transpiler = new OPTraspiler();


        let scene = JSON.parse(localStorage.getItem("saved-scene"));
        this.new_scene({ 
            w : scene.comps.size.w,
            h : scene.comps.size.h,
            r : scene.comps.color.r,
            g : scene.comps.color.g,
            b : scene.comps.color.b,
            id: scene.comps.id.id,
        });


            

        // load all entities
        for (let i = 0; i < scene.children.length; i++) {
            let entity = scene.children[i];
            let update_callback;
            let init_callback;

            let functions = "";

            if (entity.comps.script) {
                parser.parse(entity.comps.script.script);
                transpiler.transpile(parser.program, 0, [], `_${i}_`);
                for (let key in transpiler.functions) {
                    functions += transpiler.functions[key];
                }
                update_callback = transpiler.functions[`_${i}_on_update`] ? `_${i}_on_update` : "() => {}";
                init_callback = transpiler.functions[`_${i}_on_init`] ? `_${i}_on_init` : "() => {}";
            }
            init_src += `
            {
                ${functions}
                rect = self.new_rect({
                    x : ${entity.comps.pos.x},
                    y : ${entity.comps.pos.y},
                    w : ${entity.comps.size.w},
                    h : ${entity.comps.size.h},
                    r : ${entity.comps.color.r},
                    g : ${entity.comps.color.g},
                    b : ${entity.comps.color.b},
                    id: "${entity.comps.id.id ?? ""}",
                    storage: ${entity.comps.storage ? JSON.stringify(entity.comps.storage.map.map((val) => val)) : "[]"},
                    on_update : ${update_callback},
                    on_init : ${init_callback},

                });
            }
            `;
        }


        let functions = "";
        if (scene.comps.script) {
            parser.parse(scene.comps.script.script);
            transpiler.transpile(parser.program, 0, []);
            for (let key in transpiler.functions) {
                functions += transpiler.functions[key];
            }
            this.update_callback = transpiler.functions[`on_update`] ? `on_update();` : "() => {}";
            this.init_callback = transpiler.functions[`on_init`] ? `on_init();` : "() => {}";
        }   



        let src = `
        (self) => {
            // consts
            ${shared_globals}

            // functions 

            // init function
            function init() {
                {
                    ${functions}
                    ${this.init_callback}
                }
                let rect;
                ${init_src}

                for (let entity_id in self.entities) {
                    self.entities[entity_id].init(entity_id);
                }
                console.log(self.entities);
            }

            function update() {
                if(!self.is_running) return;

                ${this.update_callback}
                let i = 0;
                for (let entity_id in self.entities) {
                    self.entities[entity_id].update(entity_id);
                    i += 1;
                }
                self.render();

                self.animation_frame_id = requestAnimationFrame(() => update());
            }
            init();
            update();
        }`;

        eval(src)(this);

    }


    render() {
        this.ctx.clearRect(0, 0, this.canvas_ref.width, this.canvas_ref.height);
        for (let entity_id in this.entities) {
            this.entities[entity_id].render(this.ctx);
        }
    }

    start() {       
        this.is_running = true;
        this.scene = undefined;
        this.entities = structuredClone(this.intial_state);
        this.pressed_keys = [];

    }
    stop() {
        this.is_running = false;
        this.scene = undefined;
    }

}



const runner = new Runner();
export default runner;