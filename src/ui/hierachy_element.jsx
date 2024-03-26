import { proxy, useSnapshot } from "valtio";
import { COMP_ID } from "../lib/consts";
import engine from "../lib/engine"


export default function HierachyElement({ entity, depth }) {
    let title = useSnapshot(entity.comps[COMP_ID]);

    return <div className="hierachy-element"
        onClick={(e) => {
            engine.on_entity_select(entity,e);
        }}
        style={{
            marginLeft: `${20 + 10 * depth}px`
        }} >

        <p>
            {title.id.val}
        </p>

    </div>
}