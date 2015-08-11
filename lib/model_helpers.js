"use strict";

var Promise = require('bluebird');

module.exports = {

    deleteAll: function() {
        var deferred = Promise.defer();
        this.knex(this.tableName).select("id").delete()
            .then(function(res) {
                deferred.resolve(res)
            }, function(err) {
               deferred.reject(err);
            });
        return deferred.promise;
    },

    count: function() {
        var deferred = Promise.defer();
        this.knex(this.tableName).count('id')
            .then(function(ct) {
                ct = ct || [];
                ct[0] = ct[0] || {};
                ct[0].count = ct[0].count;
                deferred.resolve(ct[0].count);
            }, function(err) {
                deferred.reject(err);
            });
        return deferred.promise;
    },

    bulk_insert: function(items) {
        return this.knex(this.tableName).insert(items);
    }


};