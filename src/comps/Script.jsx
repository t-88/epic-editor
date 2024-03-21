import { proxy, useSnapshot } from "valtio";
import add_icon from "../assets/plus.png";
import more_icon from "../assets/more.png";
import engine from "../lib/engine";
import ScriptData from "../models/ScriptData";



function ScriptElement({refr,idx}) {
    function generate_menu_options(idx) {
        return [
            {title : "Delete", callback: () => {
                refr.scripts.splice(idx,1);
                engine.hide_popup_menu();
            }},
            {title : "Edit", callback: () => {
                engine.show_code_editor(refr.scripts[idx]);
                engine.hide_popup_menu();
            }},
        ];
    }


    return  <div  className="script-view"
    onClick={() => {
        engine.show_code_editor(refr.scripts[idx]);
    }}>
       <p>{refr.scripts[idx].title}</p>
        <div className="more-icon"
             onClick={(e) => engine.pop_menu(
                e,
                {
                x: e.target.getBoundingClientRect().x,
                y: e.target.getBoundingClientRect().y,
            },generate_menu_options(idx))
            }
        >
            <img  src={more_icon} width={20} height={20} alt="more-icon"/>
        </div>
    </div>

}

function ScriptComponent(ref) {
    const scripts_prox = useSnapshot(ref.scripts);

    // when change store
    engine.update_store();


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
                    return   <ScriptElement refr={ref}  
                                            key={idx} 
                                            idx={idx}
                            />
                })
            }        

        </section> 
    </div>
}
export default class Script {
    constructor(scripts = []) {
        this.type = "script";
        this.scripts = proxy([])
        this.renderer = () => ScriptComponent(this);
    }

    static load(data) {
        return new Script(data);
    }

    code() {


        return {type : this.type, scrpit: this.scripts};
    }

}

