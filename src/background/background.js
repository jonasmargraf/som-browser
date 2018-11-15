'use strict';
const { ipcRenderer } = require('electron');
require('./extractFeatures.js');

window.onload = () => {
  ipcRenderer.on('to-background', (event, files) => {
    Promise.all(files.map((file, i) =>
      extractFeatures(file).then(ipcRenderer.send('progress', 'Extracting features for file ' + i + ' / ' + (files.length - 1)))))
    .then(files => ipcRenderer.send('from-background', files))
  })
}
