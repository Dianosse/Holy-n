// Affiche un message d'information ou d'erreur
function showMsg(text, isError = false) {
    const msg = document.getElementById(isError ? 'admin-error' : 'admin-msg');
    const other = document.getElementById(isError ? 'admin-msg' : 'admin-error');
    other.classList.remove('show');
    msg.textContent = text;
    msg.classList.add('show');
    setTimeout(() => msg.classList.remove('show'), 4000);
}

// Fonction utilitaire pour envoyer des requêtes API côté admin
async function adminFetch(url, method, body) {
    const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: body ? JSON.stringify(body) : undefined
    });
    const data = await res.json();
    return { ok: res.ok, data };
}

// Accepte un pari en attente
async function acceptPoll(id) {
    const { ok, data } = await adminFetch(`/api/admin/polls/${id}/accept`, 'PATCH');
    if (ok) { showMsg('Pari accepté'); location.reload(); }
    else showMsg(data.error || 'Erreur', true);
}

// Refuse un pari en attente
async function refusePoll(id) {
    const { ok, data } = await adminFetch(`/api/admin/polls/${id}/refuse`, 'PATCH');
    if (ok) { showMsg('Pari refusé'); location.reload(); }
    else showMsg(data.error || 'Erreur', true);
}

async function forceClosePoll(id) {
    const { ok, data } = await adminFetch(`/api/admin/polls/${id}/force-close`, 'PATCH');
    if (ok) { showMsg('Pari clôturé, en attente de résolution'); location.reload(); }
    else showMsg(data.error || 'Erreur', true);
}

// Ferme un pari
async function closePoll(id) {
    const { ok, data } = await adminFetch(`/api/admin/polls/${id}/close`, 'PATCH');
    if (ok) { showMsg('Pari fermé'); location.reload(); }
    else showMsg(data.error || 'Erreur', true);
}

// Met fin un pari en donnant e résultat et redistribue les gains aux parieurs
async function resolvePoll(id, btn) {
    const card = btn.closest('.admin-card');
    const select = card.querySelector('.resolve-select');
    const idChoix = select.value;
    if (!idChoix) return showMsg('Sélectionne un choix gagnant avant de résoudre', true);

    btn.disabled = true;
    const { ok, data } = await adminFetch(`/api/admin/polls/${id}/resolve`, 'PATCH', { idChoix });
    if (!ok) { btn.disabled = false; return showMsg(data.error || 'Erreur', true); }

    const { ok: ok2, data: data2 } = await adminFetch(`/api/admin/polls/${id}/redistribute`, 'PATCH');
    if (ok2) { showMsg('Pari résolu et gains distribués'); location.reload(); }
    else { btn.disabled = false; showMsg(data2.error || 'Erreur lors de la distribution', true); }
}

// Bannit un utilisateur
async function banUser(id) {
    const { ok, data } = await adminFetch(`/api/admin/users/${id}/ban`, 'PATCH');
    if (ok) { showMsg('Utilisateur banni'); location.reload(); }
    else showMsg(data.error || 'Erreur', true);
}

// Débannit un utilisateur
async function unbanUser(id) {
    const { ok, data } = await adminFetch(`/api/admin/users/${id}/unban`, 'PATCH');
    if (ok) { showMsg('Utilisateur débanni'); location.reload(); }
    else showMsg(data.error || 'Erreur', true);
}

// Crée un nouveau tag
async function createTag(e) {
    e.preventDefault();
    const input = document.getElementById('new-tag-input');
    const { ok, data } = await adminFetch('/api/admin/tags', 'POST', { newLibelle: input.value.trim() });
    if (ok) {
        showMsg(`Tag "${data.data.newTag.libelle}" créé`);
        const container = document.getElementById('tags-container');
        const div = document.createElement('div');

        // Crée l'élément HTML du nouveau tag
        div.className = 'tag-admin-item';
        div.dataset.id = data.data.newTag.id;
        div.innerHTML = `<span>${data.data.newTag.libelle}</span><button onclick="deleteTag('${data.data.newTag.id}')" class="tag-delete-btn">×</button>`;

        // Ajoute le tag dans la liste
        container.appendChild(div);

        input.value = '';
    } else {
        showMsg(data.error || 'Erreur', true);
    }
}

// Supprime un tag
async function deleteTag(id) {
    const { ok, data } = await adminFetch(`/api/admin/tags/${id}`, 'DELETE');
    if (ok) {
        // Retire le tag de l'affichage
        document.querySelector(`.tag-admin-item[data-id="${id}"]`)?.remove();
        showMsg('Tag supprimé');
    } else {
        showMsg(data.error || 'Erreur', true);
    }
}
