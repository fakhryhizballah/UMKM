const jwt = require("jsonwebtoken");
const axios = require("axios");
const { User } = require("../models");
const { Op } = require("sequelize");
const secretKey = process.env.SECRET_KEY;
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

}