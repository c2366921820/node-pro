"use strict";var

PI = Math.PI,cos = Math.cos,sin = Math.sin,abs = Math.abs,sqrt = Math.sqrt,pow = Math.pow,random = Math.random,atan2 = Math.atan2;
var HALF_PI = 0.5 * PI;
var TAU = 2 * PI;
var rand = function rand(n) {return n * random();};
var randIn = function randIn(min, max) {return rand(max - min) + min;};
var fadeIn = function fadeIn(t, m) {return t / m;};
var angle = function angle(x1, y1, x2, y2) {return atan2(y2 - y1, x2 - x1);};

var starCount = 1000;

var canvas = void 0;
var ctx = void 0;
var center = void 0;
var positions = void 0;
var velocities = void 0;
var lifeSpans = void 0;
var hues = void 0;

function setup() {
	createCanvas();
	createStars();
	draw();
}

function createCanvas() {
	canvas = {
		a: document.createElement("canvas"),
		b: document.createElement("canvas") };

	canvas.b.style = "\n\t\tposition: absolute;\n\t\ttop: 0;\n\t\tleft: 0;\n\t\twidth: 100%;\n\t\theight: 100%;\n\t";






	document.body.appendChild(canvas.b);
	ctx = {
		a: canvas.a.getContext("2d"),
		b: canvas.b.getContext("2d") };

	center = [];
	resize();
}

function resize() {var _window =
	window,innerWidth = _window.innerWidth,innerHeight = _window.innerHeight;

	canvas.a.width = canvas.b.width = innerWidth;
	canvas.a.height = canvas.b.height = innerHeight;

	center[0] = 0.5 * innerWidth;
	center[1] = 0.5 * innerHeight;
}

function checkBounds(x, y) {
	return (
		x > canvas.a.width ||
		x < 0 ||
		y > canvas.a.height ||
		y < 0);

}

function createStars() {
	positions = new Float32Array(starCount * 2);
	velocities = new Float32Array(starCount * 2);
	hues = new Float32Array(starCount);
	lifeSpans = new Float32Array(starCount * 2);

	var i = void 0,x = void 0,y = void 0,t = void 0,s = void 0,vx = void 0,vy = void 0;

	for (i = 0; i < starCount * 2; i += 2) {
		resetStar(i);
	}
}

function resetStar(i) {
	var iy = void 0,rd = void 0,rt = void 0,cx = void 0,sy = void 0,x = void 0,y = void 0,rv = void 0,vx = void 0,vy = void 0,t = void 0,h = void 0,l = void 0,ttl = void 0;

	iy = i + 1;
	rd = rand(100);
	rt = rand(TAU);
	cx = cos(rt);
	sy = sin(rt);
	x = center[0] + cx * rd;
	y = center[1] + sy * rd;
	rv = randIn(0.1, 1);
	vx = rv * cx;
	vy = rv * sy;
	h = rand(360);
	l = 0;
	ttl = randIn(20, 100);

	positions[i] = x;
	positions[iy] = y;
	velocities[i] = vx;
	velocities[iy] = vy;
	hues[0.5 * i | 0] = h;
	lifeSpans[i] = l;
	lifeSpans[iy] = ttl;
}

function drawStar(i) {
	var iy = void 0,x = void 0,y = void 0,tx = void 0,ty = void 0,vx = void 0,vy = void 0,h = void 0,l = void 0,dl = void 0,ttl = void 0,c = void 0;

	iy = i + 1;
	x = positions[i];
	y = positions[iy];
	vx = velocities[i];
	vy = velocities[iy];
	tx = x + vx;
	ty = y + vy;
	vx *= 1.15;
	vy *= 1.15;
	h = hues[0.5 * i | 0];
	l = lifeSpans[i];
	ttl = lifeSpans[iy];
	dl = fadeIn(l, ttl);
	c = "hsla(" + h + ",50%,80%," + dl + ")";

	l++;

	ctx.a.save();
	ctx.a.lineWidth = dl;
	ctx.a.lineCap = 'round';
	ctx.a.strokeStyle = c;
	ctx.a.beginPath();
	ctx.a.moveTo(x, y);
	ctx.a.lineTo(tx, ty);
	ctx.a.stroke();
	ctx.a.closePath();
	ctx.a.restore();

	positions[i] = tx;
	positions[iy] = ty;
	velocities[i] = vx;
	velocities[iy] = vy;
	lifeSpans[i] = l;

	checkBounds(x, y) && resetStar(i);
}

function draw() {
	ctx.a.clearRect(0, 0, canvas.a.width, canvas.a.height);
	ctx.b.clearRect(0, 0, canvas.b.width, canvas.b.height);

	ctx.b.fillStyle = 'rgba(0,0,0,0.5)';
	ctx.b.fillRect(0, 0, canvas.b.width, canvas.b.height);

	var i = void 0;

	for (i = 0; i < starCount * 2; i += 2) {
		drawStar(i);
	}

	ctx.b.save();
	ctx.b.filter = 'blur(10px)';
	ctx.b.drawImage(canvas.a, 0, 0);
	ctx.b.restore();

	ctx.b.save();
	ctx.b.globalCompositeOperation = 'lighter';
	ctx.b.drawImage(canvas.a, 0, 0);
	ctx.b.restore();

	window.requestAnimationFrame(draw);
}

window.addEventListener("load", setup);
window.addEventListener("resize", resize);