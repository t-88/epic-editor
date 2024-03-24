
export default class BaseParser {
    constructor() {
        this.idx = 0;
        this.src = undefined;
    }
    cur(offset = 0) {
        if(this.idx + offset >= this.src.length) {
            console.log(`[Out Of Range] ${this.__class__} char out of range idx='${this.idx}`);
            throw(`[Out Of Range] ${this.__class__} char out of range idx='${this.idx}`);
        }
        return this.src[this.idx + offset]
    }
    next() {
        let cur =  this.cur()
        this.idx += 1
        return cur        
    }
}
        
