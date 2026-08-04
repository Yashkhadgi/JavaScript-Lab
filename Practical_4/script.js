/**
 * Practical 4: Raycast Utility - Palindrome Analyzer Engine
 */

document.addEventListener('DOMContentLoaded', () => {

    const palindromeInput = document.getElementById('palindrome-input');
    const presetChips = document.querySelectorAll('.preset-chip');

    const forwardBoxContainer = document.getElementById('forward-box-container');
    const reverseBoxContainer = document.getElementById('reverse-box-container');
    const connectorRowContainer = document.getElementById('connector-row-container');

    const statusBanner = document.getElementById('status-banner');
    const statusIcon = document.getElementById('status-icon');
    const statusTitle = document.getElementById('status-title');
    const statusSub = document.getElementById('status-sub');
    const symmetryPct = document.getElementById('symmetry-pct');

    const valRawLen = document.getElementById('val-raw-len');
    const valCleanLen = document.getElementById('val-clean-len');
    const valCleanStr = document.getElementById('val-clean-str');

    // Run initial analysis
    analyzeString();

    palindromeInput.addEventListener('input', analyzeString);

    presetChips.forEach(chip => {
        chip.addEventListener('click', () => {
            palindromeInput.value = chip.getAttribute('data-text');
            analyzeString();
        });
    });

    function analyzeString() {
        const rawText = palindromeInput.value;
        const cleaned = rawText.toLowerCase().replace(/[^a-z0-9]/g, '');
        const reversed = cleaned.split('').reverse().join('');

        valRawLen.textContent = rawText.length;
        valCleanLen.textContent = cleaned.length;
        valCleanStr.textContent = cleaned || "(empty)";

        if (cleaned.length === 0) {
            forwardBoxContainer.innerHTML = '<span style="color:#888; font-size:0.75rem;">Type text above...</span>';
            reverseBoxContainer.innerHTML = '';
            connectorRowContainer.innerHTML = '';

            statusBanner.className = "status-banner";
            statusIcon.className = "fa-solid fa-circle-info status-icon";
            statusTitle.textContent = "Awaiting Input";
            statusSub.textContent = "Enter a string sequence above to initiate character symmetry analysis.";
            symmetryPct.textContent = "0%";
            return;
        }

        forwardBoxContainer.innerHTML = "";
        reverseBoxContainer.innerHTML = "";
        connectorRowContainer.innerHTML = "";

        let matchCount = 0;
        const total = cleaned.length;

        for (let i = 0; i < total; i++) {
            const charF = cleaned[i];
            const charR = reversed[i];
            const isMatch = (charF === charR);

            if (isMatch) matchCount++;

            // Forward Box
            const boxF = document.createElement('div');
            boxF.className = `char-card-node ${isMatch ? 'match' : 'mismatch'}`;
            boxF.textContent = charF.toUpperCase();
            forwardBoxContainer.appendChild(boxF);

            // Connector Slot
            const conn = document.createElement('div');
            conn.className = `connector-slot ${isMatch ? 'match' : 'mismatch'}`;
            conn.innerHTML = isMatch ? '<i class="fa-solid fa-check"></i>' : '<i class="fa-solid fa-xmark"></i>';
            connectorRowContainer.appendChild(conn);

            // Reverse Box
            const boxR = document.createElement('div');
            boxR.className = `char-card-node ${isMatch ? 'match' : 'mismatch'}`;
            boxR.textContent = charR.toUpperCase();
            reverseBoxContainer.appendChild(boxR);
        }

        const pct = Math.round((matchCount / total) * 100);
        const isPalindrome = (cleaned === reversed);

        symmetryPct.textContent = `${pct}%`;

        if (isPalindrome) {
            statusBanner.className = "status-banner is-palindrome";
            statusIcon.className = "fa-solid fa-circle-check status-icon";
            statusTitle.textContent = "Palindrome Confirmed";
            statusSub.textContent = "Forward and reversed alphanumeric sequences are 100% symmetrical.";
        } else {
            statusBanner.className = "status-banner not-palindrome";
            statusIcon.className = "fa-solid fa-circle-xmark status-icon";
            statusTitle.textContent = "Not a Palindrome";
            statusSub.textContent = `Asymmetry detected across ${total - matchCount} character position(s).`;
        }
    }
});
