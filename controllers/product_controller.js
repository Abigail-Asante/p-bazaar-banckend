import { UserModel } from "../models/user_model.js";
import { ProductModel } from "../models/product_model.js";
import { productSchema } from "../validator/product_validator.js";

export const createProduct = async (req, res, next) => {
    try {
        // schema model validation
        console.log(req.file)
        const { error, value } = productSchema.validate({
            ...req.body,
            image: req.file.filename
        });
        console.log(value.image);
        if (error) {
            return res.status(422).json(error);

        };
        const userId = req?.user?.id
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

export const getProducts = async (req, res, next) => {
    try {
        // get query params
        const { limit, skip, filter } = req.query;
        // get all product from db
        const allProduct = await ProductModel
            .find({ filter })
            .limit(limit)
            .skip(skip);
        // return response
        res.json(allProduct);
    } catch (error) {
        next(error)

    }
};

export const updateProduct = async (req, res, next) => {
    try {
        // validate schema
        const { error, value } = productSchema.validate({
            ...req.body,
            image: req.file?.filename
        });
        if (error) {
            console.log(error)
            return res.status(400).send(error.details[0].message);
        };
        const userId = req?.user?.id
        // find user
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).send("User not found");
        };
        const editProduct = await ProductModel.findByIdAndUpdate(req.params.id, value, { new: true });
        if (!editProduct) {
            res.status(404).send('product not found')
        };
        await user.save();
        res.status(201).json({
            message: 'Product editted successfully',
            product: editProduct
        })
    } catch (error) {
        next(error)

    }

};


export const deleteProduct = async (req, res, next) => {
    try {
        const userId = req?.user?.id
        // find user
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).send("User not found");
        };
        // update product
        const product = await ProductModel.findByIdAndDelete(req.params.id);
        if (!product) {
            res.status(404).send('product not found')
        };
        res.status(201).json({
            message: 'Product deleted successfully',
        })
    } catch (error) {
        next(error)

    }

};


