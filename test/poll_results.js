"use strict";

process.env.NODE_ENV = 'test';

var assert = require('chai').assert
    , fs = require('fs')
    , Poll = require(__dirname + '/../models/poll')
    , Fingerprint = require(__dirname + '/../models/fingerprint')
    , Promise = require('bluebird')
    , PollResult = require(__dirname + '/../models/poll_result')
    , uuid = require('uuid');

describe('PollResults', function () {

    var poll = new Poll()
        , poll_result = new PollResult()
        , fingerprint = new Fingerprint()
        , default_questions = {
            1: 'WTF1',
            2: 'WTF2',
            3: 'WTF3',
            4: 'WTF4',
            5: 'WTF5',
            6: 'WTF6'};


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


    function create_fingerprint() {
        return new Fingerprint({ip: '1.1.1.1', user_agent: 'abc', uuid: uuid.v4().replace(/-/g, "")}).save()
    }

    function poll_name() {
        return "functional_test_" + parseInt((new Date()).getTime() / 1000);
    }

    function valid_poll_record() {
        return {name: poll_name(), questions: default_questions, options: {}};
    }

    function create_poll() {
        var record = valid_poll_record();
        return new Poll(record).save()
    }

    function valid_poll_results_record() {
        var record = {question_number: 0, ip: '1.1.1.1'}
            , deferred = Promise.defer();

        create_poll()
            .then(function(res) {
                record.poll_id = res.attributes.id;
                create_fingerprint()
                    .then(function(res) {
                        record.fingerprint_uuid = res.attributes.uuid;
                        deferred.resolve(record);
                    }, function(err) {
                        deferred.reject(err);
                    })
            },

            function(err) {
                deferred.reject(err);
            });

        return deferred.promise;
    }




    it("should fail if no fingerprint is provided", function(done) {
        valid_poll_results_record()
            .then(function(record) {
                record.fingerprint_uuid = null;
                new PollResult(record).save()
                    .then(function() {
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


    });


    it("should fail if no poll_id is provided", function(done) {
        valid_poll_results_record()
            .then(function(record) {
                record.poll_id = null;
                new PollResult(record).save()
                    .then(function() {
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


    });



    it("should create a new poll result record when all information is provided", function(done) {
        valid_poll_results_record()
            .then(function(record) {

                new PollResult(record).save()
                    .then(function(res) {
                        assert(true);
                        done();
                    }, function(err) {
                        assert(false);
                        done()
                    })

            }, function(err) {
                assert(false);
                done()
            })
    })


});