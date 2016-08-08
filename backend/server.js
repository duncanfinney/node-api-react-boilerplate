'use strict';
//Constants
const PORT = process.env.PORT;

//Middleware
const express = require('express');
const app = express();
app.use(require('./routes.js'));

//Error Handler
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(err.statusCode || 500).json(err);
});

//migrate the database
const postgrator = require('postgrator');
postgrator.setConfig({
  migrationDirectory: __dirname + '/migrations',
  driver: 'pg',
  host: process.env.PGHOST,
  port: 5432, // optionally provide port
  database: process.env.PGDATABASE,
  username: process.env.PGUSER,
  password: process.env.PGPASS
});
console.log('migrating database');
postgrator.migrate('001', function (err, migrations) {
  if (err) {
    throw err;
  }

  postgrator.endConnection(function () {

    //Start the server
    app.listen(PORT);
    console.log('Running on http://localhost:' + PORT);


  });
});
