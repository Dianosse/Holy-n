const authController = require('../controllers/auth.controller');
const protect = require("../middlewares/auth");

const router = require('express').Router();

router.route('/register').post(authController.registerUser);                    // fait

router.route('/login').post(authController.loginUser);                          // fait

router.use(protect);

router.route('/logout').post(authController.logoutUser);                        // fait

router.route('/me').get(authController.getMe);                                  // fait

module.exports = router;