const adminUsersController = require('../controllers/adminUsers.controller');
const router = require('express').Router();

router.route('/').get(adminUsersController.getAllUsers);                                // ---> fait

router.route('/:id/ban').patch(adminUsersController.patchBanUserById);                  // ---> fait

router.route('/:id/unban').patch(adminUsersController.patchUnbanUserById);              // ---> fait


module.exports = router;
