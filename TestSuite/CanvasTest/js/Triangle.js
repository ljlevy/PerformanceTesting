/*
 Implementation of the triangle figure
 */
Triangle = function (x, y, color, velocityX, velocityY, speedRatio, radius) {
    'use strict';
    this.x = x;
    this.y = y;
    this.velocityX = velocityX;
    this.velocityY = velocityY;
    this.color = color;
    this.speedRatio = speedRatio;
    this.radius = radius;
    this.height = (this.cos60 + 1) * radius;
    this.sideHalfLength = this.sin60 * radius;
};

Triangle.prototype = new Figure(0, 0, 'red', 0, 0, 1, 10);

Triangle.prototype.draw = function (ctx) {
    'use strict';
    ctx.beginPath();
    ctx.moveTo(this.x, this.y - this.radius);
    ctx.lineTo(this.x + this.sideHalfLength, this.y + this.height - this.radius);
    ctx.lineTo(this.x - this.sideHalfLength, this.y + this.height - this.radius);
    ctx.fillStyle = this.color;
    ctx.fill();
}

Triangle.prototype.sin60 = Math.sin(Math.PI / 3);
Triangle.prototype.cos60 = Math.cos(Math.PI / 3);

Triangle.text = 'Triangle';
