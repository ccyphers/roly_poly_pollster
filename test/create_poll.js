"use strict";

process.env.NODE_ENV = 'test';

var assert = require('chai').assert
    , fs = require('fs')
    , Poll = require(__dirname + '/../models/poll')
    , PollResult = require(__dirname + '/../models/poll_result')
    , Fingerprint = require(__dirname + '/../models/fingerprint');


describe('Polls', function () {

    var poll = new Poll()
        , fingerprint = new Fingerprint()
        , poll_result = new PollResult();

    var cleanup = function() {
        return poll_result.deleteAll()
            .then(function(res) {
                poll.deleteAll()
                    .then(function(res) {
                        fingerprint.deleteAll()
                    })
            })

    };

    before(function () {
        return cleanup();
    });


    it("should have a model persisting new polls" ,function(done) {

        var new_poll = new Poll({name: 'name', questions: {}, options: {}});

        return new_poll.save()
            .then(function(res) {
                poll.count()
                    .then(function(ct){
                        console.log("CT: " + ct);
                        assert(ct == 1);

                        var new_poll = new Poll({name: 'name2', questions: {}, options: {}});

                        new_poll.save()
                            .then(function(res) {
                                poll.count()
                                    .then(function(ct) {
                                        console.log("CT2: " + ct);
                                        assert(ct == 2);
                                        done()

                                    }, function(err) {
                                        assert(false);
                                        done()
                                    })

                            }, function(err) {
                                assert(false);
                                done()
                            });

                    }, function(err) {
                        assert(false);
                        done()
                    })


            });
    })
});