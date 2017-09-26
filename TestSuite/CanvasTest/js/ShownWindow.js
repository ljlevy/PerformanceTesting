// TODO : allow to notify when an item appears, so that we can put an animation on this event

ShownWindow = function (settings, ctx) {
    'use strict';
    this.points = [];
    this.currentType = this.figures[settings.test];
    this.settings = settings;
    for (var i = 0; i < settings.numberOfPoints; i++) {
        this.points[i] = this.createElement();
    }
    document.getElementById('type').innerHTML = this.figures[settings.test].text;
    document.getElementById('number').innerHTML = settings.numberOfPoints;
    this.ctx = ctx;
    this.drawScene(ctx, false);
};

ShownWindow.prototype.randomSelection = function (array) {
    'use strict';
    return array[Math.floor(Math.random() * array.length)];
}

ShownWindow.prototype.clearScreen = function () {
    'use strict';
    this.ctx.clearRect(0, 0, this.settings.width, this.settings.height);
};

ShownWindow.prototype.drawScene = function () {
    'use strict';
    this.clearScreen();
    for (var i = 0; i < this.points.length; i++) {
        this.points[i].draw(this.ctx);
    }
};

ShownWindow.prototype.figures = [Square, Triangle, Point, LinedSquare, Snowflake, Cloud, SquareOutline];

ShownWindow.prototype.switchTo = function (newFigure) {
    'use strict';
    this.currentType = this.figures[newFigure];
    document.getElementById('type').innerHTML = this.figures[newFigure].text;
    for (var i = 0; i < this.points.length; i++) {
        this.points[i] = new this.figures[newFigure](this.points[i].x, this.points[i].y, this.points[i].color, this.points[i].velocityX, this.points[i].velocityY, this.points[i].speedRatio, this.points[i].radius);
    }
};

ShownWindow.prototype.add = function (number) {
    'use strict';
    for (var i = 0; i < number; i++) {
        this.points.push(this.createElement());
    }
    document.getElementById('number').innerHTML = this.points.length;
};

ShownWindow.prototype.createElement = function () {
    'use strict';
    return new this.currentType(this.settings.width * Math.random(), this.settings.height * Math.random(), this.randomSelection(this.settings.colors), this.randomSelection(this.settings.speeds), this.randomSelection(this.settings.speeds), this.settings.speedRatio, this.randomSelection(this.settings.radius));
};

ShownWindow.prototype.remove = function (number) {
    'use strict';
    for (var i = 0; i < number; i++) {
        this.points.pop();
    }
    document.getElementById('number').innerHTML = this.points.length;
};

