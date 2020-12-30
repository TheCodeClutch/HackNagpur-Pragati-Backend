const cloudinary = require('cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.SECRET
})

exports.uploads = (file, folder) => {
    return new Promise(resolve => {
        cloudinary.uploader.upload(file, (result) => {
            resolve({
                url: result.url,
                id: result.public_id
            })
        }, {
            resource_type: "auto",
            folder: folder
        })
    })
}

exports.destroyer = (id) => {
    return new Promise( (resolve, reject) => {
        cloudinary.uploader.destroy(id, (err, result) => {
            if(!err){
                resolve({
                    message: 'Image deleted successfully',
                    result
                })
            }
        })
    })
}