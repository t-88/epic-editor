import Position from "../components/Position";
import Size from "../components/Size";
import Color from "../components/Color";
import Script from "../components/Script";
import runner from "../runner";
import Id from "../../../comps/Id";


const COMP_MAP = {
    "pos": Position,
    "size": Size,
    "color": Color,
    "script": Script,
    "id": Id,
};

const shared_globals =  `
const Components = {
    "Position" : "pos" ,
    "Size" : "size",
    "Color" : "color",
    "Script" : "script",
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
    
    get_component(id,type) {
        return runner.entities[id].comps[type];
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


