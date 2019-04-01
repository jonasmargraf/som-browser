import '../assets/css/App.css';
import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import TouchBackend from 'react-dnd-touch-backend';
import { default as CustomDragPreview } from './CustomDragPreview';
import { DragDropContext } from 'react-dnd';
import MenuBar from './MenuBar';
import Map from './Map';
import FileList from './FileList';
import FileInfo from './FileInfo';
import UserSelection from './UserSelection';
import Settings from './Settings';
const { ipcRenderer, remote } = require('electron');
const { app, BrowserWindow, dialog } = remote;
const fs = require('fs');
const url = require('url');
const path = require('path');

let dev = false

const context = new AudioContext()
let audioSources = []
let audioData = []

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

    win.once('ready-to-show', () => {
      // win.show()
      // win.webContents.openDevTools();

      ipcRenderer.once('features-done', (event, value) => {
        win.destroy()
        ipcRenderer.removeAllListeners('features-progress')
        resolve(value)
      })

      win.webContents.send('to-background', files)
    })
  })
}

function createSOM(files, settings) {
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

    win.once('ready-to-show', () => {
      // win.show()
      // win.webContents.openDevTools()

      ipcRenderer.once('som-done', (event, value) => {
        win.destroy()
        resolve(value)
      })

      ipcRenderer.on('som-progress', (event, value) => {
        console.log(value)
      })

      win.webContents.send('to-som', { files: files, settings: settings })
    })
  })
}

const getFileByPath = (files, path) =>
  (path == null) ? undefined : files.filter((file) => file.path == path)[0]

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
    })
  })
}

const playFileFromMemory = (decodedAudio) => {
  audioSources.forEach(e => e.stop())
  audioSources = []
  // context.decodeAudioData(data.buffer, decodedAudio => {
    const source = context.createBufferSource()
    audioSources.push(source)
    source.buffer = decodedAudio
    source.connect(context.destination)
    source.start()
    // return source
  // })
}

const loadAudioFiles = (files) => {
  console.log(files)
  audioData = new Array(files.length)
  files.forEach((e,i) => {
    // return (e = i)
    fs.readFile(e.path, (error, data) => {
      if (error) throw error
      // audioData[i] = data
      context.decodeAudioData(data.buffer, decodedAudio => {
        audioData[i] = decodedAudio
        // const source = context.createBufferSource()
      //   audioSources[i] = source
      //   source.buffer = decodedAudio
      //   source.connect(context.destination)
      //   // return source
      })
    })
    console.log(e.name)
    // audioSources[i] = source
    // e = source
  })
  console.log(audioData)
}

const stopAudio = () => {
  audioSources.forEach(e => e.stop())
}

class App extends React.Component {
  constructor(props) {

    super(props)
    this.handleFileListChange = this.handleFileListChange.bind(this)
    this.handleUserSelectionUpdate = this.handleUserSelectionUpdate.bind(this)
    this.handleFileClick = this.handleFileClick.bind(this)
    this.handleAnalyzeClick = this.handleAnalyzeClick.bind(this)
    this.handleMapClick = this.handleMapClick.bind(this)
    this.handleSaveClick = this.handleSaveClick.bind(this)
    this.handleLoadClick = this.handleLoadClick.bind(this)
    this.handleExportClick = this.handleExportClick.bind(this)
    this.handlePrintStateClick = this.handlePrintStateClick.bind(this)
    this.handleMouseLeave = this.handleMouseLeave.bind(this)
    this.handleChangeSettings = this.handleChangeSettings.bind(this)
    this.state = {
      files: null,
      selectedFile: undefined,
      som: null,
      loading: false,
      userSelection: [],
      progress: 'Import some files, then click the Analyze button!',
      showSettings: true,
      settings: {
        mapSize: [4, 4],
        trainingEpochs: 10,
        // dimensionWeights: [
        //   1, // RMS
        //   1, // ZCR
        //   1, // Spectral Centroid
        //   1, // Spectral Flatness
        //   1, // Spectral Slope
        //   1, // Spectral Rolloff
        //   1, // Spectral Spread
        //   1, // Spectral Skewness
        //   1, // Spectral Kurtosis
        //   1, // Loudness
        //   1  // Duration
        // ],
        // 'linear', 'inverse' or 'BDH'
        learningRateType: 'linear',
        initialAlpha: 0.9,
        // Remember: the actual radiusStart/End value is (mapSize/radiusStart)
        radiusStart: 2,
        radiusEnd: 0.1,
        magnificationM: -0.2
      }
    }
  }

  componentWillMount() {
    ipcRenderer.on('display-progress', (event, value) => {
      this.setState({ progress: value })
      // console.log(value)
    })
  }

  componentDidUpdate() {
    // console.log('App component updated')
  }

  handleFileListChange(files) {
    this.setState({
      files: files,
      selectedFile: undefined,
      som: null
    }, () => loadAudioFiles(files))
  }

  handleUserSelectionUpdate(userSelection) {
    this.setState({
      userSelection: userSelection
    })
  }

  handleFileClick(file) {
    this.setState({selectedFile: file.path})
  }

