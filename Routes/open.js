const router = require("express").Router();
const axios = require("axios");

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

router.get('/news', (request, response) => {
  axios.get('http://api.mediastack.com/v1/news?access_key=0fe6be7088aff123737658e7e1ddf9e4&keywords=successful%20women&countries=in&limit=50')
  .then(function (res) {
    response.status(200).json({
      message: res
    })
  })
  .catch(function (error) {
    console.log(error)
    response.status(200).json({
      err: 'There was some error while fetching the results.'
    })
  })
})

module.exports = router;
