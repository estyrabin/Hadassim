import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/mongoodb.js';
import providerRouter from './routes/providerRoute.js';
import shopRouter from './routes/shopRoute.js';
import { startInventoryChecker } from './jobs/inventoryChecker.js'; 

// app config
const app = express();
const port = process.env.PORT || 4001;
connectDB();

// middlewares
app.use(express.json());
app.use(cors());

// api endpoints
app.use('/api/provider', providerRouter);
app.use('/api/shop', shopRouter);



app.get('/', (req, res) => {
    res.send('API IS WORKING!');
});


app.listen(port, () => {
  startInventoryChecker(); 
});