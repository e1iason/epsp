// Simulates the weighing of a single m&m
function weighMM(expectedWeight, scalePrecision) {
    let weight = expectedWeight;
    let mutationChance = 0.6;
    let direction = (Math.random() > 0.5);
    while (Math.random() < mutationChance) {
        weight += scalePrecision * (direction ? 1 : -1);
        mutationChance *= mutationChance;
    }
    return weight;
}

function mmax(i, j) { return Math.max(i,j); }
function mmin(i, j) { return Math.min(i,j); }

// Given an array of weights, bins them into numBins
// bins and returns the object:
// {
//    binSize: float,
//    minWeight: float,
//    bins: [int, int, ...]
// }
function binWeights(weights, numBins, middle) {
    let maxWeight = weights.reduce(mmax);
    let minWeight = weights.reduce(mmin);
    let range = 2 * mmax(maxWeight - middle, middle - minWeight);
    minWeight = mmin(minWeight, middle - range/2);
    let binSize = range / numBins;
    let bins = Array.apply(null, Array(numBins)).map(i => 0);
    weights.forEach(w => {
        bins[mmin(bins.length-1, Math.floor((w-minWeight)/binSize))]++;
    });
    return {binSize, minWeight, bins};
}

// Plots a distribution in the HTML object #mm-dist.
function plotDistribution(binSize, minWeight, bins, label, $dist, title) {
    let $bars = $dist.children('.bars').html('');
    let binWidth = $bars.width() / bins.length;
    let maxValue = bins.reduce(mmax);
    $dist.children('.header').html(title);
    bins.forEach((n, i) => {
        $('<div></div>')
            .css({
                height: '0%',
                width: binWidth + 'px',
                left: (i*binWidth) + 'px'
            })
            .attr('data-height', (100*n/maxValue) + '%')
            .append('<div class="x-label">' + 
                (minWeight + i*binSize).toFixed(2) + label + 
                ' - ' + 
                (minWeight + (i+1)*binSize).toFixed(2) + label + '</div>')
            .append('<div class="y-label"><div>' + n + '<div></div>')
            .appendTo($bars);
    });
    setTimeout(function() {
        // Set actual height of each bar appropriately once rendered.
        $bars.children().each((i, bar) => {
            console.log(bar);
            $(bar).css('height', $(bar).attr('data-height'))
        });
    }, 50);

}

function MMDist() {
    createMMDistribution(/*numMMs=*/Number($("input[name=mm-num]").val()), 
                         /*eMM=*/Number($("input[name=mm-weight]").val()), 
                         /*scalePrecision=*/Number($("input[name=mm-precision]").val()), 
                         /*numBins=*/Number($("input[name=mm-bins]").val()),
                         /*label=*/'g');
}

function createMMDistribution(numMMs, eMM, scalePrecision, numBins, label) {
    $("#mm-dist").toggleClass('compact', numBins > 8);
    let MMs = Array.apply(null, Array(numMMs)).map(i => weighMM(eMM, scalePrecision))
    console.log(MMs);
    let binObj = binWeights(MMs, numBins, eMM);
    console.log(binObj);
    plotDistribution(binObj.binSize, binObj.minWeight, binObj.bins, label, 
        $("#mm-dist"), 'Measuring the mass of ' + numMMs + ' M&amp;M\'s (' + label + ')');
}

$(function() {
    setTimeout(function() {
        MMDist();
        $("#exercise-1-variables input").change(MMDist);
    }, 100);
});