import init , {js_compile} from "wasm-lib";


const init_wasm = async () => {
  await init();
}

const transpile = (src,func_prefix = "") => {
    let out = js_compile(src,func_prefix);
    return {
      status:   Number.parseInt(out[0]),
      content :  JSON.parse(out.substr(2))
    }
  }
export {transpile , init_wasm};