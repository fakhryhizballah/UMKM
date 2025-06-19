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





router.get('/admin/login', controller.loginAdmin);
router.get('/user/login', controller.loginUser);
router.post('/login', admin.verifyLogin);
router.get('/admin', middeleware.checkLoginAdmin, controller.admin);
router.get('/admin/dashboard', middeleware.checkLoginAdmin, controller.dashboard);
router.get('/maps/umkm', middeleware.checkLoginAdmin, controller.adminmaps);
router.get('/admin/article', middeleware.checkLoginAdmin, controller.adminarticle);
router.post('/admin/article/add', middeleware.checkLoginAdmin, upload.single('thumbnail'), admin.addArticle);
router.delete('/admin/article/:id', middeleware.checkLoginAdmin, admin.dellArticle);
router.put('/admin/article/:id', middeleware.checkLoginAdmin, admin.updatePublished);
router.get('/admin/article/:id', admin.getArtikel);
router.post('/admin/article/:id', middeleware.checkLoginAdmin, upload.single('thumbnail'), admin.updateArtikel);
router.get('/admin/hashtag', admin.getHashtag);
router.get('/admin/articles', admin.articles);

router.get('/admin/umkm', middeleware.checkLoginAdmin, controller.adminUMKM);
router.get('/admin/akun', middeleware.checkLoginAdmin, controller.akunUMKM);
router.get('/api/admin/allUser', middeleware.checkLoginAdmin, admin.getAllUser);
router.put('/api/admin/user/:username', middeleware.checkLoginAdmin, admin.updateUser);
router.put('/api/admin/userlevel/:username', middeleware.checkLoginAdmin, admin.updateLevel);
router.get('/admin/umkm/entity/:id', middeleware.checkLoginAdmin, controller.adminDetailUMKM);
router.get('/umkm/entity/:id', controller.profilUMKM);
router.get('/api/admin/umkm/getEntity/:id', admin.getEntity);
router.put('/api/admin/umkm/getEntity/:id', admin.updateEntity);
router.get('/api/admin/umkm/getEntity', middeleware.checkLoginAdmin, admin.getAllEntity);
router.get('/admin/umkm/dashboard/kategori', middeleware.checkLoginAdmin, admin.getAllKategori);
router.get('/admin/umkm/dashboard/level', middeleware.checkLoginAdmin, admin.getAllLevel);
router.get('/admin/umkm/dashboard/kecamatan', middeleware.checkLoginAdmin, admin.getAllKecamatan);
router.get('/admin/umkm/dashboard/kabupaten', middeleware.checkLoginAdmin, admin.getAllKabupaten);
router.get('/admin/umkm/berkas/data', middeleware.checkLoginAdmin, admin.getBerkas);
router.delete('/admin/umkm/berkas/data', middeleware.checkLoginAdmin, admin.delBerkas);
router.put('/admin/umkm/berkas/data', middeleware.checkLoginAdmin, admin.updateBerkas);





router.get('/api/article/category', article.findAllcategory);
router.get('/api/article/topic/:id', article.findCategory);
router.get('/api/maps', user.findMaps);

router.post('/api/user/username', user.cekUsername);
router.post('/api/user/register', user.userRegister);
router.post('/api/user/addEntity', uploadMultiple.fields([{ name: "logousaha", maxCount: 1 }, { name: "fotoproduk", maxCount: 10 }]), user.addEntity);
router.get('/api/user/getEntity', middeleware.checkLoginUser, user.getAllEntity);
router.get('/api/user/showStatus/:id', middeleware.checkLoginUser, user.showStatus);
router.get('/api/user/profile', middeleware.checkLoginUser, user.getProfile);
router.put('/api/user/profile', middeleware.checkLoginUser, user.updateProfile);
router.put('/api/user/profile/alamat', middeleware.checkLoginUser, user.updateAlamat);
router.post('/api/user/pp', middeleware.checkLoginUser, upload.single('picture'), user.postPicture);
router.get('/api/user/berkas/data', middeleware.checkLoginUser, user.berkas);
router.post('/api/user/berkas/data', middeleware.checkLoginUser, upload.single('url_data'), user.postBerkas);
router.delete('/api/user/berkas/data', middeleware.checkLoginUser, user.delBerkas);


router.get('/user/dashboard', middeleware.checkLoginUser, controller.adminUserAkun);
router.get('/user/home', middeleware.checkLoginUser, controller.adminUserHome);

router.get('/logout', middeleware.logout);


module.exports = router;