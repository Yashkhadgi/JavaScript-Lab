/**
 * SecureAuth Frontend — app.js
 *
 * Handles:
 *  - Tab switching (Login / Register)
 *  - API calls to backend (register, login, logout, dashboard)
 *  - JWT storage/retrieval in localStorage
 *  - Dashboard rendering (session info, recent activity)
 *  - Protected route guarding (redirect if no token)
 */

// ─────────────────────────────────────────────────────────────
// Config
// ─────────────────────────────────────────────────────────────
const API_BASE = '/api';

// ─────────────────────────────────────────────────────────────
// Token Helpers
// ─────────────────────────────────────────────────────────────
const Token = {
    set(token, email) {
        localStorage.setItem('auth_token', token);
        localStorage.setItem('auth_email', email);
    },
    get() {
        return localStorage.getItem('auth_token');
    },
    getEmail() {
        return localStorage.getItem('auth_email');
    },
    clear() {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_email');
    },
    exists() {
        return !!localStorage.getItem('auth_token');
    },
};

// ─────────────────────────────────────────────────────────────
// API Helper
// ─────────────────────────────────────────────────────────────
/**
 * Makes a JSON API request.
 * @param {string} endpoint - e.g. '/auth/login'
 * @param {'GET'|'POST'|'PUT'|'DELETE'} method
 * @param {object|null} body - Request body
 * @param {boolean} withAuth - Attach Bearer token if true
 * @returns {Promise<{ok: boolean, status: number, data: object}>}
 */
async function apiRequest(endpoint, method = 'GET', body = null, withAuth = false) {
    const headers = { 'Content-Type': 'application/json' };
    if (withAuth && Token.exists()) {
        headers['Authorization'] = `Bearer ${Token.get()}`;
    }

    const options = { method, headers };
    if (body) options.body = JSON.stringify(body);

    try {
        const res = await fetch(`${API_BASE}${endpoint}`, options);
        const data = await res.json();
        return { ok: res.ok, status: res.status, data };
    } catch (err) {
        return { ok: false, status: 0, data: { message: 'Network error. Is the server running?' } };
    }
}

// ─────────────────────────────────────────────────────────────
// UI Helpers
// ─────────────────────────────────────────────────────────────
function showAlert(id, message, type = 'error') {
    const el = document.getElementById(id);
    if (!el) return;

    // Reset
    el.className = `alert alert-${type} show`;
    el.textContent = '';

    const icon = document.createElement('span');
    icon.textContent = type === 'error' ? '⚠️' : '✅';
    icon.style.flexShrink = '0';

    const text = document.createTextNode(' ' + message);
    el.appendChild(icon);
    el.appendChild(text);
}

function hideAlert(id) {
    const el = document.getElementById(id);
    if (el) el.classList.remove('show');
}

function setButtonLoading(btnId, isLoading) {
    const btn = document.getElementById(btnId);
    if (!btn) return;
    if (isLoading) {
        btn.classList.add('loading');
        btn.disabled = true;
    } else {
        btn.classList.remove('loading');
        btn.disabled = false;
    }
}

function hideLoadingOverlay() {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
        overlay.classList.add('hidden');
        setTimeout(() => overlay.style.display = 'none', 400);
    }
}

// ─────────────────────────────────────────────────────────────
// Tab Switching (index.html)
// ─────────────────────────────────────────────────────────────
function switchTab(tab) {
    const panels = { login: 'panel-login', register: 'panel-register' };
    const btns = { login: 'btn-login', register: 'btn-register' };

    Object.keys(panels).forEach((key) => {
        const panel = document.getElementById(panels[key]);
        const btn = document.getElementById(btns[key]);
        if (!panel || !btn) return;

        if (key === tab) {
            panel.classList.add('active');
            btn.classList.add('active');
            btn.setAttribute('aria-selected', 'true');
        } else {
            panel.classList.remove('active');
            btn.classList.remove('active');
            btn.setAttribute('aria-selected', 'false');
        }
    });

    // Clear all alerts when switching tabs
    ['login-error', 'login-success', 'register-error', 'register-success'].forEach(hideAlert);
}

// ─────────────────────────────────────────────────────────────
// Register
// ─────────────────────────────────────────────────────────────
async function handleRegister(e) {
    e.preventDefault();
    hideAlert('register-error');
    hideAlert('register-success');

    const email = document.getElementById('reg-email')?.value.trim();
    const password = document.getElementById('reg-password')?.value;
    const confirm = document.getElementById('reg-confirm')?.value;

    // Client-side validation
    if (!email || !password || !confirm) {
        showAlert('register-error', 'Please fill in all fields.');
        return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
        showAlert('register-error', 'Please enter a valid email address.');
        return;
    }
    if (password.length < 6) {
        showAlert('register-error', 'Password must be at least 6 characters.');
        return;
    }
    if (password !== confirm) {
        showAlert('register-error', 'Passwords do not match.');
        return;
    }

    setButtonLoading('btn-register-submit', true);

    const { ok, data } = await apiRequest('/auth/register', 'POST', { email, password });

    setButtonLoading('btn-register-submit', false);

    if (ok) {
        showAlert('register-success', data.message || 'Account created! Please sign in.', 'success');
        document.getElementById('register-form')?.reset();
        setTimeout(() => switchTab('login'), 1800);
    } else {
        showAlert('register-error', data.message || 'Registration failed. Please try again.');
    }
}

