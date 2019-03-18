const math = require('mathjs');
const Meyda = require('meyda');
const fs = require('fs');

const context = new AudioContext()

// TODO: can't have bufferSize > 512
// WHY?
const bufferSize = 512
const featureList = [ 'rms',
                    'zcr',
                    'spectralCentroid',
                    'spectralFlatness',
                    'spectralSlope',
                    'spectralRolloff',
                    'spectralSpread',
                    'spectralSkewness',
                    'spectralKurtosis',
                    'loudness']

// function nearestPowerOf2(value) {
//   return Math.pow(2, Math.round(Math.log(value) / Math.log(2)))
// }

window.extractFeatures = (file) => {

  // let features = '';
  let features = {  rms: [],
                    zcr: [],
                    spectralCentroid: [],
                    spectralFlatness: [],
                    spectralSlope: [],
                    spectralRolloff: [],
                    spectralSpread: [],
                    spectralSkewness: [],
                    spectralKurtosis: [],
                    loudness: []
                  }

  return new Promise(function(resolve, reject) {

    fs.readFile(file.path, (error, data) => {

      if (error) throw error

      context.decodeAudioData(data.buffer, decodedAudio => {

        // In case of multichannel audio: sum to mono
        const channelCount = decodedAudio.numberOfChannels
        let summedToMono = decodedAudio.getChannelData(0)
        for (let channel = 1; channel < channelCount; channel++) {
          let channelData = decodedAudio.getChannelData(channel)
          summedToMono = summedToMono.map((sample, index) => {
            return sample + channelData[index]
          })
        }
        let signal = summedToMono.map(sample => sample / channelCount)

        // Zero-pad up to nearest multiple of bufferSize
        let zeroPaddedSignal = new Float32Array(signal.length
                                  + bufferSize - (signal.length % bufferSize))
        zeroPaddedSignal.set(signal)
        Meyda.bufferSize = bufferSize
        Meyda.windowingFunction = 'rect'

        // Framewise loop over audio and extract features
        for (let start = 0; start < zeroPaddedSignal.length; start += bufferSize) {

          let signalFrame = zeroPaddedSignal.slice(start, start + bufferSize)
          let frameFeatures = Meyda.extract(featureList, signalFrame)
          // we only use total loudness, not per band
          frameFeatures.loudness = frameFeatures.loudness.total

          // Append this frame's features to array of feature frames
          for (let feature in frameFeatures) {
            // Only use frames that have RMS > -60dBFS
            (frameFeatures.rms >= 0.001) && features[feature].push(frameFeatures[feature])
          }
        }

        // Get feature average
        for (let feature in features) {
          features[feature] = math.mean(features[feature])
        }

        // Add file duration to features
        features.duration = decodedAudio.duration

        // Pass averaged features to parent file
        file.features = features
        resolve(file)
      })
    })
  })
}
