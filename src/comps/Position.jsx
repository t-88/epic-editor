import { proxy, useSnapshot } from "valtio";
import engine from "../lib/engine";


function PositionComponent(self, x, y) {
    function on_change_x(e) {
        x.val = parseInt(e.target.value);
        engine.update_store();
    }
    function on_change_y(e) {
        y.val = parseInt(e.target.value);
        engine.update_store();
    }

    return <div className="component">
        <p className="title">Position</p>
        <section className="component-props-row">
            <div className="inline-input">
                <p>x</p>
                <input type="number"  defaultValue={x.val} onChange={on_change_x} />
            </div>
            <div className="inline-input">
                <p>y</p> <input type="number" defaultValue={y.val} onChange={on_change_y} />
            </div>
        </section>
    </div>
}
export default class Position {
    constructor(x = 0, y = 0) {
        this.type = "pos";

        this.x = proxy({ val: x });
        this.y = proxy({ val: y });

        this.renderer = () => PositionComponent(this, this.x, this.y);
    }

    proxy_list() {
        return [this.x, this.y];
    }

    get_style_props() {
        return {
            left: `${this.x.val}px`,
            top: `${this.y.val}px`,

        };
    }


    load(data) {
        this.x.val = data.x;
        this.y.val = data.y;
    }

    code() {
        return {
            x: this.x.val,
            y: this.y.val,
        }
    }
}

