const express = require('express');

const router = express.Router();

const matches = require('./handlers/matches');
router.get('/gamertags/:gamertag/matches', matches.getAll);

module.exports = router;
