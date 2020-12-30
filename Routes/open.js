const router = require("express").Router();

router.get( '/', (request, response) => {
    response.status(200).json({
        message : "This is the default route for the Pragati Project API, for women empowerment"
    })
})

router.get( '/team', (request, response) => {
    response.status(200).json({
        message : "The API is built by Nikhil, while frontend is developed by Shreya and Saloni"
    })
})

module.exports = router;
