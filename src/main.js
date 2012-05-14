var canvas, ctx;
var WIDTH, HEIGHT;
var points = [];
var running;
var canvasMinX, canvasMinY;

var POPULATION_SIZE;
//var MAX_ITERATIONS  = 1000;
var CROSSOVER_PROBABILITY;
var MUTATION_PROBABILITY;
var OX_CROSSOVER_RATE;
var UNCHANGED_GENS;

var mutationTimes;

var dis;
var bestValue, best;
var currentGeneration;
var currentBest;
var population;
var values;
var fitnessValues;
var roulette;

$(function() {
    init();
    initData();
    $('#addRandom_btn').click(function() {
	addRandomPoints(20);
	$('#status').text("");
	running = false;
    });
    $('#start_btn').click(function() { 
	if(points.length >= 4) {
	    initData();
	    start(); 
	} else {
	    alert("add some more points to the map!");
	}
    });
    $('#clear_btn').click(function() {
	running === false;
	initData();
	points = new Array();
	$('#status').text("");
    });
    $('#stop_btn').click(function() {
	if(running === false && currentGeneration !== 0){
	    goOn();
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
    init_mouse();
}
function init_mouse() {
    $("canvas").click(function(evt) {
	if(!running) {
	    canvasMinX = $("#canvas").offset().left;
	    canvasMinY = $("#canvas").offset().top;
	    $('#status').text("");

	    x = evt.pageX - canvasMinX;
	    y = evt.pageY - canvasMinY;
	    points.push(new Point(x, y));
	}
    });
}
function initData() {
    //points = [];
    running = false;

    POPULATION_SIZE = 30;
    CROSSOVER_PROBABILITY = 0.9;
    MUTATION_PROBABILITY  = 0.01;
    OX_CROSSOVER_RATE = 0.03;
    UNCHANGED_GENS = 0;
    mutationTimes = 0;

    bestValue = undefined;
    best = [];
    currentGeneration = 0;
    currentBest;
    population = new Array(POPULATION_SIZE);
    values = new Array(POPULATION_SIZE);
    fitnessValues = new Array(POPULATION_SIZE);
    roulette = new Array(POPULATION_SIZE);
}
function start() {
    GAInitialize();
    running = true;
}
function stop() {
    running = false;
}
function goOn() {
    running = true;
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
function drawLines(array) {
    ctx.strokeStyle = '#f00';
    ctx.lineWidth = 2;
    ctx.beginPath();

    ctx.moveTo(points[array[0]].x, points[array[0]].y);
    for(var i=1; i<array.length; i++) {
	ctx.lineTo( points[array[i]].x, points[array[i]].y )
    }
    ctx.lineTo(points[array[0]].x, points[array[0]].y);

    ctx.stroke();
    ctx.closePath();
}
function draw() {
    if(running) {
	GANextGeneration();
	$('#status').text("There are " + points.length + " cities in the map, "
			  +"the No." + currentGeneration + " generation with "
			  + mutationTimes + " times of mutation. best value: "
			  + ~~(bestValue));
    }
    clear();
    if (points.length > 0) {
	for(var i=0; i<points.length; i++) {
	    drawCircle(points[i]);
	}
	if(best.length === points.length) {
	    drawLines(best);
	}
    }
}
function clear() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
}
