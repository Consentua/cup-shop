'use strict';
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
// var serveStatic = require('serve-static');
const env = process.env.ENV || 'local';
const host = process.env.HOST || 'localhost';
const port = process.env.PORT || 3000;
// process.env.VUE_APP_API_URL = 'https://' + host + ':' + port
console.log('running on ' + env, host + ':' + port);

const doLogging = true;

const db = require('./controllers/db.js');

var app = express();


//------------------------------------------------------------------------------
// Request Pre-processing & middleware
//------------------------------------------------------------------------------

// Allows parsing of req.body
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

// Allow cross-origin HTTP requests
app.use(cors());


//------------------------------------------------------------------------------
// Express Setup
//------------------------------------------------------------------------------
// app.use(serveStatic(__dirname + "/dist"));

const router = express.Router();

// Serve static page
app.use('/', express.static(path.join(__dirname, '/dist')));
console.log('server started '+ port);

// Start server
console.log("Running in " + env);
console.log("Server starting on " + host + ':' + port);
app.listen(port);

// Prefix for all routes
app.use('/api', router);

//------------------------------------------------------------------------------
// Routes
//------------------------------------------------------------------------------

// Do this before all requests
router.use(function (req, res, next) {
    log('\nReceived: ' + req.method + ' ' + req.url);
    const hasBody = Object.keys(req.body).length;
    if (hasBody) log(req.body);
    next();
});

router.get('/test', function(req, res, next) {
    console.log(req);
    res.send('ok');
});

//get all db
router.get('/all', db.getAllDB);

//get single db
router.get('/single/:id', db.getSingleDB);

//get selected db
router.post('/selected', db.getSelectedDB);


// Do this after all requests
router.use(function (req, res, next) {
    log('Responding to request with status: ' +
        res.statusCode + ' ' + res.statusMessage);
    res.end();
});

function log(text) {
    if (doLogging) {
        console.log(text);
    }
}