import express from 'express';
import handlebars from "express-handlebars";
import cartsRouter from './routes/CartsRoutes.js';
import productsRouter from './routes/ProductsRoutes.js';
import viewsRouter from './routes/ViewsRoutes.js';
import __dirname from './Utils.js';

const PORT = 8080;
const app = express();

app.listen(PORT, ()=>{
    console.log(`Server running on the port ${PORT}`);
})

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(__dirname + '/public'));

app.engine('handlebars', handlebars.engine());
app.set('views', __dirname+'/views');
app.set('view engine', 'handlebars');

app.use('/api/carts', cartsRouter);
app.use('/api/products', productsRouter);
app.use('/', viewsRouter);