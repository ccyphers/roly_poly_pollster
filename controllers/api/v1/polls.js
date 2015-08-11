"use strict";

var Poll = require('../../../models/poll')
    , poll = new Poll
    , escape = require("html-escape");

module.exports = {

    /**
     * @api {get} /api/v1/poll/:id?uuid=<client 32 hex fingerprint>
     * @apiName GetPoll
     * @apiGroup Poll
     *
     * @apiSuccessExample Success-Response:
     *  HTTP/1.1 200 OK
        {
            "id":1,
            "name":"Why was Stonehenge abandoned?",
            "questions":{
                "1":"It wasn't IBM compatible.",
                "2":"To get to the middle.",
                "3":"Beer & Pretzels -- Breakfast of Champions."
            },
            "active":true
        }
     *
     *
     * @apiErrorExample Error-Response:
     *  HTTP/1.1 404 Not Found
     *  {
            "status":1,
            "message":"Poll could not be found"
        }
     */
    get: function(request, reply) {

        try {
            Poll.where({id: request.params.id}).fetch()
                .then(function (res) {
                    reply.json({id: res.attributes.id, name: res.attributes.name, questions: res.attributes.questions, active: res.attributes.active})
                }, function (err) {
                    reply.status(404).json({status: 1, message: "Poll could not be found"})
                })
        } catch(e) {
            reply.status(404).json({status: 1, message: "Poll could not be found"})
        }
    },


    /**
    * @api {get} /api/v1/polls?uuid=<client 32 hex fingerprint>
    * @apiName GetPolls
    * @apiGroup Poll
    */
    all: function(request, reply) {

        poll.all()
            .then(function(res) {

                request.poller_session.answers = request.poller_session.answers || [];

                var response = { answered_polls: request.poller_session.answers,
                                 polls:  res };
                reply.json(response);
            }, function(err) {
                reply.send("")
            })
    },

    create: function(request, reply) {

        request.body = request.body || {};
        request.body.name = request.body.name || null;

        var questions = request.body['questions[]'] || []
            , record = {name: escape(request.body.name), questions: {}};

        if(typeof(questions) == 'string') {
            questions = [questions];
        }

        for(var x = 0; x < questions.length; x++) {
            record.questions[x + 1] = escape(questions[x]);
        }

        var poll = new Poll(record);

        poll.save()
            .then(function(res) {
                reply.status(201).json(true)
            }, function(err) {
                reply.json(false)
            })
    }
};