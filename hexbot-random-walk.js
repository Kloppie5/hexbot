let canvas;
let ctx;

let posX = 0;
let posY = 0;

let tick_speed = 300;
let batch_size = 100;

function start_app() {
	sizeCanvas();

	let ticker = NOOPBOT_TICK_SETUP(draw, tick_speed);

	draw();
}

function sizeCanvas() {
	canvas = document.getElementById('canvas');
	ctx = NOOPBOT_SETUP_CANVAS( { canvas: canvas, bgColor:'#ffffff' });
	posX = window.innerWidth/2;
	posY = window.innerHeight/2;
}

function draw() {
	NOOPBOT_FETCH({
		API: 'hexbot',
		count: batch_size
	}, drawSet);
}

function drawSet(responseJson) {
	let { colors } = responseJson;
	colors.forEach(function(point) {
		step(point.value);
	});
}

function step(color) {
	var r = parseInt(color.substring(1,3),16)/255;
	var g = parseInt(color.substring(3,5),16)/255;
	var b = parseInt(color.substring(5,7),16)/255;
	
	var sat = getSat(r,g,b);
	var hue = getHue(r,g,b);
	
	dx = 5*sat*Math.cos(hue);
	dy = 5*sat*Math.sin(hue);
	
	posX += dx;
	posY += dy;
	
	drawPixel(color, posX, posY);
}

function drawPixel(color, x, y) {
	ctx.strokeStyle = color;
	ctx.strokeRect(x,y,2,2);
}

function getHue(r,g,b) {
	var minRGB = Math.min(r,Math.min(g,b));
	var maxRGB = Math.max(r,Math.max(g,b));
	var diff = maxRGB - minRGB;
	
	if ( diff == 0 )
		return 0;
	
	if ( b == minRGB )
		return 60*(1 - (r-g)/diff);
	if ( r == minRGB )
		return 60*(3 - (g-b)/diff);
	return 60*(5 - (b-r)/diff); // if ( g == minRGB )
}

function getSat(r,g,b) {
	var minRGB = Math.min(r,Math.min(g,b));
	var maxRGB = Math.max(r,Math.max(g,b));
	var diff = maxRGB - minRGB;
	return diff/maxRGB;
}

window.onresize = function(event){
	sizeCanvas();
	draw();
};
