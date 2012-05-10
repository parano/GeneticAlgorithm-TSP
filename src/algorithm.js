function GAInitialize() {
    // initialize the Genetic Algorithm
    countDistances();
    for(var i=0; i<population.length; i++) {
	population[i] = randomIndivial(points.length);
	values[i] = evaluate(population[i]);
    }
    setBestValue();
}
function GANextGeneration() {
    currentGeneration++;
    selection();
    crossover();
    mutation();
    setBestValue();
}
function selection() {
    var parents = new Array();
    parents.push(population[currentBest.bestPosition]);
    var initnum = 1;
    if(currentGeneration > 500) {
	MUTATION_PROBABILITY = 0.05;
	parents.push(best);
	initnum = 2;
    }
    setRoulette();
    for(var i=initnum; i<POPULATION_SIZE; i++) {
	parents.push(population[wheelOut(Math.random())]);
    }
    population = parents.clone();
}
function crossover() {
    var queue = new Array();
    for(var i=0; i<POPULATION_SIZE; i++) {
	if( Math.random() < CROSSOVER_PROBABILITY ) {
	    queue.push(i);
	}
    } 
    queue.shuffle();
    for(var i=0, j=queue.length-1; i<j; i+=2) {
	doCrossover(queue[i], queue[i+1]);
    }
}
function doCrossover(x, y) {
    child1 = getX(x, y);
    child2 = getY(x, y);
    population[x] = child1;
    population[y] = child2;
}
function getX(x, y) {
    solution = new Array();
    var px = population[x].clone();
    var py = population[y].clone();
    var dx,dy;
    var c = px[randomNumber(px.length)];
    solution.push(c);
    while(px.length > 1) {
	dx = px.next(px.indexOf(c));
	dy = py.next(py.indexOf(c));
	if(dis[c][dx] < dis[c][dy]) {
	    px.deleteByValue(c);
	    py.deleteByValue(c);
	    c = dx;
	} else {
	    px.deleteByValue(c);
	    py.deleteByValue(c);
	    c = dy;
	}
	solution.push(c);
    }
    //solution.push(px[0]);
    return solution;
}
function getY(x, y) {
    solution = new Array();
    var px = population[x].clone();
    var py = population[y].clone();
    var dx,dy;
    var c = px[randomNumber(px.length)];
    solution.push(c);
    while(px.length > 1) {
	dx = px.previous(px.indexOf(c));
	dy = py.previous(py.indexOf(c));
	if(dis[c][dx] < dis[c][dy]) {
	    px.deleteByValue(c);
	    py.deleteByValue(c);
	    c = dx;
	} else {
	    px.deleteByValue(c);
	    py.deleteByValue(c);
	    c = dy;
	}
	solution.push(c);
    }
    //solution.push(px[0]);
    return solution;
}
function mutation() {
    for(var i=0; i<POPULATION_SIZE; i++) {
	if(Math.random() < MUTATION_PROBABILITY) {
	    doMutate(i);
	}
    }
}
function doMutate(index) {
    mutationTimes++;
    var c = population[index].clone();
    var m = randomNumber(population[index].length - 1);
    var n = randomNumber(population[index].length - i) + 1;
    for(var i=0, j=(n-m)/2; i<j; i++) {
	population.swap(m+i, m+n-i);
    }
}
function setBestValue() {
    for(var i=0; i<population.length; i++) {
	values[i] = evaluate(population[i]);
    }
    currentBest = getCurrentBest();
    if(bestValue === undefined || bestValue > currentBest.bestValue) {
	best = population[currentBest.bestPosition].clone();
	bestValue = currentBest.bestValue;
    }
}
function setRoulette() {
    //calculate all the fitness
    for(var i=0; i<values.length; i++) { fitnessValues[i] = 1.0/values[i]; }
    //set the roulette
    var sum = 0;
    for(var i=0; i<fitnessValues.length; i++) { sum += fitnessValues[i]; }
    for(var i=0; i<roulette.length; i++) { roulette[i] = fitnessValues[i]/sum; }
    for(var i=1; i<roulette.length; i++) { roulette[i] += roulette[i-1]; }
}
function wheelOut(rand) {
    var i;
    for(i=0; i<roulette.length; i++) {
	if( rand <= roulette[i] ) {
	    return i;
	}
    }
}
