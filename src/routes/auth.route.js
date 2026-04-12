const authController = require('../controllers/auth.controller');
const protect = require("../middlewares/auth");

const router = require('express').Router();

router.route('/register').post(authController.registerUser);

router.route('/login').post(authController.loginUser);

router.use(protect);

router.route('/logout').post(authController.logoutUser);

module.exports = router;