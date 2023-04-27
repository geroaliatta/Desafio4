import { Router } from 'express';
import ProductManager from '../manager/ProductsManager.js';

const router = Router();
const manager = new ProductManager('./files/dbProducts.json');

router.get('/', async (req, res)=>{
    const products = await manager.getProducts();
    res.render('index',{
        products
    })
})

router.get('/realtimeproducts', async (req, res)=>{
    const products = await manager.getProducts();
    res.render('realTimeProducts',{
        products
    })
})

export default router;