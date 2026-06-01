function switchTab(tab) {
    document.querySelectorAll('.tab-panel').forEach(p => p.style.display = 'none');
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));

    document.getElementById('tab-' + tab).style.display = '';
    const idx = tab === 'info' ? 0 : 1;
    document.querySelectorAll('.tab-btn')[idx].classList.add('active');
}

async function saveProfile(e) {
    e.preventDefault();
    const errorDiv = document.getElementById('profile-error');
    const successDiv = document.getElementById('profile-success');
    errorDiv.classList.remove('show');
    successDiv.classList.remove('show');

    const nom = document.getElementById('profile-nom').value.trim();
    const prenom = document.getElementById('profile-prenom').value.trim();
    const pseudo = document.getElementById('profile-pseudo').value.trim();
    const description = document.getElementById('profile-description').value.trim();

    const body = {};
    if (nom) body.nom = nom;
    if (prenom) body.prenom = prenom;
    if (pseudo) body.pseudo = pseudo;
    body.description = description;

    try {
        const res = await fetch('/api/users/me', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        const data = await res.json();

        if (res.ok) {
            successDiv.textContent = 'Profil mis à jour avec succès.';
            successDiv.classList.add('show');
            setTimeout(() => window.location.reload(), 1200);
        } else {
            errorDiv.textContent = data.error || 'Erreur lors de la mise à jour';
            errorDiv.classList.add('show');
        }
    } catch {
        errorDiv.textContent = 'Erreur réseau, veuillez réessayer';
        errorDiv.classList.add('show');
    }
}
