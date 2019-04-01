const { ipcRenderer } = require('electron');
const math = require('mathjs');
math.config({randomSeed: 7});

window.calculateSOM = ({ files : files, settings: settings }) => {

  let mapSideLength = Math.floor(Math.sqrt(files.length))

  // let descriptorData = [];
  let normalizedData = [];
  let dimensionCount = null;
  // let mapSize = [settings.mapSize, settings.mapSize]
  let mapSize = settings.mapSize
  let neuronCount = mapSize[0] * mapSize[1];
  let neurons = [];
  let coordinates = [];
  let distances = [];
  let bestMatches = [];
  // let trainingEpochs = 30;
  let trainingEpochs = settings.trainingEpochs
  let radiusStart = settings.radiusStart
  let radiusEnd = settings.radiusEnd
  // let initialAlpha = 0.5;
  let initialAlpha = settings.initialAlpha
  // let magnificationM = -0.02;
  // let magnificationM = 1;
  let magnificationM = settings.magnificationM
  // let learningRateType = 'linear'; // 'BDH', 'linear' or 'inverse'
  let learningRateType = settings.learningRateType
  let trainingLength = null;
  let winTimeStamp = null;
  let rStep = null;
  let alpha = null;
  let t = 0;
  // TODO: weighting function
  // My guess is that h should be multiplied with a mask consisting of the
  // desired weights for the individual dimensions / features
  // const featureList = [ 'rms',
  //                     'zcr',
  //                     'spectralCentroid',
  //                     'spectralFlatness',
  //                     'spectralSlope',
  //                     'spectralRolloff',
  //                     'spectralSpread',
  //                     'spectralSkewness',
  //                     'spectralKurtosis',
  //                     'loudness']

  // let dimensionWeights = settings.dimensionWeights

  // let dimensionWeights = [
  //   1, // RMS
  //   1, // ZCR
  //   1, // Spectral Centroid
  //   1, // Spectral Flatness
  //   1, // Spectral Slope
  //   1, // Spectral Rolloff
  //   1, // Spectral Spread
  //   1, // Spectral Skewness
  //   1, // Spectral Kurtosis
  //   1 // Loudness
  // ]

  let som = {
    normalizedData,
    dimensionCount,
    mapSize,
    neuronCount,
    neurons,
    // dimensionWeights,
    coordinates,
    distances,
    bestMatches,
    trainingEpochs,
    radiusStart,
    radiusEnd,
    initialAlpha,
    magnificationM,
    learningRateType,
    trainingLength,
    winTimeStamp,
    rStep,
    alpha,
    t
  }

  som = normalize(files, som)
  som = initializeMap(som)
  som = trainMap(som)
  som = findBestMatches(som)
  som = populateEmptyNeurons(som)

  return new Promise((resolve, reject) => {
    resolve(som)
  })
}

function normalize(files, som) {
  ipcRenderer.send('normalize', 'Normalizing data...')
  // Initialize data matrix for SOM as an array of empty arrays,
  // where each element represents one file's feature values
  let normalizedDataMatrix = new Array(files.length).fill(new Array())
  let featureStds = {}
  // Keep track of order in which we will access the features
  let featureKeys = Object.keys(files[0].features)
  featureKeys.forEach((featureKey, index) => {
    // Get this feature's values for all files
    let featureValues = files.map(file => file.features[featureKey])
    // Get this feature's standard deviation
    featureStds[featureKey] = math.std(featureValues)
    // Normalize the feature value for each file by
    // dividing through that feature's standard deviation
    normalizedDataMatrix = normalizedDataMatrix.map((file, i) =>
    file.concat(featureValues[i] / featureStds[featureKey]))
  })

  som.dimensionCount = featureKeys.length
  som.fileNames = files.map(file => file.name)
  som.normalizedData = normalizedDataMatrix
  som.featureKeys = featureKeys
  som.featureStds = featureStds

  return som
}


