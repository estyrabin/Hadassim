import express from 'express';
import {loginShop,getAllProductsOfAllProvider,ConfirmOrder,getAllOrders,
    getAllProcessOrders,getAllActiveOrders, newOrder,getInventory,customerOrder, getInventoryForupdate,updateInventory}
from '../controllers/shopConrollers.js';
import authAdmin from '../middlewares/authAdmin.js';

const shopRouter = express.Router();

shopRouter.post('/login',loginShop);
shopRouter.get('/all-products',getAllProductsOfAllProvider);
shopRouter.post('/new-order',authAdmin,newOrder);
shopRouter.get('/all-orders',authAdmin,getAllOrders);
shopRouter.get('/all-process-orders',authAdmin,getAllProcessOrders);
shopRouter.post('/confirm-orders',authAdmin,ConfirmOrder,);
shopRouter.get('/status-orders',authAdmin,getAllActiveOrders);
shopRouter.get('/cashier', authAdmin, getInventory);
shopRouter.post('/customer-order',authAdmin,customerOrder);
shopRouter.get('/inventory',authAdmin,getInventoryForupdate);
shopRouter.post('/inventory-update',authAdmin,updateInventory);








export default shopRouter;