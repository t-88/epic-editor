import { useSnapshot } from "valtio";
import engine from "../lib/engine";

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

      </div>
    );
  }
  