import { Schema, model, Types } from "mongoose";
import { toJSON } from "@reis/mongoose-to-json";

const orderSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    productId: { type: Schema.Types.ObjectId, ref: 'Product' },
    status: { type: String, enum: ['Pending', 'Completed', 'Cancelled'], default: 'Pending' },
    amount: { type: String }  // Total price of the order
}, {
    timestamps: true
});
orderSchema.plugin(toJSON);

export const OrderModel = model('Oder', orderSchema);