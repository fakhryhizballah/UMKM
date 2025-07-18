const jwt = require("jsonwebtoken");
const axios = require("axios");
const { User, Blog, Category } = require("../models");
const { Op } = require("sequelize");
const secretKey = process.env.JWT_SECRET_KEY;
const payload = {
    gid: "Server Side",
};
module.exports = {
    findAllcategory: async (req, res) => {
        try {
            let categoris = await Category.findAll()
            let data = [];
            for (let x of categoris) {
                x.dataValues.count = await Blog.count({
                    where: {
                        category: { [Op.like]: `%${x.name}%` },
                        status: 'published'
                    }
                })
                if (x.dataValues.count > 0) {
                data.push(x)
                }
            }
            data.sort((a, b) => b.dataValues.count - a.dataValues.count)
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
    findCategory: async (req, res) => {
        let id = req.params.id;
        if (id == 'all') {
            id = '%';
        }
        try {
            let data = await Blog.findAll({
                where: {
                    category: { [Op.like]: `%${id}%` },
                    status: 'published'
                },
                attributes: ['id', 'slug', 'title', 'thumbnail', 'description', 'category'],
                order: [['createdAt', 'DESC']],
            })
            // data.dataValues.category = JSON.parse(data.dataValues.category);
            for (x of data) {
                x.dataValues.category = JSON.parse(x.dataValues.category);
            }
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
    }
};