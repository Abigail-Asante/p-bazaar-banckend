import { Router } from "express";
import { createProduct } from "../controllers/product_controller.js";
import { userAuthentication, hasPermission } from "../middleware/auth.js";
import { remoteUpload } from "../middleware/upload.js";

const productRouter = Router();

productRouter.post('/user/addProduct', userAuthentication, hasPermission ('create_product'), remoteUpload.single('image'), createProduct);


export default productRouter;