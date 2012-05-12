var canvas, ctx;
var WIDTH = 300, HEIGHT = 300;
var intervalId = 0;
var points = new Array();
var running;

var POPULATION_SIZE = 30;
var MAX_ITERATIONS  = 1000;
var CROSSOVER_PROBABILITY = 0.9;
var MUTATION_PROBABILITY  = 0.01;
//var OX_CROSSOVER_RATE = 0.3;
var OX_CROSSOVER_RATE = 0.0;

var mutationTimes = 0;

var dis;
var bestValue, best = new Array();
var currentGeneration = 0;
var currentBest;
var population = new Array(POPULATION_SIZE);
var values = new Array(POPULATION_SIZE);
var fitnessValues = new Array(POPULATION_SIZE);
var roulette = new Array(POPULATION_SIZE);

$(function() {
    init();
    $('#addRandom_btn').click(function() {
	addRandomPoints(20);
    });
    $('#start_btn').click(function() { 
	start(); 
    });
    $('#clear_btn').click(function() {
	clearAll();
    });
    $('#stop_btn').click(function() {
	if(running === false){
	    running = true;
	} else {
	    stop();
	}
    });
});
function init() {
    ctx = $('#canvas')[0].getContext("2d");
    WIDTH = $('#canvas').width();
    HEIGHT = $('#canvas').height();
    intervalId = setInterval(draw, 10);
}
function start() {
    running = true;
    //clearInterval(intervalId);
    GAInitialize();
}
function stop() {
    running = false;
    //intervalId = setInterval(draw, 10);
}
function clearAll() {
    while(points.length > 0) { points.pop(); }
    while(best.length > 0) { best.pop(); }
    clear();
}
function addRandomPoints(number) {
    running = false;
    for(var i = 0; i<number; i++) {
	points.push(randomPoint());
    }
}
function drawCircle(point) {
    ctx.fillStyle   = '#000';
    ctx.beginPath();
    ctx.arc(point.x, point.y, 5, 0, Math.PI*2, true);
    ctx.closePath();
    ctx.fill();
}
function drawLines() {
    //ctx.fillStyle   = '#00f';
    ctx.strokeStyle = '#f00';
    ctx.lineWidth = 2;
    ctx.beginPath();

    ctx.moveTo(points[best[0]].x, points[best[0]].y);
    for(var i=1; i<best.length; i++) {
	ctx.lineTo( points[best[i]].x, points[best[i]].y )
    }
    ctx.lineTo(points[best[0]].x, points[best[0]].y);

    //ctx.fill();
    ctx.stroke();
    ctx.closePath();
}
function draw() {
    if(running) {
	GANextGeneration();
	$('#generation').text("the " + currentGeneration + " generation with " + mutationTimes + " times of mutation.");
	$('#best_value').text(", best value: " + parseInt(bestValue));
    }
    clear();
    if (points.length > 0) {
	for(var i=0; i<points.length; i++) {
	    drawCircle(points[i]);
	}
	if( best.length === points.length ) {
	    drawLines();
	}
    }
}
function clear() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
}
