/*
 * Container used to draw all its Component instances
 */
var Container = Component.extend({

    initialize : function(childs) {
        Component.prototype.initialize.call(this);        
        this.childs = childs;
    },
        
    drawImpl : function(context3d,time) {
        for (var i = 0; i < this.childs.length; i++) {
            this.childs[i].draw(context3d,time);
        }
    },
    
    getChild : function(i) {
        return this.childs[i];
    }
});

