const walletController = require('../controllers/wallet.controller');

const router = require('express').Router();

router.route('/me').get(walletController.getPersonnalWallet);                   // ---> fait

router.route('/deposit').post(walletController.postDepositMoney);               // ---> fait

router.route('/withdraw').post(walletController.postWithdrawMoney);             // ---> fait

module.exports = router;
