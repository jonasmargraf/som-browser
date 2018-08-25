const math = require('mathjs');
math.config({randomSeed: 7});

window.calculateSOM = (files) => {

  let descriptorData = [];
  // let normalizedData = [];
  let dimensionCount;
  let mapSize = [7, 7];
  let neuronCount = mapSize[0] * mapSize[1];
  let neurons = [];
  let coordinates = [];
  let distances = [];
  let bestMatches = [];
  let trainingEpochs = 10;
  let radiusStart = math.max(mapSize) / 5;
  let radiusEnd = math.max(mapSize) / 30;
  let initialAlpha = 0.5;
  // let magnificationM = -0.02;
  let magnificationM = 1;
  let learningRateType = 'linear'; // 'BDH', 'linear' or 'inverse'
  let trainingLength;
  let winTimeStamp;
  let rStep;
  let alpha;
  let t = 0;

  let result = normalize(files)
  // result = initializeMap(result)
  let normalizedData = result.normalizedData
  let featureStds = result.featureStds

  return new Promise((resolve, reject) => {
    resolve(result)
  })
}

function normalize(files) {
  // Initialize data matrix for SOM as an array of empty arrays,
  // where each element represents one file's feature values
  let normalizedDataMatrix = new Array(files.length).fill(new Array())
  let dimensionCount = files[0].features.length
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

  return {
    normalizedData: normalizedDataMatrix,
    featureKeys: featureKeys,
    featureStds: featureStds
  }
}

/*
function initializeMap(data) {
  // Create neuron coordinate array
  var _i = 0;
  for (var i = 0; i < mapSize[1]; i++) {
    for (var j = 0; j < mapSize[0]; j++) {
      coordinates.push([j, i]);
      _i++;
    }
  }
  // Calculate matrix of distances between neurons on the map
  // Each row represents the distances from one neuron (where distance = 0)
  // to all others.
  for (var i = 0; i < coordinates.length; i++) {
    distances[i] = [];
    var x1 = coordinates[i][0];
    var y1 = coordinates[i][1];

    for (var j = 0; j < coordinates.length; j++) {
      var x2 = coordinates[j][0];
      var y2 = coordinates[j][1];
      distances[i].push(math.sqrt(math.square(x1 - x2) + math.square(y1 - y2)));
    }
  }
  // distances.forEach(function(element) { outlet(0, element); });

  // TODO: Add linear initialization.

  // Random initialization
  // First find each dimensions upper & lower bound, then use for random range.
  let dimMax = [];
  let dimMin = [];
  for (let dim = 0; dim < dimensionCount; dim++)
  {
    dimMax.push(math.max(getDimension(data.normalizedDataMatrix, dim)));
    dimMin.push(math.min(getDimension(data.normalizedDataMatrix, dim)));
  }

  // let featuresMax = {}
  // let featuresMin = {}
  //
  // for (feature in normalizedData[0].features) {
  //   let featureValues = normalizedData.map(file => file.normalizedFeatures[feature])
  //   featuresMax[feature] = math.max(featureValues)
  //   featuresMin[feature] = math.min(featureValues)
  // }

  for (var i = 0; i < neuronCount; i++)
  {
    neurons[i] = []
    for (var j = 0; j < dimensionCount; j++) {
    // for (feature in normalizedData[0].features) {
      neurons[i].push(math.random(dimMin[j], dimMax[j]));
      // neurons[i].push(math.random(featuresMin[feature], featuresMax[feature]))
    }
  }

  return Object.assign(data, neurons)
}
*/
