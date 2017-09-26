directions = ['goPreviousStep', 'goNextStep'];

Animator = function (settings, shownWindow) {
    'use strict';
    this.shownWindow = shownWindow;
    this.settings = settings;
    this.date = false;
    this.timeDiff = 0;
    this.elapsed = 0;
    this.frame = 0;
    this.duration = 0;
    this.results = [];
};

Animator.prototype.debug = function (frame) {
    'use strict';
    var debugDiv = document.getElementById('FPS');
    //console.log(frame);
    var result = Math.floor(frame * this.settings.precision) / this.settings.precision;
    this.results.push(result);
    if (debugDiv) {
        debugDiv.innerHTML = result;
    }
}

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
            if (that.elapsed >= 1000) {
//        that.debug(that.frame / (that.elapsed / 1000));
                that.frame = 0;
                that.elapsed = 0;
            }
            if (that.settings.duration && that.duration > that.settings.duration) {
                finished = true;
            }
            if (!finished) {
                that.shownWindow.drawScene(false);
                that.animate(targets, that);
            } else {
				PerfAnalyser.publish('SnowflakeRectangles', 'One tube on the screen', that.settings.stbId);
				PerfAnalyser.stop();
                that.shownWindow.drawScene(true);
            }
        }, 1
    );
};

Animator.prototype.sendResults = function () {
    'use strict';
    var result = 0;
    for (var i = 0; i < this.results.length; i++) {
        result += this.results[i];
    }
    result = result / this.results.length

    var post = {};
    post.test = {};
    post.test.name = 'Canvas Snowflake with rectangles';
    post.test.description = 'This test is about to move some rectangles with canvas';
    post.test.identifier = this.settings.test;
    post.stb = this.settings.stbId;
    post.value = result;
    console.log(post);
    var stringified = JSON.stringify(post);
    console.log(stringified);
    $.post('registerResult?target=Result', stringified);
};

Animator.prototype.perform = function () {
    'use strict';
    var targets = [];
    targets[0] = {
        animation: new MoveRectangle(this.settings.width, this.settings.height, 1),
        animated: this.shownWindow.rectangles
    }
    this.animate(targets, this);
};

Animator.prototype.switchTo = function (e) {
    'use strict';
    switch (e.keyCode) {
        case 107:
        case 417:
            //+
            this.shownWindow.add();
            break;
        case 109:
        case 412:
            //-
            this.shownWindow.remove();
            break;
        default:
            console.log(e.keyCode);
            break;
    }
}
