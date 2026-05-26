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

/* mustache */
app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', path.join(__dirname, 'src/views'));


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

app.get("/", (req, res) => {
    res.render("home", {
        user: req.session.user
    });
});

app.get("/register", (req, res) => {
    res.render("register");
});

/* -------- route back -------- */

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