// ─────────────────────────────────────────────────────────────
// Login
// ─────────────────────────────────────────────────────────────
async function handleLogin(e) {
    e.preventDefault();
    hideAlert('login-error');
    hideAlert('login-success');

    const email = document.getElementById('login-email')?.value.trim();
    const password = document.getElementById('login-password')?.value;

    if (!email || !password) {
        showAlert('login-error', 'Please enter your email and password.');
        return;
    }

    setButtonLoading('btn-login-submit', true);

    const { ok, data } = await apiRequest('/auth/login', 'POST', { email, password });

    setButtonLoading('btn-login-submit', false);

    if (ok && data.data?.token) {
        Token.set(data.data.token, data.data.email);
        showAlert('login-success', 'Login successful! Redirecting...', 'success');
        setTimeout(() => window.location.replace('dashboard.html'), 800);
    } else {
        showAlert('login-error', data.message || 'Invalid credentials. Please try again.');
    }
}

// ─────────────────────────────────────────────────────────────
// Logout
// ─────────────────────────────────────────────────────────────
async function handleLogout() {
    // Call the logout endpoint to log the LOGOUT event
    await apiRequest('/auth/logout', 'POST', null, true);

    // Clear token regardless of API response
    Token.clear();
    window.location.replace('index.html');
}

// ─────────────────────────────────────────────────────────────
// Dashboard Data Fetching
// ─────────────────────────────────────────────────────────────
async function loadDashboard() {
    const { ok, status, data } = await apiRequest('/protected/dashboard', 'GET', null, true);

    hideLoadingOverlay();

    if (!ok) {
        if (status === 401) {
            // Token expired or invalid — force logout
            Token.clear();
            window.location.replace('index.html');
            return;
        }
        const errEl = document.getElementById('dash-error');
        if (errEl) showAlert('dash-error', data.message || 'Failed to load dashboard.');
        return;
    }

    const { email, tokenIssuedAt, tokenExpiresAt, recentActivity } = data.data;

    // User Avatar — first letter of email
    const avatarEl = document.getElementById('user-avatar');
    if (avatarEl) avatarEl.textContent = email.charAt(0).toUpperCase();

    // Email
    const emailEl = document.getElementById('user-email');
    if (emailEl) emailEl.textContent = email;

    // Token timestamps
    const formatDate = (isoStr) => {
        if (!isoStr) return '—';
        return new Date(isoStr).toLocaleString('en-US', {
            dateStyle: 'medium',
            timeStyle: 'short',
        });
    };

    const issuedEl = document.getElementById('token-issued');
    const expiresEl = document.getElementById('token-expires');
    if (issuedEl) issuedEl.textContent = formatDate(tokenIssuedAt);
    if (expiresEl) expiresEl.textContent = formatDate(tokenExpiresAt);

    // Recent Activity Table
    renderActivityTable(recentActivity || []);
}

function renderActivityTable(activities) {
    const container = document.getElementById('activity-container');
    if (!container) return;

    if (!activities || activities.length === 0) {
        container.innerHTML = `
            <div class="no-activity">
                <div class="no-activity-icon">📭</div>
                No recent activity found.
            </div>`;
        return;
    }

    const rows = activities.map((entry) => {
        const ts = new Date(entry.timestamp).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
        const badgeClass = entry.action === 'LOGIN' ? 'login' : 'logout';
        const badgeIcon = entry.action === 'LOGIN' ? '→' : '←';

        return `
        <tr>
            <td>
                <span class="action-badge ${badgeClass}">
                    ${badgeIcon} ${entry.action}
                </span>
            </td>
            <td>${ts}</td>
            <td>${entry.ipAddress || '—'}</td>
        </tr>`;
    }).join('');

    container.innerHTML = `
        <table class="activity-table" aria-label="Recent authentication activity">
            <thead>
                <tr>
                    <th scope="col">Action</th>
                    <th scope="col">Time</th>
                    <th scope="col">IP Address</th>
                </tr>
            </thead>
            <tbody>${rows}</tbody>
        </table>`;
}

// ─────────────────────────────────────────────────────────────
// Page Initialization
// ─────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    const isLoginPage = !!document.getElementById('login-form');
    const isDashboardPage = !!document.getElementById('btn-logout');

    // ── Login / Register page ──
    if (isLoginPage) {
        hideLoadingOverlay();

        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');

        if (loginForm) loginForm.addEventListener('submit', handleLogin);
        if (registerForm) registerForm.addEventListener('submit', handleRegister);
    }

    // ── Dashboard page ──
    if (isDashboardPage) {
        // Guard: if token is missing, redirect (belt-and-suspenders, head script handles the fast case)
        if (!Token.exists()) {
            window.location.replace('index.html');
            return;
        }

        loadDashboard();

        const logoutBtn = document.getElementById('btn-logout');
        if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);
    }
});
