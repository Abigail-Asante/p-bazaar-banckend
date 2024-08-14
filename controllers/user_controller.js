import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken"
import { UserModel } from '../models/user_model.js';
import { ResetModel } from '../models/user_model.js';
import { createUserValidator, loginValidator, registrationValidator, updateUserValidator, resetPasswordValidator, forgotPasswordValidator } from '../validator/user_validator.js';
import { mailTransport } from '../config/mail.js';

// Register a user
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

// login user with and generate token
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

// user forgot password, send email to reset
export const forgotPassword = async (req, res, next) => {
    try {
        // schema validation
        const { error, value } = forgotPasswordValidator.validate(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        }
        // find if user email exist
        const user = await UserModel.findOne({ email: value.email });
        if (!user) {
            return res.status(404).json('User not found')
        }
        // Generate Reset token for user to reset password
        const resetToken = await ResetModel.create({ userId: user.id });
        // send reset Password mail for user to reset password
        await mailTransport.sendMail({
            to: value.email,
            subject: 'Reset Password',
            html: `
          <h1>Hello ${user.name}</h1>
          <h1>Kindly follow the link below to reset your password.</h1>
          <a href="${process.env.FRONTEND_URL}/reset-password/${resetToken.id}">Click Here${resetToken}</a>
          `
        });
        // Return response
        res.status(200).json('Password Reset Mail Sent!');
    } catch (error) {
        next(error)

    }
};

// After the person receive the email, verify reset token
export const verifyResetToken = async (req, res, next) => {
    try {
        // find reset token by id
        const resetToken = await ResetModel.findById(req.params.id);
        if (!resetToken) {
            return res.status(404).json('Reset Token not found')
        }
        // Check if token is valid
        if (resetToken.expired || (Date.now() >= new Date(resetToken.expiredAt).valueOf())) {
            return res.status(409).json('Reset token expired')
        };
        // Return response
        res.status(200).json('Reset token valid')
    } catch (error) {
        next(error)

    }
};

// Reset password
export const resetPassword = async (req, res, next) => {
    try {
        // schema validation
        const { error, value } = resetPasswordValidator.validate(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message)
        }
        // find reset token by id
        const resetToken = await ResetModel.findById(value.resetToken)
        if (!resetToken) {
            return res.status(404).json('Reset token not found');
        }
        // Check if token is valid
        if (resetToken.expired || (Date.now() >= new Date(resetToken.expiredAt).valueOf())) {
            return res.status(409).json('Reset token expired');
        }
        // Encrypt user new password
        const hashedPassword = bcrypt.hashSync(value.password, 10)
        // Update user password
        await UserModel.findByIdAndUpdate(resetToken.userId, { password: hashedPassword });
        // Expire reset token
        await ResetModel.findByIdAndUpdate(value.resetToken, { expired: true });
        // Return response
        res.status(200).json('Password Reset Successful!');
    } catch (error) {
        next(error)
        
    }

}

// user Profile
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



// Get all users
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

// create a new user by admin or superadmin
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
            text: `Dear user,\n\nAn account has been created for you with the following credentials.\n\nUsername: ${value.username}\nEmail: ${value.email}\nPassword: ${value.password}\nRole: ${value.role}\n\nThank you!`,
        });
        // Return response
        res.status(201).json('User Created successfully');
    } catch (error) {
        next(error);
    }
};

// update user details (all roles have access)
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

// Remove a user by superadmin
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


