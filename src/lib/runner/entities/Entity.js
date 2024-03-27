import Position from "../components/Position";
import Size from "../components/Size";
import Color from "../components/Color";
import Script from "../components/Script";
import Stroage from "../components/Storage";
import runner from "../runner";
import Id from "../../../comps/Id";
import OPParser from "../../op_lang/parser";
import OPTraspiler from "../../op_lang/transpiler";
import Functions from "../utils/functions";


const COMP_MAP = {
    "pos": Position,
    "size": Size,
    "color": Color,
    "script": Script,
    "id": Id,
    "storage": Stroage,
};




export default class Entity extends Functions {
    constructor() {
        super();
        this.id = crypto.randomUUID();
        this.comps = {};
        this.functions = {};
        runner.entities[this.id] = this;
        this.on_update = (ID) => { };
        this.on_init = (ID) => { };
    }



    load(data) {
        for(let key in data.comps) {
            this.comps[key] = new COMP_MAP[key](data.comps[key]);
        }

        if (this.comps.script) {
            let parser = new OPParser();
            parser.parse(this.comps.script.script)
            let transpiler = new OPTraspiler();

            transpiler.transpile(parser.program);
            this.functions = transpiler.functions;

            this.on_update = this.functions["on_update"] ? eval("(" + this.functions["on_update"] + ")") : this.on_update;
            this.on_init = this.functions["on_init"] ? eval("(" + this.functions["on_init"] + ")") : this.on_init;
        }
        
        this.on_init();
    }
    update() {}
    render(ctx) {}    
}


