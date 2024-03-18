import './App.css';
import SelectionList from './elements/SelectionList';
import Canvas from './elements/Canvas';
import StatusArea from './elements/StatusArea';
import CodeEditor from './elements/CodeEditor';
import engine from './lib/engine';
import { useSnapshot } from 'valtio';

export default function App() {
  const is_code_editor_visible = useSnapshot(engine.is_code_editor_visible);
  
  
  const popup_menu_prox = {
    coords : useSnapshot(engine.popup_menu.coords),
    visible : useSnapshot(engine.popup_menu.visible),
  };


  return (
    <div id='root' onClick={() => { engine.window_clicked();}}>
      <SelectionList/>
      <Canvas/>
      <StatusArea/>

      {
        (() => {
          if(is_code_editor_visible.val) { return <CodeEditor/>; }
        })()
      }

      {
        (()=>{
          if(popup_menu_prox.visible.val) {
            return <engine.popup_menu.renderer coords={popup_menu_prox.coords} />
          }
        })()
      }
    </div>
  );
}