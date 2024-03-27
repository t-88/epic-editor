import { useSnapshot } from "valtio";
import { useEffect, useRef } from "react";
import engine from "../lib/engine"
import CodeEditor from './CodeEditor';


export default function Canvas() {
  const active_scene = useSnapshot(engine.active_scene);
  const code_editor_prox = useSnapshot(engine.code_editor);
  const script_prox = useSnapshot(engine.cur_script_prox);
  const ref = useRef();


  useEffect(() => {
    engine.canvas_rect.x = ref.current.getBoundingClientRect().x;
    engine.canvas_rect.y = ref.current.getBoundingClientRect().y;
  }, [ref]);
  return (
    <div id="canvas-container">
      <div ref={ref} onClick={(e) => engine.on_canvas_click(e)}>
        <active_scene.val.renderer />
      </div>


      {!script_prox.val ? <></> :
        <div id="code-editor-area"
          style={{ height: `${code_editor_prox.height}px` }}>

          <section className="top-bar" onMouseDown={(e) => engine.code_editor_resize_grap(e)}></section>
          <CodeEditor />

        </div>
      }
    </div>
  );
}
