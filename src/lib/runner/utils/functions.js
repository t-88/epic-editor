import runner from "../runner";


export default class Functions {
    constructor() {}

    is_pressed(key) {
        return runner.pressed_keys.includes(key);
    }
    get_entity_by_id(id) {
        for(let key in runner.entities) {
            if(id == runner.entities[key].comps.id.id.val.id) {
                return runner.entities[key].id
            }
        }
    }    
    get_component(id,type) {
        if(type == "storage") {
            return runner.entities[id].comps[type].map;
        }
        return runner.entities[id].comps[type];
    }  
    log(data) {
        console.log(data);
    }  
   
    AABB(x1,y1,w1,h1,x2,y2,w2,h2){
        return x1 + w1 > x2 && y1 + h1 > y2 && x2 + w2 > x1 && y2 + h2 > y1
    }
    sqrt(num) {
        return Math.sqrt(num)
    }

    randint(num) {
        return (Math.random() * 1000) % num
    } 

    init() {
        this.log("done")
    }
    clear_entities() {
        this.log("done")
    }
}