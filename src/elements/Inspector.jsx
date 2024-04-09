import { useSnapshot } from "valtio";
import engine from "../lib/engine";
import OptionBtns from "./InspectorOption";



function Comps({ selected_entity }) {
  return !selected_entity.val ?
    <></> :
    Object.keys(selected_entity.val.comps).map((key, idx) => {
      let comp = selected_entity.val.comps[key];
      return <comp.renderer key={idx} />;
    })
}

export default function Inspector() {
  const selected_entity = useSnapshot(engine.selected_entity);

  return (
    <div id="inspector">
      <p id="inspector-title"><b>Inspector</b></p>
      <Comps selected_entity={selected_entity} />
      <OptionBtns />
    </div>
  );
}
