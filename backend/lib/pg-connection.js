const _ = require('lodash');
const knex = require('knex');

module.exports = knex({
  client: 'pg',
  connection: process.env.DATABASE_URL,
  searchPath: 'knex,public',
  pool: {
    min: 0,
    max: 7
  }
});



/**
 * Perform an "Upsert" using the "INSERT ... ON CONFLICT ... " syntax in PostgreSQL 9.5
 * @link http://www.postgresql.org/docs/9.5/static/sql-insert.html
 * @author https://github.com/plurch
 *
 * @param {string} tableName - The name of the database table
 * @param {string} conflictTarget - The column in the table which has a unique index constraint
 * @param {Object} itemData - a hash of properties to be inserted/updated into the row
 * @returns {Promise} - A Promise which resolves to the inserted/updated row
 */
module.exports.upsertItem = function(tableName, conflictTarget, itemData) {
  const keys = _.isArray(itemData) ? Object.keys(_.get(itemData, '[0]', {})) : Object.keys(itemData);
  let exclusions = keys
    .filter(c => c !== conflictTarget)
    .map(c => module.exports.raw('?? = EXCLUDED.??', [c, c]).toString())
    .join(",\n");

  let insertString = module.exports(tableName).insert(itemData).toString();
  let conflictString = module.exports.raw(` ON CONFLICT (??) DO UPDATE SET ${exclusions} RETURNING *;`, conflictTarget).toString();
  let query = (insertString + conflictString).replace(/\?/g, '\\?');

  return module.exports.raw(query)
    .on('query', data => console.log('Knex: ' + data.sql))
    .then(result => result.rows[0]);
};
