require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');

const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const protectedRoutes = require('./routes/protected');
const { verifyMailer } = require('./utils/mailer');
const { startEmailReporter } = require('./jobs/emailReporter');

const app = express();
const PORT = process.env.PORT || 3000;

// ─────────────────────────────────────────────────────────────
// Middleware
// ─────────────────────────────────────────────────────────────
app.use(cors({
    origin: '*', // In production, restrict to your frontend domain
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve the frontend static files
app.use(express.static(path.join(__dirname, '..', 'public')));

// ─────────────────────────────────────────────────────────────
// API Routes
// ─────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/protected', protectedRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Auth App is running',
        timestamp: new Date().toISOString(),
    });
});

// Catch-all: serve index.html for any non-API route (SPA support)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// ─────────────────────────────────────────────────────────────
// 404 and Global Error Handler
// ─────────────────────────────────────────────────────────────
app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Route not found.' });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
    console.error('[GLOBAL ERROR]', err);
    res.status(500).json({ success: false, message: 'Internal server error.' });
});

// ─────────────────────────────────────────────────────────────
// Bootstrap: DB → Mailer → Cron → Server
// ─────────────────────────────────────────────────────────────
const start = async () => {
    // 1. Connect to MongoDB
    await connectDB();

    // 2. Verify SMTP connection (non-blocking — app starts either way)
    await verifyMailer();

    // 3. Start the cron job
    startEmailReporter();

    // 4. Start the HTTP server
    app.listen(PORT, () => {
        console.log(`\n🚀 Server running at http://localhost:${PORT}`);
        console.log(`   Frontend : http://localhost:${PORT}/`);
        console.log(`   API docs : http://localhost:${PORT}/api/health\n`);
    });
};

start();
