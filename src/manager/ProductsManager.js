import fs from 'fs';

export default class ProductManager{

    constructor(path) {
        this.path = path;
    }

    addProduct = async (product) =>{
        const products = await this.getProducts();
        if(products.length === 0){
            product.id = 1
        }else{
            product.id = products[products.length-1].id+1;
        }
        products.push(product);
        await fs.promises.writeFile(this.path, JSON.stringify(products,null,'\t'))
        return product
    }

    getProducts = async () =>{
        if(fs.existsSync(this.path)){
            const data = await fs.promises.readFile(this.path, 'utf-8')
            const products = JSON.parse(data);
            return products;
        }else{
            return [];
        }
    }

    getProductById = async (id) => {
        const products = await this.getProducts();
        const product = products.find(e => e.id == id);
        if (!product) {
            return "Product not found";
        } else {
            return product
        };
    }

    updateProduct = async (id, prod) =>{
        const products = await this.getProducts();
        const product = products.find(e => e.id == id);
        if (!product) {
            console.log("Not found");
        } else {
            const newProduct = {...product, ...prod}
            products.splice(products.indexOf(product), 1, newProduct);
            await fs.promises.writeFile(this.path, JSON.stringify(products,null,'\t'))
            console.log("Product updated successfully");
        };
    }

    deleteProduct = async (id) =>{
        const products = await this.getProducts();
        const product = products.find(e => e.id == id);
        if (!product) {
            return "Product not found";
        } else {
            const productIn = products.indexOf(product);
            products.splice(productIn,1);
            await fs.promises.writeFile(this.path, JSON.stringify(products,null,'\t'));
            return "Product removed successfully";
        };
    }
}