function initializeMap(som) {

  ipcRenderer.send('progress', 'Initializing nodes...')

  let data = som.normalizedData
  som.coordinates = []

  // Create neuron coordinate array
  var _i = 0;
  for (var i = 0; i < som.mapSize[1]; i++) {
    for (var j = 0; j < som.mapSize[0]; j++) {
      som.coordinates.push([j, i]);
      _i++;
    }
  }
  // Calculate matrix of distances between neurons on the map
  // Each row represents the distances from one neuron (where distance = 0)
  // to all others.
  for (var i = 0; i < som.coordinates.length; i++) {
    som.distances[i] = [];
    var x1 = som.coordinates[i][0];
    var y1 = som.coordinates[i][1];

    for (var j = 0; j < som.coordinates.length; j++) {
      var x2 = som.coordinates[j][0];
      var y2 = som.coordinates[j][1];
      som.distances[i].push(math.sqrt(math.square(x1 - x2) + math.square(y1 - y2)));
    }
  }

  // TODO: Add linear initialization.

  // Random initialization
  // First find each dimensions upper & lower bound, then use for random range.
  let dimMax = [];
  let dimMin = [];
  for (let dim = 0; dim < som.dimensionCount; dim++)
  {
    dimMax.push(math.max(getDimension(data, dim)));
    dimMin.push(math.min(getDimension(data, dim)));
  }

  for (var i = 0; i < som.neuronCount; i++)
  {
    som.neurons[i] = []
    for (var j = 0; j < som.dimensionCount; j++) {
      // for (feature in normalizedData[0].features) {
      // som.neurons[i].push(math.dotMultiply(
      //   som.dimensionWeights, math.random(dimMin[j], dimMax[j])));
      som.neurons[i].push(math.random(dimMin[j], dimMax[j]));
      // neurons[i].push(math.random(featuresMin[feature], featuresMax[feature]))
    }
    // som.neurons[i] = math.dotMultiply(som.dimensionWeights, som.neurons[i])
  }

  return som
}

// Return a single feature (dimension / column) of descriptor data
function getDimension(data, dimensionIndex) {
  var dimensionData = data.map(function(element) {
    return element[dimensionIndex]
  })
  return dimensionData
}

function trainMap(som) {

  ipcRenderer.send('progress', 'Training map...')

  // som.trainingLength = 1000
  // som.trainingLength = som.trainingEpochs * som.normalizedData.length
  som.trainingLength = math.pow(10, som.trainingEpochs)
  som.rStep = (som.radiusEnd - som.radiusStart) / (som.trainingLength - 1)

  // Initialize winTimeStamp as array filled with zeros
  som.winTimeStamp = new Array(som.neuronCount)
  for (var i = 0; i < som.winTimeStamp.length; i++) {
    som.winTimeStamp[i] = 0
  }

  // let neurons = som.neurons

  // Begin training
  // for (var t = 0; t < 0; t++) {
  for (var t = 0; t < som.trainingLength; t++) {
    ipcRenderer.send('progress',
      'Training ' + math.round(100 * (t / (som.trainingLength - 1)), 0) + '% done.')
    som = trainingStep(t, som)
    // som = trainingStep(t, som, neurons)
  }

  return som
  // return neurons
}

// function trainingStep(t, trainingLength, rStep, alpha, winTimeStamp) {
// function trainingStep(t, som, neurons) {
function trainingStep(t, som) {
  // Pick random vector on each iteration
  var vector = som.normalizedData[math.randomInt(0, som.normalizedData.length)]
  // check if random outputs the same every time
  // if (t === 0)
  // {
  //   post(math.randomInt(0, normalizedData.length) + '\n');
  // }
  var differences = []
  // var differenceMagnitudes = [];
  var distancesFromVector = []

  // Subtract chosen vector from each neuron / map unit, then calculate that
  // difference vector's magnitude.
  // In other words, calculate the Euclidean distance between each neuron and
  // the chosen vector.
  //
  // NOTE: I believe I made a mistake in the original MATLAB code -
  // the calculation there (see trainMap.m line 66) only comes out to the
  // equivalent of mag = sum(difference^2),
  // instead it should be sqrt(sum(difference^2)).
  // I don't think it actually affects the result however.
  for (var n = 0; n < som.neuronCount; n++) {
    differences.push(math.subtract(som.neurons[n], vector));
    distancesFromVector.push(math.norm(math.subtract(som.neurons[n], vector)));
  }

  // Find best matching unit's distance and index: min(norm(neurons - vector))
  var bmuDistance = math.min(distancesFromVector);
  var bmu = distancesFromVector.indexOf(bmuDistance);

  // When did this neuron last win?
  var timeSinceLastWin = t - som.winTimeStamp[bmu];

  // If neuron has never won, set to 0
  if (timeSinceLastWin === t)
  {
    timeSinceLastWin = 0;
  }

  // Keep track of time t at which this neuron 'won' (was selected as bmu)
  som.winTimeStamp[bmu] = t;

  switch (som.learningRateType) {
    // Linearly decreasing learning rate
    case 'linear':
      som.alpha = som.initialAlpha * (1 - t / som.trainingLength);
      break;
    // Inverse decrease (to 0.01 * initialAlpha at last training step)
    case 'inverse':
      b = som.trainingLength / 100;
      a = b * som.initialAlpha;
      som.alpha = a / (b + t);
      break;
    // BDH adaptive local learning rate
    case 'BDH':
      som.alpha = math.pow((1 / bmuDistance), som.dimensionCount);
      som.alpha = som.initialAlpha *
              math.pow(((1 / timeSinceLastWin) * som.alpha), som.magnificationM);
      // Limit alpha to <= 0.9
      som.alpha = math.min(som.alpha, 0.9);
      break;
    }

    // Radius decreases from rStart to rEnd over n=trainingLength steps.
    var r = som.radiusStart + t * som.rStep;

    som.neurons = som.neurons.map((neuron, index) => {
      // Gaussian neighborhood function
      var h = som.alpha * math.exp(-(math.square(som.distances[index][bmu])
                                      / (2 * math.square(r))));

      // h = math.multiply(h, weights)
      // console.log(h)
      // console.log(differences[index])
      // console.log(math.dotMultiply(weights, differences[index]))

      // For dimension weights:
      // return math.subtract(neuron, math.multiply(
      //   h, math.dotMultiply(som.dimensionWeights, differences[index])));

      return math.subtract(neuron, math.multiply(h, differences[index]));
    })

    return som
}

