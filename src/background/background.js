'use strict';
const { ipcRenderer } = require('electron');
const {extractFeatures} = require('./extractFeatures.js');
// const fs = require('fs');

window.onload = () => {
  ipcRenderer.on('to-background', (event, files) => {
    // window.setTimeout(sendArg, 10000, arg)
    Promise.all(files.map(file => extractFeatures(file)))
      .then(function(values) {
        ipcRenderer.send('from-background', values)
      })
    // console.log(typeof(features))
    // ipcRenderer.send('from-background', features)
    // console.log(features)
    // window.setTimeout(sendArg, 1000, features)
  })
}

function sendArg(arg) {
  // ipcRenderer.send('from-background', arg)
  console.log(arg)
}
