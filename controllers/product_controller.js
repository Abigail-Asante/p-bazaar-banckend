import { UserModel } from "../models/user_model.js";
import { ProductModel } from "../models/product.js";
import { productSchema } from "../validator/product_validator.js";

export const createProduct = async (req, res, next) => {
    try {
        // schema model validation
        const { error, value } = productSchema.validate({
            ...req.body,
            image: req.file || req.file.filename
        });
        if (error) {
            return res.status(400).send(error.details[0].message);
        };
        const userId = req.user.id
        // find user
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).send("User not found");
        };
        // create product
        const addProduct = await ProductModel.create({
            ...value,
            user: userId
        });
        await user.save();
        res.status(201).json({
            message: 'Product added successfully',
            product: addProduct
        })
    } catch (error) {
        next(error)

    }
};

