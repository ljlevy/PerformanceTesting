/*
Define the camera position for the translation
*/
var Camera = Class.extend({
    initialize: function() {
        this.x = new ScalarBehavior(0.0, Constants.NAVIGATION_DURATION);
        this.y = new ScalarBehavior(0.0, Constants.NAVIGATION_DURATION);
    }
});
