define([
  'jquery',
  'lodash',
  'backbone',
  'text!templates/<page>/page.html'
], function($, _, Backbone, <page>Template){
  var Page = Backbone.View.extend({
    el: '.page',
    render: function () {
    }
  });
  return Page;
});
