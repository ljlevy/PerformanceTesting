/*
Interface definition for a figure
 */

Figure = function(x, y, color, velocityX, velocityY, speedRatio, radius) {
  this.x = x;
  this.y = y;
  this.velocityX = velocityX;
  this.velocityY = velocityY;
  this.color = color;
  this.speedRatio = speedRatio;
  this.radius = radius;
};

Figure.prototype.move = function(timeDiff) {
  this.x += this.velocityX * timeDiff / this.speedRatio;
  this.y += this.velocityY * timeDiff / this.speedRatio;
};

Figure.prototype.changeVelocity = function(x, y) {
  this.velocityX = x;
  this.velocityY = y;
};

Figure.text = 'Figure';
