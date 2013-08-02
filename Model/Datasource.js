define(['framework'], function(_) {
    var Datasource = function(starters, schem) {
        var models
          , schema
          , api
          , position = 1
          , zoom     = 1;
        
        models = [];
        
        schema = ['value', 'date', 'compare'];
        
        function getSafeModel(m) {
            return _.pick(m, schema);
        }
        
        api = {
            add: function(obj) {
                if(_.isArray(obj)) {
                    _.each(obj, function(m) {
                        models.push(getSafeModel(m));
                    });
                } else if(_.isObject(obj)) {
                    models.push(getSafeModel(obj));
                }
                
                return this;
            },
            selected: function() {
                var last = _.last(models, this.position())
                  , res  = _.first(last, this.zoom());
                
                return res;
            },
            position: function(value) {
                if(_.isNumber(value)) {
                    position = value;
                } else if(_.isString(value)) {
                    (value === "forward") ? position-- : position++;
                }
                if(position < 1) {
                    position = 1;
                }
                if(position > models.length) {
                    position = models.length;
                }
                return position;
            },
            zoom: function(value) {
                if(_.isNumber(value)) {
                    zoom = value;
                } else if(_.isString(value)) {
                    (value === "in") ? zoom-- : zoom++;
                }
                if(zoom < 0) {
                    zoom = 0;
                }
                if(zoom > models.length) {
                    zoom = models.length;
                }
                if(zoom > position) {
                    zoom = this.position(zoom);
                }
                return zoom;
            },
            get: function(params) {
                return _.findWhere(models, params);
            },
            topValue: function() {
                return _.max(this.selected(), function(model) { return model.value; });
            },
            marks: function() {
                var step = Math.ceil(this.topValue().value/10)
                  , top  = step * 10;
                return _.range(0, top +1, step);
            },
            length: function() {
                return models.length;
            },
            sort: function(direction) {
                models = _.sortBy(models, function(model) {
                    if(direction === 'DESC') {
                        return (model.compare || model.date)
                    }
                    
                    return -(model.compare || model.date);
                });
            }
        };
        
        api.add(starters);
            
        return api;
    }
    
    return Datasource;
});