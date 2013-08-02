define(['app'], function(App) {
    test("Can instantiate app", function() {
        var app = new App({
            canvas: '#hello'
        });
        
        equal(typeof app, 'object');
    });
    
    return {
        init: function() {
            QUnit.start();
        }
    };
});