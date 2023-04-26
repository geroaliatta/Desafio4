import { Router } from 'express';
import fs from 'fs';
import ProductManager from '../manager/ProductsManager.js';
import { uploader } from '../Utils.js';

const router = Router();
const manager = new ProductManager('./files/dbProducts.json');

router.get('/', async (req,res)=>{
    const limit = req.query.limit
    const products = await manager.getProducts();
    if (!limit) {
        res.send({products});
    } else {
        const productsLimit = products.slice(0, parseInt(limit));
        res.send({productsLimit})
    }
})

router.get('/:pid', async (req,res)=>{
    const pid = req.params.pid;
    const product = await manager.getProductById(pid);
    res.send({product});
})

router.delete('/:pid', async (req,res)=>{
    const pid = req.params.pid;
    const products = await manager.getProducts();
    const product = products.find(e => e.id == pid);
    if (!product) {
        return res.status(404).send({
            status: 'Not found',
            error: 'Product not found'
        })
    } else{
        const productIn = products.indexOf(product);
        products.splice(productIn,1);
        await fs.promises.writeFile('./files/dbProducts.json', JSON.stringify(products,null,'\t'));
        res.send({
            status:'Success',
            message: 'Product removed successfully'
        })
    };
    
})

router.post('/', uploader.array('thumbnail'), async (req,res)=>{
    const products = await manager.getProducts();
    const product = req.body;
    let pid = products[products.length - 1].id + 1

    if (!product.title || !product.category || !product.description || !product.price || !product.code || !product.stock) {
        return res.status(400).send({
            status: 'Error',
            error: 'Data required: title, category, description, price, code and stock'
        })
    }

    const productExist = products.find(e => e.code === product.code)

    if (productExist) return res.status(400).send({
        status: "Error",
        error: `Code product ${product.code} already exist`
    })

    req.files.thumbnail = []
    for (let i = 0; i < req.files.length; i++) {
        req.files.thumbnail.push("http://localhost:8080/images/"+ req.files[i].filename)
    }

    products.push({id: pid, thumbnail: [...req.files.thumbnail], status: true, ...product})
    await fs.promises.writeFile('./files/dbProducts.json', JSON.stringify(products,null,'\t'));
    res.send({
        status: 'Success',
        product: {id: pid, thumbnail: [...req.files.thumbnail], status: true, ...product}
    })
})

router.put('/:pid', async (req, res) => {
    const pid = req.params.pid
    const productUpdate = req.body
    const products = await manager.getProducts();
    const product = products.find(p => p.id === parseInt(pid))

    if (!product) return res.status(404).send({
        status: 'Error',
        error: `Product ID ${pid} doesn't exist`
    })

    if (!productUpdate.title && !productUpdate.description && !productUpdate.code && !productUpdate.price && !productUpdate.stock && !productUpdate.category) {
        return res.status(400).send({
            status: 'Error',
            error: 'Some data required to modify: title, category, description, price, code or stock'
        })
    }

    products.splice(products.indexOf(product), 1, { ...product, ...productUpdate})
    await fs.promises.writeFile('./files/dbProducts.json', JSON.stringify(products,null,'\t'));
    res.send({
        status: "Success",
        product: { ...product, ...productUpdate }
    })
})

export default router;