import Position from "../comps/Position.jsx";
import Size from "../comps/Size.jsx";
import Script from "../comps/Script.jsx";
import Color from "../comps/Color.jsx";
import COMP_MAP from "../lib/COMP_MAP.js";
import { proxy, useSnapshot } from "valtio";
import { COMP_POS } from "../lib/consts.js";
import { watch } from 'valtio/utils'
import Id from "../comps/Id.jsx";



function Entity({self,jsx_props,children =[]}) {
    let style_props = {};
    let prox_store = [];
    for (let comp_type in self.comps) {
        let proxy_list = self.comps[comp_type].proxy_list();
        for (let i = 0; i < proxy_list.length; i++) {
            prox_store.push(proxy_list[i]);
        }
        style_props = {...style_props,...self.comps[comp_type].get_style_props()}
    }

    // for start update
    useSnapshot(proxy(prox_store));

    return  <div {...jsx_props}  style={{...style_props,position: Object.keys(style_props).includes("left") ?  "absolute" : "relative"}}>
        { children.map((entity,idx) => <entity.renderer key={idx}/>)}
    </div>
}

export default class Enitity {
    constructor() { 
    this.uuid = crypto.randomUUID();
        this.type = "Entity";
        this.comps = {
            id: new Id("Entity")
        };
        this.ignored_comps = [];
        this.base_renderer = ({self,jsx_props,children}) => Entity({self,jsx_props,children});
        this.renderer = () => this.base_renderer(this,{});
    }
    remove() {
        //NOTE: too lazy to anything about it
        this.comps.size.w.val = 0;
        this.comps.size.h.val = 0;
    }
    add_component(type) {
        if(Object.keys(this.comps).includes(type) || this.ignored_comps.includes(type)) {
            return;
        }
        this.comps[type] = new COMP_MAP[type]();
    }
    load(data) {
        for (let i = 0; i < Object.keys(data.comps).length; i++) {
            let type = Object.keys(data.comps)[i]
            this.comps[type] = new COMP_MAP[type];
            this.comps[type].load(data.comps[Object.keys(data.comps)[i]]);
        }
        this.renderer = () => this.base_renderer(this,{});
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