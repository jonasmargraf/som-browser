import '../assets/css/App.css';
import React, { Component } from 'react';
const {dialog} = require('electron').remote;
const path = require('path');

class MenuBar extends React.Component {
  constructor(props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
    this.addToFileList = this.addToFileList.bind(this)
    this.handleAnalyzeClick = this.handleAnalyzeClick.bind(this)
    this.handleSave = this.handleSave.bind(this)
    this.handleLoad = this.handleLoad.bind(this)
    this.handleExport = this.handleExport.bind(this)
    this.printState = this.printState.bind(this)
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

  handleSave() {
    this.props.onSaveClick()
  }

  handleLoad() {
    this.props.onLoadClick()
  }

  handleExport() {
    this.props.onExportClick()
  }

  printState() {
    this.props.onPrintState()
  }

  render() {

    return (
      <div className="MenuBar">
        <div className="ActionButtons">
          <input className="AnalyzeSounds" type="button" value="Analyze"
            disabled={this.props.loading}
            onClick={this.handleAnalyzeClick}/>
          {this.props.loading && <span>Loading...</span>}
          <input className="SaveState" type="button" value="Save"
            onClick={this.handleSave}/>
          <input className="LoadState" type="button" value="Load Map..."
            onClick={this.handleLoad}/>
          <input className="OpenFile" type="button" value="Import Files..."
            onClick={this.handleClick}/>
          <input className="ExportSelection" type="button" value="Export Selection..."
              onClick={this.handleExport}/>
          <input className="PrintState" type="button" value="Print State"
              onClick={this.printState}/>
        </div>
      </div>
    );
  }
}

export default MenuBar;
