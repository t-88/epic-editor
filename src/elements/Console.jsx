import { useSnapshot } from "valtio";
import engine from "../lib/engine";

export default function Console() {
    const console = useSnapshot(engine.console);
  
  
    return <div id="console">
      <p className="console-title"><b>Console</b></p>
      <div id="log-area" className="custom-scroll-bar">
        {console.map((msg,idx) => <p onClick={msg.callback} key={idx}> {msg.msg} </p>)}
      </div>
    </div>
  }
  