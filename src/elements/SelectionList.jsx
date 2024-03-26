import { useSnapshot } from "valtio";
import RectEntity from "../entities/Rect";
import SceneEntity from "../entities/Scene";
import { COMP_ID } from "../lib/consts";
import engine from "../lib/engine";
import HierachyElement from "../ui/hierachy_element";
import { useNavigate } from "react-router-dom";
export default function SelectionList() {

  const navigate = useNavigate();

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
        title: "Run",
        on_click : (e) => {
          navigate("/run");
        } 
      },       
      {
        title: "Reset",
        on_click : (e) => {
          engine.reset_local_storage();
        } 
      },   
    ];



    function generate_hierachy(node , hierachy_map = [],depth = 0) {
      if(node == undefined) return;

      let entity = {
        depth: depth,
        entity : node,
      };

      if(node instanceof SceneEntity) {
        hierachy_map.push( {...entity});        
        for (let i = 0; i < node.entities.length; i++) {
          generate_hierachy(node.entities[i],hierachy_map,depth + 1);          
        }
      } else if(node instanceof RectEntity) {
        hierachy_map.push( {...entity});        
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
              generate_hierachy(engine.active_scene.val,hierachy_map);
              return hierachy_map.map((item,idx) => {
                return <HierachyElement key={idx}  entity={item.entity} depth={item.depth}/>
              })  
            })()

          }
        </section>
      </div>
    );
  }
  