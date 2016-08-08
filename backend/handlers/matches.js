const HaloAPI = require('haloapi');
const h5 = new HaloAPI(process.env.HALO_API_KEY);
const co = require('bluebird-co').co;
const pg = require('../lib/pg-connection.js');
const _ = require('lodash');

const GET_MAX_DATE_QUERY =
  `SELECT max((raw_data -> 'MatchCompletedDate' ->> 'ISO8601Date') :: DATE) as max
FROM matches
WHERE raw_data -> 'Players' -> 0 -> 'Player' ->> 'Gamertag' = ?`

const getAll = (req, res, next) => { 

  let allMatches = [];
  co(function*() {
    try {

      let i = 0;
      let hasMore = true;
      const maxQueryRes = yield pg.raw(GET_MAX_DATE_QUERY, [req.params.gamertag]);
      const maxDate = new Date(_.get(maxQueryRes, 'rows[0].max'));
      res.writeHead(200, { "Content-Type": "application/json" });
      while (hasMore) {
        //query
        const allResults = (yield h5.stats.playerMatches({player: req.params.gamertag, start: i * 25})).Results;
        const newData = _.filter(allResults, x => new Date(x.MatchCompletedDate.ISO8601Date) >= maxDate)
        
        //insert
        yield pg.upsertItem('matches', 'match_uuid', newData.map(translateInsert))

        //repeat
        console.log(req.params.gamertag, i * 25 + newData.length + ' new matches');
        
        allMatches = allMatches.concat(newData);
        hasMore = allResults.length == 25 && newData.length === allResults.length;
        i += 1;
        //so the req doesn't timeout
        res.write('\n');
      } 
      
      //now query them all out 
      const items = yield pg.select().from('matches');
      res.end(JSON.stringify(items));

    } catch (err) {
      console.log('err', err);
      next(err.body);
    }
    
  })  
  
}

const translateInsert = raw => ({
  match_uuid: raw.Id.MatchId,
  raw_data: raw
});

module.exports = {
  getAll
}
