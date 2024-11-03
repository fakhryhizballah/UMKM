const express = require('express');
const router = express.Router();
const controller = require('../controllers');
const admin = require('../controllers/admin');

router.get('/', controller.home);
router.get('/article', controller.article);
router.get('/maps', controller.maps);

router.get('/login', controller.login);
router.post('/login', admin.verifyLogin);
router.get('/admin', controller.admin);
router.get('/maps/umkm', controller.adminmaps);
router.get('/admin/article', controller.adminarticle);


module.exports = router;