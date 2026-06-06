function showMsg(text, isError = false) {
    const msg = document.getElementById(isError ? 'wallet-error' : 'wallet-msg');
    const other = document.getElementById(isError ? 'wallet-msg' : 'wallet-error');
    other.classList.remove('show');
    msg.textContent = text;
    msg.classList.add('show');
    setTimeout(() => msg.classList.remove('show'), 4000);
}

function setAmount(type, amount) {
    const input = document.getElementById(type === 'deposit' ? 'deposit-input' : 'withdraw-input');
    input.value = amount;
    input.focus();
}

function setMax() {
    const input = document.getElementById('withdraw-input');
    input.value = Number(WALLET_SOLDE).toFixed(2);
    input.focus();
}

function updateSoldeDisplay(newSolde) {
    WALLET_SOLDE = newSolde;
    document.getElementById('solde-display').textContent = Number(newSolde).toFixed(2) + '€';
}

async function deposit(e) {
    e.preventDefault();
    const form = e.target;
    const btn = form.querySelector('button[type="submit"]');
    const amount = Number(form.argent.value);

    btn.disabled = true;
    try {
        const res = await fetch('/api/wallets/deposit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ argent: amount })
        });
        const data = await res.json();

        if (res.ok) {
            updateSoldeDisplay(Number(data.data.solde));
            showMsg(`+${amount.toFixed(2)}€ déposé avec succès`);
            form.reset();
        } else {
            showMsg(data.error || 'Erreur lors du dépôt', true);
        }
    } catch {
        showMsg('Erreur réseau, veuillez réessayer', true);
    } finally {
        btn.disabled = false;
    }
}

async function withdraw(e) {
    e.preventDefault();
    const form = e.target;
    const btn = form.querySelector('button[type="submit"]');
    const amount = Number(form.argent.value);

    btn.disabled = true;
    try {
        const res = await fetch('/api/wallets/withdraw', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ argent: amount })
        });
        const data = await res.json();

        if (res.ok) {
            updateSoldeDisplay(Number(data.data.solde));
            showMsg(`${amount.toFixed(2)}€ retiré avec succès`);
            form.reset();
        } else {
            showMsg(data.error || 'Erreur lors du retrait', true);
        }
    } catch {
        showMsg('Erreur réseau, veuillez réessayer', true);
    } finally {
        btn.disabled = false;
    }
}
