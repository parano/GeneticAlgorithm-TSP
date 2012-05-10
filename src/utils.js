Array.prototype.clone = function() { return this.slice(0); }
Array.prototype.shuffle = function() {
    for(var j, x, i = this.length-1; i; j = randomNumber(i), x = this[--i], this[i] = this[j], this[j] = x);
    return this;
};
Array.prototype.indexOf = function (value) {	
    for(var i=0; i<this.length; i++) {
	if(this[i] === value) {
	    return i;
	}
    }
}
Array.prototype.deleteByValue = function (value) {
    var pos = this.indexOf(value);
    this.splice(pos, 1);
}
Array.prototype.next = function (index) {
    if(index === this.length-1) {
	return this[0];
    } else {
	return this[index+1];
    }
}
Array.prototype.previous = function (index) {
    if(index === 0) {
	return this[this.length-1];
    } else {
	return this[index-1];
    }
}
Array.prototype.swap = function (x, y) {
    var tem = this[x];
    this[x] = this[y];
    this[y] = tem;
}
function Point(x, y) {
    this.x = x;
    this.y = y;
}
function randomPoint() {
    var randomx = randomNumber(WIDTH);
    var randomy = randomNumber(HEIGHT);
    var randomPoint = new Point(randomx, randomy);
    return randomPoint; 
}
function randomNumber(boundary) {
    return parseInt(Math.random() * boundary);
}
function distance(p1, p2) {
    return euclidean(p1.x-p2.x, p1.y-p2.y);
}
function euclidean(dx, dy) {
    return Math.sqrt(dx*dx + dy*dy);
}
function randomIndivial(n) {
    a = new Array();
    for(var i=0; i<n; i++) {
	a.push(i);
    }
    return a.shuffle();
}
function evaluate(indivial) {
    var sum = 0;
    for(var i=0, j=indivial.length-1; i<j; i++) {
	sum += dis[indivial[i]][indivial[i+1]];
    }
    sum += dis[indivial.length-1][0];
    return sum;
}
function countDistances() {
    var length = points.length
    dis = new Array(length);
    for(var i=0; i<length; i++) {
	dis[i] = new Array(length);
	for(var j=0; j<length; j++) {
	    dis[i][j] = distance(points[i], points[j]); 
	}
    }
}
function getCurrentBest() {
    var bestP = 0,
	currentBestValue = values[0];

    for(var i=1; i<population.length; i++) {
	if(values[i] < currentBestValue) {
	    currentBestValue = values[i];
	    bestP = i;
	}
    }
    return {
	  bestPosition : bestP
	, bestValue    : currentBestValue
    }
}
