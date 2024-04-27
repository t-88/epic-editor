import { useSnapshot } from "valtio";
import engine from "../lib/engine";
import runner from "../lib/runner";
import "./runner.css";
import { useEffect, useRef } from "react";


export default function Runner() {
    const canvas_ref = useRef();
    const app_scale_prox = useSnapshot(engine.app_scale);


    useEffect(() => {
        runner.canvas_ref = canvas_ref.current;
        runner.start();
        runner.load_app();
    }, []);


    useEffect(() => {
        const on_resize = (_) => {
          if(window.innerWidth < 1000 || window.devicePixelRatio * 100 >= 150) {
                engine.app_scale.val = 0.7;
            } else {
                engine.app_scale.val = 1;
            }
        }
        on_resize();

        window.addEventListener("resize", on_resize);
        return () => {
            window.removeEventListener("resize", on_resize);
        }
    }, []);


    return <div id="runner" style={{ transform: `scale(${app_scale_prox.val})` }}>
        <canvas ref={canvas_ref}>

        </canvas>
    </div>
}