const TAB_NAMES = ['info', 'history', 'friends'];

// Affiche l'onglet sélectionné et masque les autres
function switchTab(tab) {
    document.querySelectorAll('.tab-panel').forEach(p => p.style.display = 'none');
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('tab-' + tab).style.display = '';
    const idx = TAB_NAMES.indexOf(tab);
    if (idx !== -1) document.querySelectorAll('.tab-btn')[idx].classList.add('active');
}

// Sauvegarde les informations du profil utilisateur
async function saveProfile(e) {
    e.preventDefault();
    const errorDiv = document.getElementById('profile-error');
    const successDiv = document.getElementById('profile-success');
    errorDiv.classList.remove('show');
    successDiv.classList.remove('show');

    // Récupère les valeurs du formulaire  
    const nom = document.getElementById('profile-nom').value.trim();
    const prenom = document.getElementById('profile-prenom').value.trim();
    const pseudo = document.getElementById('profile-pseudo').value.trim();
    const description = document.getElementById('profile-description').value.trim();

    // Construit le corps de la requête
    const body = {};
    if (nom) body.nom = nom;
    if (prenom) body.prenom = prenom;
    if (pseudo) body.pseudo = pseudo;
    body.description = description;

    try {
        // Envoie les modifications du profil au serveur
        const res = await fetch('/api/users/me', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        const data = await res.json();

        if (res.ok) {
            successDiv.textContent = 'Profil mis à jour avec succès.';
            successDiv.classList.add('show');
            // Recharge la page après la requête
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

/* ---- Amis ---- */

let searchTimer;

// Recherche des utilisateurs à suivre
function searchFriends(q) {
    clearTimeout(searchTimer);
    const results = document.getElementById('friends-search-results');
    if (!q.trim()) { results.innerHTML = ''; return; }
    searchTimer = setTimeout(async () => {
        try {
            const res = await fetch(`/api/users/search?q=${encodeURIComponent(q.trim())}`);
            const data = await res.json();
            const users = (data.data?.users || []).filter(u => u.id !== CURRENT_USER_ID);
            if (!res.ok || !users.length) {
                results.innerHTML = '<p class="empty-hint">Aucun utilisateur trouvé.</p>';
                return;
            }
            results.innerHTML = '<div class="following-grid">' +
                users.map(u => {
                    const initial = u.pseudo.charAt(0).toUpperCase();

                    // Vérifie si l'utilisateur est déjà un ami
                    const alreadyFriend = !!document.getElementById('friend-row-' + u.id);
                    return `<div class="following-card" id="search-row-${u.id}">
                        <a href="/users/${u.id}" class="following-card-inner">
                            <div class="avatar-circle avatar-sm">${initial}</div>
                            <span class="following-pseudo">${u.pseudo}</span>
                        </a>
                        ${alreadyFriend
                            ? '<span class="badge badge-termine">Déjà ami</span>'
                            : `<button class="btn btn-sm btn-orange" onclick="followFriend('${u.id}','${u.pseudo}',this)">Suivre</button>`
                        }
                    </div>`;
                }).join('') +
                '</div>';
        } catch {
            results.innerHTML = '<p class="empty-hint">Erreur réseau.</p>';
        }
    }, 350);
}

// Ajoute un utilisateur à la liste des amis
async function followFriend(userId, pseudo, btn) {
    btn.disabled = true;
    try {
        const res = await fetch(`/api/users/${userId}/follow`, { method: 'POST' });
        const data = await res.json();
        if (!res.ok) { alert(data.error || 'Erreur'); btn.disabled = false; return; }

        // Remplace le bouton par le badge "Déjà ami"
        btn.closest('.following-card').querySelector('button').outerHTML =
            '<span class="badge badge-termine">Déjà ami</span>';

        const list = document.getElementById('friends-list');
        const emptyHint = list.querySelector('.empty-hint');
        if (emptyHint) {
            list.innerHTML = '<div class="following-grid"></div>';
        }
        const grid = list.querySelector('.following-grid');
        const initial = pseudo.charAt(0).toUpperCase();

        // Crée une nouvelle card ami
        const div = document.createElement('div');
        div.className = 'following-card';
        div.id = 'friend-row-' + userId;
        div.innerHTML = `<a href="/users/${userId}" class="following-card-inner">
            <div class="avatar-circle avatar-sm">${initial}</div>
            <span class="following-pseudo">${pseudo}</span>
        </a>
        <button class="btn btn-sm btn-navy" onclick="unfollowFriend('${userId}', this)">Retirer</button>`;

        // Ajoute la card à la liste
        grid.appendChild(div);
    } catch {
        alert('Erreur réseau');
        btn.disabled = false;
    }
}

// Retire un utilisateur des amis
async function unfollowFriend(userId, btn) {
    btn.disabled = true;

    try {
        const res = await fetch(`/api/users/${userId}/follow`, { method: 'DELETE' });
        const data = await res.json();
        if (!res.ok) { alert(data.error || 'Erreur'); btn.disabled = false; return; }

        // Supprime la card de la liste des amis
        document.getElementById('friend-row-' + userId)?.remove();

        const searchRow = document.getElementById('search-row-' + userId);
        if (searchRow) {
            const oldBtn = searchRow.querySelector('button, .badge');
            if (oldBtn) {
                const pseudo = searchRow.querySelector('.following-pseudo')?.textContent || '';
                oldBtn.outerHTML = `<button class="btn btn-sm btn-orange" onclick="followFriend('${userId}','${pseudo}',this)">Suivre</button>`;
            }
        }

        const grid = document.querySelector('#friends-list .following-grid');

        // Met à jour le résultat de recherche correspondant
        if (grid && !grid.children.length) {
            document.getElementById('friends-list').innerHTML =
                '<p class="empty-hint">Vous ne suivez personne pour l\'instant.</p>';
        }
    } catch {
        alert('Erreur réseau');
        btn.disabled = false;
    }
}
