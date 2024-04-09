import { useSnapshot } from "valtio";
import engine from "../lib/engine";
import { COMP_COLOR, COMP_ID, COMP_POS, COMP_SCRIPT, COMP_SIZE, COMP_STORAGE } from "../lib/consts";

function OptionBtns() {
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
function Comps({ selected_entity }) {
  return !selected_entity.val ?
    <></> :
    Object.keys(selected_entity.val.comps).map((key, idx) => {
      let comp = selected_entity.val.comps[key];
      return <comp.renderer key={idx} />;
    })
}
function Console() {
  const msgs = useSnapshot(engine.error_messages);


  return <div id="console">
    <p className="console-title"><b>Console</b></p>
    <div id="log-area">
      {msgs.map((msg,idx) => <p onClick={msg.callback} key={idx}> {msg.txt} </p>)}
    </div>
  </div>
}

export default function Inspector() {
  const selected_entity = useSnapshot(engine.selected_entity);


  return (
    <div id="inspector">
      <p id="inspector-title"><b>Inspector</b></p>
      <Comps selected_entity={selected_entity} />
      <OptionBtns />
      <Console />
    </div>
  );
}
