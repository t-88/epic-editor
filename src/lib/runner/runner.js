import Id from "./components/Id";
import OPParser from "../op_lang/parser";
import OPTraspiler from "../op_lang/transpiler";
import Color from "./components/Color";
import Position from "./components/Position";
import Size from "./components/Size";
import Storage from "./components/Storage";
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

        document.addEventListener("keydown", (e) => {
            if (this.pressed_keys.includes(e.code)) return;
            this.pressed_keys.push(e.code);
        }, false);
        document.addEventListener("keyup", (e) => {
            if (!this.pressed_keys.includes(e.code)) return;
            this.pressed_keys.splice(this.pressed_keys.indexOf(e.code), 1);
        }, false);
    }


    create_react({ pos, size, color, id, storage, functions }) {
        let rect = new Rect();
        this.entities[rect.uuid] = rect;

        if (pos) rect.comps["pos"] = new Position({ x: pos.x, y: pos.y });
        if (color) rect.comps["color"] = new Color({ r: color.r, g: color.g, b: color.b });
        if (size) rect.comps["size"] = rect.comps["size"] = new Size({ w: size.w, h: size.h });
        if (storage) rect.comps["storage"] = new Storage({ map: storage.map.map((val) => val) });
        if (id) rect.comps["id"] = new Id({ id: id.id });
        if (functions) {
            if (functions.on_update) rect.on_update = functions.on_update;
            if (functions.on_init) rect.on_init = functions.on_init;
        }
    }
    is_pressed(key) {
        return this.pressed_keys.includes(key);
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
        this.create_react({ pos: { x, y }, size: { w, h }, color: { r, g, b }, functions: { on_init: on_init, on_update: on_update } });
    }
    remove_entity(id) {
        delete this.entities[id];
    }
    init() {
        location.reload();
    }
    clear_entities() {}

    
    load_app() {
        this.ctx = this.canvas_ref.getContext("2d");

        let init_src = "";
        let parser = new OPParser();
        let transpiler = new OPTraspiler();

        let scene = JSON.parse(localStorage.getItem("saved-scene"));
        this.create_react({
            pos: { x: 0, y: 0, },
            size: scene.comps.size,
            color: scene.comps.color,
            id: scene.comps.id,
        });
        this.canvas_ref.width = scene.comps.size.w;
        this.canvas_ref.height = scene.comps.size.h;
        this.canvas_ref.style.background = `rgb(${scene.comps.color.r},${scene.comps.color.g},${scene.comps.color.b})`;

        // load all entities
        for (let i = 0; i < scene.children.length; i++) {
            let entity = scene.children[i];
            let entity_functions = {};
            let functions = "";

            if (entity.comps.script) {
                parser.parse(entity.comps.script.script);
                transpiler.transpile(parser.program, 0, [], `_${i}_`);
                for (let key in transpiler.functions) {
                    functions += transpiler.functions[key];
                }
                entity_functions.on_update = transpiler.functions[`_${i}_on_update`] ? `_${i}_on_update` : undefined
                entity_functions.on_init = transpiler.functions[`_${i}_on_init`] ? `_${i}_on_init` : undefined
            }
            init_src += `
            {
                ${functions}
                self.create_react({
                    pos :       ${JSON.stringify(entity.comps.pos)},
                    size :      ${JSON.stringify(entity.comps.size)},
                    color :     ${JSON.stringify(entity.comps.color)},
                    storage :   ${JSON.stringify(entity.comps.storage)},
                    id:         ${JSON.stringify(entity.comps.id)},
                    functions : {
                        on_update : ${entity_functions.on_update},
                        on_init : ${entity_functions.on_init},
                    },
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

            function init() {
                {
                    ${functions}
                    ${this.init_callback}
                }
                let rect;
                ${init_src}

                for (let uuid in self.entities) {
                    self.entities[uuid].on_init(uuid);
                }
            }

            function update() {
                if(!self.is_running) return;

                ${this.update_callback}
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



