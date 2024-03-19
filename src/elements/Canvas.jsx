import { useSnapshot } from "valtio";
import engine from "../lib/engine"
import { useEffect, useRef } from "react";

export default function Canvas() {
  const active_scene = useSnapshot(engine.active_scene);
  const ref =  useRef();


  useEffect(() => {
    engine.canvas_rect.x = ref.current.getBoundingClientRect().x;
    engine.canvas_rect.y = ref.current.getBoundingClientRect().y;
  },[ref]);
  return (
    <div id="canvas-container">
      <div ref={ref} onClick={(e) =>  engine.on_canvas_click(e)}> 
          <active_scene.val.renderer  />
      </div>
    </div>
  );
}
