var Vertex = Class.extend({
     initialize : function(x,y,z,u,v) {
         this.position = vec3.create([x,y,z]);
         this.textureCoordinates = [u,v];
     } 
});
