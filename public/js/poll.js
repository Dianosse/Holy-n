const pollId = document.querySelector('main').dataset.pollId;
const msgDiv = document.getElementById('poll-msg');

const CHART_COLORS = ['#F05A22', '#1A2869', '#16A34A', '#7C3AED', '#0891B2'];

function showPollMsg(text, isError) {
    msgDiv.textContent = text;
    msgDiv.className = isError ? 'error-message show' : 'success-message show';
    setTimeout(() => msgDiv.classList.remove('show'), 4000);
}

// ── Betting forms ──────────────────────────────────────────

document.querySelectorAll('.bet-trigger').forEach(btn => {
    btn.addEventListener('click', () => {
        const id = btn.dataset.choiceId;
        document.querySelectorAll('.bet-inline-form').forEach(f => f.style.display = 'none');
        const form = document.getElementById('bet-form-' + id);
        if (form) form.style.display = 'block';
    });
});

document.querySelectorAll('.bet-cancel').forEach(btn => {
    btn.addEventListener('click', () => {
        const form = document.getElementById('bet-form-' + btn.dataset.choiceId);
        if (form) form.style.display = 'none';
    });
});

document.querySelectorAll('.bet-confirm').forEach(btn => {
    btn.addEventListener('click', async () => {
        const choiceId = btn.dataset.choiceId;
        const form = document.getElementById('bet-form-' + choiceId);
        const input = form.querySelector('.bet-amount-input');
        const montant = parseFloat(input.value);

        if (!montant || montant <= 0) { showPollMsg('Montant invalide', true); return; }

        btn.disabled = true;
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
                btn.disabled = false;
            }
        } catch {
            showPollMsg('Erreur réseau', true);
            btn.disabled = false;
        }
    });
});

// ── Chart ──────────────────────────────────────────────────

function hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${alpha})`;
}

async function initChart() {
    try {
        const res = await fetch(`/api/polls/${pollId}/chart-data`);
        const json = await res.json();

        if (!res.ok || !json.success || json.data.isEmpty) {
            document.getElementById('chart-empty').style.display = 'flex';
            document.getElementById('poll-chart').style.display = 'none';
            return;
        }

        const { labels, series } = json.data;

        // Légende masquée : les libellés sont affichés directement au bout des courbes
        document.getElementById('chart-legend').style.display = 'none';

        const canvas = document.getElementById('poll-chart');
        const ctx = canvas.getContext('2d');

        // Gradient fills
        const datasets = series.map((s, i) => {
            const color = CHART_COLORS[i % CHART_COLORS.length];
            const gradient = ctx.createLinearGradient(0, 0, 0, 300);
            gradient.addColorStop(0, hexToRgba(color, 0.18));
            gradient.addColorStop(1, hexToRgba(color, 0));
            return {
                label: s.label,
                data: s.data,
                borderColor: color,
                backgroundColor: gradient,
                borderWidth: 2,
                fill: true,
                tension: 0,
                pointRadius: 0,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: color,
                pointHoverBorderColor: '#fff',
                pointHoverBorderWidth: 2,
            };
        });

        // Plugin : libellé + valeur courante au bout de chaque courbe
        const endLabelPlugin = {
            id: 'endLabel',
            afterDraw(chart) {
                const { ctx, data } = chart;
                ctx.save();

                // Collecter les positions des derniers points
                const points = data.datasets.map((ds, i) => {
                    const meta = chart.getDatasetMeta(i);
                    if (!meta.visible || !meta.data.length) return null;
                    const last = meta.data[meta.data.length - 1];
                    return {
                        x: last.x,
                        y: last.y,
                        label: ds.label,
                        value: ds.data[ds.data.length - 1],
                        color: ds.borderColor
                    };
                }).filter(Boolean);

                // Anti-collision : pousser les labels qui se chevauchent
                const LINE_H = 30;
                points.sort((a, b) => a.y - b.y);
                for (let i = 1; i < points.length; i++) {
                    if (points[i].y - points[i - 1].y < LINE_H) {
                        points[i].y = points[i - 1].y + LINE_H;
                    }
                }

                points.forEach(({ x, y, label, value, color }) => {
                    const tx = x + 10;

                    // Libellé (petit)
                    ctx.font = '500 11px Inter, system-ui, sans-serif';
                    ctx.fillStyle = color;
                    ctx.textAlign = 'left';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(label, tx, y - 7);

                    // Valeur actuelle (gras)
                    ctx.font = 'bold 13px Inter, system-ui, sans-serif';
                    ctx.fillText(`${value}%`, tx, y + 7);
                });

                ctx.restore();
            }
        };

        new Chart(ctx, {
            type: 'line',
            data: { labels, datasets },
            plugins: [endLabelPlugin],
            options: {
                responsive: true,
                maintainAspectRatio: false,
                layout: { padding: { right: 155 } },
                interaction: { mode: 'index', intersect: false },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: '#1A2869',
                        titleColor: 'rgba(255,255,255,0.65)',
                        bodyColor: '#fff',
                        padding: 12,
                        cornerRadius: 8,
                        callbacks: {
                            label: ctx => ` ${ctx.dataset.label}: ${ctx.raw}%`
                        }
                    }
                },
                scales: {
                    x: {
                        grid: { color: '#DDDCD5', drawBorder: false },
                        ticks: { font: { family: 'Inter', size: 11 }, color: '#888880', maxTicksLimit: 8 }
                    },
                    y: {
                        min: 0,
                        max: 100,
                        grid: { color: '#DDDCD5', drawBorder: false },
                        ticks: {
                            font: { family: 'Inter', size: 11 },
                            color: '#888880',
                            callback: v => v + '%',
                            stepSize: 25
                        }
                    }
                }
            }
        });

    } catch (err) {
        console.error('Chart error:', err);
        document.getElementById('chart-empty').style.display = 'flex';
        document.getElementById('poll-chart').style.display = 'none';
    }
}

initChart();
