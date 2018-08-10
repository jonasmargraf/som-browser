// import fetch from 'electron-fetch';
const math = require('mathjs');
const Meyda = require('meyda');
const fs = require('fs');

// Meyda.bufferSize = 65536;

var context = new AudioContext()
// console.log(context)

//var audioFile = new Audio('./audio/Plank 3.wav')
//var source = context.createMediaElementSource(audioFile)
// var buffer = context.decodeAudioData()
// source.connect(context.destination)
// audioFile.play()

// TODO: can't have bufferSize > 512
// WHY?
const bufferSize = 512
const featureList = [ 'energy',
                    'zcr',
                    'spectralCentroid',
                    'spectralFlatness',
                    'spectralSlope',
                    'spectralRolloff',
                    'spectralSpread',
                    'spectralSkewness',
                    'spectralKurtosis',
                    'loudness']

function nearestPowerOf2(value) {
  return Math.pow(2, Math.round(Math.log(value) / Math.log(2)))
}

window.extractFeatures = (file) => {

  let features = '';

  return new Promise(function(resolve, reject) {
    fs.readFile(file.path, (error, data) => {
      if (error) throw error
      context.decodeAudioData(data.buffer, decodedAudio => {
        var channelCount = decodedAudio.numberOfChannels
        var summedToMono = decodedAudio.getChannelData(0)
        for (var channel = 1; channel < channelCount; channel++) {
          var channelData = decodedAudio.getChannelData(channel)
          var summedToMono = summedToMono.map((sample, index) => {
            return sample + channelData[index]
          })
        }
        var signal = summedToMono.map( sample => sample / channelCount)
        // zero-padding up to nearest power of 2
        // var zeroPaddedSignal = new Float32Array(nearestPowerOf2(signal.length))
        let zeroPaddedSignal = new Float32Array(signal.length + (bufferSize - (signal.length % bufferSize)))
        zeroPaddedSignal.set(signal)
        Meyda.bufferSize = bufferSize
        Meyda.windowingFunction = 'rect'
        var signalExtract = zeroPaddedSignal.slice(0, bufferSize)
        // var rms = Meyda.extract(['rms'], zeroPaddedSignal)
        features = Meyda.extract(featureList, signalExtract)
        file.features = features
        // console.log(zeroPaddedSignal.length)
        resolve(file)
        // console.log(features)
      })
    })
  })
}
