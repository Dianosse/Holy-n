let choiceCount = 2;
const customTags = [];

// Remplissage des selects heure/minute
(function initTimeSelects() {
    const hSelect = document.querySelector('[name="heuresCloture"]');
    const mSelect = document.querySelector('[name="minutesCloture"]');
    if (!hSelect || !mSelect) return;
    for (let h = 0; h < 24; h++) {
        const opt = document.createElement('option');
        opt.value = String(h).padStart(2, '0');
        opt.textContent = String(h).padStart(2, '0') + 'h';
        if (h === 23) opt.selected = true;
        hSelect.appendChild(opt);
    }
    for (let m = 0; m < 60; m++) {
        const opt = document.createElement('option');
        opt.value = String(m).padStart(2, '0');
        opt.textContent = String(m).padStart(2, '0');
        if (m === 59) opt.selected = true;
        mSelect.appendChild(opt);
    }
})();

// Ajout des choix au pari
function addChoice() {
    if (choiceCount >= 10) return; // Si nombre de choix >= 10, on ajoute pas
    choiceCount++;
    const container = document.getElementById('choices-container');
    const div = document.createElement('div');
    div.className = 'choice-item';
    div.innerHTML = `
        <input type="text" class="form-input" placeholder="Choix ${choiceCount}">
        <button type="button" class="choice-remove-btn" onclick="removeChoice(this)">×</button>
    `;
    container.appendChild(div);

    if (choiceCount >= 10) {
        document.getElementById('add-choice-btn').style.display = 'none';
    } // Si choix égale à 10 on désactive le bouton d'ajout de choix
}

function removeChoice(btn) {
    if (choiceCount <= 2) return; // Si nombre de choix <= 2, on retire pas
    btn.closest('.choice-item').remove();
    choiceCount--;
    document.getElementById('add-choice-btn').style.display = ''; // Activer le bouton d'ajout de choix
}

// AJout d'un nouveau tagg qui sera ajouter à la soumission du pari
function addCustomTag() {
    const input = document.getElementById('new-tag-input');
    if (!input) return;
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

// retirer tag custoom
function removeCustomTag(btn) {
    const chip = btn.closest('.tag-chip-removable');
    const value = chip.dataset.value;
    const idx = customTags.indexOf(value);
    if (idx > -1) customTags.splice(idx, 1);
    chip.remove();
}

// Soumet le pari
async function submitPoll(e) {
    e.preventDefault();
    const form = e.target;
    const errorDiv = document.getElementById('submit-error');
    const successDiv = document.getElementById('submit-success');
    errorDiv.classList.remove('show');
    successDiv.classList.remove('show');

    // Vérification de chaque champ
    const intitule = form.intitule.value.trim();
    if (!intitule || intitule.length < 3) {
        errorDiv.textContent = "L'intitulé doit contenir au moins 3 caractères";
        errorDiv.classList.add('show');
        return;
    }

    const description = form.description.value.trim();
    if (!description || description.length < 3) {
        errorDiv.textContent = 'La description doit contenir au moins 3 caractères';
        errorDiv.classList.add('show');
        return;
    }

    const dateVal = form.dateCloture.value;
    const heures = form.heuresCloture.value;
    const minutes = form.minutesCloture.value;
    if (!dateVal) {
        errorDiv.textContent = 'La date de clôture est obligatoire';
        errorDiv.classList.add('show');
        return;
    }

    const dateClotureObj = new Date(`${dateVal}T${heures}:${minutes}:00`);
    if (isNaN(dateClotureObj.getTime()) || dateClotureObj <= new Date()) {
        errorDiv.textContent = 'La date de clôture doit être dans le futur';
        errorDiv.classList.add('show');
        return;
    }

    const allChoix = Array.from(document.querySelectorAll('#choices-container .choice-item input'))
        .map(i => ({ libelle: i.value.trim() }))
        .filter(c => c.libelle.length > 0);

    if (allChoix.length < 2) {
        errorDiv.textContent = 'Le pari doit avoir au moins 2 choix';
        errorDiv.classList.add('show');
        return;
    }

    const allTags = [
        ...Array.from(document.querySelectorAll('.tag-checkbox-item:checked')).map(cb => cb.value),
        ...customTags
    ];

    const body = { intitule, description, dateCloture: dateClotureObj.toISOString(), allChoix, allTags };

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
            customTags.length = 0;
            const container = document.getElementById('custom-tags-container');
            if (container) container.innerHTML = '';
        } else {
            errorDiv.textContent = data.error || 'Erreur lors de la soumission';
            errorDiv.classList.add('show');
        }
    } catch {
        errorDiv.textContent = 'Erreur réseau, veuillez réessayer';
        errorDiv.classList.add('show');
    }
}
