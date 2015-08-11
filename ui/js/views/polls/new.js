"use strict";

define([
    'jquery',
    'lodash',
    'backbone',
    'mdl',
    'store',
    'text!views/templates/polls/new.html',
    'text!views/templates/polls/question_input.html',
    'text!views/templates/polls/alert_li.html'
], function ($, _, Backbone, mdl, Store, new_poll_template, question_template, alert_li_template) {
    var Page = Backbone.View.extend({
        el: 'div#ui_container',
        client_store: new Store('client'),
        set_defaults: function() {
            this.number_questions = 2;
            this.max_questions = 5;

        },

        events: {
               'keyup input[data-check]': 'check',
               'click button#save_poll': 'save_poll',
               'click #clear_warnings': 'clear_warnings'
        },

        clear_warnings: function() {
            $('div#alert_warning').addClass('hidden');
            $('div#alert_indicator').addClass('hidden');
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

        check_name_errors: function() {

            var name = $('input#name').attr('value').trim()
                , error = false;

            if(name == "") {
                error = true;
                $('span#name_error').html("Name can't be blank");
                $('span#name_error').css('visibility', 'visible')
            } else {
                $('span#name_error').css('visibility', 'hidden')
            }
            return error;
        },

        check_question_errors: function(questions) {

            var els = $('span[data-questions]')
                , error = false;

            if(questions.length == 0) {
                error = true;
                for(var x = 0; x < els.length; x++) {
                    $(els[x]).html("At least one question has to be asked")
                    $(els[x]).css('visibility', 'visible')
                }

            } else {
                for(var x = 0; x < els.length; x++) {
                    $(els[x]).css('visibility', 'hidden')
                }
            }
            return error;
        },

        save_poll: function(ev) {
            console.log('blah');
            var poll = {name: $('input#name').attr('value'), questions: [] }
                , question_els = $('input[data-new-poll-question]'),
                 v, question_error, name_error, uuid;

            for(var x = 0; x <= question_els.length; x++) {
                v = $(question_els[x]).attr('value');
                if(v) {
                    v = v.trim();
                    if (v != "") {
                        poll.questions.push(v);
                    }
                }

            }

            question_error = this.check_question_errors(poll.questions);
            name_error = this.check_name_errors();

            if( !question_error && !name_error ) {
                console.log('save');
                console.log(poll);

                uuid = this.client_store.get();

                $.ajax({
                    url: '/pollster/api/v1/polls?uuid=' + uuid,
                    type: 'post',
                    data: poll,
                    dataType: 'json',
                    success: function(res) {
                        location.href='/pollster/';
                    }

                })
            }
        },

        check: function (ev) {
            var current = $(ev.currentTarget)
                , current_index = Number(current.attr('data-id'));

            this.check_name_errors();
                //mdl-textfield__error
            if(current_index < this.max_questions) {
                this.clear_warnings();

                if (current_index == this.number_questions) {
                    this.number_questions += 1;
                    $('div#question_container_' + this.number_questions).removeClass('hidden');
                }
            } else {
                this.set_warnings(['Maxium number of questions reached'])
            }

        },

        render: function (appView) {
            this.set_defaults();
            console.log('blah')
            //this.header_page.render();
            $(this.el).html(_.template(new_poll_template));

            var tmpl
                , html;

            for (var x = 1; x <= this.number_questions; x++) {
                tmpl = _.template(question_template);
                html = tmpl({question_number: x, hidden: false});

                $('#questions').append(html);
            }

            for(var y = x; y <= this.max_questions; y++) {
                tmpl = _.template(question_template);
                html = tmpl({question_number: y, hidden: true});
                $('#questions').append(html);
            }

        }
    });
    return Page;
});
