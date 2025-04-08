

import mongoose from 'mongoose';
    const ProviderSchema =  new mongoose.Schema({
        
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
            unique: true,
        },
        companyName: {
            type: String,
            required: true,
        },
        representativeName: {
            type: String,
            required: true,
        },

        products: [{
            name: { type: String, required: true },
            price: { type: String, required: true }, 
            minOrder: { type: String, required: true }, 
          }],
        
    });

const ProviderModel = mongoose.models.provider || mongoose.model('provider', ProviderSchema);

export default ProviderModel;


