/**
 * Practical 6: Regex Analytics Console
 */

document.addEventListener('DOMContentLoaded', () => {

    const emailInput = document.getElementById('email-input');
    const scanBadge = document.getElementById('scan-badge');
    const scannerStatus = document.getElementById('scanner-status');

    const paragraphInput = document.getElementById('paragraph-input');

    // Extracted Chips Box
    const chipEmailBox = document.getElementById('chip-email-box');
    const chipPhoneBox = document.getElementById('chip-phone-box');
    const chipDateBox = document.getElementById('chip-date-box');

    const tagEmailCount = document.getElementById('tag-email-count');
    const tagPhoneCount = document.getElementById('tag-phone-count');
    const tagDateCount = document.getElementById('tag-date-count');

    // Chart elements
    const cntShort = document.getElementById('cnt-short');
    const cntMedium = document.getElementById('cnt-medium');
    const cntLong = document.getElementById('cnt-long');

    const barShort = document.getElementById('bar-short');
    const barMedium = document.getElementById('bar-medium');
    const barLong = document.getElementById('bar-long');

    // Init executions
    validateEmail();
    analyzeText();

    emailInput.addEventListener('input', validateEmail);
    paragraphInput.addEventListener('input', analyzeText);

    // -------------------------------------------------------------
    // REGEX EMAIL VALIDATION
    // -------------------------------------------------------------
    function validateEmail() {
        const val = emailInput.value.trim();
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (val === "") {
            scanBadge.textContent = "EMPTY";
            scanBadge.style.backgroundColor = "rgba(156, 163, 175, 0.2)";
            scanBadge.style.color = "#9CA3AF";
            scannerStatus.textContent = "Regex Verification: Awaiting input...";
            return;
        }

        const isValid = emailRegex.test(val);

        if (isValid) {
            scanBadge.textContent = "VALID";
            scanBadge.style.backgroundColor = "rgba(16, 185, 129, 0.2)";
            scanBadge.style.color = "#10B981";
            scannerStatus.textContent = "Regex Verification: Email layout confirmed.";
        } else {
            scanBadge.textContent = "INVALID";
            scanBadge.style.backgroundColor = "rgba(239, 68, 68, 0.2)";
            scanBadge.style.color = "#EF4444";
            scannerStatus.textContent = "Regex Verification: Malformed email structure.";
        }
    }

    // -------------------------------------------------------------
    // TEXT MINING & WORD LENGTH DISTRIBUTION
    // -------------------------------------------------------------
    function analyzeText() {
        const text = paragraphInput.value;

        // 1. Regex Extractions
        const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
        const phoneRegex = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}|\b\d{10}\b|\b0\d{2,4}[-.\s]?\d{6,8}\b/g;
        const dateRegex = /\b\d{1,2}[\/\.-]\d{1,2}[\/\.-]\d{2,4}\b/g;

        const foundEmails = text.match(emailRegex) || [];
        const foundPhones = text.match(phoneRegex) || [];
        const foundDates = text.match(dateRegex) || [];

        renderChips(chipEmailBox, tagEmailCount, foundEmails);
        renderChips(chipPhoneBox, tagPhoneCount, foundPhones);
        renderChips(chipDateBox, tagDateCount, foundDates);

        // 2. Word Length Breakdown
        const words = text.trim().split(/\s+/).map(w => w.replace(/[^a-zA-Z0-9]/g, '')).filter(w => w.length > 0);

        let shortCount = 0;
        let mediumCount = 0;
        let longCount = 0;

        words.forEach(w => {
            const len = w.length;
            if (len >= 1 && len <= 3) shortCount++;
            else if (len >= 4 && len <= 6) mediumCount++;
            else if (len >= 7) longCount++;
        });

        cntShort.textContent = shortCount;
        cntMedium.textContent = mediumCount;
        cntLong.textContent = longCount;

        const totalWords = words.length;

        const shortPct = totalWords > 0 ? Math.round((shortCount / totalWords) * 100) : 0;
        const mediumPct = totalWords > 0 ? Math.round((mediumCount / totalWords) * 100) : 0;
        const longPct = totalWords > 0 ? Math.round((longCount / totalWords) * 100) : 0;

        barShort.style.width = `${shortPct}%`;
        barMedium.style.width = `${mediumPct}%`;
        barLong.style.width = `${longPct}%`;
    }

    function renderChips(container, badge, items) {
        container.innerHTML = "";
        badge.textContent = `${items.length} Found`;

        if (items.length === 0) {
            container.innerHTML = '<span class="text-muted" style="font-size:0.7rem;">None detected</span>';
            return;
        }

        // Deduplicate items
        const uniqueItems = [...new Set(items)];

        uniqueItems.forEach(item => {
            const chip = document.createElement('span');
            chip.className = 'chip';
            chip.textContent = item;
            container.appendChild(chip);
        });
    }
});
