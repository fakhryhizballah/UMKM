const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET_KEY;
const { token } = require("morgan");
const { User, Entity, Blog, Category,
    Province,
    Regency,
    District,
    Village,
    Location,
    Product,
    Proposal,
    RiwayatProposal
} = require("../models");
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
    akunUMKM: (req, res) => {
        let data = {
            title: "Akun UMKM  | WEB GIS",
        };
        res.render("admin/akun", data);
    },
    proposalUMKM: (req, res) => {
        let data = {
            title: "Proposal UMKM  | WEB GIS",
        };
        res.render("admin/proposal", data);
    },
    detailProposalUMKM: async (req, res) => {
        let id = req.params.id;
        let dataProposal = await Proposal.findOne({
            where: {
                id: id
            },
            include: [{
                model: RiwayatProposal,
                as: 'riwayat_proposal',
            }]
        })
        dataProposal.tanggal = new Date(dataProposal.dataValues.createdAt).toLocaleString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        let riwayat = [];
        for (x of dataProposal.riwayat_proposal) {
            let data = {
                status: x.status,
                catatan: x.catatan
            }
            data.tanggal = new Date(x.tanggal).toLocaleString('id-ID', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
            riwayat.push(data);
        }
        console.log(dataProposal)
        let data = {
            title: "Proposal UMKM  | WEB GIS",
            id: id,
            data: dataProposal,
            riwayat: riwayat
        };
        res.render("admin/detailProposal", data);
    },
    profilUMKM: async (req, res) => {
        let id = req.params.id;
        try {
            let buffer = Buffer.from(id, 'base64');
            let idDecoded = buffer.toString('utf8');
            idDecoded = idDecoded.split("#");
            let idEntity = Buffer.from(idDecoded[1], 'base64')
            idEntity = idEntity.toString('utf8');
            let dataentity = await Entity.findOne({
                where: {
                    id: idEntity
                },
                include: [{
                    model: Location,
                    // attributes: ['id', 'address', 'status']
                    include: [{
                        model: Province,
                        as: 'prov'
                    },
                    {
                        model: Regency,
                        as: 'regen'
                    },
                    {
                        model: District,
                        as: 'dist'
                    },
                    {
                        model: Village,
                        as: 'vill'
                    }
                    ],

                }, {
                    model: Product,
                    attributes: ['id', 'url']
                }]
            })
            console.log(dataentity);
            if (dataentity == null) {
                return res.status(404).json({
                    error: true,
                    message: "Entity not found"
                });
            }
            let data = {
                title: "Profil UMKM  | WEB GIS",
                id: id,
                data: {
                    title: dataentity.badanusaha,
                    dataentity,
                    // token: req.cookies.token
                }
            };
            res.render("user/profileUMKM", data);
        } catch (err) {
            return res.redirect('/');
        }
    },
    adminUserHome: (req, res) => {
        let data = {
            title: "User Home  | WEB GIS",
        };
        res.render("adminUser/homeUser", data);
    },
    adminUserProposal: (req, res) => {
        let data = {
            title: "Proposal  | WEB GIS",
        };
        res.render("adminUser/proposal", data);
    },
    adminUserAkun: (req, res) => {
        let data = {
            title: "Dashboard User  | WEB GIS",
        };
        res.render("adminUser/dashboardAkun", data);
    },
};