  handleMapClick(mapElement) {
    this.setState({selectedFile: this.state.files[mapElement].path}, () =>
    // playFile(this.state.selectedFile))
      playFileFromMemory(audioData[mapElement]))
      // console.log(mapElement))
    // )}
  }

  handleMouseLeave() {
    stopAudio()
  }

  handleAnalyzeClick() {
   if (!this.state.files) {
     return
   }
   else {
     this.setState({
       loading: true,
       progress: 'Analyzing files...',
       som: null,
       userSelection: []
     })
     // Check if all files have features
     // i.e. if feature analysis has already been done
     if (this.state.files.find(e => !e.features)) {
       console.log("Processing files...")
       processFiles(this.state.files)
       .then(files => this.setState({ files: files, loading: false }))
       .then(() => {
         console.log("Building map...")
         createSOM(this.state.files, this.state.settings)
         .then(som => {
           this.setState({ som: som }
              , () => console.log(this.state)
            )
           // console.log(this.state)
         })
       })
     }
     // If feature analysis already done, skip directly to build map
     else {
       console.log("Building map...")
       // console.log(this.state.settings)
       createSOM(this.state.files, this.state.settings)
       .then(som => {
         this.setState({ som: som }
           , () => console.log(this.state)
         )
         // console.log(this.state)
       })
     }
   }
 }

  static updateProgress(value) {
    this.setState({ progress: value })
  }

  // Save state to disk as JSON file
  handleSaveClick() {
    const options = {
      defaultPath: path.join(app.getAppPath(), 'maps'),
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
      this.setState(loadedData, () => loadAudioFiles(this.state.files))
      :
      alert("The loaded file doesn't appear to be valid. Please try again.")
    })
  }

  handleExportClick() {
    const options = {
      defaultPath: path.join(app.getAppPath(), 'map'),
      buttonLabel: 'Save',
      properties: ['openDirectory', 'createDirectory']
    }
    console.log('exporting files...')
    // Abusing the OpenDialog here so that we prevent user from typing a file
    // name, which 'showSaveDialog' prompts them to do.
    dialog.showOpenDialog(options, path => {
      this.state.userSelection.forEach(e => {
        if ( e.file ) {
          // Copy the file to new location
          // 'wx' flag so that file only gets created if it doesn't exist
          // (for safety...)
          let tempData = fs.readFileSync(e.path)
          try {
              fs.writeFileSync(path + '/' + e.file, tempData, { flag: 'wx' })
              console.log(e.file + 'copied')
          } catch (e) {
            console.log(e)
          }
        }
      })
      console.log('Done exporting.')
    })
  }

  handlePrintStateClick() {
    console.log(this.state)
  }

  handleChangeSettings(event) {
    let settings = this.state.settings
    // console.log(event.target.min)
    if (event.target.name === 'learningRateType')
      settings[event.target.name] = event.target.value
      // console.log(event.target.value)
    // make sure input isn't NaN
    else if (!Number.isNaN(event.target.valueAsNumber)) {
      // clamp value to range
      settings[event.target.name] = Math.min(Math.max(
        event.target.min, event.target.valueAsNumber), event.target.max)
      if (event.target.name === 'mapSize')
        settings[event.target.name] = [
          settings[event.target.name],
          settings[event.target.name]
        ]
      // console.log(event.target.value)
      }
      this.setState({ settings }
        , () => console.log(this.state.settings)
      )
      // console.log('inside App.handleChangeSettings()')
    // console.log(event)
  }

  componentDidMount() {
  }

  render() {
    const files = this.state.files
    const showSettings = this.state.showSettings
    const file = getFileByPath(files, this.state.selectedFile)

    return (
      <div className="AppContent">

        <CustomDragPreview />

        <div className="TitleBar"> <p>SOM Browser</p> </div>

        <MenuBar
          files={files}
          onChange={this.handleFileListChange}
          onFileClick={this.handleFileClick}
          onAnalyzeClick={this.handleAnalyzeClick}
          onSaveClick={this.handleSaveClick}
          onLoadClick={this.handleLoadClick}
          onExportClick={this.handleExportClick}
          onPrintState={this.handlePrintStateClick}
          />

        <div className="leftPanel">
            <input id="tab1" type="radio" name="tabs" defaultChecked/>
            <label htmlFor="tab1">Sounds</label>
            <input id="tab2" type="radio" name="tabs"/>
            <label htmlFor="tab2">Settings</label>
          <div className="content">
            <div id="tabFileList">
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
            </div>
            <div id="tabSettings">
              <Settings
                filesLength={files && files.length}
                settings={this.state.settings}
                onChangeSettings={this.handleChangeSettings}
                />
            </div>
          </div>
        </div>

        <Map
          som={this.state.som}
          files={this.state.files}
          progress={this.state.progress}
          selectedFile={file}
          onMapClick={this.handleMapClick}
          onMouseLeave={this.handleMouseLeave}
          />

        <FileInfo file={file} />

        <UserSelection
          userSelection = {this.state.userSelection}
          onClick={this.handleMapClick}
          onUserSelectionUpdate={this.handleUserSelectionUpdate}
          />

      </div>
    )
  }
}

App = DragDropContext(TouchBackend({ enableMouseEvents: true }))(App)

export default hot(module)(App)
