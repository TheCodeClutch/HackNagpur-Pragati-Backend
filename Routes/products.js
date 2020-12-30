const router = require("express").Router();
const message = require('../Helpers/messaging').message;
const User = require('../Database/Models/model.js').user;
const Products = require('../Database/Models/model.js').products;
const middleware = require('../Helpers/auth-middleware').session;
const upload = require('./multer')
const cloudinary = require('./cloudinary')
const fs = require('fs')

// TO ADD PRODUCT
router.post('/add', middleware, upload.any('image'), async (request, response) => {
    const d = new Date();
    const productId = 'P' + String(d.getTime())
    const uploader = async (path) => await cloudinary.uploads(path, 'Products');
    const urls = []
    const files = request.files;
    for (const file of files) {
        const { path } = file;
        const newPath = await uploader(path)
        urls.push(newPath)
        // eslint-disable-next-line security/detect-non-literal-fs-filename
        fs.unlinkSync(path)
    }
    console.log(urls)
    const product = new Products({
        TITLE: request.body.title,
        POSTED_BY_PIC: request.decode.profile_pic,
        POSTED_BY: request.decode.name,
        EMAIL: request.decode.email,
        DESCRIPTION: request.body.description,
        CATEGORY: request.body.category,
        PRICE: request.body.price,
        NEGOTIABLE: request.body.negotiable,
        PRODUCT_ID: productId,
        IMAGE: urls,
        CITY: request.decode.city,
        STATE: request.decode.state
    })
    product.save(err => {
        if(err){
            response.status(200).json({
                err: 'There was an error while saving the product.'
            })
        } else {
            response.status(200).json({
                message: 'Product was successfully added.'
            })
        }
    })
})

// GET ALL THE PRODUCTS
router.get('/getall', (request, response) => {
    Products.find()
        .then(res => {
            response.status(200).json({
                message: res
            })
        })
        .catch(err => {
            response.status(200).json({
                err: 'There was some error while fetching the data.'
            })
        })
})

// GET ALL THE PRODUCTS POSTED BY THAT USER
router.get('/get', middleware,(request, response) => {
    Products.find({EMAIL: request.decode.email})
        .then(res => {
            response.status(200).json({
                message: res
            })
        })
        .catch(err => {
            response.status(200).json({
                err: 'There was some error while fetching the data.'
            })
        })
})

// SEARCH THE PRODUCTS
router.get('/search', async (request, response) => {
    const products = await Products.fuzzySearch(request.query.q)
    response.status(200).json({
        message: products
    })
})

// DELETE THE PRODUCT
router.post('/delete', middleware, (request, response) => {
    Products.findOneAndRemove({
        PRODUCT_ID: request.body.productId
    })
        .then(res => {
          console.log("Hello ", res)
            if(res){
                response.status(200).json({
                    message: 'The product was successfully deleted.'
                })
            } else {
                response.status(200).json({
                    err: 'No such product exist.'
                })
            }
        })
        .catch(err => {
            response.status(200).json({
                err: 'There was some error while deleting the product.'
            })
        })
})

// SHOW INTEREST
router.post('/interested', middleware, (request, response) => {
    // message about interest with user details
    Products.findOne({
        PRODUCT_ID: request.body.productId
    })
        .then(doc => {
            User.findOneAndUpdate({
                EMAIL: request.decode.email
            }, {
                $push: {
                    PRODUCT_INTEREST: {
                        PRODUCT_ID: request.body.productId,
                        TITLE: doc.TITLE,
                        POSTED_BY: doc.POSTED_BY,
                    }
                }
            })
                .then(res => {
                    console.log('Res1 :', res)
                    User.findOneAndUpdate({
                        EMAIL: doc.EMAIL,
                    }, {
                        $push: {
                            PRODUCT_INTEREST_REC: {
                                PRODUCT_ID: request.body.productId,
                                TITLE: doc.TITLE,
                                USERNAME: request.decode.name,
                                PHONE_NUMBER: request.decode.phoneNumber,
                            }
                        }
                    })
                        .then(resp => {
                            console.log('Res2 :', resp)
                            message(resp.PHONE_NUMBER, `${request.decode.name} is interested in purchasing the product named - ${doc.TITLE}. ${request.decode.name} is from ${request.decode.city}, ${request.decode.state}. You can contact ${request.decode.name} at +${request.decode.phoneNumber}. \n NOTE: Do not share any OTP or PIN while transacting.`)
                                .then(res => {
                                    response.status(200).json({
                                        message: 'Your interest was successfully registered.'
                                    })
                                })
                                .catch(err => {
                                  console.log(1)
                                    response.status(200).json({
                                        // err: 'There was some error while registering your interest.',
                                        err
                                    })
                                })
                        })
                        .catch(err => {
                          console.log(2)
                          console.log(err)
                            response.status(200).json({
                                // err: 'There was some error while registering your interest.',
                                err
                            })
                        })
                })
                .catch(err => {
                  console.log(3)
                    response.status(200).json({
                        // err: 'There was some error while registering your interest.',
                        err
                    })
                })
        })
        .catch(err => {
          console.log(4)
            response.status(200).json({
                // err: 'There was some error while registering your interest.',
                err
            })
        })
})

// SERVICES PARTICULAR USER IS INTERESTED IN
router.get('/myinterest', middleware, (request, response) => {
    User.findOne({
        EMAIL: request.decode.email
    })
        .then(doc => {
            response.status(200).json({
                message: doc.PRODUCT_INTEREST
            })
        })
        .catch(err => {
            response.status(200).json({
                err: 'There was some error while fetching your interests.'
            })
        })
})

// SERVICE ON WHICH PARTICULAR USER HAS RECEIVED INTEREST
router.get('/recinterest', middleware, (request, response) => {
    User.findOne({
        EMAIL: request.decode.email
    })
        .then(doc => {
            response.status(200).json({
                message: doc.PRODUCT_INTEREST_REC
            })
        })
        .catch(err => {
            response.status(200).json({
                err: 'There was some error while fetching your received interests.'
            })
        })
})


module.exports = router;
