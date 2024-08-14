import { Router } from "express";
import { createProduct, deleteProduct, getProducts, updateProduct } from "../controllers/product_controller.js";
import { userAuthentication, hasPermission } from "../middleware/auth.js";
import { remoteUpload } from "../middleware/upload.js";

const productRouter = Router();

productRouter.post('/user/product', userAuthentication, hasPermission('create_product'), remoteUpload.single('image'), createProduct);

productRouter.get('/user/product', getProducts);

productRouter.patch('/user/product/:id', userAuthentication, hasPermission('update_product'),updateProduct);

productRouter.delete('/user/product/:id', userAuthentication, hasPermission('delete_product'), deleteProduct);


export default productRouter;