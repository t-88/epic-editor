import Position from "../comps/Position.jsx";
import Size from "../comps/Size.jsx";
import Script from "../comps/Script.jsx";
import Color from "../comps/Color.jsx";
import {COMP_MAP} from "../lib/consts.js";



export default class Enitity {
    constructor() {
        this.type = "";
        this.comps = {};
        this.renderer = () => <></>;
    }

    add_component(type) {}
    load(data) {
        for (let i = 0; i < Object.keys(data.comps).length; i++) {
            this.comps[data.comps[Object.keys(data.comps)[i]].type] = COMP_MAP[data.comps[Object.keys(data.comps)[i]].type].load(data.comps[Object.keys(data.comps)[i]]);
        }
    }

    code() {
        let comps = {};
        for (let i = 0; i < Object.keys(this.comps).length; i++) {
            comps[Object.keys(this.comps)[i]] = this.comps[Object.keys(this.comps)[i]].code();            
        }  
        return {
            type : this.type,
            comps,
        };  
    }

}