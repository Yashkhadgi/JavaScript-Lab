/**
 * Practical 8: Iron Forge Athletic Club - Member Registration Engine
 */

document.addEventListener('DOMContentLoaded', () => {

    const form = document.getElementById('gym-form');
    const submitBtn = document.getElementById('btn-submit');

    const nameInput = document.getElementById('gym-name');
    const ageInput = document.getElementById('gym-age');
    const phoneInput = document.getElementById('gym-phone');
    const emailInput = document.getElementById('gym-email');
    const slotSelect = document.getElementById('gym-slot');

    const tierCards = document.querySelectorAll('.tier-card');

    const recName = document.getElementById('rec-name');
    const recId = document.getElementById('rec-id');
    const recSlot = document.getElementById('rec-slot');
    const badgeTierTxt = document.getElementById('badge-tier-txt');

    const validationStates = {
        name: false,
        age: false,
        phone: false,
        email: false
    };

    let selectedTier = 'standard';

    tierCards.forEach(card => {
        card.addEventListener('click', () => {
            tierCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');

            const radio = card.querySelector('input[type="radio"]');
            if (radio) {
                radio.checked = true;
                selectedTier = radio.value;
            }
        });
    });

    function updateStatusUI(statusId, isValid) {
        const statusSpan = document.getElementById(statusId);
        if (isValid) {
            statusSpan.innerHTML = '<i class="fa-solid fa-check valid"></i>';
        } else {
            statusSpan.innerHTML = '<i class="fa-solid fa-xmark invalid"></i>';
        }
        checkFormValidity();
    }

    function setStatusNeutral(statusId) {
        const statusSpan = document.getElementById(statusId);
        statusSpan.innerHTML = '<i class="fa-solid fa-minus neutral"></i>';
        checkFormValidity();
    }

    function validateName() {
        const val = nameInput.value.trim();
        if (val === "") {
            setStatusNeutral('name-status');
            validationStates.name = false;
            return;
        }
        const isValid = /^[a-zA-Z\s]{3,}$/.test(val);
        validationStates.name = isValid;
        updateStatusUI('name-status', isValid);
    }

    function validateAge() {
        const val = parseInt(ageInput.value.trim());
        if (isNaN(val)) {
            setStatusNeutral('age-status');
            validationStates.age = false;
            return;
        }
        const isValid = val >= 16 && val <= 65;
        validationStates.age = isValid;
        updateStatusUI('age-status', isValid);
    }

    function validatePhone() {
        const val = phoneInput.value.trim();
        if (val === "") {
            setStatusNeutral('phone-status');
            validationStates.phone = false;
            return;
        }
        const isValid = /^\d{10}$/.test(val);
        validationStates.phone = isValid;
        updateStatusUI('phone-status', isValid);
    }

    function validateEmail() {
        const val = emailInput.value.trim();
        if (val === "") {
            setStatusNeutral('email-status');
            validationStates.email = false;
            return;
        }
        const isValid = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(val);
        validationStates.email = isValid;
        updateStatusUI('email-status', isValid);
    }

    function checkFormValidity() {
        const allValid = validationStates.name && validationStates.age && validationStates.phone && validationStates.email;
        if (allValid) {
            submitBtn.removeAttribute('disabled');
            submitBtn.innerHTML = '<i class="fa-solid fa-unlock"></i> Issue Member Access Pass';
        } else {
            submitBtn.setAttribute('disabled', 'true');
            submitBtn.innerHTML = '<i class="fa-solid fa-lock"></i> Verification Pending';
        }
    }

    nameInput.addEventListener('input', validateName);
    ageInput.addEventListener('input', validateAge);
    phoneInput.addEventListener('input', validatePhone);
    emailInput.addEventListener('input', validateEmail);

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        recName.textContent = nameInput.value.trim();
        recSlot.textContent = slotSelect.value.toUpperCase();
        badgeTierTxt.textContent = selectedTier.toUpperCase();

        const randomNum = Math.floor(10000 + Math.random() * 90000);
        recId.textContent = `IF-${randomNum}`;

        alert("💪 Admission Verified! Member Access Pass generated successfully.");
    });
});
