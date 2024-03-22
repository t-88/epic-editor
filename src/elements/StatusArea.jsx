import { useSnapshot } from "valtio";
import engine from "../lib/engine";
import { COMP_COLOR, COMP_ID, COMP_POS, COMP_SCRIPT, COMP_SIZE } from "../lib/consts";

function AddComponenetBtn() {

  const menu_data = [
    { title: "Position", callback: () => {engine.add_component(COMP_POS);}},
    { title: "Size", callback:     () => {engine.add_component(COMP_SIZE);}},
    { title: "Color", callback:    () => {engine.add_component(COMP_COLOR);}},
    { title: "Script", callback:   () => {engine.add_component(COMP_SCRIPT);}},
    { title: "Id", callback:       () => {engine.add_component(COMP_ID);}},
  ];

  return <center id="add-component-btn" >
    <p className="menu-button" 
      onClick={
        (e) => {
          engine.pop_menu(e,
                         {x : e.target.getBoundingClientRect().x + 100,
                          y : e.target.getBoundingClientRect().y + 15,},
                          menu_data
                          );
        }
      }
    > New Component </p>
  </center> 
}

export default function StatusArea() {
  const selected_entity = useSnapshot(engine.selected_entity);

    return (
      <div id="status-area">
        <p id="status-area-title"><b>Inspector</b></p>        
        {
            !selected_entity.val ? 
            <></>  : 
                Object.keys(selected_entity.val.comps).map((key,idx) => {
                    let comp = selected_entity.val.comps[key];
                    return <comp.renderer key={idx}/>;
                })
        }

        <AddComponenetBtn />
      </div>
    );
  }
  