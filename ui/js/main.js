"use strict";

// Require.js allows us to configure shortcut alias
// Their usage will become more apparent futher along in the tutorial.
require.config({
    paths: {
        //urlArgs: "version=" +  (new Date()).getTime(),
        urlArgs: "version=dev1",
        jquery: 'libs/jquery/jquery-min',
        raphael: '../bower_components/raphael/raphael-min',
        morris: '../bower_components/morris.js/morris.min',
        mdl: '../bower_components/material-design-lite/material.min',
        lodash: 'libs/lodash/lodash', // https://github.com/amdjs
        backbone: 'libs/backbone/backbone-min', // https://github.com/amdjs
        store: 'libs/store',
        fingerprint: 'libs/fingerprint2',
        // Require.js plugins
        text: 'libs/require/text'

    }

});

require([
    'views/app',
    'router',
    'vm',
    'store',
    'fingerprint'
], function (AppView, Router, Vm, Store, Fingerprint) {
    var appView = Vm.create({}, 'AppView', AppView)
        , store = new Store('client')
        , client_id = store.get('id');

    if(typeof(client_id) == 'object') {
        new Fingerprint().get(function (result) {
            store.set(result)
            appView.render();
            Router.initialize({appView: appView});
        });
    } else {
        appView.render();
        Router.initialize({appView: appView});
    }


});
