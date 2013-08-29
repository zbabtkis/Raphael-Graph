require.config({
    paths: {
        jquery: 'components/jquery/jquery.min'
      , domready: 'components/domready/domReady'
      , raphael: 'components/raphael/raphael'
      , eve: 'components/eve/eve'
      , framework: 'components/underscore/underscore-min'
      , hammer: 'components/hammerjs/dist/hammer.min'
    },
    shim: {
        raphael: {
            exports: 'Raphael',
            deps: ['eve']
        },
        eve: {
            exports: 'eve',
            deps: ['jquery']
        },
        framework: {
            exports: '_'
        },
        hammer: {
            exports: 'Hammer'
        }
    }
});

define(['tests/datasource', 'tests/dataview', 'app'], function(modeltest, viewtest, app) {
    QUnit.start();
});