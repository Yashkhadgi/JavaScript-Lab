/**
 * Practical 8: Gym Admission & 3D Member Badge Compiler
 */

document.addEventListener('DOMContentLoaded', () => {

    const form = document.getElementById('gym-form');
    const submitBtn = document.getElementById('btn-submit');

    const nameInput = document.getElementById('gym-name');
    const ageInput = document.getElementById('gym-age');
    const phoneInput = document.getElementById('gym-phone');
    const emailInput = document.getElementById('gym-email');
    const planSelect = document.getElementById('gym-plan');
    const slotSelect = document.getElementById('gym-slot');

    // Perks items
    const perkLocker = document.getElementById('perk-locker');
    const perkTrainer = document.getElementById('perk-trainer');
    const perkSpa = document.getElementById('perk-spa');

    // Badge elements
    const recName = document.getElementById('rec-name');
    const recId = document.getElementById('rec-id');
    const recSlot = document.getElementById('rec-slot');
    const badgePlanTxt = document.getElementById('badge-plan-txt');
    
    const badgeCard = document.getElementById('badge-card');
    const badgeInner = badgeCard.querySelector('.badge-card-inner');

    const validationStates = {
        name: false,
        age: false,
        phone: false,
        email: false
    };

    // -------------------------------------------------------------
    // PERKS AUTO TOGGLE ROUTINE
    // -------------------------------------------------------------
    function updatePerksList() {
        const plan = planSelect.value;

        perkLocker.className = "perk-row";
        perkLocker.querySelector('i').className = "fa-solid fa-circle-xmark unchecked";
        perkTrainer.className = "perk-row";
        perkTrainer.querySelector('i').className = "fa-solid fa-circle-xmark unchecked";
        perkSpa.className = "perk-row";
        perkSpa.querySelector('i').className = "fa-solid fa-circle-xmark unchecked";

        if (plan === 'standard') {
            perkLocker.classList.add('active');
            perkLocker.querySelector('i').className = "fa-solid fa-circle-check checked";
        } else if (plan === 'premium') {
            perkLocker.classList.add('active');
            perkLocker.querySelector('i').className = "fa-solid fa-circle-check checked";
            perkTrainer.classList.add('active');
            perkTrainer.querySelector('i').className = "fa-solid fa-circle-check checked";
            perkSpa.classList.add('active');
            perkSpa.querySelector('i').className = "fa-solid fa-circle-check checked";
        }
    }

    planSelect.addEventListener('change', updatePerksList);
    updatePerksList(); // Init

    // -------------------------------------------------------------
    // FORM VALIDATIONS
    // -------------------------------------------------------------
    function updateStatusUI(statusId, isValid) {
        const statusSpan = document.getElementById(statusId);
        if (isValid) {
            statusSpan.innerHTML = '<i class="fa-solid fa-circle-check valid"></i>';
        } else {
            statusSpan.innerHTML = '<i class="fa-solid fa-circle-xmark invalid"></i>';
        }
        checkFormValidity();
    }

    function setStatusNeutral(statusId) {
        const statusSpan = document.getElementById(statusId);
        statusSpan.innerHTML = '<i class="fa-solid fa-circle-minus neutral"></i>';
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
            submitBtn.innerHTML = '<i class="fa-solid fa-unlock"></i> COMPILE MEMBER BADGE';
        } else {
            submitBtn.setAttribute('disabled', 'true');
            submitBtn.innerHTML = '<i class="fa-solid fa-lock"></i> Verification Pending';
        }
    }

    nameInput.addEventListener('input', validateName);
    ageInput.addEventListener('input', validateAge);
    phoneInput.addEventListener('input', validatePhone);
    emailInput.addEventListener('input', validateEmail);

    // -------------------------------------------------------------
    // COMPILE BADGE ON SUBMIT
    // -------------------------------------------------------------
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        recName.textContent = nameInput.value.trim();
        recSlot.textContent = slotSelect.value.toUpperCase();
        badgePlanTxt.textContent = planSelect.value.toUpperCase();

        const randomNum = Math.floor(10000 + Math.random() * 90000);
        recId.textContent = `IF-${randomNum}`;

        // Trigger flash highlight
        badgeCard.style.boxShadow = '0 0 25px #C6FF00';
        setTimeout(() => {
            badgeCard.style.boxShadow = '';
        }, 600);
    });

    // -------------------------------------------------------------
    // 3D HOVER TILT MATRIX
    // -------------------------------------------------------------
    badgeCard.addEventListener('mousemove', (e) => {
        const rect = badgeCard.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const rotateY = ((x / rect.width) - 0.5) * 30;
        const rotateX = (0.5 - (y / rect.height)) * 30;

        badgeInner.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    badgeCard.addEventListener('mouseleave', () => {
        badgeInner.style.transform = 'rotateX(0deg) rotateY(0deg)';
    });
});
