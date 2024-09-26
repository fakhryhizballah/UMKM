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
};