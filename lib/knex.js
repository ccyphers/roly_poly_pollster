"use strict";

var conf = require('../knexfile.js')
    , env = process.env.NODE_ENV || 'development';

var knex = require('knex')(conf[env]);

module.exports = knex;