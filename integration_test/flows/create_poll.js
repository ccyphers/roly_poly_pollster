var Promise = require('bluebird');

module.exports = function (nemo) {
    this.nemo = nemo;

    this.ensure_on_create_page = function() {
        var self = this;

        return this.nemo.driver.getCurrentUrl()
            .then(function(res) {

                if(res == self.nemo.data.base_url + '/#new') {
                    return Promise.resolve(true)
                } else {
                    self.nemo.driver.get(nemo.data.base_url);

                    self.nemo.view.navbar.createWaitVisible();
                    self.nemo.view.navbar.create().click();
                    self.nemo.view.create_poll.saveWaitVisible()
                        .then(function() {
                            return Promise.resolve(true)
                        }, function(err) {
                            return Promise.resolve(false)
                        })
                }

            }, function(err) {
                return Promise.reject(err);
            });
    };

    this.run = function (options) {
        var self= this;

        options = options || {};
        options.questions = options.questions || [];

        return this.ensure_on_create_page()
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
                    return promise
                        .then(function(res) {
                            return Promise.resolve(res);
                        }, function(err) {
                            return Promise.reject(err);
                        })

                } else {
                    return Promise.resolve(true)
                }

            });

    }

};
