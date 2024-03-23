import Entity from "./Entity";

export default class Rect extends Entity {
    constructor() {
        super();
        
    }



    update() {

    }
    render(ctx) {
        ctx.fillStyle = `rgb(${this.comps.color.r},${this.comps.color.g},${this.comps.color.b})`
        ctx.fillRect(this.comps.pos.x,this.comps.pos.y,this.comps.size.w,this.comps.size.h);
    }

}
