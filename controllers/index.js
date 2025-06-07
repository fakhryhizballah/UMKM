const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET_KEY;
const { token } = require("morgan");
const { User, Blog, Category } = require("../models");
// const { Op } = require("sequelize");
module.exports = {

    home: async (req, res) => {
        let berita = await Blog.findAll({
            where: {
                // category: { [Op.like]: `%%` },
                status: 'published'
            },
            attributes: ['id', 'slug', 'title', 'thumbnail', 'description', 'category'],
            order: [['createdAt', 'DESC']],
        })
        // data.dataValues.category = JSON.parse(data.dataValues.category);
        for (x of berita) {
            x.dataValues.category = JSON.parse(x.dataValues.category);
        }
        console.log(berita);
        let data = {
            title: "Home | WEB GIS",
            berita
        };
        res.render("user/home", data);
    },
    articles: (req, res) => {
        let data = {
            title: "articles | WEB GIS",
        };
        res.render("user/articles", data);
    },
    article: async (req, res) => {
        let id = req.params.id;
        console.log(id);
        try {
            let artikel = await Blog.findOne({
                where: {
                    slug: id
                }
            })
            console.log(artikel);
            if (artikel == null) {
                res.redirect('/articles');
            }
            let data = {
                title: "article | WEB GIS",
                artikel
            };
            res.render("user/article", data);

        } catch (err) {
            console.log(err);
            res.redirect('/articles');
        }

    },
    maps: (req, res) => {
        let data = {
            title: "maps | WEB GIS",
        };
        res.render("user/maps", data);
    },
    register: (req, res) => {
        let random = Math.floor(Math.random() * 1000000);
        console.log(random);
        let data = {
            title: "register | WEB GIS",
            token: req.cookies.token
        };
        res.render("user/register", data);

    },
    loginAdmin: (req, res) => {
        let data = {
            title: "login | WEB GIS",
        };
        res.render("admin/login", data);
    },
    loginUser: (req, res) => {
        let data = {
            title: "login User | WEB GIS",
        };
        res.render("admin/loginUser", data);
    },
    admin: (req, res) => {
        let data = {
            title: "admin | WEB GIS",
        };
        res.render("admin/admin", data);
    },
    dashboard: (req, res) => {
        let data = {
            title: "dashboard | WEB GIS",
        };
        res.render("admin/dashboard", data);
    },
    adminmaps: (req, res) => {
        let data = {
            title: "Maps Admin | WEB GIS",
        };
        res.render("admin/maps", data);
    },
    adminarticle: (req, res) => {
        let data = {
            title: "Article  | WEB GIS",
        };
        res.render("admin/article", data);
    },
    adminUMKM: (req, res) => {
        let data = {
            title: "Verifikasi UMKM  | WEB GIS",
        };
        res.render("admin/umkm", data);
    },
    adminDetailUMKM: (req, res) => {
        let id = req.params.id;
        let data = {
            title: "Verifikasi UMKM  | WEB GIS",
            id: id
        };
        res.render("admin/detailumkm", data);
    },
    adminUserHome: (req, res) => {
        let data = {
            title: "User Home  | WEB GIS",
        };
        res.render("adminUser/homeUser", data);
    },
};