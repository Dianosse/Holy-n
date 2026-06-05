function switchTab(tab) {
    document.querySelectorAll('.tab-panel').forEach(p => p.style.display = 'none');
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('tab-' + tab).style.display = 'block';
    document.querySelectorAll('.tab-btn')[tab === 'history' ? 0 : 1].classList.add('active');
}

async function toggleFollow(userId, isCurrentlyFollowing) {
    const btn = document.getElementById('follow-btn');
    btn.disabled = true;

    try {
        const method = isCurrentlyFollowing ? 'DELETE' : 'POST';
        const res = await fetch(`/api/users/${userId}/follow`, { method });

        if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            alert(data.error || 'Une erreur est survenue');
            btn.disabled = false;
            return;
        }

        if (isCurrentlyFollowing) {
            btn.textContent = 'Suivre';
            btn.className = 'btn btn-orange';
            btn.setAttribute('onclick', `toggleFollow('${userId}', false)`);
        } else {
            btn.textContent = 'Ne plus suivre';
            btn.className = 'btn btn-navy';
            btn.setAttribute('onclick', `toggleFollow('${userId}', true)`);
        }
    } catch {
        alert('Erreur réseau');
    }

    btn.disabled = false;
}
