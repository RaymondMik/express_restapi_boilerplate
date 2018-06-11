require('./config');

const express = require('express');
const bodyParser = require('body-parser');

// App init
const app = express();

// Define middlewares
app.use(bodyParser.json());

module.exports.app = app;