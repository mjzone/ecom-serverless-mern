const mongoose = require("mongoose");

// After purchasing the item. We can send the receipt to the user. 
const OrderSchema = new mongoose.Schema(
    {
        userId: { type: String, required: true },
        products: [
            {
                productId: { type: String },
                quantity: { type: Number, default: 1 }
            }
        ],
        amount: { type: Number, required: true },
        address: { type: Object, required: true },
        status: { type: String, default: "pending" } // pending, dispatched, delivered
    },
    { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);