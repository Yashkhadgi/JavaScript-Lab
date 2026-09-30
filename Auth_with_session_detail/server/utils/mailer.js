const nodemailer = require('nodemailer');

/**
 * Nodemailer transporter configured from environment variables.
 * Default configuration targets Mailtrap (recommended for testing).
 *
 * To switch providers, update .env:
 *   - Mailtrap:  SMTP_HOST=sandbox.smtp.mailtrap.io, SMTP_PORT=2525
 *   - Gmail:     SMTP_HOST=smtp.gmail.com, SMTP_PORT=587
 *   - SendGrid:  SMTP_HOST=smtp.sendgrid.net, SMTP_PORT=587
 */
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT, 10),
    // Use TLS for port 465, STARTTLS for 587/2525
    secure: parseInt(process.env.SMTP_PORT, 10) === 465,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

/**
 * Verifies the SMTP connection on startup.
 * Logs a warning if connection fails — app still runs without email.
 */
const verifyMailer = async () => {
    try {
        await transporter.verify();
        console.log('✅ SMTP connection verified — email reporting is active');
    } catch (error) {
        console.warn(
            `⚠️  SMTP connection failed: ${error.message}\n` +
            '   Email reports will not be sent. Check your .env SMTP settings.'
        );
    }
};

/**
 * Formats activity log entries into an HTML email table.
 * @param {Array} entries - ActivityLog documents
 * @returns {string} HTML string
 */
const buildEmailHTML = (entries) => {
    const rows = entries
        .map((entry) => {
            const ts = new Date(entry.timestamp).toLocaleString('en-US', {
                dateStyle: 'medium',
                timeStyle: 'medium',
                timeZone: 'UTC',
            });
            const actionColor = entry.action === 'LOGIN' ? '#4ade80' : '#f87171';
            return `
            <tr>
                <td style="padding: 10px 16px; border-bottom: 1px solid #2d2d2d; color: #e2e8f0;">
                    ${entry.userEmail}
                </td>
                <td style="padding: 10px 16px; border-bottom: 1px solid #2d2d2d; text-align:center;">
                    <span style="
                        background: ${actionColor}22;
                        color: ${actionColor};
                        padding: 3px 10px;
                        border-radius: 99px;
                        font-size: 12px;
                        font-weight: 600;
                        letter-spacing: 0.5px;
                    ">${entry.action}</span>
                </td>
                <td style="padding: 10px 16px; border-bottom: 1px solid #2d2d2d; color: #94a3b8; font-size: 13px;">
                    ${ts} UTC
                </td>
                <td style="padding: 10px 16px; border-bottom: 1px solid #2d2d2d; color: #64748b; font-size: 13px;">
                    ${entry.ipAddress || 'unknown'}
                </td>
            </tr>`;
        })
        .join('');

    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Auth Activity Report</title>
    </head>
    <body style="margin:0; padding:0; background:#0f172a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <div style="max-width: 680px; margin: 40px auto; padding: 0 16px;">

            <!-- Header -->
            <div style="
                background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
                border: 1px solid #334155;
                border-radius: 16px 16px 0 0;
                padding: 32px;
                text-align: center;
            ">
                <div style="font-size: 36px; margin-bottom: 12px;">🔐</div>
                <h1 style="margin: 0; font-size: 22px; color: #f1f5f9; font-weight: 700;">
                    Activity Report
                </h1>
                <p style="margin: 8px 0 0; color: #64748b; font-size: 14px;">
                    Generated at ${new Date().toUTCString()}
                </p>
            </div>

            <!-- Summary Banner -->
            <div style="
                background: #1e293b;
                border-left: 1px solid #334155;
                border-right: 1px solid #334155;
                padding: 16px 32px;
                display: flex;
                align-items: center;
            ">
                <span style="
                    background: #6366f122;
                    color: #818cf8;
                    font-size: 13px;
                    font-weight: 600;
                    padding: 4px 12px;
                    border-radius: 99px;
                    border: 1px solid #6366f144;
                ">
                    ${entries.length} new event${entries.length !== 1 ? 's' : ''} since last report
                </span>
            </div>

            <!-- Table -->
            <div style="background: #1e293b; border: 1px solid #334155; border-top: none;">
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="background: #0f172a;">
                            <th style="padding: 12px 16px; text-align:left; font-size: 11px; font-weight: 700; color: #475569; letter-spacing: 1px; text-transform: uppercase; border-bottom: 1px solid #334155;">
                                User Email
                            </th>
                            <th style="padding: 12px 16px; text-align:center; font-size: 11px; font-weight: 700; color: #475569; letter-spacing: 1px; text-transform: uppercase; border-bottom: 1px solid #334155;">
                                Action
                            </th>
                            <th style="padding: 12px 16px; text-align:left; font-size: 11px; font-weight: 700; color: #475569; letter-spacing: 1px; text-transform: uppercase; border-bottom: 1px solid #334155;">
                                Timestamp
                            </th>
                            <th style="padding: 12px 16px; text-align:left; font-size: 11px; font-weight: 700; color: #475569; letter-spacing: 1px; text-transform: uppercase; border-bottom: 1px solid #334155;">
                                IP Address
                            </th>
                        </tr>
                    </thead>
                    <tbody>${rows}</tbody>
                </table>
            </div>

            <!-- Footer -->
            <div style="
                background: #0f172a;
                border: 1px solid #334155;
                border-top: none;
                border-radius: 0 0 16px 16px;
                padding: 20px 32px;
                text-align: center;
            ">
                <p style="margin:0; font-size: 12px; color: #334155;">
                    Auth App with Session Detail — Automated Report<br>
                    This report is generated every 10 minutes. Do not reply to this email.
                </p>
            </div>

        </div>
    </body>
    </html>`;
};

/**
 * Sends the activity report email.
 * @param {Array} entries - ActivityLog documents to include in the report
 * @returns {Promise<void>}
 */
const sendReport = async (entries) => {
    const recipientEmail = process.env.REPORT_EMAIL;
    const fromAddress = process.env.REPORT_FROM || '"Auth App Reporter" <noreply@authapp.com>';

    if (!recipientEmail) {
        console.warn('[MAILER] REPORT_EMAIL is not set in .env — skipping email send.');
        return;
    }

    const subject =
        entries.length > 0
            ? `🔐 Auth Activity Report — ${entries.length} event${entries.length !== 1 ? 's' : ''} (${new Date().toUTCString()})`
            : `🔐 Auth Activity Report — No Activity (${new Date().toUTCString()})`;

    const html =
        entries.length > 0
            ? buildEmailHTML(entries)
            : `<p style="font-family:sans-serif;color:#64748b;padding:32px;">
                No authentication activity was recorded in the last 10 minutes.
               </p>`;

    const info = await transporter.sendMail({
        from: fromAddress,
        to: recipientEmail,
        subject,
        html,
    });

    console.log(`[MAILER] Report sent → ${recipientEmail} | Message ID: ${info.messageId}`);
};

module.exports = { sendReport, verifyMailer };
