define(['Model/Datasource', 'framework', 'raphael', 'jquery'], function(Model, _, Raphael, $) {
    var LABEL_OFFSET = 50;
    
    var View = function(options) {
        var model
          , defaults
          , current;
        
        defaults = {
            el: null,
            zoom: 10,
            width: window.innerWidth - 30,
            height: 400
        };
        
        options = options || {};
        
        options = _.defaults(options, defaults);
        
        options.el = document.getElementById(options.el);
        
        model = new Model();
        
        if(options && options.model) {
            model.add(options.model);
        }
        
        model.zoom(options.zoom);
        model.sort("DESC");
                
        current = model.selected();
        
        
        api = {
            responsive: function() {
                this.responsive = true;
                $(window).resize($.proxy(this, 'render'));
            },
            render: function() {
                var _this = this
                  , paper
                  , position
                  , marks;
                
                options.width = this.responsive ? window.innerWidth : options.width;
                
                options.el.innerHTML = "";
                
                paper = new Raphael(options.el, options.width, options.height);
                
                position = {};
                                
                _.each(current, function(m, key) {
                    currPos = {
                        left: _this.left(key),
                        top: _this.top(m.value)
                    };
                    
                    if(!_.isEmpty(position)) {
                        var line = paper.path("M"  + position.left + "," + position.top + " L" + currPos.left + "," + currPos.top)
                        line.toBack();
                        line.attr('stroke', '#fff');
                    }
                    
                    
                    circle = paper.circle(currPos.left, currPos.top, 5);
                    
                    circle.attr({
                        fill: '#09f',
                        stroke: '#222',
                        title: m.label
                    });
                    
                    _this.addTip(circle, m, paper);
                    
                    position = currPos;
                });
                
                marks= model.marks();
                _.each(marks, function(mark) {
                    paper.text(20, _this.top(mark), mark).attr('stroke', '#fff');
                    paper.path("M40 " + _this.top(mark) + " L" + (options.width - 40) + " " + _this.top(mark)).attr('stroke', '#333').toBack(); 
                });
                
                var background = paper.rect(0, 0, options.width, options.height);
                background.attr('fill', '#222');
                background.toBack();
            },
            addTip: function(circle, model, ctx) {
                var popup;
                
                circle.hover(
                    function(e) {
                        popup = ctx.text(e.offsetX + 30, e.offsetY, model.value)
                            .attr({'fill': '#fff', 'fill-opacity': 0})
                            .animate({'fill-opacity': 1}, 200);
                        circle.animate({fill: '#fff'}, 200);
                    },
                    function(e) {
                        circle.animate({fill: '#09f'}, 200);
                        popup.animate({'fill-opacity':0}, 200, 'linear', function() {popup.remove(); });
                });
            },
            left: function(value) {
                return Math.round(value * ((options.width - 40) / model.selected().length) + LABEL_OFFSET);
            },
            top: function(value) {
                return Math.round(options.height - (value * (options.height - 80) / model.topValue().value) - LABEL_OFFSET);
            }
        };
        
        return api;
                
    }
    
    return View;
});