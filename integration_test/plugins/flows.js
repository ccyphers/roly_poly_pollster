var CreatePoll = require('../flows/create_poll');

module.exports = {
    setup: function(nemo, callback) {
        nemo.flows = {};
        nemo.flows.create_poll =  new CreatePoll(nemo)
        callback(null);
    }
};
