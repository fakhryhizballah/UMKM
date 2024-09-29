const express = require('express');
const router = express.Router();
const controller = require('../controllers');

router.get('/', controller.home);
router.get('/article', controller.article);
router.get('/maps', controller.maps);

router.get('/login', controller.login);
router.get('/admin', controller.admin);


module.exports = router;