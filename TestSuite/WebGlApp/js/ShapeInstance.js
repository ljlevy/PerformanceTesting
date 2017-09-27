/*
 * This class defines how to draw a Shape
 */
var ShapeInstance = Component.extend({
    initialize: function(shape) {
        Component.prototype.initialize.call(this);
        this.shape = shape;
    },
    
    drawImpl: function(context3d, time) {
        this.shape.draw();
    }
});

