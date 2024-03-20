import RectEntity from "../entities/Rect";
import SceneEntity from "../entities/Scene";
import engine from "../lib/engine";
import HierachyElement from "../ui/hierachy_element";
export default function SelectionList() {
    const options = [
      {
        title: "Add",
        on_click : (e) => {
          
          
          engine.pop_menu(
            e,
            {
              x : e.target.getBoundingClientRect().x + 60,
              y : e.target.getBoundingClientRect().y + 15,
            },
            [{
              title: "rectangle",
              callback: ()=> {
                engine.select_element("rect");
                engine.hide_popup_menu();
              }
            }]
          )
        } 
      },
      {
        title: "Generate",
        on_click : (e) => {
          alert("wait for it, wait for it, nah. i got nothing");
          // engine.generate_code();
        } 
      },
      {
        title: "Reset",
        on_click : (e) => {
          engine.update_store();
          // engine.generate_code();
        } 
      }      

    ];



    function generate_hierachy(node , hierachy_map = [],depth = 0) {
      if(node == undefined) return;

      if(node.val instanceof SceneEntity) {
        hierachy_map.push(
          {
            title : "Scene",
            depth: depth,
            entity : node.val,
          }
        );        
        for (let i = 0; i < node.val.entities.length; i++) {
          generate_hierachy(node.val.entities[i],hierachy_map,depth + 1);          
        }
      } else if(node instanceof RectEntity) {
        hierachy_map.push(
          {
            title : "Rectangle",
            depth: depth,
            entity : node,
          }
        );
      }
    }

    return (
      <div id="selection-list">
        <div id="options-menu">
          {options.map((option,idx) => {
            return <p className="menu-button" key={idx} onClick={(e) => option.on_click(e)}>{option.title}</p>
          })}
        </div>

        <p id="selection-list-title"><b>Hierachy</b></p>    

        <section id="selection-list-hierachy">
          {
            (()=>{
              const hierachy_map = [];
              generate_hierachy(engine.active_scene,hierachy_map);
              return hierachy_map.map((item,idx) => {
                return <HierachyElement key={idx}  entity={item.entity} title={item.title} depth={item.depth}/>
              })  
            })()

          }
        </section>
      </div>
    );
  }
  