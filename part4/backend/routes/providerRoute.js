import express from 'express';
import {signUpProvider, loginProvider, ConfirmOrder, getAllOrders,getAllNewOrders} from '../controllers/providerConrollers.js';
import authProvider from '../middlewares/authProvider.js';

const providerRouter = express.Router();

providerRouter.post('/sign-up', signUpProvider);
providerRouter.post('/login',loginProvider);
providerRouter.get('/all-my-orders',authProvider,getAllOrders);
providerRouter.get('/all-new-orders',authProvider,getAllNewOrders);
providerRouter.post('/confirm-my-orders',authProvider,ConfirmOrder);





export default providerRouter;