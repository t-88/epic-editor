import { useSnapshot } from "valtio";
import add_icon from "../assets/plus.png"; 
import engine from "../lib/engine";




export default function CodeEditor() {
    const script = useSnapshot(engine.cur_script_prox);
    const pos = useSnapshot(engine.code_editor_pos);

    return <div id="code-editor"
        style={{
            left: `${pos.x}px`,
            top: `${pos.y}px`,
        }}
    >
        <div className="window-bar" onDrag={(e) => {engine.code_editor_drag(e);}}>
         <img className="remove-icon" 
              src={add_icon} alt="remove" width={25} height={25} 
              onClick={() => {engine.hide_code_editor();}}

         />
        </div>


        <p>name</p>
        <input type="text"
            value={script.val.title}
            onChange={(e) => {
                engine.cur_script_prox.val.title = e.target.value;
            }}
        />
        <p>script</p>
        <textarea name="" id="" cols="30" rows="5" 
            value={script.val.body}
            onChange={(e) => {
                engine.cur_script_prox.val.body = e.target.value;
            }}
        >

        </textarea>
    </div>
}