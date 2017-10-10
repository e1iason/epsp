

// Returns true iff the site released.
function simulateReleaseSite(successProb) {
    return (Math.random() < successProb);
}

// Returns the number of successful sites.
function simulatePresynapticTerminal(successProb, numSites) {
    return Array.apply(null, Array(numSites))
        .map(i => simulateReleaseSite(successProb))
        .reduce((i,j) => i + j);
}

// Returns the amplitude (in M&M grams) of a single EPSP of a 
// single site.
function simulateEPSP(successProb, numSites, eMM, scalePrecision) {
    return Array.apply(null, Array(numSites))
    .map(i => weighMM(eMM, scalePrecision) * simulateReleaseSite(successProb))
    .reduce((i,j) => i + j);
}

// Simulates a presynaptic terminal with `numSites` vesicle
// release sites, each with probability of releasing `successProb`,
// `numTrials` times, and generates a distribution.
function generateHistogram(successProb, numSites, numTrials, eMM, scalePrecision, numBins) {
    $("#mv-dist").toggleClass('compact', numBins > 8);
    let weights = Array.apply(null, Array(numTrials))
        .map(i => simulateEPSP(successProb, numSites, eMM, scalePrecision));
    let middle = (weights.reduce(mmax) + weights.reduce(mmin)) / 2;
    let binObj = binWeights(weights, numBins, middle);

    plotDistribution(binObj.binSize, binObj.minWeight, binObj.bins, 'mV',
        $("#mv-dist"), 'Measuring the amplitude of M&amp;M EPSPs (mV)');
}

$(function() {
    setTimeout(function() {
        mvDist();
        $("input").change(mvDist);
    }, 100);
})

function mvDist() {
    generateHistogram(/*successProb=*/Number($("input[name=mv-prob]").val()),
                      /*numSites=*/Number($("input[name=mv-sites]").val()),
                      /*numTrials=*/Number($("input[name=mv-trials]").val()),
                      /*eMM=*/Number($("input[name=mm-weight]").val()),
                      /*scalePrecision=*/Number($("input[name=mm-precision]").val()),
                      /*numBins=*/Number($("input[name=mv-bins]").val()))
}
