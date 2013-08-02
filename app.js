define(['View/DataView'], function(View) {
    var model = [
        {
            label: "hello"
          , value: 20
          , compare: 1
        }, 
        {
            label: 'goodbye'
          , value: 2
          , compare: 2
        },
        {
            label: 'goodbye'
          , value: 2
          , compare: 9
        },
        {
            label: "what"
          , value: 50
          , compare: 50
        }, 
        {
            label: 'there'
          , value: 29
          , compare: 5
        },
        {
            label: 'no'
          , value: 100
          , compare: 29
        }
    ];
    var chart = new View({el: 'target', model: model});
    chart.render();
    chart.responsive();
    
    return chart;
});