import { Router } from "express";
import { createOrder, deleteOrder, getAllOrders, getOrderById, updateOrder } from "../controllers/order_controller.js";
import { userAuthentication } from "../middleware/auth.js";

const orderRouter = Router();

orderRouter.post('/user/order',userAuthentication, createOrder);
orderRouter.get('/user/order',userAuthentication, getAllOrders);
orderRouter.get('/user/order/:id', userAuthentication, getOrderById);
orderRouter.patch('/user/order/:id', userAuthentication, updateOrder);
orderRouter.delete('/user/order/:id', userAuthentication, deleteOrder);

export default orderRouter;