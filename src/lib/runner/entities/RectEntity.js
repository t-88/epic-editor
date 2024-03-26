import OPParser from "../../op_lang/parser";
import OPTraspiler from "../../op_lang/transpiler";
import Entity from "./Entity";

export default class Rect extends Entity {
    constructor() {
        super();
        
    }


    load(data) {
        super.load(data);

        let parser = new OPParser();
        parser.parse(this.comps.script.scripts[0].body)
        parser.print_tree();
        let transpiler = new OPTraspiler();
        let src = transpiler.transpile(parser.program);
        console.log(src)
    }

    update() {

    }
    render(ctx) {
        ctx.fillStyle = `rgb(${this.comps.color.r},${this.comps.color.g},${this.comps.color.b})`
        ctx.fillRect(this.comps.pos.x,this.comps.pos.y,this.comps.size.w,this.comps.size.h);
    }

}
