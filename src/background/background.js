'use strict';
const { ipcRenderer } = require('electron');
require('./extractFeatures.js');

window.onload = () => {
  ipcRenderer.on('to-background', (event, files) => {
    Promise.all(files.map(file => extractFeatures(file)))
    .then(files => ipcRenderer.send('from-background', files))
  })
}
