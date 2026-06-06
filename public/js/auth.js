async function submitLogin(e) {
    e.preventDefault();
    const form = e.target;
    const errorDiv = document.getElementById('error-msg');
    errorDiv.classList.remove('show');

    const body = {
        mail: form.mail.value.trim(),
        password: form.password.value
    };

    try {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        const data = await res.json();

        if (res.ok) {
            window.location.href = '/';
        } else {
            errorDiv.textContent = data.error || 'Erreur de connexion';
            errorDiv.classList.add('show');
        }
    } catch {
        errorDiv.textContent = 'Erreur réseau, veuillez réessayer';
        errorDiv.classList.add('show');
    }
}

async function submitRegister(e) {
    e.preventDefault();
    const form = e.target;
    const errorDiv = document.getElementById('error-msg');
    errorDiv.classList.remove('show');

    const body = {
        nom: form.nom.value.trim(),
        prenom: form.prenom.value.trim(),
        pseudo: form.pseudo.value.trim(),
        mail: form.mail.value.trim(),
        password: form.password.value,
        passwordConfirm: form.passwordConfirm.value
    };

    try {
        const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        const data = await res.json();

        if (res.ok) {
            window.location.href = '/login?registered=1';
        } else {
            errorDiv.textContent = data.error || "Erreur lors de l'inscription";
            errorDiv.classList.add('show');
        }
    } catch {
        errorDiv.textContent = 'Erreur réseau, veuillez réessayer';
        errorDiv.classList.add('show');
    }
}

async function logout() {
    try {
        await fetch('/api/auth/logout', { method: 'POST' });
    } finally {
        window.location.replace('/');
    }
}

function toggleMenu() {
    const dropdown = document.getElementById('user-dropdown');
    if (dropdown) dropdown.classList.toggle('open');
}

document.addEventListener('click', function (e) {
    if (!e.target.closest('.user-menu')) {
        const d = document.getElementById('user-dropdown');
        if (d) d.classList.remove('open');
    }
});
