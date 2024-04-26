
function uuidv4() {
    return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
      (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
    );
  }
function empty(ID) {

}

export default class Rect {
    constructor(init , update, { pos = {x : 0, y : 0} , size = {w : 0, h : 0}, color = {r : 0, g : 0 , b : 0} ,id = undefined, storage = []} ) {
        this.uuid = uuidv4();
        if (!id) id = this.uuid;

        this.pos = pos ;
        this.size = size ;
        this.color =  color;
        this.id = id; 
        this.storage = {};
        for (let i = 0; i < storage.length; i++) {
            this.storage[storage[i]["key"]] = Number.parseFloat(storage[i]["val"])
        }

        this.update = update ?? empty;
        this.init = init ?? empty;

        this.ref = undefined;

    }
    get_component(comp_typ) {
        if (comp_typ == "Position") return this.pos
        else if (comp_typ == "Size")   return this.size
        else if (comp_typ == "Color")  return this.color
        else if (comp_typ == "Id")  return this.id
        else if (comp_typ == "Storage") return this.storage    
    }
}

