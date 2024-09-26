const express = require('express');
const router = express.Router();
const controller = require('../controllers');

router.get('/', controller.home);
router.get('/article', controller.article);

module.exports = router;