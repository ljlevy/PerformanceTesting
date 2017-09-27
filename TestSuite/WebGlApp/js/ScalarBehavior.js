var ScalarBehavior = Class.extend({
    initialize: function(value, duration, easing) {
        this.value = value;
        this.duration = duration;
        this.easing = (easing != undefined)? easing : this.linear;
        this.targetDelta = null;
        this.newTarget = null;  
    },
    
    setValue : function(target) {
        this.newTarget = target;
    },
    
    /**
     * Methods used for easing 
     */
    linear: function(x) {
        return x;
    },
    
    easeIn: function(x) {
        return x * x;
    },
  
    easeOut: function(x) {
        var oneMinus = 1.0 - x;
        return 1.0 - (oneMinus * oneMinus);
    },
        
    getValue: function(time) {
        // Restart the animation if a new value has just been set 
        if (this.newTarget != null) {
            if (this.targetDelta != null) {
                // ongoing animation => use last returned value as new reference
                this.value = this.lastResult;
                this.startTime = this.lastTime;
            } else {
                this.startTime = time;
            }
            // The new distance is calculated and so new value is considered as taken into account
            this.targetDelta = this.newTarget - this.value;
            this.newTarget = null; 
        }

        // A value has been set        
        if (this.targetDelta != null) {
            var delta = time - this.startTime;
            if (delta < this.duration) {
                this.lastResult = this.value + this.targetDelta * this.easing(delta / this.duration);
                this.lastTime = time;
            } else {
                this.value = this.value + this.targetDelta;
                this.targetDelta = null;
                this.lastResult = this.value;
            }
            return this.lastResult;
        }
        return this.value;
  } 
  
});