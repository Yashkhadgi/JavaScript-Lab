const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ActivityLog = require('../models/ActivityLog');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * Helper to extract client IP address from request.
 * Handles proxies (X-Forwarded-For) and direct connections.
 */
const getClientIP = (req) => {
    const forwarded = req.headers['x-forwarded-for'];
    if (forwarded) {
        return forwarded.split(',')[0].trim();
    }
    return req.socket?.remoteAddress || 'unknown';
};

// ─────────────────────────────────────────────────────────────
// POST /api/auth/register
// Creates a new user account with hashed password.
// ─────────────────────────────────────────────────────────────
router.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Input validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required.',
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters long.',
            });
        }

        // Check for duplicate email
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'An account with this email already exists.',
            });
        }

        // Hash password with bcrypt (10 salt rounds)
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Create and save the user
        const user = await User.create({ email, passwordHash });

        return res.status(201).json({
            success: true,
            message: 'Account created successfully. Please login.',
            data: { email: user.email },
        });
    } catch (error) {
        console.error('[REGISTER ERROR]', error);
        return res.status(500).json({
            success: false,
            message: 'Server error during registration.',
        });
    }
});

// ─────────────────────────────────────────────────────────────
// POST /api/auth/login
// Authenticates user, issues JWT, logs the LOGIN event.
// ─────────────────────────────────────────────────────────────
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required.',
            });
        }

        // Find user
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password.',
            });
        }

        // Compare passwords
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password.',
            });
        }

        // Sign JWT
        const token = jwt.sign(
            { id: user._id.toString(), email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
        );

        // Log the LOGIN activity
        await ActivityLog.create({
            userEmail: user.email,
            action: 'LOGIN',
            timestamp: new Date(),
            ipAddress: getClientIP(req),
        });

        console.log(`[ACTIVITY] LOGIN — ${user.email} at ${new Date().toISOString()}`);

        return res.status(200).json({
            success: true,
            message: 'Login successful.',
            data: {
                token,
                email: user.email,
                expiresIn: process.env.JWT_EXPIRES_IN || '1h',
            },
        });
    } catch (error) {
        console.error('[LOGIN ERROR]', error);
        return res.status(500).json({
            success: false,
            message: 'Server error during login.',
        });
    }
});

// ─────────────────────────────────────────────────────────────
// POST /api/auth/logout
// Requires valid JWT. Logs the LOGOUT event.
// Note: JWT is stateless — the client is responsible for
// dropping the token. Server-side invalidation requires a
// token blacklist (Redis), which is beyond scope here.
// The activity log entry serves as the authoritative record.
// ─────────────────────────────────────────────────────────────
router.post('/logout', authMiddleware, async (req, res) => {
    try {
        const { email } = req.user;

        // Log the LOGOUT activity
        await ActivityLog.create({
            userEmail: email,
            action: 'LOGOUT',
            timestamp: new Date(),
            ipAddress: getClientIP(req),
        });

        console.log(`[ACTIVITY] LOGOUT — ${email} at ${new Date().toISOString()}`);

        return res.status(200).json({
            success: true,
            message: 'Logged out successfully. Please discard your token.',
        });
    } catch (error) {
        console.error('[LOGOUT ERROR]', error);
        return res.status(500).json({
            success: false,
            message: 'Server error during logout.',
        });
    }
});

module.exports = router;
