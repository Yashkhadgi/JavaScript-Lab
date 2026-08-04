/**
 * Practical 9: Native macOS System Settings Engine
 */

document.addEventListener('DOMContentLoaded', () => {

    const htmlEl = document.documentElement;
    const themeCheckbox = document.getElementById('theme-toggle-checkbox');

    const segButtons = document.querySelectorAll('.seg-btn');
    const localInspector = document.getElementById('local-inspector');
    const sessionInspector = document.getElementById('session-inspector');

    const btnClear = document.getElementById('btn-clear');
    const toast = document.getElementById('toast');
    const toastText = document.getElementById('toast-text');

    const KEY_THEME = 'preferredTheme';
    const KEY_FONTSIZE = 'fontSizePref';

    initPreferences();

    function initPreferences() {
        const savedTheme = localStorage.getItem(KEY_THEME) || 'light';
        applyTheme(savedTheme);

        const savedFontSize = sessionStorage.getItem(KEY_FONTSIZE) || 'medium';
        applyFontSize(savedFontSize);

        updateInspector();
    }

    function applyTheme(theme) {
        const isDark = (theme === 'dark');
        htmlEl.classList.toggle('dark', isDark);
        themeCheckbox.checked = isDark;
    }

    themeCheckbox.addEventListener('change', () => {
        const newTheme = themeCheckbox.checked ? 'dark' : 'light';
        applyTheme(newTheme);
        localStorage.setItem(KEY_THEME, newTheme);
        updateInspector();
    });

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

    function updateInspector() {
        const localObj = {};
        for (let i = 0; i < localStorage.length; i++) {
            const k = localStorage.key(i);
            localObj[k] = localStorage.getItem(k);
        }
        localInspector.textContent = Object.keys(localObj).length > 0 ? JSON.stringify(localObj, null, 2) : '{}';

        const sessionObj = {};
        for (let i = 0; i < sessionStorage.length; i++) {
            const k = sessionStorage.key(i);
            sessionObj[k] = sessionStorage.getItem(k);
        }
        sessionInspector.textContent = Object.keys(sessionObj).length > 0 ? JSON.stringify(sessionObj, null, 2) : '{}';
    }

    let toastTimer = null;
    btnClear.addEventListener('click', () => {
        localStorage.removeItem(KEY_THEME);
        sessionStorage.removeItem(KEY_FONTSIZE);

        applyTheme('light');
        applyFontSize('medium');
        updateInspector();

        showToast('Preferences reset to default.');
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
