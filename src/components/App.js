import '../assets/css/App.css';
import React, { Component } from 'react';
import { hot } from 'react-hot-loader'
import Map from './Map';
import FileList from './FileList';
import FileInfo from './FileInfo';
import UserSelection from './UserSelection';
const { ipcRenderer, remote } = require('electron');
const { BrowserWindow } = remote;

// Invisible background Window for async background processing
function createBackgroundWindow(file) {
  return new Promise(function(resolve, reject) {
    let win = new BrowserWindow({
      show: false
    });

    // console.log("hi"+ path.join(__dirname, 'background', 'background.html'))
    win.loadURL("file:///Users/jm/Dropbox/AKT/Masterarbeit/dev/som-browser/src/background/background.html")

    win.once('ready-to-show', () => {
      // win.webContents.openDevTools();

      ipcRenderer.once(file.path, (event, arg) => {
        win.destroy()
        resolve(arg)
      })

      win.webContents.send('to-background', file)
    })
  })
}

function createSOMBackgroundWindow(files) {
  // console.log('inside createSOMBackgroundWindow()')
  return new Promise(function(resolve, reject) {
    let win = new BrowserWindow({
      show: false
    });

    // console.log("hi"+ path.join(__dirname, 'background', 'background.html'))
    win.loadURL("file:///Users/jm/Dropbox/AKT/Masterarbeit/dev/som-browser/src/background/som.html")

    win.once('ready-to-show', () => {
      // win.show()
      // console.log('ready2show')
      // win.webContents.openDevTools()

      ipcRenderer.once('som-done', (event, value) => {
        win.destroy()
        resolve(value)
      })

      win.webContents.send('to-som', files)
    })
  })
}

const processFiles = (files) =>
  Promise.all(files.map((file) => createBackgroundWindow(file)))

const getFileByPath = (files, path) =>
  (path == null) ? null : files.filter((file) => file.path == path)[0]

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
    this.setState({selectedFile: mapElement})
  }

  handleAnalyzeClick() {
    this.setState({loading: true})
    console.log("Processing files...")
    // createBackgroundWindow()
    processFiles(this.state.files)
    .then(files => this.setState({files: files, loading: false}))
      // console.log(files)
    // })
    .then(() => {
      console.log("Building map...")
      createSOMBackgroundWindow(this.state.files)
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
