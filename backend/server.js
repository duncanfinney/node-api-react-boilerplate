'use strict';
require('dotenv').config();

//Constants
const PORT = process.env.PORT;

//Middleware
const express = require('express');
const app = express();
app.use(require('./routes.js'));

//Start the server
app.listen(PORT);
console.log('Running on http://localhost:' + PORT);
