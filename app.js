/* modules */
const express = require('express');
const session = require('express-session');
const mustacheExpress = require('mustache-express');
const path = require('path');

require('dotenv').config();

/* routeurs */
const authRoute = require('./src/routes/auth.route');
const usersRoute = require('./src/routes/users.route');
const pariRoute = require('./src/routes/pari.route');
const walletRoute = require('./src/routes/wallet.route');
const adminTagsRoute = require('./src/routes/adminTags.route');
const adminPariRoute = require('./src/routes/adminPari.route');
const adminUsersRoute = require('./src/routes/adminUsers.route');



/* middlewares */
const log = require('./src/middlewares/log');
const protect = require('./src/middlewares/auth');
const isAdmin = require('./src/middlewares/isAdmin');

/* initialization */
const app = express();
const PORT = process.env.PORT || 3000;

/* models */
const { users: userModel, tag: tagModel, pari: pariModel, choix: choixModel } = require('./src/models');
const sequelize = require('./src/config/database');
const { QueryTypes } = require('sequelize');

/* mustache */
app.engine('mustache', mustacheExpress(path.join(__dirname, 'src', 'views', 'partials'), '.mustache'));
app.set('view engine', 'mustache');
app.set('views', path.join(__dirname, 'src', 'views'));


app.use(log);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false,
        maxAge: 1000 * 60 * 60
    }
}));

async function getSessionUser(req) {
    if (!req.session?.user) return null;
    try {
        const dbUser = await userModel.findByPk(req.session.user.id, {
            attributes: ['id', 'pseudo', 'admin', 'solde', 'ban']
        });
        if (!dbUser || dbUser.ban) {
            req.session.destroy(() => {});
            return null;
        }
        return {
            id: dbUser.id,
            pseudo: dbUser.pseudo,
            pseudo_initial: dbUser.pseudo.charAt(0).toUpperCase(),
            admin: dbUser.admin || undefined,
            solde: Number(dbUser.solde).toFixed(2)
        };
    } catch (err) {
        console.error(err);
        return null;
    }
}

/* -------- route front -------- */

app.get('/', async (req, res) => {
    const user = await getSessionUser(req);
    const { tag: tagFilter } = req.query;

    try {
        const [rawPolls, allTags] = await Promise.all([
            pariModel.findAll({
                where: { visible: true, actif: true, approuve: true },
                include: [
                    {
                        model: tagModel,
                        as: 'idtag_tags',
                        attributes: ['libelle'],
                        through: { attributes: [] },
                        required: !!tagFilter,
                        ...(tagFilter && { where: { libelle: tagFilter } })
                    },
                    {
                        model: choixModel,
                        as: 'idchoix_choixes',
                        attributes: ['libelle'],
                        through: { attributes: [] }
                    }
                ],
                order: [['datecreation', 'DESC']]
            }),
            tagModel.findAll({ attributes: ['libelle'] })
        ]);

        const paris = rawPolls.map(p => {
            const poll = p.toJSON();
            const choixes = poll.idchoix_choixes || [];
            const tags = poll.idtag_tags || [];

            poll.poll_id = poll.id;
            poll.tags_list = tags;

            if (poll.datecloture) {
                poll.datecloture_str = new Date(poll.datecloture).toLocaleDateString('fr-FR', {
                    day: '2-digit', month: 'long', year: 'numeric'
                });
            }

            if (choixes.length <= 2) {
                if (choixes.length >= 1) poll.choix_a = { libelle: choixes[0].libelle };
                if (choixes.length >= 2) poll.choix_b = { libelle: choixes[1].libelle };
            } else {
                poll.voir_plus = { nb: choixes.length };
            }

            delete poll.idchoix_choixes;
            delete poll.idtag_tags;
            return poll;
        });

        const tags = allTags.map(t => ({
            libelle: t.libelle,
            actif: tagFilter === t.libelle
        }));

        res.render('home', { user, paris, tags, noTagSelected: !tagFilter });
    } catch (err) {
        console.error(err);
        res.render('home', { user, paris: [], tags: [], noTagSelected: true });
    }
});

app.get('/login', (req, res) => {
    if (req.session?.user) return res.redirect('/');
    res.render('login', { user: null, hideSearch: true });
});

app.get('/register', (req, res) => {
    if (req.session?.user) return res.redirect('/');
    res.render('register', { user: null, hideSearch: true });
});

