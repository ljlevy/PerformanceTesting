var root; 

window.webGLapp = function() {
    var GL_CANVAS = "webGl-canvas",
        GL_CONTEXT = "experimental-webgl",
        VERTEX_POS = "a_position",
        PROJ_MATRIX = "u_matrix",
        canvas2d,
        context,
        texture,
        pMatrix,
        camera = new Camera(),
        currentFocus = new FocusLocation(1, 1, 1), 
        nbShadersRead,
        fragmentShaderSrc,
        vertexShaderSrc,        
        canvas3d,
        timeBase = 0,
        nbFrames = 0;
    
    function buildScene() {
        var quadShape = new QuadShape();
        var xyGridArray = [];
        for (var g = 0; g < Constants.NB_GRIDS; g++) {
            var xyGrid = buildxyGrid(g,quadShape);
            xyGridArray.push(xyGrid);
        }
        return new XGrid(640.0,xyGridArray);
    }

    function buildxyGrid(g, quadShape) {
        var zStackArray = [];
        for (var y = 0; y < Constants.NB_ROWS; y++) {
          for (var x = 0; x < Constants.NB_COLUMNS; x++) {
              var zStack = buildZstack(x,y,quadShape,Constants.DEPTH);
              zStackArray.push(zStack);
          }
        }
        var xyGrid = new XYGrid(g, 190.0, Constants.NB_COLUMNS, 130.0, zStackArray);
        return xyGrid; 
    }
    
    function buildZstack(x,y,quadShape,depth) {
        var quadStack = buildQuadStack(depth, quadShape);
        zGrid = new ZGrid(x,y,50.0,quadStack);
        return zGrid;
    }
    
    function buildQuadStack(depth, quadShape) {
        var quadArray = [];
        for (var i = 0; i < depth; i++) {
            var quadObject = new QuadObject(i, quadShape);
            quadObject.scale(170.0, 110.0, 1.0);
            quadArray.push(quadObject);
        }
        return quadArray; 
    }

    /*
     * Initialize the GL surface with the canvas element defined in the DOM.
     * Display an error message if GL is not supported
     */
    function initGL() {
        canvas3d = document.getElementById(GL_CANVAS);
        canvas2d = document.createElement('canvas');
        canvas2d.width  = 256;
        canvas2d.height = 256;    
        context = new Context3D();
        try {
            gl = canvas3d.getContext(GL_CONTEXT);
            gl.viewport(0, 0, canvas3d.width, canvas3d.height);
        } catch (e) {
        }
        if (!gl) {
            console.log("Could not initialise WebGL, sorry :-(");
        }
    }
    
    /*
     * Initialize the program shaders 
     */
    function initShaders() {
       sendRequest("shaders/shader.vs",handleVertex); 
       sendRequest("shaders/shader.fs",handleFragment); 
    }

    function sendRequest(url,callback) {
        var req = new XMLHttpRequest();
        if (!req) return;
        req.open("GET",url,true);
        req.onreadystatechange = function () {
            if (req.readyState != 4) return;
            if (req.status != 200 && req.status != 304) {
                console.log('HTTP error ' + req.status);
                return;
            }
            callback(req);
        }
        if (req.readyState == 4) return;
        req.send();
    }    
    
    function handleVertex(req) {
        vertexShaderSrc = req.responseText;
        handleShaders();
    }

    function handleFragment(req) {
        fragmentShaderSrc = req.responseText;
        handleShaders();
    }
    
    function handleShaders() {
        nbShadersRead++;
        if (nbShadersRead == 2) {
            setProgram(fragmentShaderSrc,vertexShaderSrc);
            paintCanvas();
            buildTexture();
            root = buildScene();          
            currentFocus.focus();
            if ((QueryString.auto !== undefined) && (QueryString.auto === "true")) {
                PerfAnalyser.setup({color:"black"});
                PerfAnalyser.start();
                doAutomaticNavigation();
            } else {
                addFps();
            } 
            tick(0);
        }
    }
    

    /*
     * Create the hub with the 3 grids , each one is made of 9 stacks of pictures 
     */
   
    function drawScene(time) {
      gl.clearColor(1.0, 1.0, 1.0, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.enable(gl.DEPTH_TEST);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture);
            
      gl.uniform1i(program.uniforms["uSampler"], 0);
      var viewWidth = canvas3d.width;
      var viewHeight = canvas3d.height;
      var aspect = viewWidth / viewHeight;
     
      // We create the projection with perspective matrix and then we move the camera on the Z axis in order 
      // to display from -640 to +640 on the X axis (due to 45 degrees angle).   
      pMatrix = mat4.create();
      mat4.perspective(45.0, aspect, 0.1, 2000, pMatrix);
      var cx = camera.x.getValue(time);
      var cy = camera.y.getValue(time);
      var positionCameraMatrix = mat4.translate(mat4.identity(mat4.create()),[camera.x.getValue(time),camera.y.getValue(time),-(canvas3d.width)/2]);
      var rotationCameraMatrix = mat4.rotateY(mat4.identity(mat4.create()),Math.PI / 8);
      mat4.multiply(pMatrix,rotationCameraMatrix,pMatrix);
      mat4.multiply(pMatrix,positionCameraMatrix,pMatrix);
      context.setMatrix(pMatrix); // This matix is used to set the uPMatrix attribute in the vertex shader. 
      root.draw(context, time);
    }
    
    
    /*
     * Retrieve the shader content from the DOM
     */
    function getShaderSrc(id) {
        var shaderScript = document.getElementById(id);
        if (!shaderScript) {
            return null;
        }

        var str = "";
        var k = shaderScript.firstChild;
        while (k) {
            if (k.nodeType == 3) {
                str += k.textContent;
            }
            k = k.nextSibling;
        }

        return str;        
    }


    /*
     * Setup the shaders on the GPU
     */
    function setProgram(fragmentShaderSrc, vertexShaderSrc) {            
       program = new GlProgram(fragmentShaderSrc, vertexShaderSrc);
       gl.useProgram(program.shaderProgram);
    };
    
    function tick(time) {
        if ((QueryString.auto === undefined) || (QueryString.auto !== "true")) {
            console.log("Coucou !! ");
            nbFrames++;
            if (timeBase == 0) {
                timeBase = time;
            } 
            if ((time - timeBase) > 1000) {
                fps = Math.round(nbFrames*1000.0 / (time - timeBase)); 
                document.getElementById('fps').innerHTML = fps + " fps";
                timeBase = time;
                nbFrames = 0;
            }
        }
        window.requestAnimationFrame(tick);
        drawScene(time);
        
    };
    
    
        
    function paintCanvas() {
      var context = canvas2d.getContext('2d');
      context.clearRect(0, 0, canvas2d.width, canvas2d.height);
      context.fillStyle = 'white';
      context.font = "28px Arial";
      context.fillText("Bonjour le monde !", 0, 36, 256);
    };
    
    function buildTexture() {
      texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas2d);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.generateMipmap(gl.TEXTURE_2D);
      gl.bindTexture(gl.TEXTURE_2D, null);
    };
    
    function process(keyCode) {
        var newFocusLocation;
        switch(keyCode) {            
            case Constants.LEFT : 
              newFocusLocation = currentFocus.goLeft();
              break;
            case Constants.UP :
              newFocusLocation = currentFocus.goUp();
              break;
            case Constants.RIGHT :
              newFocusLocation = currentFocus.goRight();
              break;
            case Constants.DOWN :
              newFocusLocation = currentFocus.goDown();
              break;
        }
        if ((newFocusLocation != null) && (newFocusLocation != currentFocus)) {
          currentFocus.unfocus();
          currentFocus = newFocusLocation;
          currentFocus.focus();
          var focusCoordinates = currentFocus.getFocusCoordinates();
          camera.x.setValue(-focusCoordinates[0]);
          camera.y.setValue(-focusCoordinates[1]);
        }
    };


    function keyPressedSimu(keyEvent) {
        process(keyEvent.detail.keyCode);
    }
    
    function tearDown() {
        console.log("Test ended!");
        if ((QueryString.auto !== undefined) && (QueryString.auto === "true")) {
            var name = "Test WebGL",
                description = "Hub test with WebGL",
                stbId = QueryString.stb;
            PerfAnalyser.publish(name,description,stbId);
            PerfAnalyser.stop();
        } 
    }
    
    function addFps() {
        var fps = document.createElement('div');
        fps.id = 'fps';
        fps.style.position = "absolute";
        fps.style.top = "10px";
        fps.style.left = "10px";
        fps.style.width = "100px";
        fps.style.fontFamily = '"Lucida Console", Arial, sans-serif';
        fps.style.fontSize = "20px";
        fps.style.color = "black";
        document.body.appendChild(fps);
    }
        
    // Allow to capture all the GL API calls in the console. 
    function logGLCall(functionName, args) {   
       console.log("gl." + functionName + "(" + 
          WebGLDebugUtils.glFunctionArgsToString(functionName, args) + ")");   
    }; 

    function doAutomaticNavigation() {
        console.log("doAutomaticNavigation");
        window.addEventListener('scenarioKey',keyPressedSimu);
        window.addEventListener('scenarioDone',tearDown);
        var scenario = [{KEY:"LEFT",NB:4},{KEY:"UP",NB:1},{KEY:"RIGHT",NB:8},{KEY:"DOWN",NB:2},{KEY:"LEFT",NB:8}];
        var delay = 1000;
        window.EventGenerator.doScenario(scenario,delay);
    };
    
    return {
        webGLStart : function() {
            console.log("Web GL Application - Starting.");
            initGL();
            if (Constants.DEBUG_GL) gl = WebGLDebugUtils.makeDebugContext(gl, undefined, logGLCall);
            nbShadersRead = 0;
            initShaders();
        },
        
        processKey : function(event) {
            process(event.keyCode);
        }
    };
    
}(); 



window.addEventListener('load', window.webGLapp.webGLStart);
window.addEventListener('keydown', window.webGLapp.processKey);
