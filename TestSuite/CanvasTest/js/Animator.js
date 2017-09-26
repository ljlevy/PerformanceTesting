directions = ['goPreviousStep', 'goNextStep'];

Animator = function (settings, shownWindow,log) {
    'use strict';
    this.shownWindow = shownWindow;
    this.settings = settings;
    this.date = false;
    this.timeDiff = 0;
    this.elapsed = 0;
    this.frame = 0;
    this.duration = 0;
    this.settings.results = [];
    this.log = log;
};

Animator.prototype.animate = function (targets, that) {
    'use strict';
    window.setTimeout(function () {
            that.frame++;
            var finished = true;
            if (that.date) {
                var previousDate = that.date;
                that.date = Date.now();
                that.timeDiff = that.date - previousDate;
                for (var i = 0; i < targets.length; i++) {
                    var animationDone = targets[i].animation.perform(that.timeDiff, targets[i].animated);
                    finished = finished && animationDone;
                }
            } else {
                finished = false;
                that.date = Date.now();
            }
            that.elapsed += that.timeDiff;
            that.duration += that.timeDiff;
            if (that.settings.duration && that.duration > that.settings.duration) {
                finished = true;
            }
            if (!finished) {
                that.shownWindow.drawScene(false);
                that.animate(targets, that);
            } else {
                var name = that.shownWindow.figures[that.settings.test].text;
                var description = 'This is test to dispay some' + name + ' into canvas';
                var stbId = that.settings.stbId;
                PerfAnalyser.publish(name, description, stbId);
                PerfAnalyser.stop();
                that.shownWindow.drawScene(true);
                that.frame = 0;
                that.duration = 0;
                that.results = [];
            }
        }, 1
    );
};

Animator.prototype.perform = function () {
    'use strict';
    var targets = [];
    targets[0] = {
        animation: new MoveAnimation(this.settings.width, this.settings.height),
        animated: this.shownWindow.points
    };
    this.animate(targets, this);
};

Animator.prototype.switchTo = function (e) {
    'use strict';
    switch (e.keyCode) {
        case 97:
        case 49:
            this.shownWindow.switchTo(0);
            break;
        case 98:
        case 50:
            this.shownWindow.switchTo(1);
            break;
        case 99:
        case 51:
            this.shownWindow.switchTo(2);
            break;
        case 100:
        case 52:
            this.shownWindow.switchTo(3);
            break;
        case 101:
        case 53:
            this.shownWindow.switchTo(4);
            break;
        case 102:
        case 54:
            this.shownWindow.switchTo(5);
            break;
        case 103:
        case 55:
            this.shownWindow.switchTo(6);
            break;
        case 107:
        case 417:
            //+
            this.shownWindow.add(100);
            break;
        case 109:
        case 412:
            //-
            this.shownWindow.remove(100);
            break;
        default:
            this.log.debug(e.keyCode, " not managed");
            break;
    }
};
