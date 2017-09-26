(function () {
    var log = configLog.getLogger("Canvas");

    function initializeCanvas() {

        var settings = {
            numberOfPoints: 500,
            colors: [
                'red', 'blue', 'white', 'yellow', '#C21BE0', '#13ECF0', '#FFAE00', '#BCE084', '#75BDA2', '#38EB21', "#D66000", "#00DE29", "#B8D1FF", "#9C00C7", "#C20000", "#FFF566", "#FFA200"
            ],
            speedRatio: 10,
            precision: 100,
            speeds: [1, -1], //[0.5, -0.5, 1, 2, 3, -1, -2, -3],
            radius: [8],//[2, 4, 6, 8, 10, 14, 18, 22, 26, 30, 42],
            duration: 10000,
            results: [],
            test: QueryString.type,
            stbId: QueryString.stb
        };

        var canvas = document.getElementById('mainCanvas');
        settings.width = canvas.width;
        settings.height = canvas.height;
        var shownWindow = new ShownWindow(settings, canvas.getContext('2d'));
        var animator = new Animator(settings, shownWindow, log);
        animator.perform();
        return animator;
    }


    window.onload = function () {
        'use strict';
        log.debug("Start the Canvas Test");
        var animator = initializeCanvas();
        PerfAnalyser.start();
        window.onkeydown = function (event) {
            animator.switchTo(event);
        };
    };


})();