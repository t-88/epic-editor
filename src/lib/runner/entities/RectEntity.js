import OPParser from "../../op_lang/parser";
import OPTraspiler from "../../op_lang/transpiler";
import Entity, { shared_globals } from "./Entity";



export default class Rect extends Entity {
    constructor() {
        super();
        this.on_update = (ID) => { };
        this.functions = {};
    }


    load(data) {
        super.load(data);
        if (this.comps.script && this.comps.script.scripts.length) {
            let parser = new OPParser();
            parser.parse(this.comps.script.scripts[0].body)
            // parser.print_tree();
            let transpiler = new OPTraspiler();

            transpiler.transpile(parser.program);
            this.functions = transpiler.functions;

            if (this.functions["on_update"]) {
                this.on_update = eval("(" + this.functions["on_update"] + ")");
            }
        }
    }


    update() {
        this.on_update(this.id)
    }


    render(ctx) {
        ctx.fillStyle = `rgb(${this.comps.color.r},${this.comps.color.g},${this.comps.color.b})`
        ctx.fillRect(this.comps.pos.x, this.comps.pos.y, this.comps.size.w, this.comps.size.h);
    }

}


