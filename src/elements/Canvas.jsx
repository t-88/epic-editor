import { useSnapshot } from "valtio";
import engine from "../lib/engine"

export default function Canvas() {
  const active_scene = useSnapshot(engine.active_scene);

  return (
    <div id="canvas-container">
      <div onClick={(e) =>  engine.on_canvas_click(e)}> 
          <active_scene.val.renderer  />
      </div>
    </div>
  );
}
