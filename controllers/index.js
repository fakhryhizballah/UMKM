module.exports = {
    home: (req, res) => {
        let data = {
            title: "Home | WEB GIS",
        };
        res.render("user/home", data);
    },
    article: (req, res) => {
        let data = {
            title: "article | WEB GIS",
        };
        res.render("user/article", data);
    },
    maps: (req, res) => {
        let data = {
            title: "maps | WEB GIS",
        };
        res.render("user/maps", data);
    },
    login: (req, res) => {
        let data = {
            title: "login | WEB GIS",
        };
        res.render("admin/login", data);
    },
    admin: (req, res) => {
        let data = {
            title: "admin | WEB GIS",
        };
        res.render("admin/admin", data);
    },
};