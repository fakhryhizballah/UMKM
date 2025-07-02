const multer = require("multer");
const path = require("path");


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/cache/");
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "-" + file.originalname.split(' ').join(''));
    },
});

const uploadMultiple = multer({
    storage: storage,
    limits: { fileSize: 25 * 1024 * 1024 }, // Maksimal ukuran file: 5 MB
}) 

const upload = multer({ storage });



module.exports = {
    upload,
    uploadMultiple
};