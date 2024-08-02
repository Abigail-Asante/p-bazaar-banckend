import bcrypt from 'bcrypt';
import { UserModel } from '../models/user_model.js';
import { loginValidator, registrationValidator } from '../validator/user_validator.js';

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
            acessToken: tokenLogin
        });
    } catch (error) {
        next(error)
    }
}
