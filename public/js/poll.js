const pollId = document.querySelector('main').dataset.pollId;
const msgDiv = document.getElementById('poll-msg');

function showPollMsg(text, isError) {
    msgDiv.textContent = text;
    msgDiv.className = isError ? 'error-message show' : 'success-message show';
    setTimeout(() => msgDiv.classList.remove('show'), 4000);
}

document.querySelectorAll('.bet-trigger').forEach(btn => {
    btn.addEventListener('click', () => {
        const id = btn.dataset.choiceId;
        document.querySelectorAll('.bet-inline-form').forEach(f => {
            f.style.display = 'none';
        });
        const form = document.getElementById('bet-form-' + id);
        if (form) form.style.display = 'block';
    });
});

document.querySelectorAll('.bet-cancel').forEach(btn => {
    btn.addEventListener('click', () => {
        const id = btn.dataset.choiceId;
        const form = document.getElementById('bet-form-' + id);
        if (form) form.style.display = 'none';
    });
});

document.querySelectorAll('.bet-confirm').forEach(btn => {
    btn.addEventListener('click', async () => {
        const choiceId = btn.dataset.choiceId;
        const form = document.getElementById('bet-form-' + choiceId);
        const input = form.querySelector('.bet-amount-input');
        const montant = parseFloat(input.value);

        if (!montant || montant <= 0) {
            showPollMsg('Montant invalide', true);
            return;
        }

        try {
            const res = await fetch(`/api/polls/${pollId}/bets`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idChoix: choiceId, montant })
            });
            const data = await res.json();

            if (res.ok) {
                showPollMsg('Pari placé avec succès !');
                setTimeout(() => location.reload(), 1200);
            } else {
                showPollMsg(data.error || 'Erreur lors du pari', true);
            }
        } catch {
            showPollMsg('Erreur réseau', true);
        }
    });
});
