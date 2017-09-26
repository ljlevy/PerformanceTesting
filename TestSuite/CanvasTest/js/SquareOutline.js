/*
 Implementation of the square outline figure
 */
SquareOutline = function (x, y, color, velocityX, velocityY, speedRatio, radius) {
    'use strict';
    this.x = x;
    this.y = y;
    this.velocityX = velocityX;
    this.velocityY = velocityY;
    this.color = color;
    this.speedRatio = speedRatio;
    this.radius = radius;
};

SquareOutline.prototype = new Figure(0, 0, 'red', 0, 0, 1, 10);

SquareOutline.prototype.draw = function (ctx) {
    'use strict';
    ctx.beginPath();
    ctx.rect(this.x - this.radius, this.y - this.radius, 2 * this.radius, 2 * this.radius);
    ctx.strokeStyle = this.color;
    ctx.stroke();
};

SquareOutline.text = 'SquareOutline';
