const pariController = require('../controllers/pari.controller');
const protect = require("../middlewares/auth");

const router = require('express').Router();

router.route('/').get(pariController.getAllPolls);

router.route('/:id').get(pariController.getPollById)
                    .delete(protect, pariController.deletePollById);

router.route('/tags').get(pariController.getAllTags);

router.route('/:id/bets').post(protect, pariController.postBet)
                          .get(pariController.getBets);

router.route('/submit').post(protect, pariController.postSubmitPoll);

router.route('/:id/quotes').get(pariController.getQuoteAllChoicesById);

router.route('/:id/chart-data').get(pariController.getChartData);

module.exports = router;
