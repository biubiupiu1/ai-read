const express = require('express');
const app = express();
const fs = require('fs');
const bodyParser = require('body-parser');
const router = require('./router/index');
app.disable('x-powered-by');
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(router);
app.use('/public', express.static('public'));

// Serve the files on port 3000.
app.listen(3000, function () {
});