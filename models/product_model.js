import { Schema, model, Types } from "mongoose";
import { toJSON } from "@reis/mongoose-to-json";


const productSchema = new Schema({
    name: { type: String, unique: true, required: true },
    description: { type: String },
    product_items: [{ type: String }],
    price: { type: String, required:true },
    quantity: { type: String, required: true },
    image: { type: String, default: 'No image' },
    favourite: { type: Boolean, default: false },
    location: { type: String, required: true },
    // categoryId: { type: Types.ObjectId, ref: 'category', required: true },
    userId: { type: Types.ObjectId, ref: 'User' }
}, {
    timestamps: true,
});
productSchema.plugin(toJSON);
export const ProductModel = model('Product', productSchema);