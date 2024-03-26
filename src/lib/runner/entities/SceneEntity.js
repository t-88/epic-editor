import Entity from "./Entity";
import Rect from "./RectEntity";


export default class SceneEntity extends Entity {
    constructor() {
        super();
        this.entities = [];
    }

    load(canvas,data) {
        super.load(data);
        canvas.width = `${data.comps.size.w}`; 
        canvas.height = `${data.comps.size.h}`;
        canvas.style.background = `rgb(${data.comps.color.r},${data.comps.color.g},${data.comps.color.b})`;
    
        for (let i = 0; i < data.children.length; i++) {
            if(data.children[i].type == "rect") {
                this.entities.push(new Rect());
                this.entities[this.entities.length - 1].load(data.children[i]);
            }
        }
    }

    update() { 
        for (let i = 0; i < this.entities.length; i++) {
            this.entities[i].update();
        }
    }

    render(ctx) {
        for (let i = 0; i < this.entities.length; i++) {
            this.entities[i].render(ctx);
        }
    } 
}