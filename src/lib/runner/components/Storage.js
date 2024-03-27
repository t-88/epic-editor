export default class Stroage {
    constructor(data) {
        this.map = {};
        for (let i = 0; i < data.map.length; i++) {
            this.map[data.map[i].key] = parseFloat(data.map[i].val);
        }
    }
}