function findBestMatches(som) {

  ipcRenderer.send('progress', 'Populating map...')

  som.bestMatches = som.normalizedData.map(function (vector) {
    var differences = [];
    // var differenceMagnitudes = [];
    var distancesFromVector = [];

    // Subtract chosen vector from each neuron / map unit, then calculate that
    // difference vector's magnitude.
    // In other words, calculate the Euclidean distance between each neuron and
    // the chosen vector.
    for (var n = 0; n < som.neuronCount; n++)
    {
      distancesFromVector.push(math.norm(math.subtract(som.neurons[n], vector)));
    }
    // Find best matching unit's distance and index: min(norm(neurons - vector))
    var bmuDistance = math.min(distancesFromVector);
    var bmu = distancesFromVector.indexOf(bmuDistance);
    // post('vector: ' + vector + '\n');
    // post('bmu: ' + bmu + '\t bmuDistance: ' + bmuDistance + '\n');
    return [bmu, bmuDistance];
  });

  // neuronAssignedFiles = array where index represents neuron and the element
  // at that index is an array of the files assigned to that neuron
  som.neuronAssignedFiles = new Array(som.neuronCount)
  // get just the best matching unit indexes
  let bmus = som.bestMatches.map(e => e[0])
  bmus.forEach((e, i) => {
    // If neuronAssignedFiles at this index is already an array, push current
    // file's index there, otherwise create array with file index as first element
    Array.isArray(som.neuronAssignedFiles[e]) ?
    som.neuronAssignedFiles[e].push(i)
    :
    som.neuronAssignedFiles[e] = [i]
  })
  // Look for undefined array entries and replace explicitly with null
  for (var i = 0; i < som.neuronCount; i++) {
    som.neuronAssignedFiles[i] === undefined ?
    som.neuronAssignedFiles[i] = null
    :
    som.neuronAssignedFiles[i]
  }

  return som
}

function populateEmptyNeurons(som) {

  let emptyNeuronIndeces = som.neuronAssignedFiles.map((e,i) => {
    return (e === null ? i : false)
  })
  .filter(e => e !== false)

  let tempVectors = som.normalizedData
  let tempVectorIndeces = tempVectors.map((e,i) => i)

  // Check if there are still empty neurons and vectors that haven't been moved
  // In the worst case, when there are more empty neurons than total vectors,
  // All vectors will be moved at least once and none will be assigned to their
  // actual BMU anymore.
  while (emptyNeuronIndeces.length >= 1 && tempVectorIndeces.length >= 1) {
    console.log()
    // Get random empty neuron, then remove from possible choices
    let emptyNeuronIndex = math.pickRandom(emptyNeuronIndeces)
    emptyNeuronIndeces.splice(emptyNeuronIndeces.indexOf(emptyNeuronIndex), 1)
    let emptyNeuron = som.neurons[emptyNeuronIndex]

    let distancesFromNeuron = tempVectorIndeces.map((e,i) => {
        return math.norm(math.subtract(emptyNeuron, tempVectors[e]))
    })

    let nearestVectorIndex = tempVectorIndeces[distancesFromNeuron.indexOf(
      math.min(distancesFromNeuron))]
    // Remove the found closest vector from its previously assigned neuron
    // and instead assign it to the empty neuron.
    let oldAssignedNeuronIndex = som.neuronAssignedFiles.findIndex(e =>
      Array.isArray(e) && e.some(el => el === nearestVectorIndex))
    som.neuronAssignedFiles[oldAssignedNeuronIndex].splice(
      som.neuronAssignedFiles[oldAssignedNeuronIndex].findIndex(
        e => e === nearestVectorIndex), 1)
    som.neuronAssignedFiles[emptyNeuronIndex] = [nearestVectorIndex]

    tempVectorIndeces.splice(distancesFromNeuron.indexOf(
      math.min(distancesFromNeuron)), 1)
  }

  return som
}
