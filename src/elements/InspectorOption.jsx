import engine from "../lib/engine";
import { COMP_COLOR, COMP_ID, COMP_POS, COMP_SCRIPT, COMP_SIZE, COMP_STORAGE } from "../lib/consts";
import { useSnapshot } from "valtio";

export default function OptionBtns() {
    const menu_data = [
        { title: "Position", callback: () => { engine.add_component(COMP_POS); } },
        { title: "Size", callback: () => { engine.add_component(COMP_SIZE); } },
        { title: "Color", callback: () => { engine.add_component(COMP_COLOR); } },
        { title: "Script", callback: () => { engine.add_component(COMP_SCRIPT); } },
        { title: "Id", callback: () => { engine.add_component(COMP_ID); } },
        { title: "Storage", callback: () => { engine.add_component(COMP_STORAGE); } },
    ];


    const scene = useSnapshot(engine.active_scene);
    const selected_entity = useSnapshot(engine.selected_entity);


    function on_remove(e) {
        engine.selected_entity.val.remove();
        engine.active_scene.val.entities.splice(selected_entity.val.index, 1);
        engine.on_entity_select(engine.active_scene.val,e);
        engine.update_store();
    }

    return <center id="add-component-btn" >
        <p className="menu-button"
            onClick={
                (e) => {
                    engine.pop_menu(e,
                        {
                            x: e.target.getBoundingClientRect().x + 100,
                            y: e.target.getBoundingClientRect().y + 15,
                        },
                        menu_data
                    );
                }
            }
        > Add Component </p>
        { scene.val.uuid == selected_entity.val.uuid ? <></> : <p className="menu-button" onClick={on_remove}>Remove</p> }
        
    </center>
}