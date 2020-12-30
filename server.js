const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');

// env config
require('dotenv').config();
const app = express();
app.use(cors());


// requiring local modules
const open = require('./Routes/open');
const auth = require('./Routes/auth');
const products = require('./Routes/products');
const services = require('./Routes/services');
const askDesk = require('./Routes/askDesk')

//db connect
require('./Database/connection.js');

// presets
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// port declaration
const port = process.env.PORT || 3500;

// open routes
app.use('/', open)
app.use('/auth', auth);
app.use('/products', products);
app.use('/services', services);
app.use('/askdesk', askDesk);

// Init the server
app.listen( port, () => {
    console.log('Sever is up')
})
