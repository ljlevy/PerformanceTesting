// TODO : allow to notify when an item appears, so that we can put an animation on this event

ShownWindow = function (settings, ctx) {
    'use strict';
    this.rectangles = new SnowflakeRectangle(settings.depth, settings.vanishingPoint, settings.numberOfRectangles, settings.rectangleWidth, settings.rectangleHeight, settings.marginX, settings.marginY);
    this.settings = settings;
    this.ctx = ctx;
    this.drawScene(ctx, false);
};

ShownWindow.prototype.clearScreen = function () {
    'use strict';
    this.ctx.clearRect(0, 0, this.settings.width, this.settings.height);
};

ShownWindow.prototype.drawScene = function () {
    'use strict';
    this.clearScreen();
    this.rectangles.draw(this.ctx);
};

ShownWindow.prototype.add = function (number) {
    'use strict';
    this.rectangles.addRectangle();
};

ShownWindow.prototype.remove = function (number) {
    'use strict';
    this.rectangles.removeRectangle();
};


