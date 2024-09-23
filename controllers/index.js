module.exports = {
    home: (req, res) => {
        let data = {
            title: "Home | WEB GIS",
        };
        res.render("home", data);
    },
};