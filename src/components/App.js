import '../assets/css/App.css';
import React, { Component } from 'react';
import { hot } from 'react-hot-loader'
import Map from './Map';
import FileList from './FileList';
import FileInfo from './FileInfo';
import UserSelection from './UserSelection';
const { ipcRenderer, remote } = require('electron');
const { app, BrowserWindow } = remote;
const fs = require('fs');
const url = require('url')
const path = require('path')


const context = new AudioContext()

// Invisible background window for async background processing
function processFiles(files) {
  return new Promise(function(resolve, reject) {
    let win = new BrowserWindow({
      show: false,

    });

    let indexPath = url.format({
      protocol: 'file:',
      // pathname: path.join(__dirname, 'dist', 'background.html'),
      pathname: path.join(app.getAppPath(), 'dist', 'background.html'),
      slashes: true
    });

    alert(indexPath)
    win.loadURL(indexPath)
    // win.loadURL('file:///Users/jm/Dropbox/AKT/Masterarbeit/dev/som-browser/src/background/background.html')

    win.once('ready-to-show', () => {
      win.show()
      win.webContents.openDevTools();

      ipcRenderer.once('features-done', (event, value) => {
        // win.destroy()
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

    // console.log("hi"+ path.join(__dirname, 'background', 'background.html'))
    // let backgroundPath
    // if ( dev && process.argv.indexOf('--noDevServer') === -1 ) {
      // indexPath = url.format({
      //   protocol: 'http:',
      //   host: 'localhost:8080',
      //   pathname: '/background/som.html',
      //   slashes: true
      // })
    // }
    // else {
      let backgroundPath = url.format({
        protocol: 'file:',
        // pathname: path.join(__dirname, 'dist', '/background/som.html'),
        pathname: path.join(app.getAppPath(), 'dist', 'som.html'),
        slashes: true
      })
    // }
    alert(backgroundPath)
    win.loadURL( backgroundPath )
    // win.loadURL("file:///Users/jm/Dropbox/AKT/Masterarbeit/dev/som-browser/src/background/som.html")

    win.once('ready-to-show', () => {
      win.show()
      // console.log('ready2show')
      win.webContents.openDevTools()

      ipcRenderer.once('som-done', (event, value) => {
        // win.destroy()
        resolve(value)
      })

      win.webContents.send('to-som', files)
    })
  })
}

const getFileByPath = (files, path) =>
  (path == null) ? null : files.filter((file) => file.path == path)[0]

const playFile = (filePath) => {
  fs.readFile(filePath, (error, data) => {
    if (error) throw error
    context.decodeAudioData(data.buffer, decodedAudio => {
      const source = context.createBufferSource()
      source.buffer = decodedAudio
      source.connect(context.destination)
      source.start()
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
    // createBackgroundWindow()
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

  componentDidMount() {

  }

  render() {
    const files = this.state.files
    const file = getFileByPath(files, this.state.selectedFile)

    return (
      <div>

        <FileList
          loading={this.state.loading}
          files={files}
          selectedFile={file}
          onChange={this.handleFileListChange}
          onFileClick={this.handleFileClick}
          onAnalyzeClick={this.handleAnalyzeClick}/>

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
