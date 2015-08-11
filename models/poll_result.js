"use strict";

var knex = require(__dirname + "/../lib/knex")
    , bookshelf = require('bookshelf')(knex)
    , Promise = require('bluebird')
    , extend_class = require('../lib/extend_class')
    , Poll = require('./poll')
    , model_helpers = require('../lib/model_helpers');

var PollResult = bookshelf.Model.extend({
    tableName: 'poll_results',
    hasTimestamps: true,
    knex: knex,

    get: function(poll_id) {
        var deferred = Promise.defer();


        this.knex(this.tableName).where({poll_id: poll_id}).groupBy('question_number').count('id').select("question_number")
            .then(function(res) {
                deferred.resolve(res);
            }, function(err) {
                deferred.reject(err);
            });

        return deferred.promise;
    }



});

module.exports = extend_class(PollResult, model_helpers);
