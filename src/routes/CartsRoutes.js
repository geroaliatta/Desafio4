import { Router } from 'express';
import fs from 'fs';
import CartsManager from '../manager/CartsManager.js';
import ProductManager from '../manager/ProductsManager.js';

const router = Router();
const managerCarts = new CartsManager('./files/dbCarts.json');
const managerProd = new ProductManager('./files/dbProducts.json');

router.get('/', async (req,res)=>{
    const carts = await managerCarts.getCarts();
    res.send({carts})
})

router.get('/:cid', async (req,res)=>{
    const cid = req.params.cid;
    const cart = await managerCarts.getCartById(cid);
    if (cart === "Not found") return res.status(404).send({
        status: 'Error',
        error: `Cart ID ${cid} incorrect, not found`
    })
    res.send({cart})
})

router.post('/', async (req, res)=>{

    const carts = await managerCarts.getCarts();
    const cid = (!carts) ? 0 : carts.length + 1
    const newCart = { id: cid, products: []}
    carts.push(newCart);
    await fs.promises.writeFile('./files/dbCarts.json', JSON.stringify(carts,null,'\t'));
    res.send({
        status:'Success',
        cart: newCart
    })
})

router.post('/:cid/product/:pid', async (req, res)=>{

    const carts = await managerCarts.getCarts();
    const products = await managerProd.getProducts();
    const cid = req.params.cid;
    const pid = req.params.pid;
    const cart = carts.find(c => c.id == cid);

    if (!cart) return res.status(404).send({
        status:'Error',
        error:`Cart ID ${cid} doesn't exist`
    })

    const iCart = carts.indexOf(cart);
    const product = products.find(p => p.id == pid);

    if (!product) return res.status(404).send({
        status:'Error',
        error:`Product ID ${pid} doesn't exist`
    })

    const addProductCart = cart.products.find(p => p.product == pid.toString());

    if (!addProductCart) {
        cart.products.push({product: pid, quantity: 1});
        carts.splice(iCart, 1, cart);
        await fs.promises.writeFile('./files/dbCarts.json', JSON.stringify(carts,null,'\t'));
        return res.send({
            status:'Success',
            cart
        })
    }

    const iProd = [...cart.products].indexOf(addProductCart);
    cart.products.splice(iProd, 1, {...addProductCart, quantity: addProductCart.quantity + 1});
    await fs.promises.writeFile('./files/dbCarts.json', JSON.stringify(carts,null,'\t'));
        return res.send({
            status:'Success',
            cart
        })
})

export default router;