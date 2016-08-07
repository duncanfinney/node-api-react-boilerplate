'use strict';
require('dotenv').config();

//Constants
const PORT = process.env.PORT;

//Middleware
const express = require('express');
const app = express();
app.use(require('./routes.js'));

//Error Handler
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).json(err);
});

//Start the server
app.listen(PORT);
console.log('Running on http://localhost:' + PORT);
