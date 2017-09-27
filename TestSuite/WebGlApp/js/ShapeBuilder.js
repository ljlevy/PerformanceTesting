var DEBUG_BUILDER = false;
if (DEBUG_BUILDER) {
    function logShape(message) {
        console.log(message);
    }
} else {
    function logShape(message) {
    }
}

/*
 * This class defines the data buffer for a Shape
 */
var ShapeBuilder= Class.extend({

     initialize : function() {
       this.vertices = []; 
     },

     add : function(vertex) {
       this.vertices.push(vertex);
     },

     getVertexPositionBuffer : function() {
       var bufferData = new Float32Array(this.vertices.length * 3);
       var vertex;
       for (var i = 0; i < this.vertices.length; i++) {
           vertex = this.vertices[i];
           bufferData.set([vertex.position[0],vertex.position[1],vertex.position[2]], i * 3);              
       }
       logShape("[ShapeBuilder] Vertex : ",bufferData);
       var glBuffer = gl.createBuffer();
       gl.bindBuffer(gl.ARRAY_BUFFER, glBuffer);
       gl.bufferData(gl.ARRAY_BUFFER, bufferData, gl.STATIC_DRAW);
       glBuffer.numItems = bufferData.length / 3;
       return glBuffer;
     },

     getTextureCoordinatesBuffer : function() {
       var bufferData = new Float32Array(this.vertices.length * 2);
       var v, u = 0;
       for (var i = 0; i < this.vertices.length; i++) {
           v = this.vertices[i];
           bufferData.set([v.textureCoordinates[0],v.textureCoordinates[1]],u);
           u += 2;
       }
       logShape("[ShapeBuilder] Coord : ",bufferData);
       var glBuffer = gl.createBuffer();
       gl.bindBuffer(gl.ARRAY_BUFFER, glBuffer);
       gl.bufferData(gl.ARRAY_BUFFER, bufferData, gl.STATIC_DRAW);
       return glBuffer;
     }

 });