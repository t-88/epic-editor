import './App.css';
import SelectionList from './elements/SelectionList';
import Canvas from './elements/Canvas';
import engine from './lib/engine';
import { useSnapshot } from 'valtio';
import runner from './lib/runner/runner';
import Inspector from './elements/Inspector';

export default function App() {
  const popup_menu_prox = {
    coords : useSnapshot(engine.popup_menu.coords),
    visible : useSnapshot(engine.popup_menu.visible),
  };

  runner.stop();

  return (
    <div id='root' onClick={() => { engine.window_clicked();}}>
      <SelectionList/>
      <Canvas/>
      <Inspector/>
      {
        (()=>{
          if(popup_menu_prox.visible.val) {
            return <engine.popup_menu.renderer coords={popup_menu_prox.coords} menu_data={engine.popup_menu.data} />
          }
        })()
      }
    </div>
  );
}