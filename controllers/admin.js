const jwt = require("jsonwebtoken");
const axios = require("axios");
const { User, Blog, Category } = require("../models");
const { Op } = require("sequelize");
const secretKey = process.env.JWT_SECRET_KEY;
const payload = {
    gid: "Server Side",
};
module.exports = {
    verifyLogin: async (req, res) => {
        let body = req.body;
        console.log(body.username);
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
                let slug = x.replace(/\s+/g, '-').toLowerCase();
                console.log(slug);
                // categoris.push(slug);
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
                slug: body.title.replace(/\s+/g, '-').toLowerCase(),
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
                    let slug = x.replace(/\s+/g, '-').toLowerCase();
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
                slug: body.title.replace(/\s+/g, '-').toLowerCase(),
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
    }   

}