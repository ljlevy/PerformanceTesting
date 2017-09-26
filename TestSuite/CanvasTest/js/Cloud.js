/*
 Implementation of the cloud figure
 */
Cloud = function (x, y, color, velocityX, velocityY, speedRatio, radius) {
    'use strict';
    this.x = x;
    this.y = y;
    this.velocityX = velocityX;
    this.velocityY = velocityY;
    this.color = color;
    this.speedRatio = speedRatio;
    this.radius = radius;
};

Cloud.prototype = new Figure(0, 0, 'red', 0, 0, 1, 10);

Cloud.prototype.draw = function (ctx) {
    'use strict';
    var x = this.x - this.radius;
    var y = this.y - this.radius;
    var radius = this.radius / 10;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.bezierCurveTo(x - 4 * radius, y - 2 * radius, x - 4 * radius, y + 7 * radius, x + 6 * radius, y + 7 * radius);
    ctx.bezierCurveTo(x + 8 * radius, y + 10 * radius, x + 15 * radius, y + 10 * radius, x + 17 * radius, y + 7 * radius);
    ctx.bezierCurveTo(x + 25 * radius, y + 7 * radius, x + 25 * radius, y + 4 * radius, x + 22 * radius, y + 2 * radius);
    ctx.bezierCurveTo(x + 26 * radius, y - 4 * radius, x + 20 * radius, y - 5 * radius, x + 17 * radius, y - 3 * radius);
    ctx.bezierCurveTo(x + 15 * radius, y - 7 * radius, x + 8 * radius, y - 6 * radius, x + 8 * radius, y - 3 * radius);
    ctx.bezierCurveTo(x + 3 * radius, y - 7 * radius, x - 2 * radius, y - 6 * radius, x, y);

    // complete custom shape
    ctx.closePath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = this.color;
    ctx.stroke();
};

Cloud.text = 'Cloud';
