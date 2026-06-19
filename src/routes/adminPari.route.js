const adminPariController = require('../controllers/adminPari.controller');
const router = require('express').Router();

router.route('/pending').get(adminPariController.getAllPollsPending);               // ---> fait

router.route('/:id/accept').patch(adminPariController.patchAcceptPoll);             // ---> fait

router.route('/:id/refuse').patch(adminPariController.patchRefusePoll);             // ---> fait

router.route('/:id/close').patch(adminPariController.patchClosePoll);               // ---> fait

router.route('/:id/force-close').patch(adminPariController.patchForceClosePoll);   // ---> fait

router.route('/:id/resolve').patch(adminPariController.patchResolvePoll);           // ---> fait

router.route('/:id/redistribute').patch(adminPariController.patchRedistributePoll); // ---> fait


module.exports = router;