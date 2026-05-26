const usersController = require('../controllers/users.controller');
const protect = require("../middlewares/auth");

const router = require('express').Router();

router.route('/leaderbord').get(usersController.getLeaderbord);

router.route('/me').put(protect, usersController.modifyUser)                // fait
                            .delete(protect, usersController.deleteUser);         // fait

router.route('/me/bets').get(protect, usersController.getUserBets);         // fait

router.route('/me/polls').get(protect, usersController.getUserPolls);       // fait

router.route('/:id').get(usersController.getUserById);                      // fait

router.route('/:id/stats').get(usersController.getUserStatsById);

router.route('/:id/polls').get(usersController.getUserPollsById);           // fait

module.exports = router;