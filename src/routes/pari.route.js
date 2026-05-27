const pariController = require('../controllers/pari.controller');
const protect = require("../middlewares/auth");

const router = require('express').Router();

router.route('/').get(pariController.getAllPolls);                                  // ---> fait

router.route('/:id').get(pariController.getPollById)                                // ---> fait
                            .delete(protect, pariController.deletePollById);              // ---> fait

router.route('/tags').get(pariController.getAllTags);                               // ---> fait

router.route('/:id/bets').post(protect, pariController.postBet)                     // ---> fait
                                .get(pariController.getBets);                             // ---> fait

router.route('/submit').post(protect, pariController.postSubmitPoll);               // ---> fait

router.route('/:id/quotes').get(pariController.getQuoteAllChoicesById);             // ---> fait

module.exports = router;