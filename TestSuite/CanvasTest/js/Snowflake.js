Snowflake = function (x, y, color, velocityX, velocityY, speedRatio, radius) {
    'use strict';
    this.x = x;
    this.y = y;
    this.velocityX = velocityX;
    this.velocityY = velocityY;
    this.color = color;
    this.speedRatio = speedRatio;
    this.radius = radius;
    this.image = new Image();
    this.loaded = false;
    var that = this;
    this.image.onload = function () {
        that.loaded = true;
    };
    this.image.src = 'img/user_snowflake.png';
};

Snowflake.prototype = new Figure(0, 0, 'red', 0, 0, 1, 10);

Snowflake.prototype.draw = function (ctx) {
    'use strict';
    if (this.loaded) {
        ctx.drawImage(this.image, this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
    }
};

Snowflake.text = 'Snowflake';
