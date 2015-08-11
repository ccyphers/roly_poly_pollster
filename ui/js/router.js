"use strict";

define([
    'jquery',
    'lodash',
    'backbone',
     'vm'
], function ($, _, Backbone, Vm) {
    var AppRouter = Backbone.Router.extend({
        routes: {
            // Pages
            '': 'home',
            'home': 'home',
            'new': 'new',
            'poll/:id': 'poll',
            // Default - catch all
            '*actions': 'default'
        }
    });


    var initialize = function (options) {
        var appView = options.appView;
        var router = new AppRouter(options);


        router.on('route:home', function () {
            require(['views/home/page', 'mdl'], function(Page, mdl) {
                var page = Vm.create(appView, 'HomePage', Page);
                page.render();
                componentHandler.upgradeAllRegistered();
            });
        });

        router.on('route:poll', function (id) {
            require(['views/polls/page', 'mdl'], function(Page, mdl) {
                var page = Vm.create(appView, 'PollPage', Page);
                page.render(id);
                componentHandler.upgradeAllRegistered();
            });
        });

        router.on('route:new', function () {
            require(['views/polls/new', 'mdl'], function(Page, mdl) {

                var page = Vm.create(appView, 'NewPollPage', Page);
                page.render();
                componentHandler.upgradeAllRegistered();
            });
        });


        router.on('route:default', function (actions) {
            console.log("NOP");
        });

        Backbone.history.start();
    };
    return {
        initialize: initialize
    };
});
