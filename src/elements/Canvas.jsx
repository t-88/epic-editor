import { useSnapshot } from "valtio";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import engine from "../lib/engine"
import CodeEditor from './CodeEditor';
import PONG_SRC from "../games/pong";
import transpile from "../op_lang/wapper";


export default function Canvas() {
  const active_scene = useSnapshot(engine.active_scene);
  const code_editor_prox = useSnapshot(engine.code_editor);
  const script_prox = useSnapshot(engine.cur_script_prox);
  const app_scale_prox = useSnapshot(engine.app_scale);
  const ref = useRef();

  const navigate = useNavigate();

  const options = [
    {
      title: "LoadDemo",
      on_click: (e) => {
        localStorage.setItem("saved-scene", JSON.stringify(PONG_SRC));
        engine.load_from_local_storage();
      }
    },
    {
      title: "Reset",
      on_click: (e) => {
        engine.reset();
      }
    },
    {
      title: "Generate",
      on_click: (e) => {
        engine.generate_src();
      }
    },
  ];

  function on_run() {
    engine.run_game(() => {
      navigate("/run")
    })
  }


  useEffect(() => {
    engine.canvas_rect.x = ref.current.getBoundingClientRect().x;
    engine.canvas_rect.y = ref.current.getBoundingClientRect().y;
    engine.get_canvas_rect = () => ref.current.getBoundingClientRect();
  }, [ref]);


  useEffect(() => {

    const on_resize = (_) => {
      console.log(Math.round(window.devicePixelRatio * 100));
      if(window.innerWidth < 1000 || window.devicePixelRatio * 100 >= 150) {
        engine.app_scale.val = 0.7;
      } else {
        engine.app_scale.val = 1;
      }
    }
    on_resize();

    window.addEventListener("resize",on_resize);
    return () => {
      window.removeEventListener("resize",on_resize);
    }
  },[]);

  return (
    <div id="canvas-container">
      <div id="scene-option">
        <div className="options-menu">
          {options.map((option, idx) => {
            return <p className="menu-button" key={idx} onClick={(e) => option.on_click(e)}>{option.title}</p>
          })}
          <p className="menu-button" onClick={on_run}>{"Run"}</p>
        </div>
      </div>

  
      <div ref={ref} onClick={(e) => engine.on_canvas_click(e)} id="app-container" style={{transform: `scale(${app_scale_prox.val})`}}>
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
