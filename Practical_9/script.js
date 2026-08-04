/**
 * Practical 9: Web Storage API (localStorage vs sessionStorage)
 */

document.addEventListener('DOMContentLoaded', () => {

    const htmlEl = document.documentElement;
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const toggleIcon = document.getElementById('toggle-icon');

    const segButtons = document.querySelectorAll('.seg-btn');
    const localInspector = document.getElementById('local-inspector');
    const sessionInspector = document.getElementById('session-inspector');

    const btnClear = document.getElementById('btn-clear');
    const toast = document.getElementById('toast');
    const toastText = document.getElementById('toast-text');

    const KEY_THEME = 'preferredTheme';
    const KEY_FONTSIZE = 'fontSizePref';

    // 1. INITIALIZE PREFERENCES
    initPreferences();

    function initPreferences() {
        const savedTheme = localStorage.getItem(KEY_THEME) || 'light';
        applyTheme(savedTheme);

        const savedFontSize = sessionStorage.getItem(KEY_FONTSIZE) || 'medium';
        applyFontSize(savedFontSize);

        updateInspector();
    }

    // 2. THEME CONTROLLER (localStorage)
    function applyTheme(theme) {
        const isDark = (theme === 'dark');
        htmlEl.classList.toggle('dark', isDark);
        themeToggleBtn.setAttribute('aria-checked', isDark ? 'true' : 'false');
        toggleIcon.className = `fa-solid ${isDark ? 'fa-moon' : 'fa-sun'} thumb-icon`;
    }

    themeToggleBtn.addEventListener('click', () => {
        const isDark = themeToggleBtn.getAttribute('aria-checked') === 'true';
        const newTheme = isDark ? 'light' : 'dark';

        applyTheme(newTheme);
        localStorage.setItem(KEY_THEME, newTheme);
        updateInspector();
    });

    // 3. FONT SIZE CONTROLLER (sessionStorage)
    function applyFontSize(size) {
        document.body.classList.remove('font-small', 'font-medium', 'font-large');
        document.body.classList.add(`font-${size}`);

        segButtons.forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-size') === size);
        });
    }

    segButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const size = btn.getAttribute('data-size');
            applyFontSize(size);
            sessionStorage.setItem(KEY_FONTSIZE, size);
            updateInspector();
        });
    });

    // 4. LIVE STORAGE INSPECTOR RENDERER
    function updateInspector() {
        const localObj = {};
        for (let i = 0; i < localStorage.length; i++) {
            const k = localStorage.key(i);
            localObj[k] = localStorage.getItem(k);
        }
        localInspector.textContent = Object.keys(localObj).length > 0 ? JSON.stringify(localObj, null, 2) : '(empty)';

        const sessionObj = {};
        for (let i = 0; i < sessionStorage.length; i++) {
            const k = sessionStorage.key(i);
            sessionObj[k] = sessionStorage.getItem(k);
        }
        sessionInspector.textContent = Object.keys(sessionObj).length > 0 ? JSON.stringify(sessionObj, null, 2) : '(empty)';
    }

    // 5. CLEAR PREFERENCES & TOAST
    let toastTimer = null;
    btnClear.addEventListener('click', () => {
        localStorage.removeItem(KEY_THEME);
        sessionStorage.removeItem(KEY_FONTSIZE);

        applyTheme('light');
        applyFontSize('medium');
        updateInspector();

        showToast('Preferences cleared. Defaults restored.');
    });

    function showToast(msg) {
        toastText.textContent = msg;
        toast.classList.add('show');

        if (toastTimer) clearTimeout(toastTimer);
        toastTimer = setTimeout(() => {
            toast.classList.remove('show');
        }, 2500);
    }
});
