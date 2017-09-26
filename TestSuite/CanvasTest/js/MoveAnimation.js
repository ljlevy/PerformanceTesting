MoveAnimation = function (width, height) {
    'use strict';
    this.width = width;
    this.height = height;
};

MoveAnimation.prototype.comparator = {
    moveDown: function (current, target) {
        'use strict';
        return (current > target);
    },
    moveUp: function (current, target) {
        'use strict';
        return (current < target);
    }
};

MoveAnimation.prototype.perform = function (timeDiff, animated) {
    'use strict';
    for (var i = 0; i < animated.length; i++) {
        animated[i].move(timeDiff);
        if (animated[i].x < animated[i].radius) {
            animated[i].x = 2 * animated[i].radius - animated[i].x;
            animated[i].changeVelocity(-animated[i].velocityX, animated[i].velocityY);
        }
        if (animated[i].y < animated[i].radius) {
            animated[i].y = 2 * animated[i].radius - animated[i].y;
            animated[i].changeVelocity(animated[i].velocityX, -animated[i].velocityY);
        }
        if (animated[i].x > this.width - animated[i].radius) {
            animated[i].x = 2 * this.width - 2 * animated[i].radius - animated[i].x;
            animated[i].changeVelocity(-animated[i].velocityX, animated[i].velocityY);
        }
        if (animated[i].y > this.height - animated[i].radius) {
            animated[i].y = 2 * this.height - 2 * animated[i].radius - animated[i].y;
            animated[i].changeVelocity(animated[i].velocityX, -animated[i].velocityY);
        }
    }
    return false;
};
