"use strict";

var express = require('express')
    , app = express()
    , routes = require('./config/routes')
    , sessions = require("client-sessions")
    , body_parser = require('body-parser');

app.use(sessions({
    cookieName: 'poller_session',
    secret: 'blargadeeblargblarg',
    duration: 30 * 24 * 60 * 60 * 1000//,
    //activeDuration: 1000 * 60 * 5
}));

app.enable('trust proxy')

app.use(body_parser.urlencoded({ extended: false }));
app.use(body_parser.json());

app.use(express.static('ui'));

app.use('/pollster/api/v1', routes);

app.listen(3000);