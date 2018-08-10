'use strict';
const { ipcRenderer } = require('electron');
require('./extractFeatures.js');
// const fs = require('fs');

window.onload = () => {
  ipcRenderer.on('to-background', (event, files) => {
    Promise.all(files.map(file => extractFeatures(file)))
      .then(function(values) {
        ipcRenderer.send('from-background', values)
      })

  })
}
