import logo from './logo.svg';
import './App.css';
import SelectionList from './elements/SelectionList';
import Canvas from './elements/Canvas';
import StatusArea from './elements/StatusArea';
import engine from './lib/engine';

export default function App() {
  return (
    <>
      <SelectionList/>
      <Canvas/>
      <StatusArea/>
    </>
  );
}