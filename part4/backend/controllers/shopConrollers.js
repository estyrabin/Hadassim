import orderModel from '../models/OrderModels.js';
import providerModel from '../models/ProviderModel.js';
import OrderModel from '../models/OrderModels.js';
import InventoryModel from '../models/InventoryModels.js'
import jwt from 'jsonwebtoken';



/**
 * 
 * @param {*} req - equest object, containing the email and password
 * @param res - The response object, send back the result
 * Handles shop owner login.
 */
const loginShop = async (req, res) => {
    try { 
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password are required'  });
        }
        if (email === process.env.SHOP_EMAIL && password === process.env.SHOP_PASSWORD) {
            const token = jwt.sign({ email }, process.env.JWT_SECRET);  // Generate JWT token if credentials are correct

            return res.status(200).json({ success: true, token, message: 'login successful'  });
        } else {
            return res.status(404).json({ success: false, message: 'Incorrect username or password' });  
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
        success: false, 
          message: 'Server error', 
          error: error.message 
        });
    }
};
 
/**
 * @param req - request object
 * @param res - The response object, send back the result
 * retrieves all providers(company name)and their products
 */
const getAllProductsOfAllProvider = async (req,res) => {
    try{

        const providers = await providerModel.find({})
        if (!providers){        
            res.status(404).json({success:false, message:"thers in no provider in the system"})
        }


        const productsDict = providers.reduce((dict, provider) => {
            dict[provider.companyName] = provider.products;
            return dict;
          }, {});

        res.status(200).json({success:true,productsDict})

  
    }catch (error) {
        console.error(error);
        res.json({ 
          success: false, 
          message: 'Server error', 
          error: error.message 
        });
    }
}

/**
* @param req - request object, containing the orderId 
 * @param res - The response object, send back the result
 * Confirms and updates the status of an order to Completed
*/
const ConfirmOrder = async (req,res) => {
    try{   
        const {orderId} = req.body;
        const order = await orderModel.findOne({_id:orderId});
        
        if (!order){
            res.status(404).json({success:false, message:"Order not found"})
        }else{
            const updateOrder = await orderModel.findByIdAndUpdate(orderId,{status:"Completed"}, {new:true})

            //update the products in the inventory
            for (const [productName, amount] of order.products.entries()) {
              const numericAmount = parseFloat(amount);
             
        
              await InventoryModel.findOneAndUpdate(
                { product: productName }, 
                { 
                    $inc: { amount: numericAmount }, 
                    $set: { pendingOrder: false }    
                },
                { new: true } 
            );
            }
            
            res.status(200).json({success:true,message:"The order was successfully updated"})
        }

  
    }catch (error) {
        console.error(error);
        res.status(500).json({ 
            success: false, 
          message: 'Server error', 
          error: error.message 
        });
    }
}


/**
 * @param req - request object
 * @param res - The response object, send back the result
 * retrieves all orders 
 */
const getAllOrders = async (req,res) => {
    try{
   
        const orders = await orderModel.find({})
        res.status(200).json({ success: true, orders });

  
    }catch (error) {
        console.error(error);
        res.json({ 
          success: false, 
          message: 'Server error', 
          error: error.message 
        });
    }
}


/**
 * @param req - request object
 * @param res - The response object, send back the result
 * retrieves all orders that are in status = New or inProcess
 */
const getAllActiveOrders = async (req,res) => {
    try{   
        const orders = await orderModel.find({$or: [{status:"inProcess" }, {    status:"New" }] })
        res.status(200).json({ success: true, orders });

  
    }catch (error) {
        console.error(error);
        res.json({ 
          success: false, 
          message: 'Server error', 
          error: error.message 
        });
    }
}

/**
 * @param req - request object
 * @param res - The response object, send back the result
 * retrieves all orders that are in status = inProcess
 */
const getAllProcessOrders = async (req,res) => {
  try{   
      const orders = await orderModel.find({status:"inProcess" })
      res.status(200).json({ success: true, orders });


  }catch (error) {
      console.error(error);
      res.json({ 
        success: false, 
        message: 'Server error', 
        error: error.message 
      });
  }
}

/**
 * @param req - request object, containing the companyName and the products 
 * @param res - The response object, send back the result
 * Handles new order.
 */
const newOrder = async (req, res) => {
  try {
    const { companyName, products } = req.body;

    if (!companyName || !products) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const status = 'New';

    const newOrder = new OrderModel({
      companyName,
      date: new Date(),
      products, 
      status,
    });


    await newOrder.save();

    res.status(201).json({ success: true, message: "Order successfully added" });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};


/**
 * @param req - request object
 * @param res - The response object, send back the result
 * retrieves all the inventory items whose minimum value has not been updated (min = -1)
 */
const getInventoryForupdate = async (req,res) => {
  try{
 
      const inventory = await InventoryModel.find({min:-1})
      res.status(200).json({ success: true, inventory });


  }catch (error) {
      console.error(error);
      res.json({ 
        success: false, 
        message: 'Server error', 
        error: error.message 
      });
  }
}

/**
 * @param req - request object, containing the companyName and the products 
 * @param res - The response object, send back the result
 * Handles new ustomer order
 */
const customerOrder = async (req, res) => {
  try {
    const { products } = req.body;

    if (!products || Object.keys(products).length === 0) {
      return res.status(400).json({ success: false, message: "Products are required" });
    }

    for (const [productName, amount] of Object.entries(products)) {
      const numericAmount = parseFloat(amount);
      let product = await InventoryModel.findOne({ product: productName });

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${productName}`,
        });
      }

      const product_amount = product.amount;

      if (numericAmount > product_amount) {
         return res.status(400).json({
          success: false,
          message: `There is ${product_amount} ${productName} available`,
        });

        
      }

      const updatedProduct = await InventoryModel.findOneAndUpdate(
        { product: productName },
        { $inc: { amount: -numericAmount } },
        { new: true }
      );

      if (!updatedProduct) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${productName}`,
        });
      }
    }

    res.status(201).json({ success: true, message: "Order successfully added" });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};



/**
 * @param req - request object
 * @param res - The response object, send back the result
 * retrieves all the inventory 
 */
const getInventory = async (req,res) => {
  try{
 
      const inventory = await InventoryModel.find({})
      res.status(200).json({ success: true, inventory });


  }catch (error) {
      console.error(error);
      res.json({ 
        success: false, 
        message: 'Server error', 
        error: error.message 
      });
  }
}

/**
* @param req - request object, containing the productName and quantity
 * @param res - The response object, send back the result
 * update the min of inventory of product
*/
const updateInventory = async (req, res) => {
  try {
    const { productName,quantity} = req.body;
    

    const updatedProduct = await InventoryModel.findOneAndUpdate(
      { product: productName },
      { $set: { min: quantity } },
      { new: true }
    );
    

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: `Product not found: ${productName}`,
      });
    }
    res.status(201).json({ success: true, message: "Order successfully added" });
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};


export {loginShop,getAllProductsOfAllProvider,ConfirmOrder,getAllOrders,
  getAllActiveOrders,newOrder,getAllProcessOrders,getInventory,customerOrder,getInventoryForupdate,updateInventory}

  