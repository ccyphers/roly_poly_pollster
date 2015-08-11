"use strict";

var express = require('express')
    , router = express.Router()
    , polls = require('../controllers/api/v1/polls')
    , Fingerprint = require('../models/fingerprint')
    , poll_results = require('../controllers/api/v1/poll_results');

// Enforce strict contract for user fingerprint
router.use(function(req, res, next) {

    req.query.uuid = req.query.uuid || "";

    if(req.query.uuid.length < 32) {
        return res.status(403).send("");
    } else {
        try {
            new Fingerprint().save({uuid: req.query.uuid, user_agent: req.headers['user-agent'], ip: req.ip})
                .then(function (res) {
                    //req.poller_session = req.poller_session || {};
                    console.log('Time: ', Date.now() + "FP: " + req.query.uuid);
                    next();

                }, function (err) {
                    // silently ignore error if record already exists
                    // saves from having to make two queries
                    if(err.toString().match(/fingerprints_uuid_unique/)) {
                        next();
                    } else {
                        return res.status(403).send("");
                    }


                })
        } catch(e) {
            return res.status(403).send("");
        }
    }

});

// Get a single poll
router.get('/poll/:id', polls.get);

// Get results for a poll
router.get('/poll/:id/results', poll_results.get);


// List of all polls used to populate home page
router.get('/polls', polls.all);

// Create a new poll
router.post('/polls', polls.create);


// Answer a poll
router.post('/poll_results', poll_results.create);

module.exports = router;
