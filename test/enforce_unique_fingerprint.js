"use strict";

process.env.NODE_ENV = 'test';

var assert = require('chai').assert
    , fs = require('fs')
    , Poll = require(__dirname + '/../models/poll')
    , PollResult = require(__dirname + '/../models/poll_result')
    , Fingerprint = require(__dirname + '/../models/fingerprint')
    , uuid = require('uuid');


describe('Fingerprint', function () {

    var poll = new Poll()
        , poll_result = new PollResult()
        , fingerprint = new Fingerprint();


    var cleanup = function() {
        return poll_result.deleteAll()
            .then(function(res) {
                poll.deleteAll()
                    .then(function(res) {
                        fingerprint.deleteAll()
                    })
            })
    };

    beforeEach(function () {
        return cleanup();
    });



    it("should not allow creating a fingerprint with the same uuid and ip" ,function(done) {

        // first test that a single fingerprint can be created

        var record = {uuid: uuid.v4().replace(/-/g, ''), ip: '1.1.1.1', user_agent: 'abc'}
            , fp = new Fingerprint(record);

        fp.save()
            .then(function(res) {

                // now check that a duplicate isn't allowed
                fp = new Fingerprint(record);
                fp.save()
                    .then(function(res) {
                        assert(false);
                        done()
                    }, function(err) {
                        assert(true);
                        done()
                    })

            }, function(err) {
                assert(false);
                done()
            })


    })
});