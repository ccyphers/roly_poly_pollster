    define([
        'jquery',
        'store',
        'lodash',
        'backbone',
        'raphael',
        'morris',
        'text!views/templates/polls/page.html',
        'text!views/templates/polls/alert_li.html'
    ], function ($, Store, _, Backbone, raphael, morris, poll_template, alert_li_template) {
        var Page = Backbone.View.extend({
            el: 'div#ui_container',

            storage_by_id: new Store('polls_by_id'),
            client_store: new Store('client'),
            selected_number: -1,


            events: {
                'click input#select_choice': 'select_choice',
                'click button#answer_poll': 'save',
                'click button#poll_results': 'get_results',
                'click #clear_warnings': 'clear_warnings'
            },

            clear_warnings: function() {
                $('div#alert_warning').addClass('hidden');
                $('div#alert_indicator').addClass('hidden');
            },

            display_chart: function(results) {
                var poll = self.poll || self.children.PollPage.poll;

                var data = [{label: 'Answers'}]
                    , y_keys = []
                    , labels = [];


                results.forEach(function(result) {
                    data[0][poll.questions[result.question_number]] = Number(result.count);
                    labels.push(poll.questions[result.question_number])
                });

                Morris.Bar({
                    element: 'chart',
                    data: data,
                    xkey: 'label',
                    ykeys: labels,
                    labels: labels
                });
            },

            get_results: function(ev) {
                var uuid = this.client_store.get()
                    , self = this;

                this.clear_warnings();
                $('#chart').empty();

                var poll = self.poll;
                $.ajax({
                    url: '/pollster/api/v1/poll/' + this.id + '/results?uuid=' + uuid,
                    type: 'get',
                    success: function (results) {
                        self.display_chart(results);
                    }
                })

            },

            set_warnings: function(items) {
                items = items || [];

                var tmpl, html;

                for(var x = 0; x < items.length; x++) {
                    tmpl = _.template(alert_li_template)
                    html = tmpl({message: items[x]});

                    $('ul#new_poll_alerts_warning').html(html);
                }
                $('div#alert_indicator').removeClass('hidden');
                $('div#alert_warning').removeClass('hidden');

            },

            check_answer: function(ev) {
                var error = false;

                if(this.selected_number == -1) {
                    error = true;
                    this.set_warnings(["Please select a question"])
                }

                return error;
            },

            save: function(ev) {
                var self = this
                    , uuid = this.client_store.get();
                if(!this.check_answer()) {
                    $.ajax({
                        url: '/pollster/api/v1/poll_results?uuid=' + uuid,
                        type: 'post',
                        dataType: 'json',
                        data: {id: this.id, question_number: this.selected_number},
                        success: function (res) {
                            self.clear_warnings();
                            $('#chart').empty();

                            self.display_chart(res.poll_results);
                            console.log('saved');
                        },
                        error: function (res) {
                            var body = JSON.parse(res.responseText)
                            msg = body.message || "An unexpected issue occured taking the poll"
                            self.set_warnings([msg]);
                        }
                    })
                }
            },

            select_choice: function(ev) {
                var current = $(ev.currentTarget)
                    , all = $('input#select_choice')
                    , i;

                if(current.attr('checked')) {
                    console.log(this.selected_number)
                    this.selected_number = Number(current.attr('data-question-number'));

                    for (var x = 0; x < all.length; x++) {
                        i = $(all[x]);
                        if (this.selected_number != Number(i.attr('data-question-number'))) {
                            i.attr('checked', false);
                        }
                    }
                } else {
                    this.selected_number = -1;
                }




            },

            polls_by_id: function (polls) {
                var res = {};
                for(var x = 0; x < polls.length; x++) {
                    res[polls[x].id] = polls[x];
                }
                return res;
            },

            render: function (id) {
                this.id = id;

                var polls_by_id = this.storage_by_id.get()
                    , self = this
                    , tmpl = _.template(poll_template);


                this.poll = polls_by_id[id];

                if(this.poll) {
                    var html = tmpl({poll: this.poll});
                    $(this.el).html(html);
                } else {

                    var uuid = this.client_store.get();

                    $.ajax({
                        url: '/pollster/api/v1/poll/' + id + '?uuid=' + uuid,
                        type: 'get',
                        success: function (poll) {
                            self.poll = poll;
                            var html = tmpl({poll: poll});
                            $(self.el).html(html);
                        }
                    })
                }



            }
        });
        return Page;
    });
