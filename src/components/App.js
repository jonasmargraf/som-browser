import '../assets/css/App.css';
import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import MenuBar from './MenuBar';
import Map from './Map';
import FileList from './FileList';
import FileInfo from './FileInfo';
import UserSelection from './UserSelection';
const { ipcRenderer, remote } = require('electron');
const { app, BrowserWindow, dialog } = remote;
const fs = require('fs');
const url = require('url');
const path = require('path');

let dev = false

const context = new AudioContext()
let audioSources = []

// Are we in dev or production mode?
window.onload = () => {
  ipcRenderer.send('dev-request', true)
}
ipcRenderer.once('dev-mode', (event, value) => {
  dev = value
  // console.log('dev-mode in App.js: ' + dev + ' ' + value)
})

// Invisible background window for async background processing
function processFiles(files) {
  return new Promise(function(resolve, reject) {
    let win = new BrowserWindow({
      show: false,
    });

    let backgroundPath
    if ( dev && process.argv.indexOf('--noDevServer') === -1 ) {
      backgroundPath = url.format({
        protocol: 'http:',
        host: 'localhost:8080',
        pathname: 'background.html',
        slashes: true
      })
    }
    else {
    backgroundPath = url.format({
      protocol: 'file:',
      pathname: path.join(app.getAppPath(), 'dist', 'background.html'),
      slashes: true
    })
  }

    // alert(backgroundPath)
    win.loadURL(backgroundPath)
    // win.loadURL('file:///Users/jm/Dropbox/AKT/Masterarbeit/dev/som-browser/src/background/background.html')

    win.once('ready-to-show', () => {
      // win.show()
      // win.webContents.openDevTools();

      ipcRenderer.once('features-done', (event, value) => {
        win.destroy()
        resolve(value)
      })

      win.webContents.send('to-background', files)
    })
  })
}

function createSOM(files) {
  return new Promise(function(resolve, reject) {
    let win = new BrowserWindow({
      show: false
    });

    let backgroundPath
    if ( dev && process.argv.indexOf('--noDevServer') === -1 ) {
      backgroundPath = url.format({
        protocol: 'http:',
        host: 'localhost:8080',
        pathname: 'som.html',
        slashes: true
      })
    }
    else {
      backgroundPath = url.format({
        protocol: 'file:',
        pathname: path.join(app.getAppPath(), 'dist', 'som.html'),
        slashes: true
      })
    }
    // alert(backgroundPath)
    win.loadURL( backgroundPath )
    // win.loadURL("file:///Users/jm/Dropbox/AKT/Masterarbeit/dev/som-browser/src/background/som.html")

    win.once('ready-to-show', () => {
      // win.show()
      // win.webContents.openDevTools()

      ipcRenderer.once('som-done', (event, value) => {
        win.destroy()
        resolve(value)
      })

      win.webContents.send('to-som', files)
    })
  })
}

const getFileByPath = (files, path) =>
  (path == null) ? null : files.filter((file) => file.path == path)[0]

const playFile = (filePath) => {
  audioSources.forEach(e => e.stop())
  audioSources = []
  fs.readFile(filePath, (error, data) => {
    if (error) throw error
    context.decodeAudioData(data.buffer, decodedAudio => {
      const source = context.createBufferSource()
      audioSources.push(source)
      source.buffer = decodedAudio
      source.connect(context.destination)
      source.start()
      // console.log(audioSources)
    })
  })
}

class App extends React.Component {
  constructor(props) {

    super(props)
    this.handleFileListChange = this.handleFileListChange.bind(this)
    this.handleFileClick = this.handleFileClick.bind(this)
    this.handleAnalyzeClick = this.handleAnalyzeClick.bind(this)
    this.handleMapClick = this.handleMapClick.bind(this)
    this.handleSaveClick = this.handleSaveClick.bind(this)
    this.handleLoadClick = this.handleLoadClick.bind(this)
    this.state = {
      files: null,
      selectedFile: null,
      som: null,
      loading: false
    }
  }

  handleFileListChange(files) {
    this.setState({
      files: files,
      selectedFile: null,
      som: null
    })
  }

  handleFileClick(file) {
    this.setState({selectedFile: file.path})
  }

  handleMapClick(mapElement) {
    this.setState({selectedFile: mapElement}, () =>
      playFile(this.state.selectedFile))
  }

  handleAnalyzeClick() {
    this.setState({loading: true})
    console.log("Processing files...")
    processFiles(this.state.files)
    .then(files => this.setState({files: files, loading: false}))
    .then(() => {
      console.log("Building map...")
      createSOM(this.state.files)
      .then(som => {
        this.setState({som: som})
        console.log(this.state)
      })
    })
  }

  // Save state to disk as JSON file
  handleSaveClick() {
    const options = {
      defaultPath: path.join(app.getAppPath(), 'map'),
      filters: [{name: 'JSON', extensions: ['json']}]
    }
    // Check that we aren't currently analyzing and that the map exists
    !this.state.loading
    && this.state.som
    && dialog.showSaveDialog(options, path => {
      fs.writeFileSync(path, JSON.stringify(this.state))
    })
  }

  // Load state from JSON file
  handleLoadClick() {
    const options = {
      defaultPath: app.getAppPath(),
      properties: ['openFile'],
      filters: [{name: 'JSON', extensions: ['json']}]
    }
    // let filePath = path.join(app.getAppPath(), 'map.json')
    let loadedData
    dialog.showOpenDialog(options, path => {
      loadedData = JSON.parse(fs.readFileSync(path[0]))
      // Check validity of file by looking for som property
      loadedData.som ?
      this.setState(loadedData)
      :
      alert("The loaded file doesn't appear to be valid. Please try again.")
    })
  }

  componentDidMount() {
  }

  render() {
    const files = this.state.files
    const file = getFileByPath(files, this.state.selectedFile)

    return (
      <div>

        <div className="TitleBar">
          <p>SOM Browser</p>
        </div>

        <MenuBar
          files={files}
          onChange={this.handleFileListChange}
          onFileClick={this.handleFileClick}
          onAnalyzeClick={this.handleAnalyzeClick}
          onSaveClick={this.handleSaveClick}
          onLoadClick={this.handleLoadClick}
          />

        <FileList
          loading={this.state.loading}
          files={files}
          selectedFile={file}
          onChange={this.handleFileListChange}
          onFileClick={this.handleFileClick}
          onAnalyzeClick={this.handleAnalyzeClick}
          onSaveClick={this.handleSaveClick}
          onLoadClick={this.handleLoadClick}
          />

        <Map
          som={this.state.som}
          files={this.state.files}
          selectedFile={file}
          onMapClick={this.handleMapClick}/>

        <FileInfo file={file}/>

        <UserSelection />

      </div>
    )
  }
}

export default hot(module)(App)
