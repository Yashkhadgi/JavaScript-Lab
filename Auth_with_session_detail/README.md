# 🔐 Auth App with Session Detail

A full-stack Node.js + Express + MongoDB authentication web app featuring:
- **JWT-based sessions** with bcrypt password hashing
- **Activity logging** (every LOGIN/LOGOUT stored in MongoDB)
- **Scheduled email reports** every 10 minutes via Nodemailer + node-cron
- **Premium dark UI** with glassmorphism design

---

## 📁 Folder Structure

```
Auth_with_session_detail/
├── server/
│   ├── config/
│   │   └── db.js              ← Mongoose connection
│   ├── models/
│   │   ├── User.js            ← User schema (email + bcrypt hash)
│   │   └── ActivityLog.js     ← Activity log schema (LOGIN/LOGOUT + reported flag)
│   ├── routes/
│   │   ├── auth.js            ← /api/auth/register, login, logout
│   │   └── protected.js       ← /api/protected/dashboard (JWT-guarded)
│   ├── middleware/
│   │   └── authMiddleware.js  ← JWT verification
│   ├── jobs/
│   │   └── emailReporter.js   ← node-cron: 10-min report job
│   ├── utils/
│   │   └── mailer.js          ← Nodemailer transporter + HTML email builder
│   └── index.js               ← Express entry point
├── public/
│   ├── index.html             ← Login/Register page
│   ├── dashboard.html         ← Protected dashboard
│   ├── style.css              ← Premium dark UI styles
│   └── app.js                 ← Frontend logic (fetch API, JWT storage)
├── .env.example               ← All required environment variables
├── .gitignore
├── package.json
└── README.md
```

---

## 🚀 Quick Start

### 1. Prerequisites

- **Node.js** v18 or higher
- **MongoDB** (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- **Mailtrap account** (free) — [sign up here](https://mailtrap.io)

### 2. Clone and Install

```bash
cd Auth_with_session_detail
npm install
```

### 3. Configure Environment

```bash
cp .env.example .env
```

Open `.env` and fill in your values:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/auth_app

JWT_SECRET=your_random_secret_here_min_32_chars
JWT_EXPIRES_IN=1h

# From Mailtrap → Email Testing → Your Inbox → Show Credentials
SMTP_HOST=sandbox.smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=<your_mailtrap_user>
SMTP_PASS=<your_mailtrap_pass>

REPORT_EMAIL=admin@example.com
REPORT_FROM="Auth App Reporter <noreply@authapp.com>"
SEND_EMPTY_REPORT=false
```

### 4. Start MongoDB (if running locally)

```bash
mongod
# or on macOS with Homebrew:
brew services start mongodb-community
```

### 5. Run the App

```bash
# Development (auto-restarts on file change)
npm run dev

# Production
npm start
```

Open your browser at **http://localhost:3000**

---

## 🔌 API Endpoints

| Method | Endpoint | Auth Required | Description |
|--------|----------|:---:|-------------|
| `POST` | `/api/auth/register` | ❌ | Create a new account |
| `POST` | `/api/auth/login` | ❌ | Login, receive JWT, log LOGIN event |
| `POST` | `/api/auth/logout` | ✅ Bearer | Log LOGOUT event, client drops token |
| `GET`  | `/api/protected/dashboard` | ✅ Bearer | Confirm auth, get session + activity |
| `GET`  | `/api/health` | ❌ | Server health check |

### Example: Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"secret123"}'
```

### Example: Protected Route

```bash
curl http://localhost:3000/api/protected/dashboard \
  -H "Authorization: Bearer <your_token_here>"
```

---

## 📧 Email Report

The cron job runs **every 10 minutes** and:

1. Queries `ActivityLog` for entries where `reported = false`
2. If entries exist → sends a formatted HTML email to `REPORT_EMAIL`
3. Marks those entries as `reported = true` to prevent re-sending
4. If no entries and `SEND_EMPTY_REPORT=false` (default) → skips silently

### Testing the Cron Early

To trigger the report in 1 minute instead of 10, temporarily edit `server/jobs/emailReporter.js`:

```js
// Change this line:
const schedule = '*/10 * * * *';
// To:
const schedule = '*/1 * * * *';
```

Check your Mailtrap inbox for the report.

---

## 🗃️ MongoDB Collections

### `users`
| Field | Type | Description |
|-------|------|-------------|
| `email` | String | Unique, lowercased |
| `passwordHash` | String | bcrypt hash (10 rounds) |
| `createdAt` | Date | Auto-set |

### `activitylogs`
| Field | Type | Description |
|-------|------|-------------|
| `userEmail` | String | Who performed the action |
| `action` | String | `LOGIN` or `LOGOUT` |
| `timestamp` | Date | When it happened |
| `ipAddress` | String | Client IP |
| `reported` | Boolean | `true` after included in email report |

---

## 🔒 Security Notes

- Passwords are hashed with **bcrypt** (10 salt rounds) — never stored in plain text
- JWT tokens are verified server-side on every protected request
- Token invalidation on logout is client-side (token dropped from localStorage)
  - For true server-side invalidation, add a Redis token blacklist
- CORS is open (`*`) in development — restrict to your domain in production
- Environment secrets are never committed (`.gitignore` covers `.env`)

---

## 🛠️ Dev Tools

```bash
# View activity logs in MongoDB shell
mongosh auth_app
db.activitylogs.find().pretty()

# Reset all logs (useful for testing)
db.activitylogs.deleteMany({})
```
