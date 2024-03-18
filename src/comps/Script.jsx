import { proxy, useSnapshot } from "valtio";
import add_icon from "../assets/plus.png";
import more_icon from "../assets/more.png";
import engine from "../lib/engine";
import ScriptData from "../models/ScriptData";
import { useRef } from "react";


function ScriptComponent(ref) {

    const scripts_prox = useSnapshot(ref.scripts);
    const widget_ref = useRef();

    function generate_menu_options(script, idx) {
        return [
            {title : "Delete", callback: () => {console.log("deleting...");}},
            {title : "Edit", callback: () => {
                engine.show_code_editor(ref.scripts[idx]);
            }},
        ];
    }


    return  <div className="component">  
        <section className="title-icon">
            <p>Script</p>
            <img onClick={() => {
                ref.scripts.push(new ScriptData());
                engine.show_code_editor(ref.scripts[ref.scripts.length - 1]);
            }} src={add_icon} width={25} height={25} 
            
            />  
        </section>


        <section className="scripts">
             {
                scripts_prox.map((script_data,idx) => {
                    return  <div  className="script-view" key={idx}
                                onClick={() => {
                                    engine.show_code_editor(ref.scripts[idx]);
                                }}
                            >
                            <p>{script_data.title}</p>
                            <div ref={widget_ref} className="more-icon"
                                 onClick={(e) => engine.pop_menu(
                                    e,
                                    {
                                    x: widget_ref.current.getBoundingClientRect().x,
                                    y: widget_ref.current.getBoundingClientRect().y,
                                },generate_menu_options(script_data,idx))
                                }
                            >
                                <img  src={more_icon} width={20} height={20} alt="more-icon"/>
                            </div>
                        </div>
                })
            }        

        </section> 
    </div>
}
export default class Script {
    constructor(script = "") {
        this.name = "script";
        this.scripts = proxy([])
        this.renderer = () => ScriptComponent(this);
    }


    code() {
        return {
            script : this.script.val,
        }
    }

}

