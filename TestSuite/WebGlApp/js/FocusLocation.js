/*
  Allow to determine the next focus location depending on the key pressed.
*/
var FocusLocation = Class.extend ({
    
    initialize : function(g,x,y) {
        this.g = g;
        this.x = x;
        this.y = y;
    },
    
    focus : function() {
        root.focus(this.g,this.x,this.y);
    },
    
    unfocus : function() {
        root.unfocus(this.g,this.x,this.y);
    },
    
    getFocusCoordinates : function() {
        var xyz = [0.0,0.0,0.0];
        var pannel = root.getChild(this.g);
        xyz = pannel.multiply(xyz);
        var cell = pannel.getChild(this.x)[this.y];
        xyz = cell.multiply(xyz);
        return xyz;
    },

    goLeft : function() {
        if (this.x > 0) return new FocusLocation(this.g, this.x - 1, this.y);
        if (this.g > 0) return new FocusLocation(this.g - 1, 2, this.y);
        return this;
    },    
    
    goUp : function() {
        if (this.y < 2) return new FocusLocation(this.g, this.x, this.y + 1);
        return this;
    },
        
    goRight : function() {
        if (this.x < 2) return new FocusLocation(this.g, this.x + 1, this.y);
        if (this.g < 2) return new FocusLocation(this.g + 1, 0, this.y);
        return this;
    },    
    
    goDown : function() {
        if (this.y > 0) return new FocusLocation(this.g, this.x, this.y - 1);
        return this;
    }    
});
