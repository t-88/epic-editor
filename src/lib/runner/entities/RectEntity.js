import OPParser from "../../op_lang/parser";
import OPTraspiler from "../../op_lang/transpiler";
import Entity, { shared_globals } from "./Entity";



export default class Rect extends Entity {
    constructor() {
        super();
    }


    load(data) {
        super.load(data);
        
    }


    update() {
        this.on_update(this.id)
    }


    render(ctx) {
        ctx.fillStyle = `rgb(${this.comps.color.r},${this.comps.color.g},${this.comps.color.b})`
        ctx.fillRect(this.comps.pos.x, this.comps.pos.y, this.comps.size.w, this.comps.size.h);
    }

}


