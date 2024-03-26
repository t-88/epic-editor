import Position from "../components/Position";
import Size from "../components/Size";
import Color from "../components/Color";
import Script from "../components/Script";
import runner from "../runner";
import Id from "../../../comps/Id";
import Stroage from "../components/Storage";


const COMP_MAP = {
    "pos": Position,
    "size": Size,
    "color": Color,
    "script": Script,
    "id": Id,
    "storage": Stroage,
};

const shared_globals =  `
const Components = {
    "Position" : "pos" ,
    "Size" : "size",
    "Color" : "color",
    "Script" : "script",
    "Storage" : "storage",
};

const Keys = {
    "Left": "ArrowLeft",
    "Right": "ArrowRight",
    "Up": "ArrowUp",
    "Down": "ArrowDown",
};
`;




export default class Entity {
    constructor() {
        this.id = crypto.randomUUID();
        this.comps = {};
        runner.entities[this.id] = this;
    }

    is_pressed(key) {
        return runner.pressed_keys.includes(key);
    }
    get_entity_by_id(id) {
        for(let key in runner.entities) {
            if(id == runner.entities[key].comps.id.id.val.id) {
                return runner.entities[key].id
            }
        }
    }    
    get_component(id,type) {
        if(type == "storage") {
            return runner.entities[id].comps[type].map;
        }
        return runner.entities[id].comps[type];
    }  
    log(data) {
        console.log(data);
    }  


    AABB(x1,y1,w1,h1,x2,y2,w2,h2){
        return x1 + w1 > x2 && y1 + h1 > y2 && x2 + w2 > x1 && y2 + h2 > y1
    }
    sqrt(num) {
        return Math.sqrt(num)
    }


    load(data) {
        for(let key in data.comps) {
            this.comps[key] = new COMP_MAP[key](data.comps[key]);
        }
    }

    update() {
    }
    render(ctx) {
    }    
}

export {shared_globals}


