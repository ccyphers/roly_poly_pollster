//var knex = require('../../lib/knex');

module.exports = {
    setup: function(nemo, callback) {
        nemo.knex = require('../../lib/knex');
        callback(null);
    }
};