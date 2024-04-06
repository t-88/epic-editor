import Id from "./components/Id";
import OPParser from "../op_lang/parser";
import OPTraspiler from "../op_lang/transpiler";
import Color from "./components/Color";
import Position from "./components/Position";
import Size from "./components/Size";
import Storage from "./components/Storage";
import Rect from "./entities/RectEntity";
import Functions from "./utils/functions";
import shared_globals from "./utils/globals";


class Runner extends Functions {
    constructor() {
        super();

        this.canvas_ref = undefined;
        this.ctx = undefined;
        this.scene = undefined;

        this.entities = {};
        this.pressed_keys = [];
        this.is_running = false;

        this.parser = new OPParser();
        this.transpiler = new OPTraspiler();
        this.init_src = "";


        document.addEventListener("keydown", (e) => {
            if (this.pressed_keys.includes(e.code)) return;
            this.pressed_keys.push(e.code);
        }, false);
        document.addEventListener("keyup", (e) => {
            if (!this.pressed_keys.includes(e.code)) return;
            this.pressed_keys.splice(this.pressed_keys.indexOf(e.code), 1);
        }, false);
    }


    is_pressed(key) {
        return this.pressed_keys.includes(key);
    }
    create_rect({ pos, size, color, id, storage, functions }) {
        let rect = new Rect();
        this.entities[rect.uuid] = rect;

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
    get_entity_by_id(id) {
        for (let key in this.entities) {
            if (!this.entities[key].comps.id) continue;
            if (id == this.entities[key].comps.id.id) {
                return this.entities[key].uuid
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
    create_entity(x, y, w, h, r, g, b, on_init = () => { }, on_update = () => { }) {
        this.create_rect({ pos: { x, y }, size: { w, h }, color: { r, g, b }, functions: { on_init: on_init, on_update: on_update } });
    }
    remove_entity(id) {
        delete this.entities[id];
    }
    init() {
        location.reload();
    }
    clear_entities() { }
    load_functions(script, func_prefix = "") {
        let function_declarations = "";
        let function_names = {};

        if (script) {
            this.parser.parse(script);
            this.transpiler.transpile(this.parser.program, 0, [], func_prefix);
            for (let key in this.transpiler.functions) {
                function_declarations += this.transpiler.functions[key];
            }
            function_names.on_update = this.transpiler.functions[func_prefix + `on_update`] ? func_prefix + `on_update` : undefined
            function_names.on_init = this.transpiler.functions[func_prefix + `on_init`] ? func_prefix + `on_init` : undefined
        }
        return [function_declarations, function_names]
    }
    load_entities(scene) {
        for (let i = 0; i < scene.children.length; i++) {
            let entity = scene.children[i];
            const [function_declarations, function_names] = this.load_functions(entity.comps.script, `_${i}_`);
            this.init_src += `
            {
                ${function_declarations}
                self.create_rect({
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
            self.create_rect({
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
                requestAnimationFrame(() => update());
            }
            init();
            update();
        }`;
    }
    load_app() {
        this.ctx = this.canvas_ref.getContext("2d");
        this.init_src = "";

        let scene = JSON.parse(localStorage.getItem("saved-scene"));
        this.load_scene(scene);
        this.load_entities(scene);

        let src = this.create_js_src(this.init_src);
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

    }
    stop() {
        this.is_running = false;
        this.scene = undefined;
    }
}



const runner = new Runner();
export default runner;



