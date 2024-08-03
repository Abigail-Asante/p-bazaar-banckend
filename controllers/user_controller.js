import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken"
import { UserModel } from '../models/user_model.js';
import { createUserValidator, loginValidator, registrationValidator, updateUserValidator } from '../validator/user_validator.js';
import { mailTransport } from '../config/mail.js';

export const registration = async (req, res, next) => {
    try {
        // schema validation
        const { error, value } = registrationValidator.validate(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        }
        // check if email exist
        const email = value.email;
        const findIfUserExist = await UserModel.findOne({ email });
        if (findIfUserExist) {
            return res.status(401).send('User has already signed up');
        }
        // hash password
        const hashedPassword = await bcrypt.hash(value.password, 12);
        value.password = hashedPassword;
        delete value.confirmPassword; // Remove confirmPassword field before storing

        // create user
        await UserModel.create(value);

        // return response
        return res.status(201).send('Signed Up Successfully');
    } catch (error) {
        next(error);
    }
};

export const loginUser = async (req, res, next) => {
    try {
        // schema validation
        const { error, value } = loginValidator.validate(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        }


        // first find user by email or username
        const user = await UserModel.findOne({
            $or: [
                { email: value.email },
                { username: value.username }
            ]
        })
        if (!user) {
            return res.status(401).json('No user found');
        }
        // after user is found continue to verify password
        const correctPassword = bcrypt.compareSync(value.password, user.password);
        if (!correctPassword) {
            return res.status(401).json('Invalid credentials');
        }

        // Generate token
        const tokenLogin = jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET_KEY,
            { expiresIn: '24h' }
        );
        // Return response
        res.status(201).json({
            message: 'User signed In successfully',
            acessToken: tokenLogin,
            user: { username: user.username }
        });
    } catch (error) {
        next(error)
    }
};

export const profile = async (req, res, next) => {
    try {
        // Get user id from request
        const userId = req?.user?.id;
        // Find user by id
        const user = await UserModel.findById(userId)
            .select({ password: false });
        // Return response
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
}


// export const getUsers = async (req, res, next) => {
//     try {
//         // Get all users
//         const users = await UserModel
//             .find()
//             .select({ password: false });
//         // Return response
//         res.status(200).json(users);
//     } catch (error) {
//         next(error);
//     }
// }

export const getAllUsers = async (req, res, next) => {
    try {
        const email = req.query.email?.toLowerCase();
        const username = req.query.username?.toLowerCase();

        const filter = {};
        if (email) {
            filter.email = email;
        }
        if (username) {
            filter.username = username;
        }

        const users = await UserModel.find(filter);

        return res.status(200).json({ users });
    } catch (error) {
        next(error);
    }
};

export const createUser = async (req, res, next) => {
    try {
        // Validate request
        const { value, error } = createUserValidator.validate(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        }
        // Encrypt user password
        const hashedPassword = bcrypt.hashSync(value.password, 10);
        // Create user
        await UserModel.create({
            ...value,
            password: hashedPassword
        });
        // Send email to user
        await mailTransport.sendMail({
            from: "noreply@test.com",
            to: value.email,
            subject: "User Account Created!",
            text: `Dear user,\n\nA user account has been created for you with the following credentials.\n\nUsername: ${value.username}\nEmail: ${value.email}\nPassword: ${value.password}\nRole: ${value.role}\n\nThank you!`,
        });
        // Return response
        res.status(201).json('User Created');
    } catch (error) {
        next(error);
    }
};

export const updateUser = async (req, res, next) => {
    try {
        // Validate request
        const { value, error } = updateUserValidator.validate(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        }
        const userId = req?.user?.id;
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).send("User not found");
        }
        // Update user
        await UserModel.findByIdAndUpdate(
            req.params.id,
            value,
            { new: true }
        );
        // Return response
        res.status(200).json({
            message: 'User Updated Successfully'
        });
    } catch (error) {
        next(error);
    }
};

export const deleteUser = async (req, res, next) => {
    try {
        // Get user id from session or request
        const userId = req?.user?.id;
        // Ensure user is not deleting themselves
        if (userId === req.params.id) {
            return res.status(409).json('Cannot Delete Self');
        }
        // Delete user
        await UserModel.findByIdAndDelete(req.params.id);
        // Return response
        res.status(200).json('User Deleted Successfully');
    } catch (error) {
        next(error);
    }
};


