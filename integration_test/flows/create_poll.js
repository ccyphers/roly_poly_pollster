var Promise = require('bluebird');

module.exports = function (nemo) {
    this.nemo = nemo;

    this.ensure_on_create_page = function() {
        var deferred = Promise.defer()
            , self = this;

        this.nemo.driver.getCurrentUrl()
            .then(function(res) {

                if(res == self.nemo.data.base_url + '/#new') {
                    deferred.resolve(true)
                } else {
                    self.nemo.driver.get(nemo.data.base_url);

                    self.nemo.view.navbar.createWaitVisible();
                    self.nemo.view.navbar.create().click();
                    self.nemo.view.create_poll.saveWaitVisible()
                        .then(function() {
                            deferred.resolve(true)
                        }, function(err) {
                            deferred.reject(err)
                        })
                }

            }, function(err) {
                deferred.reject(err);
            });

        return deferred.promise;
    };

    this.run = function (options) {
        var deferred = Promise.defer()
            , self= this
            , promise;

        options = options || {};
        options.questions = options.questions || [];

        this.ensure_on_create_page()
            .then(function(res) {
                if (options.name) {
                    promise = self.nemo.view.create_poll.name().sendKeys(options.name);
                }

                options.questions.forEach(function (question) {
                    promise = self.nemo.view.create_poll["question_" + question.number].call().sendKeys(question.text);
                });

                if (options.save) {
                    promise = self.nemo.view.create_poll.save().click();
                }


                if(promise) {
                    promise
                        .then(function(res) {
                            deferred.resolve(res);
                        }, function(err) {
                            deferred.reject(err);
                        })

                } else {
                    deferred.resolve(true)
                }

            });

        return deferred.promise;

    }

};