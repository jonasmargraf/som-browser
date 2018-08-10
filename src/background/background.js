'use strict';
const { ipcRenderer } = require('electron');
require('./extractFeatures.js');
// const fs = require('fs');

window.onload = () => {
  ipcRenderer.on('to-background', (event, file) => {
      extractFeatures(file)
        .then(function(value) {
          ipcRenderer.send("from-background", value)
        })
})}
