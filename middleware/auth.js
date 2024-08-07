import jwt from "jsonwebtoken"
import { UserModel } from "../models/user_model.js";
import { roles } from "../config/role.js";

export const userAuthentication = (req, res, next) => {
    if (req.headers.authorization) {
        try {
            // Extract the token from the headers
            const token = req.headers.authorization.split(' ')[1];
            // Verify the token to get user and append to request
            req.user = jwt.verify(token, process.env.JWT_SECRET_KEY);
            // Call next function
            next();
        } catch (error) {
            res.status(401).json(error)
        }
    } else {
        res.status(401).json({ error: 'Not authenticated' })
    }
};

export const hasPermission = (permission) => {
    return async (req, res, next) => {
        try {
            // Get user id request
            const userId =  req?.user?.id;
            // Find user by id
            const user = await UserModel.findById(userId);
            // Find user role with permissions
            const userRole = roles.find(element => element.role === user.role);
            // Use role to check if user has permission
            if (userRole && userRole.permissions.includes(permission)) {
                next();
            } else {
                res.status(403).json('Oops you are Not Authorized!');
            }
        } catch (error) {
            next(error);
        }
    }
}

