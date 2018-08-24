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

  // Add new field for normalization while preserving original data
  let normalizedData = files.map(file =>
    Object.assign(file, { normalizedFeatures: {} }))

  // Get each feature's standard deviation
  let featureStds = {}
  for (feature in normalizedData[0].features) {
    let featureValues = normalizedData.map(file => file.features[feature])
    featureStds[feature] = math.std(featureValues)
    // Normalize each file's feature values through division by standard deviation
    normalizedData.forEach(file =>
      file.normalizedFeatures[feature] = file.features[feature] / featureStds[feature])
  }

  return new Promise((resolve, reject) => {
    // resolve(files.map(file => file.name))
    resolve([normalizedData, featureStds])
    // resolve(featureStds)
  })
}
