class Msg {
    constructor(txt,callback = () => {}) {
        this.txt = txt;
        this.callback = callback;
    }
}

export default Msg;