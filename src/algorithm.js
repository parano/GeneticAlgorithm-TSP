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
    //if(currentGeneration%(points.length * 5) == 0) {
    //    tribulate();
    //}
    setBestValue();
}
function tribulate() {
    for(var i=0; i<POPULATION_SIZE; i++) {
    //for(var i=population.length>>1; i<POPULATION_SIZE; i++) {
	population[i] = randomIndivial(points.length);
    }	
}
function selection() {
    var parents = new Array();
    parents.push(population[currentBest.bestPosition]);
    var initnum = 1;
    //if(currentGeneration > points.length*5) {
    //    MUTATION_PROBABILITY = 0.05;
    //    var tem = best.clone();
    //    //var tem = population[currentBest.bestPosition].clone();
    //    parents.push(tem);
    //    initnum = 2;
    //}
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
	if( Math.random() < OX_CROSSOVER_RATE ) {
	    oxCrossover(queue[i], queue[i+1]);
	} else {
	    doCrossover(queue[i], queue[i+1]);
	}
    }
}
function oxCrossover(x, y) {	
    var px = population[x].roll();
    var py = population[y].roll();

    var rand = randomNumber(points.length-1) + 1;
    var pre_x = px.slice(0, rand);
    var pre_y = py.slice(0, rand);

    var tail_x = px.slice(rand, px.length);
    var tail_y = py.slice(rand, py.length);

    px = tail_x.concat(pre_x);
    py = tail_y.concat(pre_y);

    population[x] = pre_y.concat(px.reject(pre_y));
    population[y] = pre_x.concat(py.reject(pre_x));
}
function doCrossover(x, y) {
    child1 = getChild('next', x, y);
    child2 = getChild('previous', x, y);
    population[x] = child1;
    population[y] = child2;
}
function getChild(fun, x, y) {
    solution = new Array();
    var px = population[x].clone();
    var py = population[y].clone();
    var dx,dy;
    var c = px[randomNumber(px.length)];
    solution.push(c);
    while(px.length > 1) {
	dx = px[fun](px.indexOf(c));
	dy = py[fun](py.indexOf(c));
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
    return solution;
}
function mutation() {
    for(var i=0; i<POPULATION_SIZE; i++) {
	if(Math.random() < MUTATION_PROBABILITY) {
	    //if(Math.random() > 0.5) {
		//population[i] = pushMutate(population[i]);
	    //} else {
		population[i] = doMutate(population[i]);
	    //}
	}
    }
}
function doMutate(seq) {
    mutationTimes++;
    // m and n refers to the actual index in the array
    // m range from 0 to length-5, n range from 4...length-m
    var m = randomNumber(seq.length - 3); //returns a random number from 0 to length-4 (smaller than length-4+1)
    var n = randomNumber(seq.length - m -4) + 4;//returns a random number from 4 to length-m
    // reverse from m to m+n-1
    for(var i=0, j=Math.floor(n/2); i<j; i++) {
	seq.swap(m+i, m+n-i-1);
    }
    return seq;
}
function pushMutate(seq) {
    mutationTimes++;
    var m,n;
    do {
	m = randomNumber(seq.length>>1);
	n = randomNumber(seq.length);
    } while (m>=n)
    var s1 = seq.slice(0,m);
    var s2 = seq.slice(m,n)
    var s3 = seq.slice(n,seq.length);
    return s2.concat(s1).concat(s3).clone();
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
