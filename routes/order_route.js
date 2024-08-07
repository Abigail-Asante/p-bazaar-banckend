import { Router } from "express";
import { createOrder, deleteOrder, getAllOrders, getOrderById, updateOrder } from "../controllers/order_controller.js";
import { hasPermission, userAuthentication } from "../middleware/auth.js";

const orderRouter = Router();

orderRouter.post('/user/order', userAuthentication, hasPermission('create_order'), createOrder);
orderRouter.get('/user/order', userAuthentication, hasPermission('read_ order'), getAllOrders);
orderRouter.get('/user/order/:id', userAuthentication, hasPermission('read_ order'), getOrderById);
orderRouter.patch('/user/order/:id', userAuthentication, hasPermission('update_order'), updateOrder);
orderRouter.delete('/user/order/:id', userAuthentication, hasPermission('delete_order'), deleteOrder);

export default orderRouter;