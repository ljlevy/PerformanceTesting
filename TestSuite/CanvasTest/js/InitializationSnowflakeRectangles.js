function initializeCanvas() {

  var log = configLog.getLogger('Initialization');

  var settings = {
    numberOfRectangles: QueryString.numberOfRectangles ? QueryString.numberOfRectangles : 1, // Number of tubes to show.
    depth: QueryString.depth ? parseFloat(QueryString.depth) : 0.5, // Depth of the tube.
    vanishingPoint: { // Define the vanishing point coordinates, id est the point targetted by the tubes.
    	x: QueryString.x ? parseInt(QueryString.x) : 300,
    	y: QueryString.y ? parseInt(QueryString.y) : 500
    },
    rectangleWidth: QueryString.rectangleWidth ? parseInt(QueryString.rectangleWidth) : 100, // Width of the front of the tube. In pixels.
    rectangleHeight: QueryString.rectangleHeight ? parseInt(QueryString.rectangleHeight) : 50, // Height of the front of the tube. In pixels.
    marginX: QueryString.marginX ? parseInt(QueryString.marginX) : 10, // Margin between two rectangles on the X coordinate, in pixel.
    marginY: QueryString.marginY ? parseInt(QueryString.marginY) : 10, // Margin between two rectangles on the Y coordinate, in pixel.
    precision: QueryString.precision ? parseInt(QueryString.precision) : 100, // Precision of the FPS value (so 100 will be a precision of 0.01)
    duration: QueryString.duration ? parseInt(QueryString.duration) : 10000, // Duration of the animation, in milliseconds.
    stbId: QueryString.stb
  };

  var canvas = document.getElementById('mainCanvas');
  settings.width = canvas.width;
  settings.height = canvas.height;
  var shownWindow = new ShownWindow(settings, canvas.getContext('2d'));
  log.debug('shownWindow : ', shownWindow);
  var animator = new Animator(settings, shownWindow);
  animator.perform();
  return animator;
}

window.onload = function() {
  var animator = initializeCanvas();
  PerfAnalyser.start();
  window.onkeydown = function(event) {
    animator.switchTo(event);
  };
};
