/**
 * Practical 4: Cybernetic Palindrome Analyzer
 */

document.addEventListener('DOMContentLoaded', () => {

    const palindromeInput = document.getElementById('palindrome-input');
    const btnAnalyze = document.getElementById('btn-analyze');
    const presetButtons = document.querySelectorAll('.btn-preset');

    // Vector grid elements
    const forwardCharRow = document.getElementById('forward-char-row');
    const reverseCharRow = document.getElementById('reverse-char-row');
    const vectorBridgesRow = document.getElementById('vector-bridges-row');

    // Telemetry & Hologram elements
    const statusHologram = document.getElementById('status-hologram');
    const statusIcon = document.getElementById('status-icon');
    const statusTitle = document.getElementById('status-title');
    const statusSub = document.getElementById('status-sub');

    const metricRawLen = document.getElementById('metric-raw-len');
    const metricCleanLen = document.getElementById('metric-clean-len');
    const metricSymmetry = document.getElementById('metric-symmetry');
    const metricClosure = document.getElementById('metric-closure');

    const cleanedStringVal = document.getElementById('cleaned-string-val');
    const reversedStringVal = document.getElementById('reversed-string-val');

    // Analyze on launch
    analyzeString();

    btnAnalyze.addEventListener('click', analyzeString);
    palindromeInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') analyzeString();
    });

    presetButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            palindromeInput.value = btn.getAttribute('data-text');
            analyzeString();
        });
    });

    function analyzeString() {
        const rawText = palindromeInput.value;
        const cleaned = rawText.toLowerCase().replace(/[^a-z0-9]/g, '');
        const reversed = cleaned.split('').reverse().join('');

        // Raw metrics
        metricRawLen.textContent = rawText.length;
        metricCleanLen.textContent = cleaned.length;
        cleanedStringVal.textContent = cleaned || "(empty)";
        reversedStringVal.textContent = reversed || "(empty)";

        if (cleaned.length === 0) {
            forwardCharRow.innerHTML = '<span class="text-muted">Awaiting input...</span>';
            reverseCharRow.innerHTML = '';
            vectorBridgesRow.innerHTML = '';
            
            statusHologram.className = 'status-hologram-card';
            statusIcon.className = 'fa-solid fa-triangle-exclamation status-icon';
            statusTitle.textContent = 'AWAITING INPUT';
            statusSub.textContent = 'Enter text above to initialize vector inspection.';
            
            metricSymmetry.textContent = '0%';
            metricClosure.textContent = 'FALSE';
            return;
        }

        // Render Character Rows & Bridges
        forwardCharRow.innerHTML = "";
        reverseCharRow.innerHTML = "";
        vectorBridgesRow.innerHTML = "";

        let matchCount = 0;
        const total = cleaned.length;

        for (let i = 0; i < total; i++) {
            const charF = cleaned[i];
            const charR = reversed[i];
            const isMatch = (charF === charR);

            if (isMatch) matchCount++;

            // Forward Box
            const boxF = document.createElement('div');
            boxF.className = `char-box ${isMatch ? 'match' : 'mismatch'}`;
            boxF.textContent = charF.toUpperCase();
            forwardCharRow.appendChild(boxF);

            // Bridge icon
            const bridge = document.createElement('div');
            bridge.className = `bridge-icon ${isMatch ? 'match' : 'mismatch'}`;
            bridge.innerHTML = isMatch ? '<i class="fa-solid fa-check"></i>' : '<i class="fa-solid fa-xmark"></i>';
            vectorBridgesRow.appendChild(bridge);

            // Reverse Box
            const boxR = document.createElement('div');
            boxR.className = `char-box ${isMatch ? 'match' : 'mismatch'}`;
            boxR.textContent = charR.toUpperCase();
            reverseCharRow.appendChild(boxR);
        }

        const symmetryPct = Math.round((matchCount / total) * 100);
        const isPalindrome = (cleaned === reversed);

        metricSymmetry.textContent = `${symmetryPct}%`;
        metricClosure.textContent = isPalindrome ? 'TRUE' : 'FALSE';

        if (isPalindrome) {
            statusHologram.className = 'status-hologram-card is-palindrome';
            statusIcon.className = 'fa-solid fa-shield-halved status-icon';
            statusTitle.textContent = 'PALINDROME CONFIRMED';
            statusSub.textContent = 'Forward and reversed alphanumeric sequences are perfectly symmetrical.';
        } else {
            statusHologram.className = 'status-hologram-card not-palindrome';
            statusIcon.className = 'fa-solid fa-triangle-exclamation status-icon';
            statusTitle.textContent = 'PALINDROME MISMATCH';
            statusSub.textContent = `Asymmetry detected across ${total - matchCount} character position(s).`;
        }
    }
});
