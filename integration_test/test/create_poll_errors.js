var assert = require('chai').assert
    , Nemo = require('nemo');


describe("Create Poll", function () {
    this.timeout(15000);
    var nemo;


    beforeEach(function (done) {
        nemo = Nemo(__dirname + "/..", done);
    });

    afterEach(function (done) {
        nemo.driver.quit().then(done);
    });

    it("should indicate the user can't create a poll without a name", function (done) {
        var options = {
            //name: 'yadablahyadayo',
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
            .then(function () {

                nemo.view.create_poll.name_error().getText()
                    .then(function (o) {
                        assert(o == "Name can't be blank");
                        done()
                    }, function (err) {
                        assert(false);
                        done()
                    });
            })

    });

    it("should clear a name error once the user provides a name", function (done) {
        var options = {
            save: true,
            questions: []
        };

        nemo.flows.create_poll.run(options)
            .then(function () {
                nemo.flows.create_poll.run({name: 'should clear error', save: true})
                    .then(function () {
                        nemo.view.create_poll.name_error().getText()
                            .then(function (o) {
                                assert(o == "");
                                done();

                            }, function () {
                                assert(false);
                                done();
                            });
                    }, function (err) {
                        assert(false);
                        done();
                    });
            }, function () {
                assert(false);
                done();
            })


    });

    it("should indicate the user can't create a poll without asking a question", function (done) {
        var options = {
            name: 'yadablahyadayo',
            save: true,
            questions: []
        };

        nemo.flows.create_poll.run(options)
            .then(function () {

                nemo.view.create_poll.name_error().getText()
                    .then(function (o) {

                        // verify there's no error for name
                        assert(o == "");

                        // verify there's an error for at least one question
                        nemo.view.create_poll.question_1_error().getText()
                            .then(function (o) {
                                assert("At least one question has to be asked" == o);
                                done()
                            }, function (err) {
                                assert(false);
                                done()
                            })

                    }, function (err) {
                        assert(false);
                        done()
                    })

            }, function (err) {
                assert(false);
                done()
            })
    });

});