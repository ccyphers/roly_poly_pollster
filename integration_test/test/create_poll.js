var assert = require('chai').assert
    , Nemo = require('nemo');


describe("Create Poll", function () {
    this.timeout(15000);
    var nemo;


    before(function (done) {
        nemo = Nemo(__dirname + "/..", done);
    });

    after(function (done) {
        nemo.driver.quit().then(done);
    });

    it("should be able to create a poll", function (done) {
        var options = {
            name: 'yadablahyadayo',
            save: true,
            questions: [
                {
                    number: 1,
                    text: "Testing 1 " + Date()
                },
                {
                    number: 2,
                    text: "Testing 2 " + Date()
                }

            ]
        };

        nemo.flows.create_poll.run(options)
            .then(function() {
                debugger
                nemo.view.navbar.homeWaitVisible()
                    .then(function() {


                        nemo.knex.table('polls').where({name: 'yadablahyadayo'}).orderBy("id", "desc").limit(1)
                            .then(function(res) {
                                var seconds1 = res[0].created_at.getTime()
                                    , seconds2 = (new Date()).getTime();

                                //console.log(seconds2-seconds1);
                                // the last record in the DB should have been created in the past second
                                assert.closeTo(seconds1, seconds2, 1000, 'numbers are close');

                                done();
                            }, function(err) {
                                assert(false);
                                done();
                            })

                    });

            })

    })
});
