MoveRectangle = function (width, height, velocity) {
    'use strict';
    this.width = width;
    this.height = height;
    this.x = 0;
    this.y = 0;
    this.velocity = velocity;
    this.direction = 'right';
};

MoveRectangle.prototype.comparator = {
    moveDown: function (current, target) {
        'use strict';
        return (current > target);
    },
    moveUp: function (current, target) {
        'use strict';
        return (current < target);
    }
};

MoveRectangle.prototype.perform = function (timeDiff, animated) {
    'use strict';
    var velocity = this.velocity * timeDiff;
    switch (this.direction) {
        case 'right':
            this.x += velocity;
            animated.setCoordinates(this.x, this.y);
            if (this.x + animated.getWidth() > this.width) {
                this.direction = 'down';
            }
            break;
        case 'left':
            this.x -= velocity;
            animated.setCoordinates(this.x, this.y);
            if (this.x - velocity < 0) {
                this.direction = 'up';
            }
            break;
        case 'up':
            this.y -= velocity;
            animated.setCoordinates(this.x, this.y);
            if (this.y - this.velocity < 0) {
                this.direction = 'right';
            }
            break;
        case 'down':
            this.y += velocity;
            animated.setCoordinates(this.x, this.y);
            if (this.y + animated.getHeight() > this.height) {
                this.direction = 'left';
            }
            break;
    }
    return false;
};
