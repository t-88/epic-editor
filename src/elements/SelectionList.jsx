import engine from "../lib/engine";
export default function SelectionList() {
    
    
    return (
      <div id="selection-list">
        <button onClick={() => engine.select_element("rect") }> rect </button>
        <button onClick={() => engine.generate_code() } > generate! </button>
      </div>
    );
  }
  