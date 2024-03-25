import Lexer from "../op_lang/lexer";
import OPParser from "../op_lang/parser";
import SceneEntity from "./entities/SceneEntity";

class Runner {
    constructor() {
        this.canvas_ref = undefined;
        this.ctx = undefined;
        this.scene = undefined;
    }


    load_app() {
        let parser = new OPParser();
        parser.parse(`
            func on_input(ID) {
                pos = get_component(ID,Components.Position);  
                if(is_pressed(Keys.Left)) {
                    pos.x = pos.x + 1;
                }                  
                if(is_pressed(Keys.Right)) {
                    pos.x = pos.x - 1;
                }
                for(i in 1..10) {
                    create_entity(
                        x = 1,
                        y = 1,
                        w = 1,
                        h = 1,
                    );        
                }                         
            }  
        `);

        console.log(parser.program)
        parser.print_tree();

   



        this.scene = new SceneEntity();
        this.ctx = this.canvas_ref.getContext("2d");
        if(!localStorage.getItem("saved-scene")) {
            return;
        }
        this.scene.load(this.canvas_ref,JSON.parse(localStorage.getItem("saved-scene")))
        this.animate();
    }



    animate() {
        this.update();
        this.render();
        requestAnimationFrame(() => this.animate);
    }


    update() {
    }
    render() {
        this.ctx.clearRect(0, 0, this.canvas_ref.width, this.canvas_ref.height);
        this.scene.render(this.ctx);
    }
}



const runner = new Runner();
export default runner;