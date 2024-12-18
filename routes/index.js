const express = require('express');
const router = express.Router();
const controller = require('../controllers');
const admin = require('../controllers/admin');
const user = require('../controllers/user');
const article = require('../controllers/article');
const { upload, uploadMultiple } = require('../middleware/upload');
const middeleware = require('../middleware');


router.get('/', controller.home);
router.get('/articles', controller.articles);
router.get('/articles/detail/:id', controller.article);
router.get('/maps', controller.maps);
router.get('/register', controller.register);


router.post('/user/register', uploadMultiple.fields([{ name: "logousaha", maxCount: 1 }, { name: "fotoproduk", maxCount: 10 }]), user.register);

router.get('/login', controller.login);
router.post('/login', admin.verifyLogin);
router.get('/admin', middeleware.checkLoginAdmin, controller.admin);
router.get('/admin/dashboard', controller.dashboard);
router.get('/maps/umkm', controller.adminmaps);
router.get('/admin/article', middeleware.checkLoginAdmin, controller.adminarticle);
router.post('/admin/article/add', middeleware.checkLoginAdmin, upload.single('thumbnail'), admin.addArticle);
router.delete('/admin/article/:id', middeleware.checkLoginAdmin, admin.dellArticle);
router.put('/admin/article/:id', middeleware.checkLoginAdmin, admin.updatePublished);
router.get('/admin/article/:id', admin.getArtikel);
router.post('/admin/article/:id', middeleware.checkLoginAdmin, upload.single('thumbnail'), admin.updateArtikel);
router.get('/admin/hashtag', admin.getHashtag);
router.get('/admin/articles', admin.articles);

router.get('/admin/umkm', middeleware.checkLoginAdmin, controller.adminUMKM);
router.get('/admin/umkm/entity/:id', middeleware.checkLoginAdmin, controller.adminDetailUMKM);
router.get('/admin/umkm/getEntity/:id', admin.getEntity);
router.put('/admin/umkm/getEntity/:id', admin.updateEntity);
router.get('/admin/umkm/getEntity', middeleware.checkLoginAdmin, admin.getAllEntity);



router.get('/api/article/category', article.findAllcategory);
router.get('/api/article/topic/:id', article.findCategory);
router.get('/api/maps', user.findMaps);



module.exports = router;