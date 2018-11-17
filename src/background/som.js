'use strict';
const { ipcRenderer } = require('electron');
require('./calculateSOM.js');
// const fs = require('fs');

window.onload = () => {
  ipcRenderer.on('to-som', (event, arg) => {
      calculateSOM(arg)
        .then(function(value) {
          ipcRenderer.send('from-som', value)
        })
})}
