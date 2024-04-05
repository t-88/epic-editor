export default class Entity {
    constructor() {
        this.uuid = crypto.randomUUID();
        this.comps = {};
        this.functions = {};
        this.on_update = (ID) => { };
        this.on_init = (ID) => { };
    }
    render(ctx) {}    
}


