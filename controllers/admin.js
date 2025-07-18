const jwt = require("jsonwebtoken");
const axios = require("axios");
const { Sequelize, sequelize, User, Blog, Category, Province, Regency, District, Village, Entity, Location, Product, file, profile, Proposal, RiwayatProposal, Entity_Status } = require("../models");
const { Op } = require("sequelize");
const secretKey = process.env.JWT_SECRET_KEY;
const payload = {
    gid: "Server Side",
};
module.exports = {
    verifyLogin: async (req, res) => {
        let body = req.body;
        try {
            let useraccount = await User.findOne({
                where: {
                    [Op.or]: [{ username: body.username }, { email: body.username }],
                    password: body.password,
                },
            });
            console.log(useraccount);
            if (!useraccount) {
                return res.status(400).json({
                    error: true,
                    message: "Username atau password salah!",
                });
            }
            // create jwt
            let token = jwt.sign(
                {
                    id: useraccount.id,
                    username: useraccount.username,
                    email: useraccount.email,
                    fullName: useraccount.fullName,
                    role: useraccount.role
                },
                secretKey,
                { expiresIn: 60 * 60 * 24 * 7 }
            );
            // set cookie
            res.cookie("token", token, {
                maxAge: 1000 * 60 * 60 * 24 * 7,
                httpOnly: false,
            });
            return res.status(200).json({
                error: false,
                message: "Selamat datang, " + useraccount.fullName + "!",
                role: useraccount.role,
            });
        } catch (err) {
            console.log(err);
            return res.status(400).json({
                error: true,
                message: "something went wrong!",
            });
        }

    },
    addArticle: async (req, res) => {
        let body = req.body;
        console.log("body");
        let path = req.file.path;
        console.log(path);
        path = path.split("public/cache/")[1];
        body.thumbnail = '/asset/cdn/' + path;

        console.log(path);
        console.log(body.thumbnail);
        console.log(body);
        try {
            let label = body.label;
            label = label.split(",");
            console.log(label);
            let categoris = [];
            for (let x of label) {
                let slug = x.toLowerCase()
                    .replace(/[^a-z\s]/g, "") // Hapus karakter selain huruf dan spasi
                    .replace(/\s+/g, "-");    // Ganti spasi dengan "-"
                let category = await Category.findOne({
                    where: {
                        slug: slug
                    }
                })
                if (!category) {
                    category = await Category.create({
                        slug: slug,
                        name: x
                    })
                    categoris.push(x);
                } else {
                    categoris.push(category.name);
                }
                // body.categoryId = category.id;
            }
            categoris = JSON.stringify(categoris);
            let token = req.cookies.token;
            const secretKey = process.env.JWT_SECRET_KEY;
            const decoded = jwt.verify(token, secretKey);
            console.log(decoded);
            let addBlog = await Blog.create({
                title: body.title,
                slug: body.title.toLowerCase()
                    .replace(/[^a-z\s]/g, "")
                    .replace(/\s+/g, "-"),
                description: body.description,
                content: body.content,
                thumbnail: body.thumbnail,
                category: categoris,
                author: decoded.username,
                status: 'draft'
            })
            return res.status(200).json({
                error: false,
                message: "Artikel berhasil ditambahkan!",
            });
        } catch (err) {
            console.log(err);
            if (err.errors[0].validatorKey == "not_unique") {
                return res.status(400).json({
                    error: true,
                    message: "Judul artikel sudah ada!",
                });
            }
            return res.status(500).json({
                error: true,
                message: "something went wrong!",
            });
        }
    },
    articles: async (req, res) => {
        try {
            let data = await Blog.findAll()
            return res.status(200).json({
                error: false,
                message: "Data Artikel",
                data: data
            });
        } catch (err) {
            console.log(err);
            return res.status(400).json({
                error: true,
                message: "something went wrong!",
            });
        }
    },
    dellArticle: async (req, res) => {
        let id = req.params.id;
        try {
            await Blog.destroy({
                where: {
                    id: id
                }
            })
            return res.status(200).json({
                error: false,
                message: "Artikel berhasil dihapus!",
            });
        } catch (err) {
            console.log(err);
            return res.status(400).json({
                error: true,
                message: "something went wrong!",
            });
        }
    },
    updatePublished: async (req, res) => {
        let id = req.params.id;
        try {
            let blog = await Blog.findOne({
                where: {
                    id: id
                },
                attributes: ['status']
            })
            console.log(blog);
            let update = blog.dataValues.status == 'published' ? 'draft' : 'published';
            await Blog.update({
                status: update
            }, {
                where: {
                    id: id
                }
            })
            return res.status(200).json({
                error: false,
                message: "Artikel berhasil diubah!",
            });
        } catch (err) {
            console.log(err);
            return res.status(400).json({
                error: true,
                message: "something went wrong!",
            });
        }
    },
    getArtikel: async (req, res) => {
        let id = req.params.id;
        try {
            let artikel = await Blog.findOne({
                where: {
                    id: id
                }
            })
            console.log(artikel.category);
            artikel.category = JSON.parse(artikel.category);
            console.log(artikel);

            return res.status(200).json({
                error: false,
                message: "Data Artikel",
                data: artikel
            });
        } catch (err) {
            console.log(err);
            return res.status(400).json({
                error: true,
                message: "something went wrong!",
            });
        }
    },
    updateArtikel: async (req, res) => {
        let id = req.params.id;
        let body = req.body;
        console.log(body);
        try {
            let blog = await Blog.findOne({
                where: {
                    id: id
                }
            })
            if (body.thumbnail != 'undefined') {
                let path = req.file.path;
                console.log(path);
                path = path.split("public/cache/")[1];
                body.thumbnail = '/asset/cdn/' + path;
                await blog.update({
                    thumbnail: body.thumbnail
                })
            }
            if (body.label != '') {
                let label = body.label;
                label = label.split(",");
                console.log(label);
                let categoris = [];
                for (let x of label) {
                    let slug = x.toLowerCase()
                        .replace(/[^a-z\s]/g, "")
                        .replace(/\s+/g, "-");
                    console.log(slug);
                    categoris.push(slug);
                    let category = await Category.findOne({
                        where: {
                            slug: slug
                        }
                    })
                    if (!category) {
                        category = await Category.create({
                            slug: slug,
                            name: x
                        })
                    }
                    // body.categoryId = category.id;
                }
                categoris = JSON.stringify(categoris);
                await blog.update({
                    category: categoris
                })
            }
            await blog.update({
                title: body.title,
                slug: body.title.toLowerCase()
                    .replace(/[^a-z\s]/g, "")
                    .replace(/\s+/g, "-"),
                description: body.description,
                content: body.content
            })
            // await blog.update({
            //     title: body.title,
            //     slug: body.title.replace(/\s+/g, '-').toLowerCase(),
            //     description: body.description,
            //     content: body.content,
            //     category: body.category
            // })
            // await Blog.update({
            //     title: body.title,
            //     slug: body.title.replace(/\s+/g, '-').toLowerCase(),
            //     description: body.description,
            //     content: body.content,
            //     thumbnail: body.thumbnail,
            //     category: JSON.stringify(body.category)
            // }, {
            //     where: {
            //         id: id
            //     }
            // })
            return res.status(200).json({
                error: false,
                message: "Artikel berhasil diubah!",
            });
        } catch (err) {
            console.log(err);
            return res.status(400).json({
                error: true,
                message: "something went wrong!",
            });
        }
    },
    getHashtag: async (req, res) => {
        try {
            let data = await Category.findAll()
            return res.status(200).json({
                error: false,
                message: "Data Hashtag",
                data: data
            });
        } catch (err) {
            console.log(err);
            return res.status(400).json({
                error: true,
                message: "something went wrong!",
            });
        }
    },
    getAllEntity: async (req, res) => {
        try {
            res.setHeader('Content-Type', 'application/json');
            let data = await Entity.findAll({
                include: [
                    {
                        model: User,
                        as: 'user',
                    },
                    {
                    model: Location,
                    attributes: ['id', 'address']
                    }]
            })
            return res.status(200).json({
                error: false,
                message: "Data Entity",
                data: data
            });
        } catch (err) {
            console.log(err);
            return res.status(400).json({
                error: true,
                message: "something went wrong!",
                error: err
            });
        }
    },
    getEntity: async (req, res) => {
        let id = req.params.id;
        console.log(id);
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
                    }, {
                        model: User,
                        as: 'user',
                        attributes: ['fullName', 'email', 'noWa']
                    }
                ]
            })
            return res.status(200).json({
                error: false,
                message: "Data Entity",
                data: dataentity
            });
        } catch (err) {
            console.log(err);
            return res.status(400).json({
                error: true,
                message: "something went wrong!",
            });
        }
    },
    updateEntity: async (req, res) => {
        let id = req.params.id;
        let t = await sequelize.transaction();
        try {
            let buffer = Buffer.from(id, 'base64');
            let idDecoded = buffer.toString('utf8');
            idDecoded = idDecoded.split("#");
            let idEntity = Buffer.from(idDecoded[1], 'base64')
            idEntity = idEntity.toString('utf8');
            let massage = req.body.message;
            let data = await Entity.update(
                { status: req.body.status },
                {
                    where: {
                        id: idEntity
                    }
                }, { transaction: t })
            await Entity_Status.create({
                entityId: idEntity,
                message: massage,
                status: req.body.status
            }, { transaction: t })
            await t.commit();
            return res.status(200).json({
                error: false,
                message: "Entity berhasil diubah!",
                data: data
            });
        } catch (err) {
            console.log(err);
            await t.rollback();
            return res.status(400).json({
                error: true,
                message: "something went wrong!",
            });
        }
    },
    getAllKategori: async (req, res) => {
        try {
            const data = await Entity.findAll({
                attributes: [
                    'kategoriusaha',
                    [Sequelize.fn('COUNT', Sequelize.col('kategoriusaha')), 'count']
                ],
                where: {
                    status: "accepted"
                },
                group: ['kategoriusaha'],
            });
            return res.status(200).json({
                error: false,
                message: "Data Kategori",
                data: data
            });
        } catch (err) {
            console.log(err);
            return res.status(400).json({
                error: true,
                message: "something went wrong!",
            });
        }
    },
    getAllLevel: async (req, res) => {
        try {
            let data = await User.findAll({
                attributes: [
                    ['level', 'levelusaha'],
                    [Sequelize.fn('COUNT', Sequelize.col('level')), 'count']
                ],
                group: ['level'],
                where: {
                    role: "user",
                    level: {
                        [Op.ne]: null
                    }
                }
            })

            return res.status(200).json({
                error: false,
                message: "Data Level Usaha",
                data: data
            });
        } catch (err) {
            console.log(err);
            return res.status(400).json({
                error: true,
                message: "something went wrong!",
            });
        }
    },
    getAllKecamatan: async (req, res) => {
        try {
            const data = await Entity.findAll({
                where: {
                    status: "accepted"
                },
                include: [{
                    model: Location,
                    attributes: ['district'],
                    include: [{
                        model: District,
                        as: 'dist',
                        attributes: ['id', 'name']
                    }]
                }],
                attributes: [
                    [Sequelize.fn('COUNT', Sequelize.col('Location.dist.name')), 'count']
                ],
                group: ['Location.dist.name']
            });
            return res.status(200).json({
                error: false,
                message: "Data Kecamatan",
                data: data
            });
        } catch (err) {
            console.log(err);
            return res.status(400).json({
                error: true,
                message: "something went wrong!",
            });
        }
    },
    getAllKabupaten: async (req, res) => {
        try {
            const data = await Entity.findAll({
                where: {
                    status: "accepted"
                },
                include: [{
                    model: Location,
                    attributes: ['regency'],
                    include: [{
                        model: Regency,
                        as: 'regen',
                        attributes: ['id', 'name']
                    }]
                }],
                attributes: [
                    [Sequelize.fn('COUNT', Sequelize.col('Location.regen.name')), 'count']
                ],
                group: ['Location.regen.name']
            });
            return res.status(200).json({
                error: false,
                message: "Data Kabupaten",
                data: data
            });
        } catch (err) {
            console.log(err);
            return res.status(400).json({
                error: true,
                message: "something went wrong!",
            });
        }  
    },
    getBerkas: async (req, res) => {
        try {
            let data = await file.findAll()
            return res.status(200).json({
                error: false,
                message: "Data Berkas",
                data: data
            });
        } catch (err) {
            console.log(err);
            return res.status(400).json({
                error: true,
                message: "something went wrong!",
            });
        }
    },
    delBerkas: async (req, res) => {
        let body = req.body;
        try {
            let data = await file.destroy({
                where: {
                    id: body.id
                }
            })
            return res.status(200).json({
                error: false,
                status: 200,
                message: "Data berhasil dihapus!",
                data: data
            });
        } catch (err) {
            console.log(err);
            return res.status(400).json({
                error: true,
                status: 400,
                message: "something went wrong!",
            });
        }
    },
    updateBerkas: async (req, res) => {
        let body = req.body;
        try {
            let data = await file.update({
                status: body.status,
                catatan: body.catatan
            }, {
                where: {
                    id: body.id
                }
            })
            return res.status(200).json({
                error: false,
                status: 200,
                message: "Data berhasil diupdate!",
                data: data
            });
        } catch (err) {
            console.log(err);
            return res.status(400).json({
                error: true,
                status: 400,
            }
            );
        }
    },
    getAllProposal: async (req, res) => {
        const currentDate = new Date();
        const oneMonthAgo = new Date(currentDate);
        oneMonthAgo.setMonth(currentDate.getMonth() - 1);
        try {
            let data = await Proposal.findAll({
                attributes: { exclude: ['latar_belakang', 'isi_proposal', 'jenis_bantuan'] },
                include: [{
                    model: RiwayatProposal,
                    as: 'riwayat_proposal',
                    order: [['tanggal', 'DESC']],
                    attributes: ['status', 'catatan', 'tanggal'],
                    limit: 1,
                }],
                order: [['createdAt', 'DESC']],

            })
            data = filterProposal(data)
            return res.status(200).json({
                error: false,
                message: "Data Proposal",
                data: data
            });
        } catch (err) {
            console.log(err);
            return res.status(400).json({
                error: true,
                message: "something went wrong!",
            });
        }
    },
    tinjauProposal: async (req, res) => {
        let id = req.params.id;
        let body = req.body;
        try {
            let proposal = await Proposal.findOne({
                where: {
                    id: id
                }
            })
            if (!proposal) {
                return res.status(400).json({
                    error: true,
                    message: "Proposal tidak ditemukan!",
                });
            }
            await RiwayatProposal.create({
                proposal_id: proposal.id,
                status: body.status,
                catatan: body.catatan,
                tanggal: new Date()
            })

            return res.status(200).json({
                error: false,
                message: "Data Proposal",
                data: proposal
            });
        } catch (err) {
            console.log(err);
            return res.status(400).json({
                error: true,
                message: "something went wrong!",
            });
        }

    },
    getAllUser: async (req, res) => {
        try {
            let data = await User.findAll({
                where: {
                    role: 'user'
                },
                attributes: { exclude: ['role', 'id', 'updatedAt'] }
            })
            return res.status(200).json({
                error: false,
                message: "Data User",
                data: data
            });
        } catch (err) {
            console.log(err);
            return res.status(400).json({
                error: true,
                message: "something went wrong!",
            });
        }
    },
    updateUser: async (req, res) => {
        let username = req.params.username;
        try {
            let user = await User.findOne({
                where: {
                    username: username
                }
            })
            if (!user) {
                return res.status(404).json({
                    error: true,
                    message: "User not found!",
                });
            }
            await user.update({
                status: user.status == '1' ? '0' : '1'
            })
            return res.status(200).json({
                error: false,
                message: "User berhasil diubah!",
            });
        } catch (err) {
            console.log(err);
            if (err.errors[0].validatorKey == "not_unique") {
                return res.status(400).json({
                    error: true,
                    message: "Username atau email sudah ada!",
                });
            }
            return res.status(500).json({
                error: true,
                message: "something went wrong!",
            });
        }
    },
    updateLevel: async (req, res) => {
        let username = req.params.username;
        let level = req.body.level;
        try {
            let user = await User.findOne({
                where: {
                    username: username
                }
            })
            if (!user) {
                return res.status(404).json({
                    error: true,
                    message: "User not found!",
                });
            }
            await user.update({
                level: level
            })
            return res.status(200).json({
                error: false,
                message: "Level user berhasil diubah!",
            });
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                error: true,
                message: "something went wrong!",
            });
        }
    }   

}
function filterProposal(data) {
    const currentDate = new Date();
    const oneMonthAgo = new Date(currentDate);
    oneMonthAgo.setMonth(currentDate.getMonth() - 1);

    return data.filter(item => {
        // Cek apakah ada riwayat_proposal
        if (!item.riwayat_proposal || item.riwayat_proposal.length === 0) {
            return true; // Tetap simpan jika tidak ada riwayat
        }

        const firstHistory = item.riwayat_proposal[0];
        const proposalDate = new Date(firstHistory.tanggal);

        // Hapus jika status adalah "Pengajuan" DAN tanggal lebih dari 1 bulan
        if (firstHistory.status === "Pengajuan" && proposalDate < oneMonthAgo) {
            return false; // Hapus item ini
        }

        return true; // Simpan item ini
    });
}