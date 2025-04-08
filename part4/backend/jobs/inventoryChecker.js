import InventoryModel from '../models/InventoryModels.js';
import axios from 'axios';
import jwt from 'jsonwebtoken';

const backendUrl = process.env.BACKEND_URL;
let sToken = null;


/**
 * get the shop owner's token
 */
function getToken(){
    const email = {email:process.env.SHOP_EMAIL};
    sToken = jwt.sign(email,process.env.JWT_SECRET);
}

/**
 * checks the inventory in the store and orders as needed
 */
async function checkInventoryAndOrder() {

    try{
        if (!sToken) {
            getToken();
        }
    
        const inventoryProducts = await InventoryModel.find();
    
        for (const product of inventoryProducts) {
            
            if(product.amount < product.min && product.pendingOrder){

                let orderAamount  =  product.min * 2 - product.amount;
                const providersArray = Array.from(product.providers, ([name, details]) => ({
                    name,
                    price: details.price,
                    minOrder: details.minOrder
                }));

                //Checking if there are no provider for the product
                if (providersArray.length === 0) {
                    console.log(`No providers found for ${product.product}`);
                    continue;
                }

                //reduce the cheapest provide
                const cheapestProvider = providersArray.reduce((prev, curr) => 
                    prev.price < curr.price ? prev : curr
                );

                // Adjusted amount ofrser acording the provider 
                if (orderAamount < cheapestProvider.minOrder){
                    orderAamount = cheapestProvider.minOrder
                    console.log(`Adjusted ${product.product} order to meet minOrder: ${orderAamount}`);
                }

                await newOrder(product.product, orderAamount, cheapestProvider.name);
                await InventoryModel.updateOne({ _id: product._id }, { pendingOrder: true });
                console.log(`New order for ${product.product}: ${orderAamount}  from ${cheapestProvider.name} at ${cheapestProvider.price}`);

            }
        }
    }catch (error) {
        console.error(`Error checking inventory:`, error.message);
    }
    
}


/**
 *  * Handles new order.
 */
async function newOrder(product, amount, providerName) {

    try{
        const orderProducts = new Map();
        orderProducts.set(product,amount);
    
        const response = await axios.post(
            `${backendUrl}/api/shop/new-order`,
            { companyName: providerName, products: orderProducts },
            { headers: { token: sToken} }
        );
    
        console.log(`Order request sent for ${product}: ${amount}  from ${providerName}`);
        return response.data;

    }catch (error) {
        console.error(`Error sending a new order for ${product}:`, error.message);
        throw error;
    }
}


function startInventoryChecker() {
    checkInventoryAndOrder();
    cron.schedule('*/1 * * * *', checkInventoryAndOrder);
}


export {checkInventoryAndOrder };