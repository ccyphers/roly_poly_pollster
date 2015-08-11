"use strict";

var knex = require(__dirname + "/../lib/knex")
    , bookshelf = require('bookshelf')(knex)
    , Promise = require('bluebird')
    , extend_class = require('../lib/extend_class')
    , model_helpers = require('../lib/model_helpers');

var Fingerprint = bookshelf.Model.extend({
    tableName: 'fingerprints',
    hasTimestamps: true,
    knex: knex
});

module.exports = extend_class(Fingerprint, model_helpers);
