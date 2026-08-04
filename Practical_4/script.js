/**
 * Practical 4: Cybernetic Palindrome HUD Engine
 */

document.addEventListener('DOMContentLoaded', () => {

    const palindromeInput = document.getElementById('palindrome-input');
    const btnAnalyze = document.getElementById('btn-analyze');
    const hudPresets = document.querySelectorAll('.hud-preset');

    const forwardNodesBox = document.getElementById('forward-nodes-box');
    const reverseNodesBox = document.getElementById('reverse-nodes-box');
    const nodesBridgesBox = document.getElementById('nodes-bridges-box');

    const hologramBanner = document.getElementById('hologram-banner');
    const holoIcon = document.getElementById('holo-icon');
    const holoTitle = document.getElementById('holo-title');
    const holoSub = document.getElementById('holo-sub');

    const valRawLen = document.getElementById('val-raw-len');
    const valCleanLen = document.getElementById('val-clean-len');
    const valSymmetry = document.getElementById('val-symmetry');
    const valClosure = document.getElementById('val-closure');

    const strClean = document.getElementById('str-clean');
    const strReverse = document.getElementById('str-reverse');

    // Run initial scan
    analyzeMatrix();

    btnAnalyze.addEventListener('click', analyzeMatrix);
    palindromeInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') analyzeMatrix();
    });

    hudPresets.forEach(preset => {
        preset.addEventListener('click', () => {
            palindromeInput.value = preset.getAttribute('data-text');
            analyzeMatrix();
        });
    });

    function analyzeMatrix() {
        const rawText = palindromeInput.value;
        const cleaned = rawText.toLowerCase().replace(/[^a-z0-9]/g, '');
        const reversed = cleaned.split('').reverse().join('');

        valRawLen.textContent = rawText.length;
        valCleanLen.textContent = cleaned.length;
        strClean.textContent = cleaned || "(empty)";
        strReverse.textContent = reversed || "(empty)";

        if (cleaned.length === 0) {
            forwardNodesBox.innerHTML = '<span class="text-muted">AWAITING SEQUENCE...</span>';
            reverseNodesBox.innerHTML = '';
            nodesBridgesBox.innerHTML = '';

            hologramBanner.className = 'hologram-banner';
            holoIcon.className = 'fa-solid fa-triangle-exclamation hologram-icon';
            holoTitle.textContent = 'AWAITING SEQUENCE';
            holoSub.textContent = 'Input text above to initiate quantum node analysis.';

            valSymmetry.textContent = '0%';
            valClosure.textContent = 'FALSE';
            return;
        }

        forwardNodesBox.innerHTML = "";
        reverseNodesBox.innerHTML = "";
        nodesBridgesBox.innerHTML = "";

        let matchCount = 0;
        const total = cleaned.length;

        for (let i = 0; i < total; i++) {
            const charF = cleaned[i];
            const charR = reversed[i];
            const isMatch = (charF === charR);

            if (isMatch) matchCount++;

            // Forward Node
            const nodeF = document.createElement('div');
            nodeF.className = `cyber-node ${isMatch ? 'node-match' : 'node-mismatch'}`;
            nodeF.textContent = charF.toUpperCase();
            forwardNodesBox.appendChild(nodeF);

            // Vector Bridge Slot
            const bridge = document.createElement('div');
            bridge.className = `laser-slot-bridge ${isMatch ? 'match' : 'mismatch'}`;
            bridge.innerHTML = isMatch ? '<i class="fa-solid fa-check"></i>' : '<i class="fa-solid fa-xmark"></i>';
            nodesBridgesBox.appendChild(bridge);

            // Reverse Node
            const nodeR = document.createElement('div');
            nodeR.className = `cyber-node ${isMatch ? 'node-match' : 'node-mismatch'}`;
            nodeR.textContent = charR.toUpperCase();
            reverseNodesBox.appendChild(nodeR);
        }

        const symmetryPct = Math.round((matchCount / total) * 100);
        const isPalindrome = (cleaned === reversed);

        valSymmetry.textContent = `${symmetryPct}%`;
        valClosure.textContent = isPalindrome ? 'TRUE' : 'FALSE';

        if (isPalindrome) {
            hologramBanner.className = 'hologram-banner is-palindrome';
            holoIcon.className = 'fa-solid fa-shield-halved hologram-icon';
            holoTitle.textContent = 'PALINDROME CONFIRMED';
            holoSub.textContent = 'Forward and reversed quantum node sequences exhibit 100% closure.';
        } else {
            hologramBanner.className = 'hologram-banner not-palindrome';
            holoIcon.className = 'fa-solid fa-triangle-exclamation hologram-icon';
            holoTitle.textContent = 'PALINDROME MISMATCH';
            holoSub.textContent = `Asymmetry detected across ${total - matchCount} character position(s).`;
        }
    }
});
