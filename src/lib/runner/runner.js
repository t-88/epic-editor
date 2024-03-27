import Entity from "./entities/Entity";
import Rect from "./entities/RectEntity";
import SceneEntity from "./entities/SceneEntity";

class Runner {
    constructor() {
        this.canvas_ref = undefined;
        this.ctx = undefined;
        this.scene = undefined;

        this.entities = {};
        this.pressed_keys = [];
        this.is_running = false;

        this.init_events();

    }

    init_events() {
        document.addEventListener("keydown",(e) => {
            if(this.pressed_keys.includes(e.code)) return;
            this.pressed_keys.push(e.code);
        },false);
        document.addEventListener("keyup",(e) => {
            if(!this.pressed_keys.includes(e.code)) return;
            this.pressed_keys.splice(this.pressed_keys.indexOf(e.code),1);
        },false);
    }

    load_app() {
        this.scene = new SceneEntity();
        this.ctx = this.canvas_ref.getContext("2d");
        if(!localStorage.getItem("saved-scene")) {
            return;
        }
        this.scene.load(this.canvas_ref,JSON.parse(localStorage.getItem("saved-scene")))
        this.animate();
    }



    animate() {
        if(!this.is_running || !this.scene) return;
        this.update();
        this.render();
        requestAnimationFrame(() => this.animate());
    }


    update() {
        this.scene.update();
    }
    render() {
        this.ctx.clearRect(0, 0, this.canvas_ref.width, this.canvas_ref.height);
        this.scene.render(this.ctx);
    }

    start() {
        this.is_running = true;   
        this.scene = undefined;
        this.entities = {};
        this.pressed_keys = [];
    }
    stop() {
        this.is_running = false;   
        this.scene = undefined;
    }

    //NOTE: stupid solution plz change its 00:34:25 i am not in the mood to give a shit
    create_rect() {
        this.scene.entities.push(new Rect());
    }
}



const runner = new Runner();
export default runner;