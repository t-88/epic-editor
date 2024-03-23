import runner from "../lib/runner/runner";
import "./runner.css";
import { useEffect, useRef } from "react";


export default function  Runner () {
    const canvas_ref = useRef();

    useEffect(() => { 
        runner.canvas_ref = canvas_ref.current;
        runner.load_app();
    },[]);

    return <div id="runner">
        <canvas ref={canvas_ref}>

        </canvas>
    </div>
}