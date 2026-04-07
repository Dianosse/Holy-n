/* modules */
const express = require('express');

require('dotenv').config();

/* routeurs */


/* middlewares */
const log = require('./src/middlewares/log');

/* initialization */
const app = express();
const PORT = process.env.PORT || 3000;

/* routes publiques */


/* routes aves auth */

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});