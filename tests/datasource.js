define(['Model/Datasource', 'framework'], function(Datasource, _) {

    test("Can instantiate Datasource", function() {
        var datasource = new Datasource();
        
        ok(_.isObject(datasource));
    });
    
    test("Can add a model", function() {
        var datasource = new Datasource();
        
        datasource.add({date: "hello", value: 1});
                                        
        ok(datasource.length() === 1);
    });
    

    test("Datasource calculates top model", function() {
        var data = [
            {date: "hello", value: 1},
            {date: 'goodbye', value: 1000},
            {date: 'what', value: 100}
        ];
        var datasource = new Datasource(data);
        datasource.zoom(3);
        deepEqual(datasource.topValue(), data[1]);
    });
    
    test("Can get model", function() {
        var model = {date: 'hello', value: 100};
        var datasource = new Datasource(model);
        
        deepEqual(model, datasource.get(model));
    });
    
    test("Model removes unwanted schema", function() {
        var data = {
            date: "hello",
            value: 1,
            meTo: "no"
        };
        
        var datasource = new Datasource(data);
        
        notDeepEqual(data, datasource.get({date: 'hello'}));
    });
    
    test("Initial position is end of array", function() { 
        var datasource = new Datasource();
        
        equal(datasource.position(), 0);
    });
    
    test("Can set position", function() {
        var data = [
            {date: "hello", value: 1},
            {date: 'goodbye', value: 1000},
            {date: 'what', value: 100}
        ];
        var datasource = new Datasource(data);
        datasource.position(2);
        
        equal(datasource.position(), 2);
    });
    
    test("Can set zoom by number", function() {
        var data = [
            {date: "hello", value: 1},
            {date: 'goodbye', value: 1000},
            {date: 'what', value: 100}
        ];
        var datasource = new Datasource(data);
        datasource.position(3);
        datasource.zoom(3);
        
        equal(datasource.zoom(), 3);
    });
    
    test("Can set position by direction", function() {
        var data = [
            {date: "hello", value: 1},
            {date: 'goodbye', value: 1000},
            {date: 'what', value: 100}
        ];
        var datasource = new Datasource(data);
        datasource.position(2);
        datasource.position('forward');
        equal(datasource.position(), 1);
        
        datasource.position(2);
        datasource.position('back');
        equal(datasource.position(), 3);
    });
    
    test("Can set zoom by direction", function() {
        var data = [
            {date: "hello", value: 1},
            {date: 'goodbye', value: 1000},
            {date: 'what', value: 100}
        ];
        var datasource = new Datasource(data);
        // Set zoom to known value.
        datasource.zoom(1);
        datasource.zoom("in");
        equal(datasource.zoom(), 0);
        // Set zoom to known value.
        datasource.zoom(1);
        datasource.zoom("out");
        equal(datasource.zoom(), 2);
    });
    
    test("Zoom can't be below zero", function() {
        var datasource = new Datasource();
        
        datasource.zoom(-2);
        equal(datasource.zoom(), 0);
    });
    
    test("Position can't be below zero", function() {
        var datasource = new Datasource();
        
        datasource.position(-2);
        equal(datasource.position(), 0);
    });
    
    test("Zoom can't be greater than length", function() {
        var data = [
            {date: "hello", value: 1},
            {date: 'goodbye', value: 1000},
            {date: 'what', value: 100}
        ];
        var datasource = new Datasource(data);
        
        datasource.zoom(5);
        equal(datasource.zoom(), 3);
    });
    
    test("Position can't be greater than length", function() {
        var data = [
            {date: "hello", value: 1},
            {date: 'goodbye', value: 1000},
            {date: 'what', value: 100}
        ];
        var datasource = new Datasource(data);
        
        datasource.position(5);
        equal(datasource.position(), 3);
    });
    
    test("Position with zoom greater than length should max out", function() {
        var data = [
            {date: "hello", value: 1},
            {date: 'goodbye', value: 1000},
            {date: 'what', value: 100}
        ];
        var datasource = new Datasource(data);
        
        datasource.position(1);
        datasource.zoom(5);
        
        equal(datasource.zoom(), 3);
        equal(datasource.position(), 3);
    });
    
    test("Can filter results by setting zoom", function() {
        var data = [
            {date: "hello", value: 1},
            {date: 'goodbye', value: 1000},
            {date: 'what', value: 100}
        ];
        var datasource = new Datasource(data);
        
        datasource.position(1);
        
        var initial = datasource.selected();
        
        datasource.zoom(3);
        notDeepEqual(datasource.selected(), initial);
        datasource.position(1);
        datasource.zoom(1);
        // Should be equal to selected at initial zoom.
        deepEqual(datasource.selected(), initial);
    });
    
    test("Can sort by comparator", function() {
        var data = [
            {date: "hello", value: 1, compare: 1},
            {date: 'goodbye', value: 1000, compare: 3},
            {date: 'what', value: 100, compare:2}
        ];
        var datasource = new Datasource(data);
        
        datasource.sort("DESC");
        datasource.zoom(3);
        
        deepEqual(datasource.selected()[2], {date: 'goodbye', value: 1000, compare: 3});
        
        datasource.sort("ASC");
        datasource.zoom(3);
        
        deepEqual(datasource.selected()[0], {date: 'goodbye', value: 1000, compare: 3});
    });
    
    test("Can generate marks", function() {
        var data = [
            {date: "hello", value: 1, compare: 1},
            {date: 'goodbye', value: 1000, compare: 3},
            {date: 'what', value: 100, compare:2}
        ];
        var datasource = new Datasource(data);
        
        datasource.zoom(3);
        
        deepEqual(datasource.marks(), [0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000]);
    });
});