const adminTagsController = require('../controllers/adminTags.controller');
const router = require('express').Router();

router.route('/').post(adminTagsController.postCreateTag);                          // ---> fait

router.route('/:id').delete(adminTagsController.deleteTagById);

module.exports = router;