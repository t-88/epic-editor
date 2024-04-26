import { init_wasm, transpile } from "../op_lang/wapper.js";
import kaboom from "kaboom";
const shared_globals =  `
const Components = {
    "Position" : "Position" ,
    "Size" :     "Size",
    "Color" :    "Color",
    "Script" :   "Script",
    "Storage" :  "Storage",
};

const Keys = {
    "Left": "left",
    "Right": "right",
    "Up": "up",
    "Down": "down",
};
`;


function uuidv4() {
    return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
      (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
    );
  }
function empty(ID) {

}
class Rectangle {
    constructor(init , update, { pos = {x : 0, y : 0} , size = {w : 0, h : 0}, color = {r : 0, g : 0 , b : 0} ,id = undefined, storage = []} ) {
        this.uuid = uuidv4();
        if (!id) id = this.uuid;

        this.pos = pos ;
        this.size = size ;
        this.color =  color;
        this.id = id; 
        this.storage = {};
        for (let i = 0; i < storage.length; i++) {
            this.storage[storage[i]["key"]] = Number.parseFloat(storage[i]["val"])
        }

        this.update = update ?? empty;
        this.init = init ?? empty;

        this.ref = undefined;

    }
    get_component(comp_typ) {
        if (comp_typ == "Position") return this.pos
        else if (comp_typ == "Size")   return this.size
        else if (comp_typ == "Color")  return this.color
        else if (comp_typ == "Id")  return this.id
        else if (comp_typ == "Storage") return this.storage    
    }
}


function sys__randint(num) {
    return (Math.random() * 1000) % num
}
function sys__AABB(x1, y1, w1, h1, x2, y2, w2, h2) {
    return x1 + w1 > x2 && y1 + h1 > y2 && x2 + w2 > x1 && y2 + h2 > y1
}
function sys__is_pressed(key) {
    return runner.kaboom.isKeyDown(key);
}
function sys__get_dt() {
    return runner.dt;
}


function sys__get_component(id, type) {
    return runner.entities[id].get_component(type);
}

function sys__remove_entity(id) {
    runner.kaboom.destroy(runner.entities[id].ref);
    delete runner.entities[id];
}

function sys__clear_entities() { 
    for(let uuid in runner.entities) {
        runner.kaboom.destroy(runner.entities[uuid].ref);
        delete runner.entities[uuid];
    }
}

function sys__init() {
    runner.restart = true;
}
function sys__get_entity_by_id(id) {
    for (let uuid in runner.entities) {
        if (!runner.entities[uuid].id) continue;
        if (id == runner.entities[uuid].id) {
            return uuid;
        }
    }
    console.error(`no entity with id ${id} exsists`);
}
function sys__create_entity(on_init, on_update, { x = 0, y = 0, w = 0, h = 0, r = 0, g = 0, b = 0, storage = [], id }) {
    let kaboom_rect = runner.kaboom.add([
        runner.kaboom.pos(x ?? 0, y ?? 0),
        runner.kaboom.rect(w ?? 0, h ?? 0),
        runner.kaboom.color(r ?? 0, g ?? 0, b ?? 0),
        { storage },
        { id }
    ]);
    let rect = new Rectangle(on_init, on_update, { pos: kaboom_rect.pos, size: {w : kaboom_rect.width, h: kaboom_rect.height}, color: kaboom_rect.color, storage: storage, id: id });
    rect.ref = kaboom_rect;
    runner.entities[rect.uuid] = rect; 
}



class Runner {
    constructor() {
        this.canvas_ref = undefined;
        this.ctx = undefined;
        this.scene = undefined;

        this.entities = {};
        self.backup_entities = {};
        this.pressed_keys = [];
        this.is_running = false;


        this.init_src = "";

        this.last_time = undefined;
        this.curr_time = undefined;
        this.kaboom = undefined;
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

    start() {
        this.is_running = true;
        this.scene = undefined;
        this.entities = {};
        this.pressed_keys = [];
        this.last_time = undefined;
    }
    stop() {
        this.is_running = false;

        if(!this.kaboom) return;
        this.kaboom.quit();
    }  

    load_functions(script, func_prefix = "") {
        let code = "";
        let function_names = {};

        if (script) {
            let { status, content } = transpile(script, func_prefix);
            code = content[0];
            console.assert(status == 0, "unreachable script status must be 0");


            function_names.on_update = func_prefix + `on_update`;
            function_names.on_init = func_prefix + `on_init`;
        }
        return [code, function_names]
    }
    compile_entity(entity,func_prefix = "") {
        const [function_declarations, function_names] = this.load_functions(entity.comps.script, func_prefix);
        let x = 0;
        let y = 0;
        let w = 0;
        let h = 0;
        let r = 0;
        let g = 0;
        let b = 0;
        let id = undefined;
        let storage = "[]";
        if(entity.comps.pos) {
            x = entity.comps.pos.x;
            y = entity.comps.pos.y;
        }
        if(entity.comps.size) {
            w = entity.comps.size.w;
            h = entity.comps.size.h;
        }
        if(entity.comps.color) {
            r = entity.comps.color.r;
            g = entity.comps.color.g;
            b = entity.comps.color.b;
        }
        if(entity.comps.id) {
            id = entity.comps.id;
        }
        if(entity.comps.storage) {
            storage = entity.comps.storage;
        }

        return `
        {
            ${function_declarations}
            sys__create_entity(
                ${function_names.on_init},
                ${function_names.on_update},
                {
                    x :      ${x},
                    y :      ${y},
                    w :      ${w},
                    h :      ${h},
                    r :      ${r},
                    g :      ${g},
                    b :      ${b},
                    id :     "${id}",
                    storage: ${JSON.stringify(storage)},
                }
            );                
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
                    self.entities[uuid].init(uuid);
                }
            }
            
            function update() {
                if(!self.is_running) return;

                for (let uuid in self.entities) {
                    self.entities[uuid].update(uuid);
                    if(self.restart) {
                        self.restart = false;
                        init();
                        break;
                    };
                }
            }
            init();
            self.kaboom.onUpdate(() => {
                self.dt = self.kaboom.dt();
                update();
            });
        }`;
    }
    async load_app() {
        await init_wasm();

        this.init_src = "";
        let scene = JSON.parse(localStorage.getItem("saved-scene"));
        this.init_src += this.compile_entity(scene);
        for (let i = 0; i < scene.children.length; i++) {
            this.init_src += this.compile_entity(scene.children[i],`__${i}__`);
        }

        this.kaboom = kaboom({
            global: false,
            canvas: this.canvas_ref,
            background: [scene.comps.color.r, scene.comps.color.g, scene.comps.color.b],
            width: scene.comps.size.w,
            height: scene.comps.size.h,
        });

        let src = this.create_js_src(this.init_src);
        eval(src)(this);
    }

  
}


const runner = new Runner();











export default runner;





