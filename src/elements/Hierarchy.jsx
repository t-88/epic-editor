import { useSnapshot } from "valtio";
import RectEntity from "../entities/Rect.jsx";
import SceneEntity from "../entities/Scene.jsx";
import engine from "../lib/engine.js";
import HierachyElement from "./HierachyElement.jsx";
import PONG_SRC from "../games/pong.js";
import Console from "./Console";



export default function SelectionList() {
  useSnapshot(engine.active_scene);

  const options = [
    {
      title: "Add",
      on_click: (e) => {

        engine.pop_menu(
          e,
          {
            x: e.target.getBoundingClientRect().x + 60,
            y: e.target.getBoundingClientRect().y + 15,
          },
          [{
            title: "rectangle",
            callback: () => {
              engine.select_element("rect");
              engine.hide_popup_menu();
            }
          }]
        )
      }
    },




  ];



  function generate_hierachy(node, hierachy_map = [], depth = 0) {
    if (node == undefined) return;

    let entity = {
      depth: depth,
      entity: node,
    };

    if (node instanceof SceneEntity) {
      hierachy_map.push({ ...entity });
      for (let i = 0; i < node.entities.length; i++) {
        generate_hierachy(node.entities[i], hierachy_map, depth + 1);
      }
    } else if (node instanceof RectEntity) {
      hierachy_map.push({ ...entity });
    }

  }

  return (
    <div id="hiercarchy">
      <div className="options-menu">
        {options.map((option, idx) => {
          return <p className="menu-button" key={idx} onClick={(e) => option.on_click(e)}>{option.title}</p>
        })}
      </div>

      <p id="hiercarchy-title"><b>Hierachy</b></p>

      <section id="hiercarchy-list" className="custom-scroll-bar">
        {
          (() => {
            const hierachy_map = [];
            generate_hierachy(engine.active_scene.val, hierachy_map);
            return hierachy_map.map((item, idx) => {
              return <HierachyElement key={idx} entity={item.entity} depth={item.depth} />
            })
          })()

        }
      </section>

      <div className="console-container">
        <Console />
      </div>
    </div>
  );
}
