const express = require('express');
const HaloAPI = require('haloapi');
const co = require('bluebird-co').co;

const h5 = new HaloAPI(process.env.HALO_API_KEY);

const router = express.Router();
router.get('/gamertags/:gamertag/matches', (req, res) => {
    res.end('hello there');
})

module.exports = router;
