/*
 * Define what is a shape
 */
var Shape = Class.extend({
    // Abtract method
    draw : function() {}
});

/*
 * Define a quad, one asset on the grid
 */
var QuadShape = Shape.extend({
    initialize : function() {
        this.sb = new ShapeBuilder();
        this.sb.add(new Vertex(-0.5,  0.5, 0.0, 0.0, 0.0));
        this.sb.add(new Vertex( 0.5,  0.5, 0.0, 1.0, 0.0));
        this.sb.add(new Vertex(-0.5, -0.5, 0.0, 0.0, 1.0));    
        this.sb.add(new Vertex( 0.5, -0.5, 0.0, 1.0, 1.0));

        // Buffer vertex    
        this.vertexPositionBuffer = this.sb.getVertexPositionBuffer();
        this.textureCoordinatesBuffer = this.sb.getTextureCoordinatesBuffer();

        // Indices
        this.quadIndices = gl.createBuffer();        
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.quadIndices);
        var data = new Uint8Array([ 0, 1, 2, 3 ]);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, gl.STATIC_DRAW);

        // Borders
        this.rectIndices = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.rectIndices);
        data = new Uint8Array([ 0, 1, 3, 2 ]);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, gl.STATIC_DRAW);
    },
    
    draw : function() {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPositionBuffer);
        gl.vertexAttribPointer(program.attributes['aVertexPosition'], 3, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER,this.textureCoordinatesBuffer);
        gl.vertexAttribPointer(program.attributes['aTextureCoords'], 2, gl.FLOAT, false, 0, 0);

        // Draw the quad shapes - type = 0 for the fragment shader        
        gl.uniform1i(program.uniforms['type'], 0);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.quadIndices);
        gl.drawElements(gl.TRIANGLE_STRIP, 4, gl.UNSIGNED_BYTE, 0);

        // Draw the borders - type = 1 for the fragment shader        
/*
        gl.uniform1i(program.uniforms['type'], 1);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.rectIndices);
        gl.drawElements(gl.LINE_LOOP, 4, gl.UNSIGNED_BYTE, 0);
*/
    }
});
