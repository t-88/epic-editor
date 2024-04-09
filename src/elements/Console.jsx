import { useSnapshot } from "valtio";
import engine from "../lib/engine";

export default function Console() {
    const msgs = useSnapshot(engine.error_messages);
  
  
    return <div id="console">
      <p className="console-title"><b>Console</b></p>
      <div id="log-area" className="custom-scroll-bar">
        {msgs.map((msg,idx) => <p onClick={msg.callback} key={idx}> {msg.txt} </p>)}
      </div>
    </div>
  }
  