/**
 * Task 1: Secure Email Authentication Engine
 */

document.addEventListener('DOMContentLoaded', () => {

    const loginStage = document.getElementById('login-stage');
    const successStage = document.getElementById('success-stage');
    const loginForm = document.getElementById('login-form');

    const inputEmail = document.getElementById('input-email');
    const inputPassword = document.getElementById('input-password');
    const btnTogglePwd = document.getElementById('btn-toggle-pwd');
    const btnDemoCreds = document.getElementById('btn-demo-creds');
    const btnLoginSubmit = document.getElementById('btn-login-submit');

    const emailStatusIcon = document.getElementById('email-status-icon');
    const pwdStatusIcon = document.getElementById('pwd-status-icon');

    const groupEmail = document.getElementById('group-email');
    const groupPassword = document.getElementById('group-password');

    const pwdStrengthFill = document.getElementById('pwd-strength-fill');
    const pwdStrengthLbl = document.getElementById('pwd-strength-lbl');

    const toastBanner = document.getElementById('toast-banner');
    const toastMsg = document.getElementById('toast-msg');

    const displayUserEmail = document.getElementById('display-user-email');
    const displayLoginTime = document.getElementById('display-login-time');
    const displaySecToken = document.getElementById('display-sec-token');

    const btnSignOut = document.getElementById('btn-sign-out');

    // Run initial real-time inspection
    inspectInputs();

    // Toggle Password Visibility
    if (btnTogglePwd) {
        btnTogglePwd.addEventListener('click', () => {
            if (inputPassword.type === 'password') {
                inputPassword.type = 'text';
                btnTogglePwd.textContent = 'Hide';
            } else {
                inputPassword.type = 'password';
                btnTogglePwd.textContent = 'Show';
            }
        });
    }

    // Fill Demo Creds
    if (btnDemoCreds) {
        btnDemoCreds.addEventListener('click', () => {
            inputEmail.value = btnDemoCreds.getAttribute('data-email') || "yash.khadge@symbiosis.edu";
            inputPassword.value = btnDemoCreds.getAttribute('data-pwd') || "symbiosis2026";
            inspectInputs();
            showToast("Demo credentials autofilled!");
        });
    }

    // Real-time input validation listeners
    inputEmail.addEventListener('input', inspectInputs);
    inputPassword.addEventListener('input', inspectInputs);

    function inspectInputs() {
        const emailVal = inputEmail.value.trim();
        const pwdVal = inputPassword.value.trim();
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        // Email status
        if (emailRegex.test(emailVal)) {
            emailStatusIcon.classList.add('active');
            groupEmail.classList.remove('has-error');
        } else {
            emailStatusIcon.classList.remove('active');
        }

        // Password status
        if (pwdVal.length >= 4) {
            pwdStatusIcon.classList.add('active');
            groupPassword.classList.remove('has-error');
        } else {
            pwdStatusIcon.classList.remove('active');
        }

        // Strength Bar
        let strengthPct = 0;
        let strengthColor = "#F43F5E";
        let strengthText = "Strength: Weak";

        if (pwdVal.length === 0) {
            strengthPct = 0;
            strengthText = "Strength: None";
        } else if (pwdVal.length < 6) {
            strengthPct = 33;
            strengthColor = "#F43F5E";
            strengthText = "Strength: Weak";
        } else if (pwdVal.length < 10) {
            strengthPct = 66;
            strengthColor = "#F59E0B";
            strengthText = "Strength: Medium";
        } else {
            strengthPct = 100;
            strengthColor = "#10B981";
            strengthText = "Strength: Strong";
        }

        pwdStrengthFill.style.width = `${strengthPct}%`;
        pwdStrengthFill.style.backgroundColor = strengthColor;
        pwdStrengthLbl.textContent = strengthText;
    }

    // Main Authentication Action
    function executeLogin() {
        const emailVal = inputEmail.value.trim();
        const pwdVal = inputPassword.value.trim();

        let isValid = true;

        if (!emailVal || !emailVal.includes('@')) {
            groupEmail.classList.add('has-error');
            isValid = false;
        }

        if (!pwdVal || pwdVal.length < 4) {
            groupPassword.classList.add('has-error');
            isValid = false;
        }

        if (!isValid) {
            showToast("Please enter a valid email and password.", true);
            return;
        }

        // Populate User Info
        displayUserEmail.textContent = emailVal;

        const now = new Date();
        const timeStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + 
                        ' • ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        displayLoginTime.textContent = timeStr.toUpperCase();
        displaySecToken.textContent = `AUTH-${Math.floor(100000 + Math.random() * 900000)}-TOKEN`;

        // Direct Style & Class View Switching (100% RELIABLE)
        loginStage.style.display = 'none';
        loginStage.classList.add('hidden');

        successStage.style.display = 'flex';
        successStage.classList.remove('hidden');

        showToast(`Authentication Successful! Welcome back.`);
    }

    // Attach Click and Form Submit Listeners
    if (btnLoginSubmit) {
        btnLoginSubmit.addEventListener('click', (e) => {
            e.preventDefault();
            executeLogin();
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            executeLogin();
        });
    }

    // Sign Out Handler
    if (btnSignOut) {
        btnSignOut.addEventListener('click', () => {
            inputPassword.value = "";
            inspectInputs();

            successStage.style.display = 'none';
            successStage.classList.add('hidden');

            loginStage.style.display = 'flex';
            loginStage.classList.remove('hidden');

            showToast("Signed out of session.");
        });
    }

    function showToast(msg, isError = false) {
        if (!toastBanner) return;
        toastMsg.textContent = msg;
        toastBanner.style.borderColor = isError ? "#F43F5E" : "#10B981";
        toastBanner.classList.add('show');
        setTimeout(() => {
            toastBanner.classList.remove('show');
        }, 3200);
    }
});
