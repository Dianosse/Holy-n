const usersController = require('../controllers/users.controller');
const protect = require("../middlewares/auth");

const router = require('express').Router();

router.route('/leaderboard').get(usersController.getLeaderboard);            // fait

router.route('/me').put(protect, usersController.modifyUser)                // fait
                            .delete(protect, usersController.deleteUser);         // fait

router.route('/me/bets').get(protect, usersController.getUserBets);         // fait

router.route('/me/polls').get(protect, usersController.getUserPolls);       // fait

router.route('/search').get(usersController.searchUsers);                   // fait

router.route('/:id').get(usersController.getUserById);                      // fait

router.route('/:id/stats').get(usersController.getUserStatsById);           // fait

router.route('/:id/polls').get(usersController.getUserPollsById);           // fait

router.route('/:id/follow').post(protect, usersController.postFollowUserById)               // fait
                                    .delete(protect, usersController.deleteFollowUserById);       // fait

router.route('/:id/followers').get(protect, usersController.getFollowersById);              // fait

router.route('/:id/following').get(protect, usersController.getFollowingById);              // fait

module.exports = router;