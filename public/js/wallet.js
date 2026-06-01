async function deposit(e) {
    e.preventDefault();
    const form = e.target;
    const errorDiv = document.getElementById('deposit-error');
    const successDiv = document.getElementById('deposit-success');
    errorDiv.classList.remove('show');
    successDiv.classList.remove('show');

    try {
        const res = await fetch('/api/wallets/deposit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ argent: Number(form.argent.value) })
        });
        const data = await res.json();

        if (res.ok) {
            const nouveauSolde = Number(data.data.solde).toFixed(2);
            document.getElementById('solde-display').textContent = nouveauSolde + '€';
            successDiv.textContent = `Dépôt effectué. Nouveau solde : ${nouveauSolde}€`;
            successDiv.classList.add('show');
            form.reset();
        } else {
            errorDiv.textContent = data.error || 'Erreur lors du dépôt';
            errorDiv.classList.add('show');
        }
    } catch {
        errorDiv.textContent = 'Erreur réseau, veuillez réessayer';
        errorDiv.classList.add('show');
    }
}

async function withdraw(e) {
    e.preventDefault();
    const form = e.target;
    const errorDiv = document.getElementById('withdraw-error');
    const successDiv = document.getElementById('withdraw-success');
    errorDiv.classList.remove('show');
    successDiv.classList.remove('show');

    try {
        const res = await fetch('/api/wallets/withdraw', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ argent: Number(form.argent.value) })
        });
        const data = await res.json();

        if (res.ok) {
            const nouveauSolde = Number(data.data.solde).toFixed(2);
            document.getElementById('solde-display').textContent = nouveauSolde + '€';
            successDiv.textContent = `Retrait effectué. Nouveau solde : ${nouveauSolde}€`;
            successDiv.classList.add('show');
            form.reset();
        } else {
            errorDiv.textContent = data.error || 'Erreur lors du retrait';
            errorDiv.classList.add('show');
        }
    } catch {
        errorDiv.textContent = 'Erreur réseau, veuillez réessayer';
        errorDiv.classList.add('show');
    }
}
