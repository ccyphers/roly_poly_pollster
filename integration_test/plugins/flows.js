var CreatePoll = require('../flows/create_poll');

module.exports = {
    setup: function(nemo, callback) {

        //var create_poll = new CreatePoll(nemo);
        nemo.flows = {};
        nemo.flows.create_poll =  new CreatePoll(nemo)
        //nemo.flows.create_poll = create_poll.run;

        callback(null);
    }
};