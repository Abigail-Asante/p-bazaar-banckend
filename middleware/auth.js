import jwt from "jsonwebtoken"

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
}