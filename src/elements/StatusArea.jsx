import { useSnapshot } from "valtio";
import engine from "../lib/engine";

function AddComponenetBtn() {

  const menu_data = [
    { title: "Position", callback: () => {engine.add_component("Position");}},
    { title: "Size", callback:     () => {engine.add_component("Size");}},
    { title: "Color", callback:    () => {engine.add_component("Color");}},
    { title: "Script", callback:   () => {engine.add_component("Script");}},
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
                selected_entity.val.comps.map((comp,idx) => {
                    return <comp.renderer key={idx}/>;
                })
        }

        <AddComponenetBtn />
      </div>
    );
  }
  