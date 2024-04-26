import { proxy, useSnapshot } from "valtio";
import Color from "../comps/Color";
import Position from "../comps/Position";
import Script from "../comps/Script";
import Size from "../comps/Size";
import Storage from "../comps/Storage";
import Id from "../comps/Id";


const COMP_MAP = {
    "pos": Position,
    "size": Size,
    "color": Color,
    "script": Script,
    "id": Id,
    "storage": Storage,
};;

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