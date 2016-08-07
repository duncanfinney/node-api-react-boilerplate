const HaloAPI = require('haloapi');
const h5 = new HaloAPI(process.env.HALO_API_KEY);
const co = require('bluebird-co').co;

const getAll = (req, res, next) => {

  let allMatches = [];
  co(function*() {
    try {

      let hasMore = true;
      let i = 0;
      while (hasMore && i < 2) {
        const data = yield h5.stats.playerMatches({player: req.params.gamertag, start: i * 25});
        allMatches = allMatches.concat(data.Results);
        i++; 
        hasMore = data.Results.length == 25;
      }

      res.json(allMatches);
    } catch (err) {
      console.log('err', err);
      next(err.body);
    }
    
  })  
  
}

module.exports = {
  getAll
}
