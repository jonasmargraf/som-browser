import '../assets/css/App.css';
import React, { Component } from 'react';
import { hot } from 'react-hot-loader'
import Map from './Map';
import FileList from './FileList';
import FileInfo from './FileInfo';
import UserSelection from './UserSelection';
const { ipcRenderer, remote } = require('electron');
const { BrowserWindow } = remote;
const path = remote.require('path')


// window.onload = () => {
//   ipcRenderer.send('async', 'ping')

// import {  Container,
//           Row,
//           Col,
//           Card,
//           CardHeader,
//           CardFooter,
//           CardBody
//         } from 'reactstrap';



// Invisible background Window for async background processing
function createBackgroundWindow(files) {
  return new Promise(function(resolve, reject) {
    const win = new BrowserWindow({
      show: false
    });

    // console.log("hi"+ path.join(__dirname, 'background', 'background.html'))
    win.loadURL("file:///Users/jm/Dropbox/AKT/Masterarbeit/dev/basic-electron-react-boilerplate/src/background/background.html")

    win.once('ready-to-show', () => {
      // win.show();
      // Open the DevTools automatically if developing
      // if ( dev ) {
      win.webContents.openDevTools();
      // }
      ipcRenderer.once('to-ui', (event, arg) => {
        win.destroy()
        console.log(arg)
        resolve(arg)
      })
      win.webContents.send("to-background", files)
    })
  })
}
//
// const processFiles = (files) =>
//   Promise.all(files.map((f)=>createBackgroundWindow(f)))

class App extends React.Component {
  constructor(props) {
    super(props)
    this.handleFileListChange = this.handleFileListChange.bind(this)
    this.handleFileClick = this.handleFileClick.bind(this)
    this.handleAnalyzeClick = this.handleAnalyzeClick.bind(this)
    this.state = {
      files: null,
      selectedFile: null
    }
  }

  handleFileListChange(files) {
    this.setState({
      files: files,
      selectedFile: null
    })
  }

  handleFileClick(file) {
    this.setState({selectedFile: file})
  }

  handleAnalyzeClick() {

    // createBackgroundWindow()
    createBackgroundWindow(this.state.files).then((files)=>this.setState({files:files}))
  }

  componentDidMount() {

  }

  render() {
    const files = this.state.files
    const file = this.state.selectedFile

    return (
      <div>
        <Map />
        <FileList
          files={files}
          onChange={this.handleFileListChange}
          onFileClick={this.handleFileClick}
          onAnalyzeClick={this.handleAnalyzeClick}/>
        <FileInfo file={file}/>
        <UserSelection />
      </div>
    );
  }
}

export default hot(module)(App)

/*
<div>
<Row>
  <Col md="6">
    <Map />
  </Col>
  <Col xs="3">
    <Card>
      <CardHeader>
        Sounds
      </CardHeader>
      <CardBody>
        <FileList files={files} onChange={this.handleFileListChange}
          onFileClick={this.handleFileClick}/>
      </CardBody>
      <CardFooter>
      </CardFooter>
    </Card>
  </Col>

  <Col xs="3">
    <Card>
      <CardHeader>
        File Info
      </CardHeader>
      <CardBody>
        <FileInfo file={file}/>
      </CardBody>
      <CardFooter>
      </CardFooter>
    </Card>
  </Col>
</Row>
<Row>
  <Col>
    <UserSelection />
  </Col>
</Row>
</div>
*/
