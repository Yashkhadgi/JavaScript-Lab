/**
 * Practical 6: Light Studio Telemetry & Custom Regex Extractor
 */

document.addEventListener('DOMContentLoaded', () => {

    const emailInput = document.getElementById('email-input');
    const verifyBadge = document.getElementById('verify-badge');
    const emailStatusTag = document.getElementById('email-status-tag');

    const customRegexInput = document.getElementById('custom-regex-input');
    const paragraphInput = document.getElementById('paragraph-input');

    const boxCustomChips = document.getElementById('box-custom-chips');
    const boxEmailChips = document.getElementById('box-email-chips');
    const boxPhoneChips = document.getElementById('box-phone-chips');
    const boxDateChips = document.getElementById('box-date-chips');

    const cntCustom = document.getElementById('cnt-custom');
    const cntEmail = document.getElementById('cnt-email');
    const cntPhone = document.getElementById('cnt-phone');
    const cntDate = document.getElementById('cnt-date');

    const cntShort = document.getElementById('cnt-short');
    const cntMedium = document.getElementById('cnt-medium');
    const cntLong = document.getElementById('cnt-long');

    const barShort = document.getElementById('bar-short');
    const barMedium = document.getElementById('bar-medium');
    const barLong = document.getElementById('bar-long');

    // Run initial scans
    validateEmail();
    analyzeText();

    emailInput.addEventListener('input', validateEmail);
    paragraphInput.addEventListener('input', analyzeText);
    customRegexInput.addEventListener('input', analyzeText);

    function validateEmail() {
        const val = emailInput.value.trim();
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (val === "") {
            verifyBadge.textContent = "EMPTY";
            verifyBadge.style.backgroundColor = "#F1F5F9";
            verifyBadge.style.color = "#94A3B8";

            emailStatusTag.className = "status-tag";
            emailStatusTag.textContent = "Awaiting Email Target";
            emailStatusTag.style.backgroundColor = "#F1F5F9";
            emailStatusTag.style.color = "#94A3B8";
            return;
        }

        const isValid = emailRegex.test(val);

        if (isValid) {
            verifyBadge.textContent = "VALID";
            verifyBadge.style.backgroundColor = "#ECFDF5";
            verifyBadge.style.color = "#10B981";

            emailStatusTag.className = "status-tag tag-emerald";
            emailStatusTag.textContent = "Email Format Valid";
        } else {
            verifyBadge.textContent = "INVALID";
            verifyBadge.style.backgroundColor = "#FEF2F2";
            verifyBadge.style.color = "#EF4444";

            emailStatusTag.className = "status-tag tag-red";
            emailStatusTag.textContent = "Malformed Email Format";
        }
    }

    function analyzeText() {
        const text = paragraphInput.value;

        // Custom Regex Extraction
        let foundCustom = [];
        const patternVal = customRegexInput.value.trim();
        if (patternVal !== "") {
            try {
                const userRegex = new RegExp(patternVal, 'g');
                foundCustom = text.match(userRegex) || [];
            } catch(e) {
                foundCustom = ["Invalid Regex Pattern"];
            }
        }

        // Built-in Extractions
        const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
        const phoneRegex = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}|\b\d{10}\b|\b0\d{2,4}[-.\s]?\d{6,8}\b/g;
        const dateRegex = /\b\d{1,2}[\/\.-]\d{1,2}[\/\.-]\d{2,4}\b/g;

        const foundEmails = text.match(emailRegex) || [];
        const foundPhones = text.match(phoneRegex) || [];
        const foundDates = text.match(dateRegex) || [];

        renderChips(boxCustomChips, cntCustom, foundCustom, true);
        renderChips(boxEmailChips, cntEmail, foundEmails, false);
        renderChips(boxPhoneChips, cntPhone, foundPhones, false);
        renderChips(boxDateChips, cntDate, foundDates, false);

        // Word Length Distribution
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

    function renderChips(container, counter, items, isCustom) {
        container.innerHTML = "";
        counter.textContent = `${items.length} Found`;

        if (items.length === 0) {
            container.innerHTML = '<span style="color:#94A3B8; font-size:0.7rem;">None detected</span>';
            return;
        }

        const uniqueItems = [...new Set(items)];

        uniqueItems.forEach(item => {
            const chip = document.createElement('span');
            chip.className = `pastel-chip ${isCustom ? 'custom-chip' : ''}`;
            chip.textContent = item;
            container.appendChild(chip);
        });
    }
});
