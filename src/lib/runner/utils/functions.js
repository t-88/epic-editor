export default class Functions {
    constructor() {}
   
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
}