import init , {js_compile} from "wasm-lib";


const init_wasm = async () => {
  await init();
}

const transpile = (src) => {
    let out = js_compile(src);
    return {
      status:   Number.parseInt(out[0]),
      content :  JSON.parse(out.substr(2))
    }
  }
export {transpile , init_wasm};

