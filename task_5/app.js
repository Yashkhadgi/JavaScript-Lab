// UI Toggling Logic
function toggleView(view) {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const btnLogin = document.getElementById('btn-login');
    const btnRegister = document.getElementById('btn-register');

    if (!loginForm) return; // Not on auth page

    if (view === 'login') {
        loginForm.classList.add('active-form');
        registerForm.classList.remove('active-form');
        btnLogin.classList.add('active');
        btnRegister.classList.remove('active');
    } else {
        registerForm.classList.add('active-form');
        loginForm.classList.remove('active-form');
        btnRegister.classList.add('active');
        btnLogin.classList.remove('active');
    }
}

// Authentication Logic
document.addEventListener('DOMContentLoaded', () => {
    
    // --- Dashboard Page Logic ---
    const welcomeMsg = document.getElementById('welcome-msg');
    const logoutBtn = document.getElementById('logout-btn');

    if (welcomeMsg && logoutBtn) {
        // We are on the dashboard
        let activeUser = null;
        try {
            activeUser = JSON.parse(sessionStorage.getItem('active_session'));
        } catch (e) {
            console.error("Session storage is disabled or unavailable.");
        }
        
        // Double check just in case inline script missed it
        if (!activeUser) {
            window.location.replace('index.html');
            return;
        }

        welcomeMsg.textContent = `Hello, ${activeUser.username}`;

        // Handle Logout
        logoutBtn.addEventListener('click', () => {
            // Remove session
            sessionStorage.removeItem('active_session');
            // Strict redirect replacing history
            window.location.replace('index.html');
        });
    }


    // --- Auth Page Logic ---
    const regForm = document.getElementById('register-form');
    const loginForm = document.getElementById('login-form');

    if (regForm) {
        regForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('reg-username').value.trim();
            const password = document.getElementById('reg-password').value.trim();
            const msgBox = document.getElementById('reg-message');

            if (!username || !password) {
                msgBox.textContent = 'Please fill all fields.';
                return;
            }

            try {
                // Get existing users from "database" (localStorage)
                const users = JSON.parse(localStorage.getItem('registered_users') || '[]');
                
                if (users.find(u => u.username === username)) {
                    msgBox.textContent = 'Username already exists.';
                    msgBox.style.color = 'var(--error)';
                    return;
                }

                // Save new user
                users.push({ username, password });
                localStorage.setItem('registered_users', JSON.stringify(users));

                msgBox.textContent = 'Registration successful! Please login.';
                msgBox.style.color = 'var(--success)';
                regForm.reset();
                
                // Switch to login after a brief moment
                setTimeout(() => toggleView('login'), 1500);
            } catch (err) {
                msgBox.textContent = 'Error: LocalStorage disabled (are you in incognito or using file:// protocol?)';
                msgBox.style.color = 'var(--error)';
            }
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('login-username').value.trim();
            const password = document.getElementById('login-password').value.trim();
            const errorBox = document.getElementById('login-error');

            try {
                const users = JSON.parse(localStorage.getItem('registered_users') || '[]');
                const user = users.find(u => u.username === username && u.password === password);

                if (user) {
                    // Set session storage (active session)
                    sessionStorage.setItem('active_session', JSON.stringify({ username: user.username }));
                    
                    // Strict redirect replacing history
                    window.location.replace('dashboard.html');
                } else {
                    errorBox.textContent = 'Invalid username or password.';
                }
            } catch (err) {
                errorBox.textContent = 'Error: LocalStorage/SessionStorage disabled.';
            }
        });
    }
});
