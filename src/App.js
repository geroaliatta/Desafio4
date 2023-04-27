import express from 'express';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';
import cartsRouter from './routes/CartsRoutes.js';
import productsRouter from './routes/ProductsRoutes.js';
import viewsRouter from './routes/ViewsRoutes.js';
import ProductManager from './manager/ProductsManager.js';
import __dirname from './Utils.js';

const PORT = 8080;
const app = express();
const productManager = new ProductManager('./files/dbProducts.json');

const server = app.listen(PORT, ()=>{
    console.log(`Server running on the port ${PORT}`);
})
const socketServer = new Server(server);

const socketProducts = async(socketServer)=>{
    const products = await productManager.getProducts();
    socketServer.on('connection', (socket)=>{
        console.log('Nuevo cliente conectado');
        socket.emit('products', products)
        console.log(products);
    })
}

socketProducts(socketServer)

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(__dirname + '/public'));

app.engine('handlebars', handlebars.engine());
app.set('views', __dirname+'/views');
app.set('view engine', 'handlebars');

app.use('/api/carts', cartsRouter);
app.use('/api/products', productsRouter);
app.use('/', viewsRouter);
