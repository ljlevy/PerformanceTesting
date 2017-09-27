var Context3D = Class.extend({

    initialize : function() {
        this.mvMatrix = mat4.identity(mat4.create()); 
        this.mvStack = [];
    },

    // Set the perspective matrix into the vertex shader
    setMatrix : function(matrix) {
        gl.uniformMatrix4fv(program.uniforms['uPMatrix'], false, matrix);
    },

    // Set the model-view matrix into the vertex shader
    apply : function(transform) {
        mat4.multiply(this.mvMatrix,transform,this.mvMatrix); 
        gl.uniformMatrix4fv(program.uniforms['uMVMatrix'], false, this.mvMatrix);
    },

    // Store in the stack a clone of the current model-view matrix
    pushMatrix : function() {
        this.mvStack.push(mat4.create(this.mvMatrix)); 
    },

    // Restore the model_view matrix
    popMatrix : function() {
        this.mvMatrix = this.mvStack.pop();        
   }
}); 
