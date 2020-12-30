const router = require("express").Router();
const message = require('../Helpers/messaging').message;
const User = require('../Database/Models/model.js').user;
const Services = require('../Database/Models/model.js').services;
const middleware = require('../Helpers/auth-middleware').session;
const upload = require('./multer')
const cloudinary = require('./cloudinary')
const fs = require('fs')

// TO ADD SERVICE
router.post('/add', upload.any('image'), middleware, async (request, response) => {
    const d = new Date();
    const serviceId = 'S' + String(d.getTime());
    const uploader = async (path) => await cloudinary.uploads(path, 'Services');
    const urls = []
    const files = request.files;
    for (const file of files) {
        const { path } = file;
        const newPath = await uploader(path)
        urls.push(newPath)
        // eslint-disable-next-line security/detect-non-literal-fs-filename
        fs.unlinkSync(path)
    }
    const service = new Services({
        TITLE: request.body.title,
        POSTED_BY_PIC: request.decode.profile_pic,
        POSTED_BY: request.decode.name,
        EMAIL: request.decode.email,
        DESCRIPTION: request.body.description,
        CATEGORY: request.body.category,
        PRICE: request.body.price,
        NEGOTIABLE: request.body.negotiable,
        SERVICE_ID: serviceId,
        IMAGE: urls,
        CITY: request.decode.city,
        STATE: request.decode.state
    })
    service.save(err => {
        if(err){
            response.status(200).json({
                err: 'There was an error while saving the service.'
            })
        } else {
            response.status(200).json({
                message: 'Service was successfully added.'
            })
        }
    })
})

// GET ALL THE SERVICES POSTED BY THAT USER
router.get('/get', middleware, (request, response) => {
    Services.find({EMAIL: request.decode.email})
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

// GET ALL THE SERVICES
router.get('/getall', (request, response) => {
    Services.find()
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

// SEARCH THE SERVICE
router.get('/search', async(request, response) => {
    const services = await Services.fuzzySearch(request.query.q)
    response.status(200).json({
        message: services
    })
})

// DELETE THE SERVICE
router.post('/delete', middleware, (request, response) => {
    Services.findOneAndRemove({
        SERVICE_ID: request.body.serviceId
    })
        .then(res => {
          console.log("Hello ", res)
            if(res){
                response.status(200).json({
                    message: 'The service was successfully deleted.'
                })
            } else {
                response.status(200).json({
                    err: 'No such service exist.'
                })
            }
        })
        .catch(err => {
            response.status(200).json({
                err: 'There was some error while deleting the service.'
            })
        })
})

// SHOW INTEREST
router.post('/interested', middleware, (request, response) => {
    // message about interest with user details
    Services.findOne({
        SERVICE_ID: request.body.serviceId
    })
        .then(doc => {
            User.findOneAndUpdate({
                EMAIL: request.decode.email
            }, {
                $push: {
                    SERVICE_INTEREST: {
                        SERVICE_ID: request.body.serviceId,
                        TITLE: doc.TITLE,
                        POSTED_BY: doc.POSTED_BY,
                    }
                }
            })
                .then(res => {
                    User.findOneAndUpdate({
                        EMAIL: doc.EMAIL,
                    }, {
                        $push: {
                            SERVICE_INTEREST_REC: {
                                SERVICE_ID: request.body.serviceId,
                                TITLE: doc.TITLE,
                                USERNAME: request.decode.name,
                                PHONE_NUMBER: request.decode.phoneNumber,
                            }
                        }
                    })
                        .then(resp => {
                            message(resp.PHONE_NUMBER, `${request.decode.name} is interested in availing the service named - ${doc.TITLE}. ${request.decode.name} is from ${request.decode.city}, ${request.decode.state}. You can contact ${request.decode.name} at +${request.decode.phoneNumber}. \n NOTE: Do not share any OTP or PIN while transacting.`)
                                .then(res => {
                                    response.status(200).json({
                                        message: 'Your interest was successfully registered.'
                                    })
                                })
                                .catch(err => {
                                    response.status(200).json({
                                        err: 'There was some error while registering your interest.',
                                    })
                                })
                        })
                        .catch(err => {
                            response.status(200).json({
                                err: 'There was some error while registering your interest.',
                            })
                        })
                })
                .catch(err => {
                    response.status(200).json({
                        err: 'There was some error while registering your interest.'
                    })
                })
        })
        .catch(err => {
            response.status(200).json({
                err: 'There was some error while registering your interest.'
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
                message: doc.SERVICE_INTEREST
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
                message: doc.SERVICE_INTEREST_REC
            })
        })
        .catch(err => {
            response.status(200).json({
                err: 'There was some error while fetching your received interests.'
            })
        })
})

module.exports = router;
