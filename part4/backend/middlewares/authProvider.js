import jwt from 'jsonwebtoken';

/**
 * Middleware to authenticate if the user is an provider.
 * @param {Object} req - The request object, containing the authorization token in the headers.
 * @param {Object} res - The response object, used to send back the result.
 * @param {Function} next - The next middleware function to call if the user is authorized.
 */
 const authProvider = async (req, res, next) => {
    try {
        const { token } = req.headers;
        if (!token) {
            return res.json({ 
                success: false, 
                message: 'Not authorized login again' 
            });
        }

        const d_token = jwt.verify(token, process.env.JWT_SECRET);
        req.providerId = d_token.id;


        next();

    } catch (error) {
        console.error(error);
        res.json({ 
            success: false, 
            message: 'Server error', error: error.message 
        });
    }
}


export default authProvider;