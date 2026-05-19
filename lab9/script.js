const citiesData = {
    Ukraine: ["Kyiv", "Lviv", "Odesa", "Kharkiv", "Chernivtsi"],
    USA: ["New York", "Los Angeles", "Chicago", "Miami", "San Francisco"]
};

document.getElementById('btn-reg-tab').addEventListener('click', () => switchTab('register'));
document.getElementById('btn-log-tab').addEventListener('click', () => switchTab('login'));

function switchTab(tab) {
    const isReg = tab === 'register';
    document.getElementById('register-tab').classList.toggle('active', isReg);
    document.getElementById('login-tab').classList.toggle('active', !isReg);
    document.getElementById('btn-reg-tab').classList.toggle('active', isReg);
    document.getElementById('btn-log-tab').classList.toggle('active', !isReg);
}

function setupPasswordToggle(iconId, inputId) {
    const icon = document.getElementById(iconId);
    const input = document.getElementById(inputId);
    if (!icon || !input) return;
    icon.addEventListener('click', () => {
        const show = input.type === "password";
        input.type = show ? "text" : "password";
        icon.classList.toggle("fa-eye", !show);
        icon.classList.toggle("fa-eye-slash", show);
    });
}
setupPasswordToggle('toggle-reg-pass', 'reg-password');
setupPasswordToggle('toggle-reg-confirm', 'reg-confirm');
setupPasswordToggle('toggle-log-pass', 'log-password');

function setError(el, message) {
    const group = el.closest('.form-group');
    if (!group) return;
    const errorDiv = group.querySelector('.error-msg');
    if (errorDiv) {
        group.classList.replace('success', 'error') || group.classList.add('error');
        errorDiv.innerText = message;
    }
}

function setSuccess(el) {
    const group = el.closest('.form-group');
    if (!group) return;
    const errorDiv = group.querySelector('.error-msg');
    if (errorDiv) {
        group.classList.replace('error', 'success') || group.classList.add('success');
        errorDiv.innerText = "";
    }
}

function clearStatus(el) {
    const group = el.closest('.form-group');
    if (!group) return;
    group.classList.remove('error', 'success');
    const errorDiv = group.querySelector('.error-msg');
    if (errorDiv) errorDiv.innerText = "";
}

const countrySelect = document.getElementById('reg-country');
const citySelect = document.getElementById('reg-city');

countrySelect.addEventListener('change', function () {
    citySelect.innerHTML = '<option value="">Choose city...</option>';
    if (this.value) {
        citySelect.disabled = false;
        citiesData[this.value].forEach(city => {
            const opt = document.createElement('option');
            opt.value = opt.textContent = city;
            citySelect.appendChild(opt);
        });
        setSuccess(countrySelect);
    } else {
        citySelect.disabled = true;
        setError(countrySelect, "Country is required.");
    }
});

citySelect.addEventListener('change', function () {
    this.value ? setSuccess(citySelect) : setError(citySelect, "City is required.");
});

const regFirstName = document.getElementById('reg-firstname');
const regLastName  = document.getElementById('reg-lastname');
const regEmail     = document.getElementById('reg-email');
const regPassword  = document.getElementById('reg-password');
const regConfirm   = document.getElementById('reg-confirm');
const regPhone     = document.getElementById('reg-phone');
const regDob       = document.getElementById('reg-dob');
const sexError     = document.getElementById('sex-error');
const registerForm = document.getElementById('register-form');

function validateName(el, label, isLive = false) {
    const val = el.value.trim();
    if (isLive && val.length < 3) { clearStatus(el); return false; }
    if (val.length < 3 || val.length > 15) {
        setError(el, `${label} must be between 3 and 15 characters.`);
        return false;
    }
    setSuccess(el);
    return true;
}

function validateEmail() {
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(regEmail.value.trim());
    valid ? setSuccess(regEmail) : setError(regEmail, "Please provide a valid email.");
    return valid;
}

function validatePassword() {
    const valid = regPassword.value.length >= 6;
    valid ? setSuccess(regPassword) : setError(regPassword, "Password must be at least 6 characters long.");
    return valid;
}

function validateConfirmPassword() {
    const valid = regConfirm.value !== "" && regConfirm.value === regPassword.value;
    valid ? setSuccess(regConfirm) : setError(regConfirm, "Passwords do not match.");
    return valid;
}

