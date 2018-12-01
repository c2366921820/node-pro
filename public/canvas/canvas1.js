//Globals
var vWidth = window.innerWidth;
var vHeight = window.innerHeight;
var cns = document.createElement("canvas");
cns.width = vWidth;
cns.height = vHeight;
document.body.appendChild(cns);
var ctx = cns.getContext("2d");
ctx.fillStyle = "rgba(6,9,74,1)";
ctx.fillRect(0, 0, vWidth, vHeight);

//Particles
var particles = new Array();
var Particle = function() {
  this.x =
    Math.round(Math.random() * vWidth) - Math.round(Math.random() * vWidth);
  this.y =
    Math.round(Math.random() * vHeight) - Math.round(Math.random() * vHeight);
  this.hue =
    "#" +
    Math.random()
      .toString(16)
      .substr(2, 6);
  this.directionX = "left";
  this.directionY = "bottom";
};
for (var i = 0; i < 1000; i++) {
  particles[i] = new Particle();
}

//Paint
var paint = param => {
  ctx.beginPath();
  ctx.lineWidth = "2";
  ctx.strokeStyle = particles[param].hue;
  ctx.moveTo(particles[param].x, particles[param].y);
  if (particles[param].directionY == "bottom") {
    particles[param].y = particles[param].y + Math.round(Math.random() * 2);
    if (particles[param].y > vHeight) {
      particles[param].directionY = "top";
    }
  }
  if (particles[param].directionY == "top") {
    particles[param].y = particles[param].y - Math.round(Math.random() * 2);
    if (particles[param].y < 0) {
      particles[param].directionY = "bottom";
    }
  }

  if (particles[param].directionX == "left") {
    particles[param].x = particles[param].x + Math.round(Math.random() * 2);
    if (particles[param].x > vWidth) {
      particles[param].directionX = "right";
    }
  }
  if (particles[param].directionX == "right") {
    particles[param].x = particles[param].x - Math.round(Math.random() * 2);
    if (particles[param].x < 0) {
      particles[param].directionX = "left";
    }
  }

  ctx.lineTo(particles[param].x, particles[param].y);
  ctx.closePath;
  ctx.stroke();
};

// Frames
var frame = () => {
  ctx.fillStyle = "rgba(6,9,74,.20)";
  ctx.fillRect(0, 0, vWidth, vHeight);
  for (var j = 0; j < 1000; j++) {
    paint(j);
  }
  window.requestAnimationFrame(frame);
};
window.requestAnimationFrame(frame);