require.config({
    paths: {
        jquery: 'components/jquery/jquery.min'
      , domready: 'components/domready/domReady'
      , raphael: 'components/raphael/raphael'
      , eve: 'components/eve/eve'
      , framework: 'components/underscore/underscore-min'
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
        }
    }
});

define(['tests/datasource', 'tests/dataview', 'app'], function(modeltest, viewtest, app) {
    QUnit.start();
});