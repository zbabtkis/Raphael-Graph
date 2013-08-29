define(['Model/Datasource', 'framework', 'raphael', 'jquery', 'hammer'], function(Model,  _, Raphael, $, Hammer) {
    var LABEL_OFFSET = 50;
    
    var View = function(options) {
        var model
          , defaults
          , paper
          , _left
          , _top
          , _position
          , _addBackground
          , _addPoint
          , _addMark
          , _addTip
          , api;
        
        defaults = {
            el: null,
            zoom: 3,
            width: window.innerWidth - 30,
            height: 400,
            sort: "DESC"
        };
                
        options = _.defaults((options || {}), defaults);
        
        options.el = document.getElementById(options.el);
        options.$el = $(options.el);
        
        // Used to hold position of previous point.
        _position = {}; 
        
        model = new Model();
        
        if(options && options.model) {
            model.add(options.model);
        }
        
        model.zoom(options.zoom);
        model.sort(options.sort);

        window.model = model;
        
        paper = new Raphael(options.el, options.width, options.height);

        Hammer(options.el).on('pinch-in', function(e) {
            var zoom = 1;

            /**var point = {
                width: options.width,
                offset: e.offsetX
            };*/

            model.zoom(model.zoom() + zoom);
        });

        options.$el.on('mousewheel', function(e) {
            var zoom = e.originalEvent.wheelDeltaY > 0 ? 1 : -1;

            var point = {
                width: options.width,
                offset: e.offsetX
            };

            model.zoom(model.zoom() + zoom, point);
        });

        api = {
            responsive: function() {
                this.responsive = true;
                $(window).resize($.proxy(this, 'render'));
            },
            render: function() {
                var _this = this
                  , position
                  , current
                  , marks;

                current = model.selected();
                marks   = model.marks();
                               
                options.width = this.responsive ? options.el.offsetWidth : options.width;
                
                paper.clear()
                paper.setSize(options.width, options.height);
                                
                _.each(current, _addPoint);
                _.each(marks, _addMark);
                
                _addBackground();
                
                _position = null;
            }
        };

        model.on('change:zoom', api.render, api);
        model.on('change:position', api.render, api);
        
        _left = function(value) {
            return Math.round(
                value * ((options.width - 40) / model.selected().length) 
                + LABEL_OFFSET
            );
        },
        _top = function(value) {
            return Math.round(
                options.height - (value * (options.height - 80) / model.topValue().value)
                - LABEL_OFFSET);
        }
        
        _addBackground = function() {
            var background = paper.rect(0, 0, options.width, options.height);
                
            background.attr('fill', '#2c3e50');
            background.toBack();
        }
        
        _addPoint = function(m, key) {
            currPos = {
                left: _left(key),
                top: _top(m.value)
            };
                    
            if(!_.isEmpty(_position)) {
                var line = paper.path("M"  
                    + _position.left 
                    + "," 
                    + _position.top 
                    + " L" 
                    + currPos.left 
                    + "," 
                    + currPos.top, 
                    + ' Z')
                    .toBack()
                    .attr('stroke', '#fff');
            }
                    
            label = paper.text(
                    currPos.left, 
                    options.height 
                        - LABEL_OFFSET 
                        + 30, 
                    m.date.getMonth()
                )
                .attr('stroke', '#fff');
                    
            circle = paper.circle(currPos.left, currPos.top, 5);
                    
            circle.attr({
                fill: '#f1c40f',
                stroke: '#f39c12',
                title: m.date
            });
                    
            _addTip(circle, m);
                    
            _position = currPos;
        }
        
        _addMark = function(mark) {
            paper.text(20, _top(mark), mark).attr('stroke', '#fff');
            paper.path(
                "M40 " 
                + _top(mark) 
                + " L" 
                + (options.width - 40) 
                + " " 
                + _top(mark)).attr('stroke', '#34495e')
                .toBack(); 
        }
        
        _addTip = function(circle, model) {
            var popup;
               
            circle.hover(
                function(e) {
                    popup = paper.text(e.offsetX + 30, e.offsetY, model.value)
                        .attr({'fill': '#fff', 'fill-opacity': 0})
                        .animate({'fill-opacity': 1}, 200);
                    circle.animate({fill: '#fff'}, 200);
                },
                function(e) {
                    circle.animate({fill: '#f1c40f'}, 200);
                    popup.animate({'fill-opacity':0}, 200, 'linear', function() {popup.remove(); });
            });
        }
        
        return api;
                
    }
    
    return View;
});