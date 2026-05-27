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

/* initialization */
const app = express();
const PORT = process.env.PORT || 3000;

/* models */
const { users: userModel, tag: tagModel } = require('./src/models');

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

/* -------- route front -------- */

app.get('/', async (req, res) => {
    let user = null;

    if (req.session?.user) {
        try {
            const dbUser = await userModel.findByPk(req.session.user.id, {
                attributes: ['id', 'pseudo', 'admin', 'solde']
            });
            if (dbUser) {
                user = {
                    pseudo: dbUser.pseudo,
                    pseudo_initial: dbUser.pseudo.charAt(0).toUpperCase(),
                    admin: dbUser.admin || undefined,
                    solde: Number(dbUser.solde).toFixed(2)
                };
            } else {
                req.session.destroy(() => {});
            }
        } catch (err) {
            console.error(err);
        }
    }

    // ---Route pas encore codée--- GET /api/polls : getAllPolls non terminé côté back
    const paris = [];

    let tags = [];
    try {
        const allTags = await tagModel.findAll({ attributes: ['libelle'] });
        tags = allTags.map((t, i) => ({ libelle: t.libelle, actif: i === 0 }));
    } catch (err) {
        console.error(err);
    }

    res.render('home', { user, paris, tags });
});

app.get('/login', (req, res) => {
    if (req.session?.user) return res.redirect('/');
    res.render('login', { user: null, hideSearch: true });
});

app.get('/register', (req, res) => {
    if (req.session?.user) return res.redirect('/');
    res.render('register', { user: null, hideSearch: true });
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

app.use('/api/admin/tags', adminTagsRoute);
app.use('/api/admin/users', adminUsersRoute);
app.use('/api/admin/polls', adminPariRoute);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});