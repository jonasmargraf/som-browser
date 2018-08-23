import '../assets/css/App.css';
import React, { Component } from 'react';
// import { ListGroup, ListGroupItem } from 'reactstrap';
const {dialog} = require('electron').remote;
const path = require('path');
// const {extractFeatures} = require('../extractFeatures.js');

// var file = fetch('../../audio/.Plank 3.wav')
//             .then(response => response.arrayBuffer())
//             .then(buffer => console.log(buffer))

class FileListItem extends React.Component {
  constructor(props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick(file) {
    this.props.onFileClick(file)
  }

  render() {
    const file = this.props.file

    return (
      <li className="FileListItem" onClick={this.handleClick.bind(this, file)}>
        {file.name}
      </li>
    )
    }
}

class FileList extends React.Component {
  constructor(props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
    this.addToFileList = this.addToFileList.bind(this)
    this.handleAnalyzeClick = this.handleAnalyzeClick.bind(this)
  }

  addToFileList(files) {
    files = files.map(filePath => ({
      path: filePath,
      name: path.basename(filePath)
    }))

    this.props.onChange(files)
  }

  handleClick() {
    const options = {
      properties: ['openFile', 'multiSelections'],
      filters: [{name: 'Audio Files', extensions: ['wav', 'mp3', 'flac', 'ogg']}]
    }
    dialog.showOpenDialog(options, files => files && this.addToFileList(files))
  }

  handleAnalyzeClick() {
    // console.log('hi from handleAnalyzeClick')
    const files = this.props.files
    // this doesn't find the correct path yet, it looks in localhost:8080/Users/etc...
    // files.forEach(file => console.log(extractFeatures(file.path)))
    this.props.onAnalyzeClick()
  }

  render() {
    const files = this.props.files;
    const fileListItems = [];

    if (files) {
      files.forEach(file => fileListItems.push(
        <FileListItem
          key={file.path}
          file={file}
          onFileClick={this.props.onFileClick}/>
      ))
    }

    return (
      <div className="FileList">
        <h3>
          Sounds
        </h3>
        <div className="ActionButtons">
          <input className="AnalyzeSounds" type="button" value="Analyze"
            disabled={this.props.loading}
            onClick={this.handleAnalyzeClick}/>
          {this.props.loading && <span>loading</span>}
          <input className="OpenFile" type="button" value="Open..."
            onClick={this.handleClick}/>
        </div>
        <ul>
          {
            files ?

            fileListItems

            :

            <p>No audio files loaded.</p>
          }
        </ul>
      </div>
    );
  }
}

export default FileList;
