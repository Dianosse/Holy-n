/* modules */
const express = require('express');
const session = require('express-session');

require('dotenv').config();

/* routeurs */
const authRoute = require('./src/routes/auth.route');

/* middlewares */
const log = require('./src/middlewares/log');
const protect = require('./src/middlewares/auth');

/* initialization */
const app = express();
const PORT = process.env.PORT || 3000;

app.use(log);
app.use(express.json());
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

/* routes publiques */
app.get("/", (req, res) => {
    res.json({
        message : "API active"
    });
});

app.use('/auth', authRoute);

/* routes avec auth */
app.use(protect);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});