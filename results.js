var uuid = require('uuid')
    , PollResult = require('./models/poll_result')
    , Poll= require('./models/poll')
    , Fingerprint = require('./models/fingerprint')
    , async = require('async');

function run() {
    var q = async.queue(function (msg, callback) {
        var fp_uuid = uuid.v4();

        new Fingerprint({uuid: fp_uuid, ip: '1.1.1.1', user_agent: 'abc'}).save()
            .then(function (res) {


                new PollResult({
                    question_number: msg.question_number,
                    poll_id: msg.poll_id,
                    ip: '1.1.1.1',
                    fingerprint_uuid: res.attributes.uuid
                }).save()
                    .then(function (res) {
                        console.log('inserted');
                        callback()
                    }, function (err) {
                        console.log(err);
                        callback()
                    })
            }, function (err) {
                console.log(err);
                callback()
            })
    });

    q.drain = function () {
        process.exit(0)
    };



    p_record1 = {
        name: 'What do agnostic, insomniac dyslexics do at night?',
        questions: {
            1: 'Open other end.',
            2: "Stay awake and wonder if there's a dog.",
            3: 'A nervous wreck.',
            4: 'So they can dress like pimps.',
            5: 'A canary with the super-user password.'
        },
        options: {}
    }

    p_record2 = {
        name: 'Why was Stonehenge abandoned?',
        questions: {
            1: "It wasn't IBM compatible.",
            2: "To get to the middle.",
            3: 'Beer & Pretzels -- Breakfast of Champions.'
        },
        options: {}
    }

    p_record3 = {
        name: "No manual is ever necessary, according to",
        questions: {
            1: "May I politely interject here: BULLSHIT.  That's the biggest Apple lie of all!",
            2: "On a normal ascii line, the only safe condition to detect is a 'BREAK'",
            3: "It's God.  No, not Richard Stallman, or Linus Torvalds, but God."
        },
        options: {}
    }


    var new_poll = new Poll(p_record1);

    new_poll.save()
        .then(function (res) {


            for (var x = 0; x < 6563; x++) {
                var n1 = Math.floor((Math.random() * 8) + 1);
                var n2 = Math.floor((Math.random() * 3) + 1);
                var n3 = Math.floor((Math.random() * 10) + 1);
                var n4 = Math.floor((Math.random() * 5) + 1);
                var n5 = Math.floor((Math.random() * 12) + 1);


                if (n1 == 1) {
                    q.push({question_number: 1, poll_id: res.attributes.id})
                } else if (n2 == 1) {
                    q.push({question_number: 2, poll_id: res.attributes.id})
                } else if (n3 == 1) {
                    q.push({question_number: 3, poll_id: res.attributes.id})
                } else if (n4 == 1) {
                    q.push({question_number: 4, poll_id: res.attributes.id})
                } else if (n5 == 1) {
                    q.push({question_number: 5, poll_id: res.attributes.id})
                }
            }

            new Poll(p_record2).save()
                .then(function (res) {

                    for (var x = 0; x < 9563; x++) {
                        var n1 = Math.floor((Math.random() * 6) + 1);
                        var n2 = Math.floor((Math.random() * 10) + 1);
                        var n3 = Math.floor((Math.random() * 3) + 1);


                        if (n1 == 1) {
                            q.push({question_number: 1, poll_id: res.attributes.id})
                        } else if (n2 == 1) {
                            q.push({question_number: 2, poll_id: res.attributes.id})
                        } else if (n3 == 1) {
                            q.push({question_number: 3, poll_id: res.attributes.id})
                        }
                    }
                });

            new Poll(p_record3).save()
                .then(function (res) {

                    for (var x = 0; x < 2563; x++) {
                        var n1 = Math.floor((Math.random() * 6) + 1);
                        var n2 = Math.floor((Math.random() * 10) + 1);
                        var n3 = Math.floor((Math.random() * 4) + 1);


                        if (n1 == 1) {
                            q.push({question_number: 1, poll_id: res.attributes.id})
                        } else if (n2 == 1) {
                            q.push({question_number: 2, poll_id: res.attributes.id})
                        } else if (n3 == 1) {
                            q.push({question_number: 3, poll_id: res.attributes.id})
                        }
                    }
                });


        });

}

var poll = new Poll();
poll.where({name: "What do agnostic, insomniac dyslexics do at night?"}).fetch()
    .then(function(res) {
        if(res) {
            process.exit(0);

        } else {
            run();
        }

    });

