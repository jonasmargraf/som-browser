import '../assets/css/App.css';
import React, { Component } from 'react';
const {dialog} = require('electron').remote;
const path = require('path');

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
      <li
        id={this.props.selected ? "FileListSelectedFile" : undefined}
        className="FileListItem"
        onClick={this.handleClick.bind(this, file)}>
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
    const selectedFile = this.props.selectedFile && this.props.selectedFile.path

    if (files) {
      files.forEach(file => fileListItems.push(
        <FileListItem
          key={file.path}
          file={file}
          selected={file.path === selectedFile}
          onFileClick={this.props.onFileClick}/>
      ))
    }

    return (
      <div className="FileListContainer">
        <h3>
          Sounds
        </h3>
        <div className="ActionButtons">
          <input className="AnalyzeSounds" type="button" value="Analyze"
            disabled={this.props.loading}
            onClick={this.handleAnalyzeClick}/>
          {this.props.loading && <span>Loading...</span>}
          <input className="OpenFile" type="button" value="Open..."
            onClick={this.handleClick}/>
        </div>
        <ul className="FileList">
          { files ? fileListItems : <span>No audio files loaded.</span> }
        </ul>
      </div>
    );
  }
}

export default FileList;
