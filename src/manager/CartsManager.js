import fs from 'fs';

export default class CartsManager {
    
    constructor(path) {
        this.path = path;
    }

    getCarts = async () =>{
        if(fs.existsSync(this.path)){
            const data = await fs.promises.readFile(this.path, 'utf-8')
            const carts = JSON.parse(data);
            return carts;
        }else{
            return [];
        }
    }

    getCartById = async (id) => {
        const carts = await this.getCarts();
        const cart = carts.find(e => e.id == id);
        if (!cart) {
            return "Not found";
        } else {
            return cart
        };
    }
}