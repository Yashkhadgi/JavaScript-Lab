const mongoose = require('mongoose');

/**
 * Schema for recording user authentication events.
 * Every LOGIN and LOGOUT action is stored here.
 * The `reported` flag prevents double-sending in email reports.
 */
const activityLogSchema = new mongoose.Schema({
    userEmail: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
    },
    action: {
        type: String,
        enum: ['LOGIN', 'LOGOUT'],
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
    ipAddress: {
        type: String,
        default: 'unknown',
    },
    // Marks whether this entry has been included in an email report.
    // The cron job sets this to true after sending to prevent duplicate emails.
    reported: {
        type: Boolean,
        default: false,
    },
});

// Index for efficient querying of unreported entries by time
activityLogSchema.index({ reported: 1, timestamp: -1 });

module.exports = mongoose.model('ActivityLog', activityLogSchema);
