const jwt = require("jsonwebtoken");
const { User, Profile } = require("../models");
const user = require("../controllers/user");
module.exports = {
    login: async (req, res, next) => {
        try {
            const token = req.cookies.token;
            res.cookie("tokens", "a", {
                httpOnly: false,
            });
            if (!token) {
                return res.redirect("/");
            }
            const secretKey = process.env.JWT_SECRET_KEY;
            const decoded = jwt.verify(token, secretKey);
            let getUser = await User.findOne({
                where: {
                    nik: decoded.id,
                },
            });
            if (!getUser) {
                res.clearCookie("token");
                return res.redirect("/");
            }

            let newToken = jwt.sign({
                id: decoded.id,
                nama: decoded.nama,
                wa: decoded.wa,
            },
                secretKey, { expiresIn: 60 * 60 * 24 * 7 }
            );
            // set cookie
            res.cookie("token", newToken, {
                maxAge: 1000 * 60 * 60 * 24 * 7,
                httpOnly: false,
            });
            req.account = getUser;
            next();
        } catch (err) {
            res.clearCookie("token");
            return res.redirect("/");
        }
    },
    checkLogin: (req, res, next) => {
        try {
            const token = req.cookies.token;

            const secretKey = process.env.JWT_SECRET_KEY;
            const decoded = jwt.verify(token, secretKey);
            if (!decoded) {
                return res.redirect("/");
            }

            next();
        } catch (err) {
            res.clearCookie("token");
            return res.redirect("/");
        }
    },
    checkLoginAdmin: (req, res, next) => {
        const token = req.cookies.token;
        if (!token) {
            return res.redirect("/");
        }
        const secretKey = process.env.JWT_SECRET_KEY;
        const decoded = jwt.verify(token, secretKey);
        if (!decoded) {
            return res.redirect("/");
        }
        if (decoded.role != "admin") {
            return res.redirect("/");
        }
        req.account = decoded;
        next();
        // decoded.role == "admin" ? next() : return res.redirect("/");
    },
    checkLoginUser: async (req, res, next) => {
        const token = req.cookies.token;
        if (!token) {
            return res.redirect("/");
        }
        const secretKey = process.env.JWT_SECRET_KEY;
        const decoded = jwt.verify(token, secretKey);
        req.account = decoded;
        if (!decoded) {
            return res.redirect("/");
        }
        if (decoded.role != "user") {
            return res.redirect("/");
        }
        let url_pp = req.cookies.url_pp;
        if (!url_pp) {
            let pp = await Profile.findOne({
                where: {
                    username: decoded.username,
                },
                attributes: ["url_pp"],
            });
            try {
                if (pp.dataValues.url_pp !== null && pp.dataValues.url_pp !== "") {
                    res.cookie("url_pp", pp.dataValues.url_pp, {
                        maxAge: 1000 * 60 * 60 * 24 * 7,
                        httpOnly: false,
                    });

                }
            } catch (error) {

            }

        }
        next();
    },
    logout: (req, res) => {
        res.clearCookie("token");
        res.clearCookie("url_pp");
        return res.redirect("/");
    }
};