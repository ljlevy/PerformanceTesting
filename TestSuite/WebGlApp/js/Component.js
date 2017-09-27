/*
 * Define the basic component behavior 
 */
var Component = function() {
    function log(message) {
        if (Constants.DEBUG_COMPONENT) console.log("[Component] " + message);
    }
    
    return Class.extend({

        initialize : function() { 
            this.transform = mat4.identity(mat4.create());
        },

        translate : function(x,y,z) {
            mat4.translate(this.transform,[x,y,z]);
            log("[translate] transform = ", this.transform);
        },

        scale : function(x,y,z) {
            mat4.scale(this.transform,[x,y,z]);
            log("[scale] transform = ", this.transform);
        },

        multiply : function(sourceVec3) {
            var dest = [0.0,0.0,0.0];
            mat4.multiplyVec3(this.transform, sourceVec3, dest);
            log("[multiply] dest = ", dest);
            return dest;
        },

        getTransformation : function(time) {
            return this.transform;
        },

        draw : function(context3d, time) {
            context3d.pushMatrix();
            context3d.apply(this.getTransformation(time));
            this.drawImpl(context3d, time);
            context3d.popMatrix();
        },

        // Abtract method
        drawImpl : function(context3d, time) {
            throw new Exception("[drawImpl] Method shall be implemented by subClass.");
        }
    });
}(); 

