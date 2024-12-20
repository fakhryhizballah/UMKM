const jwt = require("jsonwebtoken");
const { User } = require("../models");
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

        const secretKey = process.env.JWT_SECRET_KEY;
        const decoded = jwt.verify(token, secretKey);
        if (!decoded) {
            return res.redirect("/");
        }
        if (decoded.role != "admin") {
            return res.redirect("/");
        }
        next();
        // decoded.role == "admin" ? next() : return res.redirect("/");
    },
    checkLoginUser: (req, res, next) => {
        const token = req.cookies.token;
        if (!token) {
            return res.redirect("/");
        }
        const secretKey = process.env.JWT_SECRET_KEY;
        const decoded = jwt.verify(token, secretKey);
        if (!decoded) {
            return res.redirect("/");
        }
        if (decoded.role != "user") {
            return res.redirect("/");
        }
        next();
    },
    logout: (req, res) => {
        res.clearCookie("token");
        return res.redirect("/login");
    }
};