import '../assets/css/App.css';
import React, { Component } from 'react';
import Map from './Map';
import FileList from './FileList';
import FileInfo from './FileInfo';
import UserSelection from './UserSelection';
const { ipcRenderer } = require('electron');

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
    // console.log('Hello from handleAnalyzeClick()')
    ipcRenderer.send('from-ui', this.state.files)
  }

  componentDidMount() {
    ipcRenderer.on('to-ui', (event, arg) => {
      // console.log(arg.map(file => file.name))
      // console.log(arg.map(file => file.path))
      console.log(arg)
      this.setState({files: arg})
    })
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

export default App;

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
