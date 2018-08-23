const math = require('mathjs');

window.calculateSOM = (files) => {
  return new Promise((resolve, reject) => {
    resolve(files.map(file => file.name))
  })
}