function validatePhone() {
    const valid = /^\+380\d{9}$/.test(regPhone.value.trim());
    valid ? setSuccess(regPhone) : setError(regPhone, "Format must be Ukrainian: +380XXXXXXXXX");
    return valid;
}

function validateDob() {
    if (!regDob.value) { setError(regDob, "Date of birth is required."); return false; }
    const dob = new Date(regDob.value);
    const today = new Date();
    if (dob > today) { setError(regDob, "Date of birth cannot be in the future."); return false; }
    let age = today.getFullYear() - dob.getFullYear();
    if (today.getMonth() - dob.getMonth() < 0 ||
        (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())) age--;
    if (age < 12) { setError(regDob, "You must be at least 12 years old to register."); return false; }
    setSuccess(regDob);
    return true;
}

function validateSex() {
    const group = sexError.closest('.form-group');
    const selected = Array.from(document.getElementsByName('sex')).some(r => r.checked);
    sexError.innerText = selected ? "" : "Please select your sex.";
    group?.classList.toggle('error', !selected);
    group?.classList.toggle('success', selected);
    return selected;
}

function validateCountry() {
    if (!countrySelect.value) { setError(countrySelect, "Please select a country."); return false; }
    setSuccess(countrySelect);
    return true;
}

function validateCity() {
    if (!citySelect.value) { setError(citySelect, "Please select a city."); return false; }
    setSuccess(citySelect);
    return true;
}

regFirstName.addEventListener('input', () => validateName(regFirstName, 'First name', true));
regFirstName.addEventListener('blur',  () => validateName(regFirstName, 'First name'));
regLastName.addEventListener('input',  () => validateName(regLastName, 'Last name', true));
regLastName.addEventListener('blur',   () => validateName(regLastName, 'Last name'));
regEmail.addEventListener('input', validateEmail);
regPassword.addEventListener('input', validatePassword);
regConfirm.addEventListener('input', validateConfirmPassword);
regPhone.addEventListener('input', validatePhone);
regDob.addEventListener('change', validateDob);

registerForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const isValid = [
        validateName(regFirstName, 'First name'),
        validateName(regLastName, 'Last name'),
        validateEmail(), validatePassword(), validateConfirmPassword(),
        validatePhone(), validateDob(), validateSex(),
        validateCountry(), validateCity()
    ].every(Boolean);

    if (!isValid) return;

    const formData = new FormData(registerForm);

    console.log("--- Реєстрація (FormData) ---");
    for (const [key, val] of formData) {
        console.log(`${key}: ${val}`);
    }

    alert("Ви успішно зареєстровані!");
    registerForm.reset();
    citySelect.disabled = true;
    registerForm.querySelectorAll('.form-group').forEach(g => g.classList.remove('success', 'error'));
});

const loginForm     = document.getElementById('login-form');
const loginUsername = document.getElementById('log-username');
const loginPassword = document.getElementById('log-password');

function validateLoginUsername(isLive = false) {
    const val = loginUsername.value.trim();
    if (isLive && val.length < 3) { clearStatus(loginUsername); return false; }
    if (val.length < 3) { setError(loginUsername, "Min 3 characters required."); return false; }
    setSuccess(loginUsername);
    return true;
}

function validateLoginPassword() {
    const valid = loginPassword.value.length >= 6;
    valid ? setSuccess(loginPassword) : setError(loginPassword, "Password must be at least 6 characters.");
    return valid;
}

loginUsername.addEventListener('input', () => validateLoginUsername(true));
loginUsername.addEventListener('blur',  () => validateLoginUsername());
loginPassword.addEventListener('input', validateLoginPassword);
loginPassword.addEventListener('blur',  validateLoginPassword);

loginForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const isValidLogin = validateLoginUsername() && validateLoginPassword();
    if (!isValidLogin) return;

    const formData = new FormData(loginForm);

    const rememberCheckbox = document.getElementById('log-remember');
    if (rememberCheckbox) {
        formData.set('rememberMe', rememberCheckbox.checked);
    }

    console.log("--- Авторизація (FormData) ---");
    for (const [key, val] of formData) {
        console.log(`${key}: ${val}`);
    }

    alert("Вхід успішно виконано!");
    loginForm.reset();
    loginForm.querySelectorAll('.form-group').forEach(g => g.classList.remove('success', 'error'));
});