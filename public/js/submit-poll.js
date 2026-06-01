let choiceCount = 2;
const customTags = [];

function addChoice() {
    if (choiceCount >= 10) return;
    choiceCount++;
    const container = document.getElementById('choices-container');
    const div = document.createElement('div');
    div.className = 'choice-item';
    div.innerHTML = `
        <input type="text" class="form-input" placeholder="Choix ${choiceCount}" required>
        <button type="button" class="choice-remove-btn" onclick="removeChoice(this)">×</button>
    `;
    container.appendChild(div);
    if (choiceCount >= 10) {
        document.getElementById('add-choice-btn').style.display = 'none';
    }
}

function removeChoice(btn) {
    if (choiceCount <= 2) return;
    btn.closest('.choice-item').remove();
    choiceCount--;
    document.getElementById('add-choice-btn').style.display = '';
}

function addCustomTag() {
    const input = document.getElementById('new-tag-input');
    const value = input.value.trim();
    if (!value) return;
    if (customTags.includes(value)) { input.value = ''; return; }

    customTags.push(value);

    const container = document.getElementById('custom-tags-container');
    const chip = document.createElement('span');
    chip.className = 'tag-chip tag-chip-removable';
    chip.dataset.value = value;
    chip.innerHTML = `${value} <button type="button" class="tag-chip-remove" onclick="removeCustomTag(this)">×</button>`;
    container.appendChild(chip);
    input.value = '';
}

function removeCustomTag(btn) {
    const chip = btn.closest('.tag-chip-removable');
    const value = chip.dataset.value;
    const idx = customTags.indexOf(value);
    if (idx > -1) customTags.splice(idx, 1);
    chip.remove();
}

async function submitPoll(e) {
    e.preventDefault();
    const form = e.target;
    const errorDiv = document.getElementById('submit-error');
    const successDiv = document.getElementById('submit-success');
    errorDiv.classList.remove('show');
    successDiv.classList.remove('show');

    const allChoix = Array.from(document.querySelectorAll('#choices-container .choice-item input'))
        .map(i => ({ libelle: i.value.trim() }))
        .filter(c => c.libelle.length > 0);

    const allTags = [
        ...Array.from(document.querySelectorAll('.tag-checkbox-item:checked')).map(cb => cb.value),
        ...customTags
    ];

    const body = {
        intitule: form.intitule.value.trim(),
        description: form.description.value.trim(),
        dateCloture: new Date(form.dateCloture.value).toISOString(),
        allChoix,
        allTags
    };

    try {
        const res = await fetch('/api/polls/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        const data = await res.json();

        if (res.ok) {
            successDiv.textContent = 'Pari soumis ! Il sera visible après validation par un administrateur.';
            successDiv.classList.add('show');
            form.reset();
            document.querySelectorAll('#choices-container .choice-item .choice-remove-btn').forEach(b => b.closest('.choice-item').remove());
            choiceCount = 2;
            document.getElementById('add-choice-btn').style.display = '';
        } else {
            errorDiv.textContent = data.error || 'Erreur lors de la soumission';
            errorDiv.classList.add('show');
        }
    } catch {
        errorDiv.textContent = 'Erreur réseau, veuillez réessayer';
        errorDiv.classList.add('show');
    }
}
