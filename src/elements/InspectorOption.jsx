import engine from "../lib/engine";
import { COMP_COLOR, COMP_ID, COMP_POS, COMP_SCRIPT, COMP_SIZE, COMP_STORAGE } from "../lib/consts";

export default  function OptionBtns() {
    const menu_data = [
      { title: "Position", callback: () => { engine.add_component(COMP_POS); } },
      { title: "Size", callback: () => { engine.add_component(COMP_SIZE); } },
      { title: "Color", callback: () => { engine.add_component(COMP_COLOR); } },
      { title: "Script", callback: () => { engine.add_component(COMP_SCRIPT); } },
      { title: "Id", callback: () => { engine.add_component(COMP_ID); } },
      { title: "Storage", callback: () => { engine.add_component(COMP_STORAGE); } },
    ];
  
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
      <p className="menu-button" >Remove</p>
    </center>
  }