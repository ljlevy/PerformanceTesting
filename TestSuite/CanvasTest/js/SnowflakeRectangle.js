SnowflakeRectangle = function (depth, vanishingPoint, numberOfRectangles, rectangleWidth, rectangleHeight, marginX, marginY) {
    'use strict';
    this.x = 0;
    this.y = 0;
    this.depth = depth;
    this.vanishingPoint = vanishingPoint;
    this.numberOfRectangles = numberOfRectangles;
    this.rectangleWidth = rectangleWidth;
    this.rectangleHeight = rectangleHeight;
    this.marginX = marginX;
    this.marginY = marginY;
};

SnowflakeRectangle.prototype.addRectangle = function () {
    'use strict';
    this.numberOfRectangles++;
};

SnowflakeRectangle.prototype.removeRectangle = function () {
    'use strict';
    this.numberOfRectangles--;
};

SnowflakeRectangle.prototype.setCoordinates = function (x, y) {
    'use strict';
    this.x = x;
    this.y = y;
};

SnowflakeRectangle.prototype.getWidth = function () {
    'use strict';
    return this.numberOfRectangles * (this.rectangleWidth + this.marginX);
};

SnowflakeRectangle.prototype.getHeight = function () {
    'use strict';
    return (this.rectangleHeight + this.marginY);
};

SnowflakeRectangle.prototype.draw = function (ctx) {
    'use strict';
    var x = this.x;
    var y = this.y;
    for (var i = 0; i < this.numberOfRectangles; i++) {
        this.drawRectangle(ctx, x, y);
        x += this.marginX + this.rectangleWidth;
    }
};

SnowflakeRectangle.prototype.drawRectangle = function (ctx, x, y) {
    'use strict';
    ctx.fillStyle = 'white';
    ctx.globalAlpha = 0.5;
    // LEFT
    this.drawTetragon(ctx,
        {x: x, y: y},
        {x: x + this.depth * (this.vanishingPoint.x - x), y: y + this.depth * (this.vanishingPoint.y - y)},
        {x: x + this.depth * (this.vanishingPoint.x - x), y: y + this.rectangleHeight + this.depth * (this.vanishingPoint.y - (y + this.rectangleHeight))},
        {x: x, y: y + this.rectangleHeight});

    // RIGHT
    this.drawTetragon(ctx,
        {x: x + this.rectangleWidth, y: y},
        {x: x + this.rectangleWidth + this.depth * (this.vanishingPoint.x - (x + this.rectangleWidth)), y: y + this.depth * (this.vanishingPoint.y - y)},
        {x: x + this.rectangleWidth + this.depth * (this.vanishingPoint.x - (x + this.rectangleWidth)), y: y + this.rectangleHeight + this.depth * (this.vanishingPoint.y - (y + this.rectangleHeight))},
        {x: x + this.rectangleWidth, y: y + this.rectangleHeight});

    var topOpacity = 0.5 - 0.1;
    ctx.globalAlpha = topOpacity >= 0 ? topOpacity : 0;
    // TOP
    this.drawTetragon(ctx,
        {x: x, y: y},
        {x: x + this.depth * (this.vanishingPoint.x - x), y: y + this.depth * (this.vanishingPoint.y - y)},
        {x: x + this.rectangleWidth + this.depth * (this.vanishingPoint.x - (x + this.rectangleWidth)), y: y + this.depth * (this.vanishingPoint.y - y)},
        {x: x + this.rectangleWidth, y: y});

    // BOTTOM
    this.drawTetragon(ctx,
        {x: x, y: y + this.rectangleHeight},
        {x: x + this.depth * (this.vanishingPoint.x - x), y: y + this.rectangleHeight + this.depth * (this.vanishingPoint.y - (y + this.rectangleHeight))},
        {x: x + this.rectangleWidth + this.depth * (this.vanishingPoint.x - (x + this.rectangleWidth)), y: y + this.rectangleHeight + this.depth * (this.vanishingPoint.y - (y + this.rectangleHeight))},
        {x: x + this.rectangleWidth, y: y + this.rectangleHeight});
};

SnowflakeRectangle.prototype.drawTetragon = function (ctx, point1, point2, point3, point4) {
    'use strict';
    ctx.beginPath();
    ctx.moveTo(point1.x, point1.y);
    ctx.lineTo(point2.x, point2.y);
    ctx.lineTo(point3.x, point3.y);
    ctx.lineTo(point4.x, point4.y);
    ctx.lineTo(point1.x, point1.y);
    ctx.fill();
};
