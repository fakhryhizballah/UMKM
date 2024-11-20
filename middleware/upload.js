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
// Middleware untuk upload multiple files
// const upload = multer({
//     storage: storage,
//     limits: { fileSize: 5 * 1024 * 1024 }, // Maksimal ukuran file: 5 MB
// }).array("files", 10); // Nama field "files", maksimal 10 file
const uploadMultiple = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Maksimal ukuran file: 5 MB
}) // Nama field "files", maksimal 10 file

// const upload = multer({
//     storage: storage,
//     limits: { fileSize: 10 * 1024 * 1024 }, // Maksimal 10 MB per file
// });
const upload = multer({ storage });



module.exports = {
    upload,
    uploadMultiple
};