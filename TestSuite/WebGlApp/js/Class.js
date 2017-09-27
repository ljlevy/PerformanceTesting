/*
* TODO put it somewhere else ...
* gl : global variable to refer the GL surface
* program : global variable to refer the shader program
*/
var gl;
var program;


// definiting the base constructor for all classes, which will execute the final class prototype's initialize method if exists
var Class = function() {
    this.initialize && this.initialize.apply(this, arguments);
};

Class.extend = function(childPrototype) { // defining a static method 'extend'
    var parent = this;
    var child = function() { // the child constructor is a call to its parent's
        return parent.apply(this, arguments);
    };
    child.extend = parent.extend; // adding the extend method to the child class
    var Surrogate = function() {}; // surrogate "trick" as seen previously
    Surrogate.prototype = parent.prototype;
    child.prototype = new Surrogate;
    for(var key in childPrototype){
        child.prototype[key] = childPrototype[key];
    }
    return child; // returning the child class
};
