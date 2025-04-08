import mongoose from 'mongoose';

const InventorySchema = new mongoose.Schema({
    product: {
        type: String,
        required: true,
    },
    min: {
        type: Number,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    providers: {
        type: Map,
        of: {
            price: { type: Number, required: true },
            minOrder: { type: Number, required: true }
        }
    },
    pendingOrder: {
        type: Boolean,
        default: false
    }
});

const InventoryModel = mongoose.models.inventory || mongoose.model('inventory', InventorySchema);

export default InventoryModel;