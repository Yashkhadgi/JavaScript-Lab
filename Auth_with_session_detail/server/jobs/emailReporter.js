const cron = require('node-cron');
const ActivityLog = require('../models/ActivityLog');
const { sendReport } = require('../utils/mailer');

/**
 * Activity Email Reporter — Cron Job
 *
 * Schedule: Every 10 minutes — cron: "asterisk/10 asterisk asterisk asterisk asterisk"
 *
 * On each tick:
 *  1. Queries ActivityLog for entries where reported = false
 *  2. If entries exist → sends HTML email report → marks them as reported = true
 *  3. If no entries and SEND_EMPTY_REPORT=true → sends "no activity" email
 *  4. If no entries and SEND_EMPTY_REPORT=false (default) → skips silently
 */
const startEmailReporter = () => {
    const sendEmpty = process.env.SEND_EMPTY_REPORT === 'true';

    // Cron expression: every 10 minutes
    // To test faster, change to '*/1 * * * *' (every minute)
    const schedule = '*/10 * * * *';

    console.log(`📧 Email reporter scheduled: runs ${schedule}`);

    cron.schedule(schedule, async () => {
        const runAt = new Date().toISOString();
        console.log(`\n[CRON] Email reporter triggered at ${runAt}`);

        try {
            // Fetch all unreported activity log entries, oldest first
            const unreportedEntries = await ActivityLog.find({ reported: false })
                .sort({ timestamp: 1 })
                .lean();

            if (unreportedEntries.length === 0) {
                if (sendEmpty) {
                    console.log('[CRON] No new activity — sending empty report (SEND_EMPTY_REPORT=true)');
                    await sendReport([]);
                } else {
                    console.log('[CRON] No new activity — skipping email (SEND_EMPTY_REPORT=false)');
                }
                return;
            }

            console.log(`[CRON] Found ${unreportedEntries.length} unreported entries — sending report...`);

            // Send the email report
            await sendReport(unreportedEntries);

            // Mark all sent entries as reported to prevent re-sending
            const ids = unreportedEntries.map((e) => e._id);
            await ActivityLog.updateMany(
                { _id: { $in: ids } },
                { $set: { reported: true } }
            );

            console.log(`[CRON] ✅ ${unreportedEntries.length} entries marked as reported`);
        } catch (error) {
            console.error('[CRON] ❌ Email reporter failed:', error.message);
            // Don't re-throw — cron jobs should not crash the process
        }
    });
};

module.exports = { startEmailReporter };
