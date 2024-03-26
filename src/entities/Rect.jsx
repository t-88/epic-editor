import Position from "../comps/Position.jsx";
import Size from "../comps/Size.jsx";
import engine from "../lib/engine.js";
import Color from "../comps/Color.jsx";
import Entity from "./Entity.jsx";



export default class RectEntity extends Entity {
    constructor() {
        super();
        this.type = "Rect";
        this.comps.pos = new Position(0,0);
        this.comps.size =  new Size(50,50);
        this.comps.color = new Color(125,125,125);

        this.comps.id.id.val = "Rect";

        this.renderer = () => <this.base_renderer self={this} jsx_props={{onMouseDown:(e) => this.on_mouse_down(e)}}  />
    }
    load(data) {
        super.load(data);
        this.renderer = () => <this.base_renderer self={this} jsx_props={{onMouseDown:(e) => this.on_mouse_down(e)}}  />
    }

    on_mouse_down(e) {
        engine.on_entity_select(this,e);
        engine.dragged_entity_info.entity.val = this;
        engine.dragged_entity_info.offset.x = e.nativeEvent.offsetX;
        engine.dragged_entity_info.offset.y = e.nativeEvent.offsetY;
    }
}