app.get('/profile', async (req, res) => {
    const user = await getSessionUser(req);
    if (!user) return res.redirect('/login');

    try {
        const [dbUser, rawBets] = await Promise.all([
            userModel.findByPk(user.id, {
                attributes: ['id', 'pseudo', 'nom', 'prenom', 'mail', 'description']
            }),
            sequelize.query(
                `SELECT m.montant, m.datedepari, m.idpari,
                        p.intitule, p.datearchivage, p.idchoixgagnant,
                        c.libelle AS choix_libelle
                 FROM mise m
                 INNER JOIN pari p ON p.id = m.idpari
                 INNER JOIN choix c ON c.id = m.idchoix
                 WHERE m.iduser = :idUser
                 ORDER BY m.datedepari DESC`,
                { replacements: { idUser: user.id }, type: QueryTypes.SELECT }
            )
        ]);

        const historique = rawBets.map(b => {
            let statut, statut_en_cours, statut_termine, statut_annule;
            if (b.idchoixgagnant) {
                statut = 'Terminé'; statut_termine = true;
            } else if (b.datearchivage) {
                statut = 'Annulé'; statut_annule = true;
            } else {
                statut = 'En cours'; statut_en_cours = true;
            }
            return {
                poll_id: b.idpari,
                poll_intitule: b.intitule,
                choix_libelle: b.choix_libelle,
                montant: Number(b.montant).toFixed(2),
                date_str: new Date(b.datedepari).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }),
                statut,
                statut_en_cours: statut_en_cours || null,
                statut_termine: statut_termine || null,
                statut_annule: statut_annule || null
            };
        });

        res.render('profile', {
            user,
            profileData: dbUser.toJSON(),
            historique,
            noHistorique: historique.length === 0
        });
    } catch (err) {
        console.error(err);
        res.redirect('/');
    }
});

app.get('/wallet', async (req, res) => {
    const user = await getSessionUser(req);
    if (!user) return res.redirect('/login');

    try {
        const result = await sequelize.query(
            `SELECT COALESCE(SUM(m.montant), 0) AS "totalMise"
             FROM mise m JOIN pari p ON m.idpari = p.id
             WHERE m.iduser = :idUser AND p.actif = true;`,
            { replacements: { idUser: user.id }, type: QueryTypes.SELECT }
        );
        const totalMise = Number(result[0].totalMise).toFixed(2);
        res.render('wallet', { user, totalMise });
    } catch (err) {
        console.error(err);
        res.redirect('/');
    }
});

app.get('/admin', async (req, res) => {
    const user = await getSessionUser(req);
    if (!user) return res.redirect('/login');
    if (!user.admin) return res.redirect('/');

    try {
        const includeChoixTag = [
            { model: choixModel, as: 'idchoix_choixes', attributes: ['id', 'libelle'], through: { attributes: [] } },
            { model: tagModel, as: 'idtag_tags', attributes: ['id', 'libelle'], through: { attributes: [] } }
        ];

        const [pendingPolls, activePolls, allUsers, allTags] = await Promise.all([
            pariModel.findAll({ where: { approuve: false, datearchivage: null }, include: includeChoixTag }),
            pariModel.findAll({ where: { approuve: true, actif: true }, include: includeChoixTag }),
            userModel.findAll({ attributes: ['id', 'admin', 'nom', 'prenom', 'pseudo', 'ban', 'mail', 'solde'] }),
            tagModel.findAll({ attributes: ['id', 'libelle'] })
        ]);

        res.render('admin', {
            user,
            pendingPolls: pendingPolls.map(p => p.toJSON()),
            activePolls: activePolls.map(p => p.toJSON()),
            allUsers: allUsers.map(u => u.toJSON()),
            allTags: allTags.map(t => t.toJSON())
        });
    } catch (err) {
        console.error(err);
        res.redirect('/');
    }
});

app.get('/polls/submit', async (req, res) => {
    const user = await getSessionUser(req);
    if (!user) return res.redirect('/login');

    try {
        const allTags = await tagModel.findAll({ attributes: ['id', 'libelle'] });
        res.render('submit-poll', { user, allTags: allTags.map(t => t.toJSON()) });
    } catch (err) {
        console.error(err);
        res.redirect('/');
    }
});

