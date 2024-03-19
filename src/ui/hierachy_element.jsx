import engine from "../lib/engine"


export default function HierachyElement({ entity, title, depth }) {
    return <div className="hierachy-element"
        onClick={(e) => {
            engine.on_entity_select(entity,e);
        }}
        style={{
            marginLeft: `${20 + 10 * depth}px`
        }} >

        <p>
            {title}
        </p>

    </div>
}