const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const ActivityLog = require('../models/ActivityLog');

const router = express.Router();

// ─────────────────────────────────────────────────────────────
// GET /api/protected/dashboard
// Returns the authenticated user's profile info.
// Requires: Authorization: Bearer <token>
// ─────────────────────────────────────────────────────────────
router.get('/dashboard', authMiddleware, async (req, res) => {
    try {
        // req.user is populated by authMiddleware
        const { email, id, iat, exp } = req.user;

        // Fetch the last 5 activity logs for this user
        const recentActivity = await ActivityLog.find({ userEmail: email })
            .sort({ timestamp: -1 })
            .limit(5)
            .select('action timestamp ipAddress -_id');

        return res.status(200).json({
            success: true,
            message: 'Welcome to the protected dashboard!',
            data: {
                email,
                userId: id,
                tokenIssuedAt: new Date(iat * 1000).toISOString(),
                tokenExpiresAt: new Date(exp * 1000).toISOString(),
                recentActivity,
            },
        });
    } catch (error) {
        console.error('[DASHBOARD ERROR]', error);
        return res.status(500).json({
            success: false,
            message: 'Server error fetching dashboard data.',
        });
    }
});

module.exports = router;