app.get('/polls/:id', async (req, res) => {
    try {
        const user = await getSessionUser(req);

        const poll = await pariModel.findByPk(req.params.id, {
            include: [
                { model: choixModel, as: 'idchoix_choixes', attributes: ['id', 'libelle'], through: { attributes: [] } },
                { model: tagModel, as: 'idtag_tags', attributes: ['id', 'libelle'], through: { attributes: [] } }
            ]
        });

        if (!poll) return res.redirect('/');

        const creator = await userModel.findByPk(poll.iduser, { attributes: ['id', 'pseudo'] });
        const pollData = poll.toJSON();

        const quotesRaw = await sequelize.query(
            `SELECT c.id, COALESCE(SUM(m.montant), 0) AS total_mise
             FROM parichoix pc
             INNER JOIN choix c ON pc.idchoix = c.id
             LEFT JOIN mise m ON m.idchoix = c.id AND m.idpari = pc.idpari
             WHERE pc.idpari = :idPari
             GROUP BY c.id`,
            { replacements: { idPari: poll.id }, type: QueryTypes.SELECT }
        );

        let userBets = {};
        if (user) {
            const userBetsRaw = await sequelize.query(
                `SELECT idchoix, SUM(montant) AS montant_user
                 FROM mise WHERE idpari = :idPari AND iduser = :idUser
                 GROUP BY idchoix`,
                { replacements: { idPari: poll.id, idUser: user.id }, type: QueryTypes.SELECT }
            );
            userBetsRaw.forEach(b => { userBets[b.idchoix] = Number(b.montant_user); });
        }

        const quoteMap = {};
        let totalVolumeChoix = 0;
        quotesRaw.forEach(q => {
            totalVolumeChoix += Number(q.total_mise);
            quoteMap[q.id] = Number(q.total_mise);
        });

        const nbChoix = (pollData.idchoix_choixes || []).length;
        pollData.idchoix_choixes = (pollData.idchoix_choixes || []).map(c => {
            const totalMise = quoteMap[c.id] || 0;
            let quote;
            if (totalVolumeChoix === 0) {
                quote = nbChoix;
            } else if (totalMise === 0) {
                quote = null;
            } else {
                quote = Number((totalVolumeChoix / totalMise).toFixed(2));
            }
            const userMise = userBets[c.id] != null ? Number(userBets[c.id]).toFixed(2) : null;
            return {
                ...c,
                totalMise: totalMise.toFixed(2),
                quote_str: quote !== null ? `x${quote}` : '-',
                userMise
            };
        });

        pollData.totalVolumeChoix = totalVolumeChoix.toFixed(2);

        if (pollData.datecloture) {
            pollData.datecloture_str = new Date(pollData.datecloture).toLocaleDateString('fr-FR', {
                day: '2-digit', month: 'long', year: 'numeric'
            });
        }

        if (pollData.datecreation) {
            pollData.datecreation_str = new Date(pollData.datecreation).toLocaleDateString('fr-FR', {
                day: '2-digit', month: 'long', year: 'numeric'
            });
        }

        res.render('poll', { user, poll: pollData, creator: creator ? creator.toJSON() : null, loggedIn: !!user });
    } catch (err) {
        console.error(err);
        res.redirect('/');
    }
});

/* -------- route back -------- */

//ça permet de rediriger les utilisateurs vers l'acceuil quand ils vont sur une route /api
app.use('/api', (req, res, next) => {
    const accept = req.headers['accept'] || '';
    if (accept.includes('text/html')) {
        return res.redirect('/');
    }
    next();
});

/* routes back publiques */
app.get("/api", (req, res) => {
    res.json({
        message : "API active"
    });
});

app.use('/api/auth', authRoute);
app.use('/api/users', usersRoute);
app.use('/api/polls', pariRoute);

/* routes back avec auth */
app.use(protect);
app.use('/api/wallets', walletRoute);

app.use(isAdmin);
app.use('/api/admin/tags', adminTagsRoute);
app.use('/api/admin/users', adminUsersRoute);
app.use('/api/admin/polls', adminPariRoute);

async function closeExpiredPolls() {
    try {
        const [, meta] = await sequelize.query(
            `UPDATE pari SET actif = false WHERE actif = true AND datecloture < NOW()`,
            { type: QueryTypes.UPDATE }
        );
        const count = meta?.rowCount ?? meta;
        if (count > 0) console.log(`[cron] ${count} pari(s) expiré(s) fermé(s) automatiquement`);
    } catch (err) {
        console.error('[cron] Erreur clôture automatique:', err.message);
    }
}

closeExpiredPolls();
setInterval(closeExpiredPolls, 5 * 60 * 1000);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});