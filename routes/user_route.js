import { Router } from "express";
import { loginUser, registration } from "../controllers/user_controller.js";
import { userAuthentication } from "../middleware/auth.js";

const userRouter = Router();

userRouter.post('/user/auth/register', registration);
userRouter.post('/user/auth/login', userAuthentication, loginUser);


export default userRouter;