/**
 * Practical 4: Palindrome Phrase Analyzer Engine (Minimum 3 Words Logic)
 */

document.addEventListener('DOMContentLoaded', () => {

    const palindromeInput = document.getElementById('palindrome-input');
    const wordCountBadge = document.getElementById('word-count-badge');
    const presetChips = document.querySelectorAll('.preset-chip');

    const statusBanner = document.getElementById('status-banner');
    const statusIcon = document.getElementById('status-icon');
    const statusTitle = document.getElementById('status-title');
    const statusSub = document.getElementById('status-sub');
    const symmetryBadge = document.getElementById('symmetry-badge');

    const forwardNodesBox = document.getElementById('forward-nodes-box');
    const reverseNodesBox = document.getElementById('reverse-nodes-box');
    const connectorsBox = document.getElementById('connectors-box');

    const valRawLen = document.getElementById('val-raw-len');
    const valCleanLen = document.getElementById('val-clean-len');
    const valWordCount = document.getElementById('val-word-count');
    const valCleanStr = document.getElementById('val-clean-str');

    // Initial evaluation
    analyzePhrase();

    palindromeInput.addEventListener('input', analyzePhrase);

    presetChips.forEach(chip => {
        chip.addEventListener('click', () => {
            palindromeInput.value = chip.getAttribute('data-text');
            analyzePhrase();
        });
    });

    function analyzePhrase() {
        const rawText = palindromeInput.value;
        const words = rawText.trim().split(/\s+/).filter(w => w.length > 0);
        const wordCount = words.length;

        valRawLen.textContent = rawText.length;
        valWordCount.textContent = `${wordCount} Word${wordCount !== 1 ? 's' : ''}`;

        // Minimum 3 words verification logic
        if (wordCount < 3) {
            wordCountBadge.textContent = `${wordCount} / 3 Words`;
            wordCountBadge.className = "word-counter-badge";

            statusBanner.className = "status-banner warning";
            statusIcon.className = "fa-solid fa-triangle-exclamation status-icon";
            statusTitle.textContent = "Minimum 3 Words Required";
            statusSub.textContent = `Current input contains ${wordCount} word${wordCount !== 1 ? 's' : ''}. Please enter a phrase with at least 3 words (e.g. 'Never odd or even').`;

            symmetryBadge.textContent = "--";
            valCleanLen.textContent = "0";
            valCleanStr.textContent = "(Requires 3+ words)";

            forwardNodesBox.innerHTML = '<span style="color:#94A3B8; font-size:0.75rem;">Awaiting 3-word phrase...</span>';
            reverseNodesBox.innerHTML = '';
            connectorsBox.innerHTML = '';
            return;
        }

        // 3+ words requirement met
        wordCountBadge.textContent = `${wordCount} Words`;
        wordCountBadge.className = "word-counter-badge valid";

        const cleaned = rawText.toLowerCase().replace(/[^a-z0-9]/g, '');
        const reversed = cleaned.split('').reverse().join('');

        valCleanLen.textContent = cleaned.length;
        valCleanStr.textContent = cleaned || "(empty)";

        forwardNodesBox.innerHTML = "";
        reverseNodesBox.innerHTML = "";
        connectorsBox.innerHTML = "";

        let matchCount = 0;
        const total = cleaned.length;

        for (let i = 0; i < total; i++) {
            const charF = cleaned[i];
            const charR = reversed[i];
            const isMatch = (charF === charR);

            if (isMatch) matchCount++;

            // Forward Node
            const nodeF = document.createElement('div');
            nodeF.className = `char-node ${isMatch ? 'match' : 'mismatch'}`;
            nodeF.textContent = charF.toUpperCase();
            forwardNodesBox.appendChild(nodeF);

            // Connector
            const conn = document.createElement('div');
            conn.className = `connector-item ${isMatch ? 'match' : 'mismatch'}`;
            conn.innerHTML = isMatch ? '<i class="fa-solid fa-check"></i>' : '<i class="fa-solid fa-xmark"></i>';
            connectorsBox.appendChild(conn);

            // Reverse Node
            const nodeR = document.createElement('div');
            nodeR.className = `char-node ${isMatch ? 'match' : 'mismatch'}`;
            nodeR.textContent = charR.toUpperCase();
            reverseNodesBox.appendChild(nodeR);
        }

        const pct = Math.round((matchCount / total) * 100);
        const isPalindrome = (cleaned === reversed);

        symmetryBadge.textContent = `${pct}%`;

        if (isPalindrome) {
            statusBanner.className = "status-banner match";
            statusIcon.className = "fa-solid fa-circle-check status-icon";
            statusTitle.textContent = "Palindrome Confirmed";
            statusSub.textContent = `Valid 3+ word phrase! Forward and reversed character sequences exhibit 100% symmetry.`;
        } else {
            statusBanner.className = "status-banner mismatch";
            statusIcon.className = "fa-solid fa-circle-xmark status-icon";
            statusTitle.textContent = "Not a Palindrome";
            statusSub.textContent = `Asymmetry detected across ${total - matchCount} character position(s) in this ${wordCount}-word phrase.`;
        }
    }
});
