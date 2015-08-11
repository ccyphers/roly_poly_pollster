"use strict";

var knex = require(__dirname + "/../lib/knex")
    , bookshelf = require('bookshelf')(knex)
    , Promise = require('bluebird')
    , extend_class = require('../lib/extend_class')
    , model_helpers = require('../lib/model_helpers');

var Poll = bookshelf.Model.extend({
    tableName: 'polls',
    hasTimestamps: true,
    knex: knex,

    all: function() {
        return this.knex(this.tableName).select("id", "name", "questions", "active");
    }
});

module.exports = extend_class(Poll, model_helpers);
