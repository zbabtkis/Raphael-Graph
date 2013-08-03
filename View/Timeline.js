define(['framework'], function(_) {
    var LABEL_OFFSET = 50;
    
    var Timeline = function(options, model) {
        var paper,
            _addBackground,
            _plotPoint,
            _path = "",
            _setEdge;
        
        options = {
            width: options.width,
            height: 50,
            el: options.el
        };
        
        paper = new Raphael(options.el, options.width, options.height);

        _setEdge = (function() {
            var line, fill, edges = [], edgesX = [];
                
            var api =  {
                find: function(e, isSelected) {
                    if(line && !isSelected) {
                        line.remove();
                    }
                    line = paper.path('M' + e.x + ' 0L' + e.x + ' ' + options.height).attr('stroke', '#2ecc71');
                    
                    if(isSelected) {
                        edges.push(line);
                        if(edgesX.length === 0) {
                            edgesX.push(e.x);
                        } else {
                            edgesX[1] = e.x;
                        }
                    }
                    
                    if(edges.length > 0) {
                        edgesX[1] = e.x;
                        if(fill) {
                            fill.remove();
                        }
                        fill = paper.rect(edgesX[0], 0, edgesX[1] - edgesX[0], options.height).attr('fill', '#09f');
                    }
                },
                reverseLookup: function(position) {
                    //var old = (options.width - 40) * model.selected().length / (position * LABEL_OFFSET);
                    return (position / options.width);
                },
                select: function(e) {
                    this.find(e, true);
                    if(edges.length === 2) {
                        setTimeout(function() {  
                            _.invoke(edges,'remove');
                            fill.remove();
                            edges = [];
                            edgesX = [];
                        }, 200);
                    }
                }
            };
                            
            _.bindAll(api, 'find', 'select');
                            
            return api;
        })();
        
        _plotPoint = function(m) {
            _path += "";
            
            return _path;
        }
        
        _left = function(value) {
            return Math.round(
                value * ((options.width - 40) / model.all().length) 
                + LABEL_OFFSET
            );
        },
        _top = function(value) {
            return Math.round(
                options.height - (value * (options.height - 80) / _.max(model.all(), function(m) { return m.value; }).value)
                - LABEL_OFFSET);
        }

        _addBackground = function() {
            var background = paper.rect(0, 0, options.width, options.height);

            background.attr('fill', '#222');

            background.mousemove(function(e) {
                _setEdge.find(e);
            });
                
            background.click(function(e) {
                _setEdge.select(e);
            });
        }

        return {
            responsive: function() {
                this.responsive = true;
                $(window).resize(this.render);
            },
            render: function() {
                paper.clear()
                paper.setSize(options.width, options.height);
                
                _addBackground();
                
                var months = model.months();
                
                _.each(months, function(month, key) {
                    paper.text(_left(key), 30, month).attr('stroke', '#fff');
                });
            }
        };
    }
    
    return Timeline;
});