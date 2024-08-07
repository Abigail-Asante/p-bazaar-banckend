import { UserModel } from "../models/user_model.js";
import { OrderModel } from "../models/order_model.js";
import { orderValidator } from "../validator/order_validator.js";
import { ProductModel } from "../models/product_model.js";

// create order
export const createOrder = async (req, res, next) => {
    try {
        // order schema validation
        const { error, value } = orderValidator.validate(req.body)
        if (error) {
            return res.status(400).send(error.details[0].message)
        };
        const userId = req?.user?.id
        // find user
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).send("User not found")
        };
        // find the product the user wants to purchase
        const { productId, quantity, price } = value;
        const product = await ProductModel.findById(productId, price, quantity);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Calculate amount
        const amount = product.price * quantity;
        const order = await OrderModel.create({
            ...value,
            userId: userId,
            productId: productId,
            amount

        });
        await order.save();
        res.json({
            message: 'order placed successfully',
            order: order
        });
    } catch (error) {
        next(error)

    };
};

// Get all orders
export const getAllOrders = async (req, res, next) => {
    try {
        const userId = req?.user?.id
        // find user
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).send("User not found")
        };
        const orders = await OrderModel.find().select({password: false}).populate('userId').populate('productId');
        res.status(200).json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get order by ID
export const getOrderById = async (req, res) => {

    try {
        const order = await OrderModel.findById(req.params.id).select("-password").populate('userId').populate('productId');
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update an order
export const updateOrder = async (req, res, next) => {
    try {
        // order schema validation
        const { error, value } = orderValidator.validate(req.body)
        if (error) {
            return res.status(400).send(error.details[0].message)
        };
        const userId = req?.user?.id
        // find user
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).send("User not found")
        };

        const editOrder = await OrderModel.findByIdAndUpdate(req.params.id, value, { new: true });
        if (!editOrder) {
            return res.status(404).json({
                message: 'Order not found'
            });
        };

        res.status(200).json({
            message: "Order updated successfully",
            editOrder: editOrder
        });
    } catch (error) {
        next(error)

    }

};

// Delete an order
export const deleteOrder = async (req, res, next) => {
    try {
        const userId = req?.user?.id
        // find user
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).send("User not found")
        };

        const deleteOrder = await OrderModel.findByIdAndDelete(req.params.id);
        if (!deleteOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json({ message: 'Order deleted' });
    } catch (error) {
        next(error)

    }

};