const jwt = require('jsonwebtoken');

/**
 * JWT Authentication Middleware
 *
 * Reads the Authorization header in the format: "Bearer <token>"
 * Verifies the token against JWT_SECRET.
 * If valid, attaches the decoded payload to req.user and calls next().
 * If invalid or missing, responds with 401 Unauthorized.
 */
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            message: 'Access denied. No token provided.',
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // { id, email, iat, exp }
        next();
    } catch (err) {
        const message =
            err.name === 'TokenExpiredError'
                ? 'Token has expired. Please login again.'
                : 'Invalid token.';

        return res.status(401).json({ success: false, message });
    }
};

module.exports = authMiddleware;
