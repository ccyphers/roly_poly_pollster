"use strict";

    define([
        'jquery',
        'store',
        'lodash',
        'backbone',
        'text!views/templates/home/page.html'
    ], function ($, Store, _, Backbone, home_template) {
        var Page = Backbone.View.extend({
            el: 'div#ui_container',

            storage: new Store('polls'),
            client_store: new Store('client'),
            storage_by_id: new Store('polls_by_id'),
            storage_answered_polls: new Store('answered_polls'),

            events: {
                'click button#take_poll': 'poll_page'
            },

            poll_page: function (ev) {
                var id = $(ev.currentTarget).attr('data-id');
                console.log(id);
                location.href = "#poll/" + id;
            },

            search: function (ev) {
                console.log(ev);
            },

            polls_by_id: function (polls) {
                var res = {};
                for(var x = 0; x < polls.length; x++) {
                    res[polls[x].id] = polls[x];
                }
                return res;
            },

            render: function (appView) {
                var self = this
                    , uuid = this.client_store.get();

                $.ajax({
                    url: '/pollster/api/v1/polls?uuid=' + uuid,
                    type: 'get',
                    success: function (res) {
                        self.storage.set(res.polls);
                        self.storage_answered_polls.set(res.answered_polls);
                        self.storage_by_id.set(self.polls_by_id(res.polls));
                        var tmpl = _.template(home_template)
                            , html = tmpl({polls: res.polls});

                        $(self.el).html(html);

                    }
                })


            }
        });
        return Page;
    });
