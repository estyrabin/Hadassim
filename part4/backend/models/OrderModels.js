import mongoose from 'mongoose';
const OrderSchema =  new mongoose.Schema({


    companyName: {
        type: String,
        required: true,
    },
    date: {
        type: Number,
        required: true,
    },
    products: {
        type: Map,
        of: Number,
        required: true,
    },
    
    status: {
        type: String,
        required: true,
    },
});

const OrderModel = mongoose.models.order || mongoose.model('order', OrderSchema);



export default OrderModel;