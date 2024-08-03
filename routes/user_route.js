import { Router } from "express";
import { createUser, deleteUser, getAllUsers, loginUser, profile, registration, updateUser,  } from "../controllers/user_controller.js";
import { hasPermission, userAuthentication } from "../middleware/auth.js";

const userRouter = Router();

userRouter.post('/user/auth/register', registration);
userRouter.post('/user/auth/login',  loginUser);
userRouter.get('/user/auth/profile',userAuthentication, profile);
userRouter.get('/users/auth/getUsers',userAuthentication, hasPermission('read_users'), getAllUsers)
userRouter.post('/user/auth/addUser', userAuthentication, hasPermission('create_user'), createUser);
userRouter.patch('/user/auth/updateUser/:id', userAuthentication, hasPermission('update_user'), updateUser);
userRouter.delete('/user/auth/delete/:id', userAuthentication, hasPermission('delete_user'), deleteUser);



export default userRouter;