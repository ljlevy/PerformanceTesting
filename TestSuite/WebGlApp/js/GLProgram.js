/*
String.startsWith method
*/
if (!String.prototype.startsWith) {
  Object.defineProperty(String.prototype, 'startsWith', {
    enumerable: false,
    configurable: false,
    writable: false,
    value: function (searchString, position) {
      position = position || 0;
      return this.indexOf(searchString, position) === position;
    }
  });
}

/*
Allow to program the shaders
*/
var GlProgram = Class.extend({
    initialize: function(fragmentSource, vertexSource) {
    
        function log(message) {
            console.log("[GLProgram] "+message);
        }
        
        /*
         Return the variable name located at the end of the given line
        */
        function varName(shaderLine) {
            var words = shaderLine.split(' '),
                endOfLine = words[words.length - 1];
                array = endOfLine.indexOf('[');
            if (array !== -1) {
                return endOfLine.substring(0, array);
            }
            return endOfLine.substring(0, endOfLine.indexOf(';'));
        }
            
        this.attributeNames = [];
        this.uniformNames = [];
        
        // Search 'uniform' in fragment shader
        var fs = fragmentSource.split('\n');
        for (var line = 0 ; line < fs.length; line++) {
            fs[line] = fs[line].trim();
            if (fs[line].startsWith('uniform')) {
                log("uniform : "+varName(fs[line]));
                this.uniformNames.push(varName(fs[line]));
            }
        }   
        
        // Search 'attribute' and 'uniform' in vertex shader
        var vs = vertexSource.split('\n');
        for (var line = 0 ; line < vs.length; line++) {
            vs[line] = vs[line].trim();
            if (vs[line].startsWith('uniform')) {
                log("uniform : "+varName(vs[line]));
                this.uniformNames.push(varName(vs[line]));
            } else if (vs[line].startsWith('attribute')) {
                log("attribute : "+varName(vs[line]));
                this.attributeNames.push(varName(vs[line]));
            }
        }

        this.fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(this.fragmentShader, fragmentSource);
        gl.compileShader(this.fragmentShader);
        if (!gl.getShaderParameter(this.fragmentShader, gl.COMPILE_STATUS)) {
            console.log(gl.getShaderInfoLog(this.fragmentShader));
        }

        this.vertexShader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(this.vertexShader, vertexSource);
        gl.compileShader(this.vertexShader);
        if (!gl.getShaderParameter(this.vertexShader, gl.COMPILE_STATUS)) {
            console.log(gl.getShaderInfoLog(this.vertexShader));
        }

        this.shaderProgram = gl.createProgram();
        gl.attachShader(this.shaderProgram, this.vertexShader);
        gl.attachShader(this.shaderProgram, this.fragmentShader);
        gl.linkProgram(this.shaderProgram);
        if (!gl.getProgramParameter(this.shaderProgram, gl.LINK_STATUS)) {
            console.log("Could not initialise shaders");
        }

        // Get the shaders attributes and uniforms parameters        
        this.attributes = [];
        this.uniforms = [];
        for (var i = 0; i < this.attributeNames.length; i++) {
            var attribute = this.attributeNames[i];
            this.attributes[attribute] = gl.getAttribLocation(this.shaderProgram,attribute);
            gl.enableVertexAttribArray(this.attributes[attribute]);
        }

        for (var i = 0; i < this.uniformNames.length; i++) {
            var uniform = this.uniformNames[i];
            this.uniforms[uniform] = gl.getUniformLocation(this.shaderProgram,uniform);
        }
    }
});
