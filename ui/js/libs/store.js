"use strict";

var Store = function(root) {
  this.root = root;
};

Store.prototype = {
  get: function() {
    var obj = localStorage[this.root];
    obj = obj || [];

    if(typeof(obj) == 'string') {
      obj = JSON.parse(obj);
    }
    return obj;
  },

  set: function(obj) {
    localStorage[this.root] = JSON.stringify(obj)
  }
};

define(function() { return Store; });
