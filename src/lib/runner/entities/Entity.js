import Position from "../components/Position";
import Size from "../components/Size";
import Color from "../components/Color";
import Script from "../components/Script";


const COMP_MAP = {
    "pos": Position,
    "size": Size,
    "color": Color,
    "script": Script,
};

export default class Entity {
    constructor() {
        this.comps = {};
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
