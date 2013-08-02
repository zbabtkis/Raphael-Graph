define(['View/DataView'], function(View) {
    var model = [
        {
            date: new Date("January 1, 2013")
          , value: 20
        }, 
        {
            date: new Date("February 5, 2013")
          , value: 2
        },
        {
            date: new Date("March 10, 2013")
          , value: 2
        },
        {
            date: new Date("April 1, 2013")
          , value: 50
        }, 
        {
            date: new Date("May 2, 2013")
          , value: 29
        },
        {
            date: new Date("June 1, 2013")
          , value: 100
        }
    ];
    var chart = new View({el: 'target', model: model});
    chart.render();
    chart.responsive();
    
    return chart;
});