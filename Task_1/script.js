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
    const chipDemo = document.querySelector('.chip-demo');

    const emailErrorMsg = document.getElementById('email-error-msg');
    const pwdErrorMsg = document.getElementById('pwd-error-msg');

    const displayUserEmail = document.getElementById('display-user-email');
    const displayLoginTime = document.getElementById('display-login-time');
    const displaySecToken = document.getElementById('display-sec-token');

    const btnSignOut = document.getElementById('btn-sign-out');

    // Toggle Password Visibility
    btnTogglePwd.addEventListener('click', () => {
        if (inputPassword.type === 'password') {
            inputPassword.type = 'text';
            btnTogglePwd.textContent = 'Hide';
        } else {
            inputPassword.type = 'password';
            btnTogglePwd.textContent = 'Show';
        }
    });

    // Fill Demo Creds
    chipDemo.addEventListener('click', () => {
        inputEmail.value = chipDemo.getAttribute('data-email');
        inputPassword.value = chipDemo.getAttribute('data-pwd');
        clearErrors();
    });

    // Real-time input cleaning
    inputEmail.addEventListener('input', clearErrors);
    inputPassword.addEventListener('input', clearErrors);

    function clearErrors() {
        inputEmail.closest('.form-group').classList.remove('has-error');
        inputPassword.closest('.form-group').classList.remove('has-error');
    }

    // Submit Handler
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const emailVal = inputEmail.value.trim();
        const pwdVal = inputPassword.value.trim();
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        let isValid = true;

        if (!emailRegex.test(emailVal)) {
            inputEmail.closest('.form-group').classList.add('has-error');
            isValid = false;
        }

        if (pwdVal.length < 6) {
            inputPassword.closest('.form-group').classList.add('has-error');
            isValid = false;
        }

        if (!isValid) return;

        // Successful Authentication!
        displayUserEmail.textContent = emailVal;

        const now = new Date();
        const timeStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'SHORT', year: 'numeric' }) + 
                        ' • ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        displayLoginTime.textContent = timeStr.toUpperCase();
        displaySecToken.textContent = `AUTH-${Math.floor(10000 + Math.random() * 90000)}-TOKEN`;

        // Switch Stages
        loginStage.classList.add('hidden');
        successStage.classList.remove('hidden');
    });

    // Sign Out Handler
    btnSignOut.addEventListener('click', () => {
        inputPassword.value = "";
        clearErrors();
        successStage.classList.add('hidden');
        loginStage.classList.remove('hidden');
    });
});
