/*
 * This class allows to dispose a QuadShape instance on the Z axis 
 */
var QuadObject  = ShapeInstance.extend({
    
    initialize : function(z, quadShape) {
        ShapeInstance.prototype.initialize.call(this,quadShape);         
        this.z = z;
    },
    
    drawImpl: function(context3d,time) {
        gl.uniform1i(program.uniforms['cellz'], this.z);
        ShapeInstance.prototype.drawImpl.call(this, context3d, time);
    }
});
