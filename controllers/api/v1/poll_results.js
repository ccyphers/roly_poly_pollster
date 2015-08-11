"use strict";

var PollResult = require('../../../models/poll_result')
    , poll_result = new PollResult()
    , Promise = require('bluebird');

function get_results(id) {
    var deferred = Promise.defer();

    try {
        poll_result.get(id)
            .then(function (res) {
                deferred.resolve(res);
            }, function (err) {
                deferred.reject(false)
            })
    } catch (e) {
        deferred.reject(false)
    }

    return deferred.promise;
}

module.exports = {

    get: function(request, reply) {
        get_results(request.params.id)
            .then(function(res) {
                reply.json(res);
            }, function(err) {
                reply.status(404).json({status: 1, message: ""})
            });
    },

    create: function (request, reply) {

        try {
            request.poller_session.answers = request.poller_session.answers || [];

            var record = {
                    poll_id: request.body.id,
                    fingerprint_uuid: request.query.uuid,
                    question_number: request.body.question_number,
                    ip: request.ip
                }
                , poll_result = new PollResult(record);

            if(request.poller_session.answers.indexOf(request.body.id) > -1) {
                return reply.status(403).json({status: 1, message: "You have already taken this poll, give other users a shot."})
            }

        } catch(e) {
            return reply.status(400).json(false);
        }

        poll_result.save()
            .then(function (res) {

                request.poller_session.answers.push(request.body.id);

                get_results(request.body.id)
                    .then(function(poll_results) {
                        reply.status(201).json({status: 0, poll_results: poll_results})
                    }, function(err) {
                        reply.status(400).json(false)
                    });

            }, function (err) {
                if(err.toString().match(/fingerprint_uuid_poll_id/)) {
                    reply.status(403).json({status: 1, message: "You have already taken this poll, give other users a shot."})
                } else {
                    reply.status(400).json(false)
                }
            })

    }
};