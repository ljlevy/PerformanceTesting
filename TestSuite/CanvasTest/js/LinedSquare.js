/*
 Implementation of the lined square figure
 */
LinedSquare = function (x, y, color, velocityX, velocityY, speedRatio, radius) {
    'use strict';
    this.x = x;
    this.y = y;
    this.velocityX = velocityX;
    this.velocityY = velocityY;
    this.color = color;
    this.speedRatio = speedRatio;
    this.radius = radius;
};

LinedSquare.prototype = new Figure(0, 0, 'red', 0, 0, 1, 10);

LinedSquare.prototype.draw = function (ctx) {
    'use strict';
    ctx.beginPath();
    ctx.moveTo(this.x - this.radius, this.y - this.radius);
    ctx.lineTo(this.x - this.radius, this.y + this.radius);
    ctx.lineTo(this.x + this.radius, this.y + this.radius);
    ctx.lineTo(this.x + this.radius, this.y - this.radius);
    ctx.fillStyle = this.color;
    ctx.fill();
};

LinedSquare.text = 'LinedSquare';
