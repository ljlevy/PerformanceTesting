var DEBUG_GRID = false;
if (DEBUG_GRID) {
    function log(message) {
        console.log(message);
    }
} else {
    function log(message) {
    }
}

/*
 * ----------------------------------------------
 * Build a stack on the Z axis
 * ---------------------------------------------- 
 */
var ZGrid = Container.extend({
    
    initialize : function(x, y, zdelta, componentsArray) {
        log("[ZGrid]["+x+"]["+y+"] zd="+zdelta+" depth="+componentsArray.length);
        Container.prototype.initialize.call(this,componentsArray);
        var count = componentsArray.length;
        for (var i = 0; i < count; i++) {
            log("[ZGrid]["+x+"]["+y+"] ["+(-i * zdelta)+"]");
            componentsArray[i].translate(0.0, 0.0, -i * zdelta);
        }
        this.focusProp = new ScalarBehavior(0.0, 400.0);
        this.focusTransform = mat4.identity(mat4.create());
        this.x = x;
        this.y = y;
    },
    
    focus : function() {
        log("[ZGrid]["+this.x+"]["+this.y+"] Set focus");
        this.focusProp.setValue(1.0);
    },

    unfocus : function() {
        log("[ZGrid]["+this.x+"]["+this.y+"] Unset focus");
        this.focusProp.setValue(0.0);
    },
    
    getTransformation : function(time) {
        var value = this.focusProp.getValue(time),
            matrix = mat4.create(),
            componentTransform = Container.prototype.getTransformation.call(this,time);
        log("[ZGrid]["+this.x+"]["+this.y+"] Value=",value);
        // The Z value shall be forced to the expected value. 
        this.focusTransform[12] = 0.0;
        this.focusTransform[13] = 0.0;
        this.focusTransform[14] = value*120.0;
        //mat4.translate(this.focusTransform,[0.0,0.0,value*120.0]);  
        mat4.multiply(this.focusTransform,componentTransform,matrix);
        log("[ZGrid]["+this.x+"]["+this.y+"] ",matrix);
        if (value===1) {
            log("[ZGrid]["+this.x+"]["+this.y+"] Focus : YES");
        }
        return matrix;
    },

    draw : function(context3d, time) {
        Container.prototype.draw.call(this, context3d, time);        
    },

    drawImpl : function(context3d, time) {
        gl.uniform1i(program.uniforms['cellx'], this.x);
        gl.uniform1i(program.uniforms['celly'], this.y);
        Container.prototype.drawImpl.call(this,context3d, time);
    }
});

/*
 * ----------------------------------------------
 * Build the grid made of stacks on the Z axis.
 * Each stack is separated from each other with xdelta pixels on X axis
 * and ydelta pixels on Y axys.
 * Each stack is a ZGrid instance.
 * ----------------------------------------------
 */
var XYGrid = Container.extend({

    initialize : function (g, xdelta, columns, ydelta, ZGridArray) {
        log("[XYGrid]["+g+"] xd="+xdelta+" col="+columns+" yd="+ydelta+ " NbElt="+ZGridArray.length);
        var count, rows, c, r, x, y;
        Container.prototype.initialize.call(this,ZGridArray);
        this.cells = [];
        this.g = g;
        count = ZGridArray.length;
        rows = Math.floor(count / columns);
        for (var i = 0; i < columns; i++) {
          this.cells.push([]);
        }
        c = Math.floor((columns - 1) / 2);
        r = Math.floor((rows - 1) / 2);
        for (var i = 0; i < count; i++) {
          x = i % columns;
          y = Math.floor(i / columns);
          this.cells[x].push(ZGridArray[i]);
          log("[XYGrid]["+g+"]["+x+"]["+y+"] ["+((x - c) * xdelta)+","+((y - r) * ydelta)+"]");
          ZGridArray[i].translate((x - c) * xdelta, (y - r) * ydelta, 0.0);
        }
    },
    
    getChild : function(x) {
        return this.cells[x];
    },

    drawImpl : function(context3d, time) {
        gl.uniform1i(program.uniforms['cellg'], this.g);
        Container.prototype.drawImpl.call(this, context3d, time);
    }
});

/*
 * ----------------------------------------------
 * Build the hub on the X axis with the given grid of components
 * separated from each other with xdelta pixels.
 * ----------------------------------------------
 */
var XGrid = Container.extend({
    initialize : function(xdelta, XYGridChilds) {
        log("[XGrid] xd="+xdelta+" nbPannels="+XYGridChilds.length);
        Container.prototype.initialize.call(this,XYGridChilds);
        var count = XYGridChilds.length;
        var c = Math.floor((count - 1) / 2);
        for (var i = 0; i < count; i++) {
          log("[XGrid]["+i+"]["+((i - c) * xdelta)+"]");
          XYGridChilds[i].translate((i - c) * xdelta,0.0,0.0);
        }
    },
    
    drawImpl : function(context3d, time) {
        Container.prototype.drawImpl.call(this, context3d, time);
    },
    
    focus : function(g,x,y) {
        log("[XGrid] Focus ["+g+"]["+x+"]["+y+"]");
        this.getChild(g).getChild(x)[y].focus();        
    },
    
    unfocus : function(g,x,y) {
        log("[XGrid] Unfocus ["+g+"]["+x+"]["+y+"]");
        this.getChild(g).getChild(x)[y].unfocus();        
    }
});    
