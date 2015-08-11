StyleHeader = {
  active_class: 'active',

  activate_current: function() {
    $($('a[href="' + location.hash + '"]').parent()).addClass(this.active_class)
  },

  deactivate_all: function() {
    var active = this.active_els();
    for(var x = 0; x < active.length; x++) {
      $(active[x]).removeClass(this.active_class)
    }
  },

  active_els: function() {
    return $('li.' + this.active_class);
  }
}

define(function() {
  return StyleHeader;
});
