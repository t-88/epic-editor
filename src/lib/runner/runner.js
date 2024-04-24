import Id from "./components/Id";
import { init_wasm ,transpile } from "../../op_lang/wapper";


import Color from "./components/Color";
import Position from "./components/Position";
import Size from "./components/Size";
import Storage from "./components/Storage";
import Rect from "./entities/RectEntity";
import shared_globals from "./utils/globals";




class Runner {
    constructor()  {
        this.canvas_ref = undefined;
        this.ctx = undefined;
        this.scene = undefined;

        this.entities = {};
        this.pressed_keys = [];
        this.is_running = false;


        this.init_src = "";

        this.last_time = undefined;
        this.curr_time = undefined;
        this.dt = 0;

        this.setup_events();
    }

    setup_events() {
        document.addEventListener("keydown", (e) => {
            if (this.pressed_keys.includes(e.code)) return;
            this.pressed_keys.push(e.code);
        }, false);
        document.addEventListener("keyup", (e) => {
            if (!this.pressed_keys.includes(e.code)) return;
            this.pressed_keys.splice(this.pressed_keys.indexOf(e.code), 1);
        }, false);
    }




    load_functions(script, func_prefix = "") {
        let code = "";
        let function_names = {};

        if (script) {
            // console.log(script)
            let {status, content} = transpile(script,func_prefix);
            code = content[0];
            console.assert(status == 0, "unreachable script status must be 0");


            function_names.on_update = func_prefix + `on_update`;
            function_names.on_init = func_prefix + `on_init`;
        }
        return [code, function_names]
    }
    load_entities(scene) {
        for (let i = 0; i < scene.children.length; i++) {
            let entity = scene.children[i];
            const [function_declarations, function_names] = this.load_functions(entity.comps.script, `_${i}_`);
            this.init_src += `
            {
                ${function_declarations}
                sys__create_rect({
                    pos :       ${JSON.stringify(entity.comps.pos)},
                    size :      ${JSON.stringify(entity.comps.size)},
                    color :     ${JSON.stringify(entity.comps.color)},
                    storage :   ${JSON.stringify(entity.comps.storage)},
                    id:         ${JSON.stringify(entity.comps.id)},
                    functions : {
                        on_update : ${function_names.on_update},
                        on_init : ${function_names.on_init},
                    },
                });                
            }
            `;
        }
    }
    load_scene(scene) {
        const [function_declarations, function_names] = this.load_functions(scene.comps.script);
        this.canvas_ref.width = scene.comps.size.w;
        this.canvas_ref.height = scene.comps.size.h;
        this.canvas_ref.style.background = `rgb(${scene.comps.color.r},${scene.comps.color.g},${scene.comps.color.b})`;
        this.init_src += `
        {
            ${function_declarations}
            sys__create_rect({
                pos :       ${JSON.stringify({ x: 0, y: 0, })},
                size :      ${JSON.stringify(scene.comps.size)},
                color :     ${JSON.stringify(scene.comps.color)},
                storage :   ${JSON.stringify(scene.comps.storage)},
                id:         ${JSON.stringify(scene.comps.id)},
                functions : {
                    on_update : ${function_names.on_update},
                    on_init : ${function_names.on_init},
                },
            });                
        }
        `;
    }
    create_js_src(init) {
        
        return `
        (self) => {
            // consts
            ${shared_globals}

            function init() {
                ${init}
                for (let uuid in self.entities) {
                    self.entities[uuid].on_init(uuid);
                }
            }
            function update() {
                if(!self.is_running) return;
                let i = 0;
                for (let uuid in self.entities) {
                    self.entities[uuid].on_update(uuid);
                    i += 1;
                }
                self.render();
                requestAnimationFrame((now) => {
                    if(!self.last_time) self.last_time = now;
                    self.dt = (now - self.last_time) / 1000;
                    self.last_time = now;
                    update();
                });
            }
            init();
            update();
        }`;
    }
    async load_app() {
        await init_wasm(); 

        this.ctx = this.canvas_ref.getContext("2d");
        this.init_src = "";

        let scene = JSON.parse(localStorage.getItem("saved-scene"));
        this.load_scene(scene);
        this.load_entities(scene);

        let src = this.create_js_src(this.init_src);
        console.log(src);
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
        this.entities = {};
        this.pressed_keys = [];
        this.last_time = undefined;

    }
    stop() {
        this.is_running = false;
        this.scene = undefined;
    }
}


const runner = new Runner();


function sys__AABB(x1,y1,w1,h1,x2,y2,w2,h2){
    return x1 + w1 > x2 && y1 + h1 > y2 && x2 + w2 > x1 && y2 + h2 > y1
}
function sys__randint(num) {
    return (Math.random() * 1000) % num
} 
function sys__is_pressed(key) {
    return runner.pressed_keys.includes(key);
}
function sys__get_dt() {
    return runner.dt;
}
function sys__create_rect({ pos, size, color, id, storage, functions }) {
    let rect = new Rect();
    runner.entities[rect.uuid] = rect;

    if (pos) rect.comps["pos"] = new Position({ x: pos.x, y: pos.y });
    if (color) rect.comps["color"] = new Color({ r: color.r, g: color.g, b: color.b });
    if (size) rect.comps["size"] = rect.comps["size"] = new Size({ w: size.w, h: size.h });
    if (storage) rect.comps["storage"] = new Storage({ map: storage.map((val) => val) });
    if (id) rect.comps["id"] = new Id({ id: id });
    if (functions) {
        if (functions.on_update) rect.on_update = functions.on_update;
        if (functions.on_init) rect.on_init = functions.on_init;
    }
}    
function sys__get_entity_by_id(id) {
    for (let key in runner.entities) {
        if (!runner.entities[key].comps.id) continue;
        if (id == runner.entities[key].comps.id.id) {
            return runner.entities[key].uuid
        }
    }
    alert("entity not found");
}
function sys__get_component(id, type) {
    if (type == "storage") {
        return runner.entities[id].comps[type].map;
    }
    return runner.entities[id].comps[type];
}
function sys__create_entity(on_init, on_update,{x = 0, y = 0, w = 0, h = 0, r = 0, g = 0, b = 0}) {
    sys__create_rect({ pos: { x, y }, size: { w, h }, color: { r, g, b }, functions: { on_init: on_init, on_update: on_update } });
}
function sys__remove_entity(id) {
    delete runner.entities[id];
}

function sys__clear_entities() { }

function sys__init() {
    location.reload();
}


export default runner;



