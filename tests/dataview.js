define(['View/Dataview', 'framework'], function(View, _) {
    test("Can instantiate view", function() {
        var view = new View();
        
        ok(_.isObject(view));
    });
});