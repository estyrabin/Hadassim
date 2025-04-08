import orderModel from '../models/OrderModels.js';
import ProviderModel from '../models/ProviderModel.js';
import InventoryModel from '../models/InventoryModels.js'
import bcrypt from 'bcrypt';
import validator from 'validator';
import jwt from 'jsonwebtoken';


/**
 * 
 * @param {*} req - equest object, containing the registration details.
 * @param res - The response object, send back the result
 * Handles provider signUp.
 */
const signUpProvider = async (req, res) => {
  try {
    const { email, password, phone, companyName, representativeName, products } = req.body;

    if (!email || !password || !phone || !representativeName || !products) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    if (!validator.isEmail(email)) {
      return res.status(422).json({ success: false, message: "Please enter a valid email" });
    }

    const existingProvider = await ProviderModel.findOne({
      $or: [{ email }, { phone }, { companyName }]
    });

    if (existingProvider) {
      return res.status(409).json({ success: false, message: "Provider already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newProvider = new ProviderModel({
      email,
      password: hashedPassword,
      phone,
      representativeName,
      companyName,
      products
    });

    //updating the provider and its products in the inventory
    for (let product of products) {
      let inventoryItem = await InventoryModel.findOne({ product: product.name });
      if (inventoryItem) {
        if (!inventoryItem.providers.has(newProvider.companyName)) {
            inventoryItem.providers.set(newProvider.companyName, {
                price: product.price,
                minOrder: product.minOrder
            });
            await inventoryItem.save();
        }
      } else {
        const newProduct = new InventoryModel({
          product: product.name,
          min: -1,
          amount: 0,
          providers: new Map([[newProvider.companyName, { price: product.price, minOrder: product.minOrder || 1 }]])
        });
    
        await newProduct.save();
      }
    }
    

    await newProvider.save();
    
    const token = jwt.sign({ id: newProvider._id }, process.env.JWT_SECRET); //generates a JWT token for the newProduct

    res.status(201).json({ success: true, token, message: "Signup successful" });

  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
}


/**
 * 
 * @param {*} req - equest object, containing the email and password
 * @param res - The response object, send back the result
 * Handles provider login.
 */
const loginProvider = async (req, res) => {
    try {
  
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password are required'  });
        }
        
        const provider = await ProviderModel.findOne({ email: email });
        
        if (!provider) {
            return res.status(404).json({ success: false, message: 'Incorrect username or password' });
        }
        
        const isMatch = await bcrypt.compare(password, provider.password)

        if (isMatch) {
            const token = jwt.sign({ id:provider._id }, process.env.JWT_SECRET); // Generate JWT token if credentials are correct

            return res.status(200).json({ success: true, token, message: 'login successful'});

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
* @param req - request object, containing the orderId 
 * @param res - The response object, send back the result
 * Confirms and updates the status of an order to inProcess
*/
const ConfirmOrder = async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await orderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    const updateOrder = await orderModel.findByIdAndUpdate(
      orderId,
      { status: "inProcess" },
      { new: true }
    );

    return res.status(200).json({ success: true, message: "The order was successfully updated" });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};


/**
 * @param req - request object, containing the providerId 
 * @param res - The response object, send back the result
 * retrieves all orders associated with a specific provider
 */
const getAllOrders = async (req, res) => {
  try {
    const { providerId } = req;
    const provider = await ProviderModel.findById(providerId);
    if (!provider) {
      return res.status(404).json({ success: false, message: 'Provider not found' });
    }
    
    const orders = await orderModel.find({ companyName: provider.companyName });
    res.status(200).json({ success: true, orders });

    console.log('Provider name from token:', providerId);


    res.status(200).json({ success: true });
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
 * @param req - request object, containing the providerId 
 * @param res - The response object, send back the result
 * retrieves all orders associated with a specific provider tthat are in status = New
 */
const getAllNewOrders = async (req,res) => {
    try{   
      const { providerId } = req;
      const provider = await ProviderModel.findById(providerId);
      if (!provider) {
        return res.status(404).json({ success: false, message: 'Provider not found' });
      }

      const orders = await orderModel.find({$and: [{companyName:provider.companyName }, { status:"New" }] })
      return res.status(200).json({ success: true, orders });

  
    }catch (error) {
        console.error(error);
        res.json({ 
          success: false, 
          message: 'Server error', 
          error: error.message 
        });
    }
  }
 

export {signUpProvider, loginProvider, ConfirmOrder, getAllOrders,getAllNewOrders};