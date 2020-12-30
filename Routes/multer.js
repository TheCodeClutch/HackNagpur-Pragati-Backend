
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log(file)
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        console.log(file)
        cb(null, new Date().toISOString() + '-' + file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    console.log(file.mimetype)
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
        console.log('ho rha hain')
        cb(null, true)
    } else {
        //reject file
        cb({message: 'Unsupported file format'}, false)
    }
}

const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 20}, // max upload size
    fileFilter: fileFilter
})

module.exports = upload;