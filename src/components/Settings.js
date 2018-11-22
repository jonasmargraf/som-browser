import '../assets/css/App.css';
import React, { Component } from 'react';
const {dialog} = require('electron').remote;
const path = require('path');
const ENTER_KEY = 13;

class Settings extends React.Component {
  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.handleChangeSettings = this.handleChangeSettings.bind(this)
    this.handleKeyDown = this.handleKeyDown.bind(this)
    this.handleFocus = this.handleFocus.bind(this)
    this.handleBlur = this.handleBlur.bind(this)
    this.handleMapSizeModeChange = this.handleMapSizeModeChange.bind(this)
    this.state = ({
      value: undefined,
      mapSizeMode: 'auto'
    })
  }

  componentDidMount() {
    
  }

  componentWillMount() {
  }

  componentDidUpdate(event) {
    if (this.state.mapSizeMode === 'auto') {
      // let event = {
        // target: this.refs['mapSize'],
        // valueAsNumber: mapSize
      // }
      // event.target = this.refs['mapSize']
      // event.target.value = mapSize
      // handleMapSizeModeChange(event)
      // console.log(this.state.mapSizeMode)
      // console.log(event)
      // if (this.props.filesLength) {
      //   this.props.onChangeSettings({
      //     target: this.refs['mapSize'],
      //     valueAsNumber: Math.floor(Math.sqrt(this.props.filesLength))
      //   })
      // }
      const mapSize = Math.floor(Math.sqrt(this.props.filesLength))
      // this.refs['mapSize'].value = mapSize
      console.log(this.refs['mapSize'])
    }
    console.log('did update')
    // console.log(this.props.filesLength)
  }

  handleChange(event) {
    this.props.onChangeSettings(event)
    console.log(event.target)
    // console.log(this.refs[event.target.name])
    this.refs[event.target.name].value = event.target.value
  }

  handleMapSizeModeChange(event) {
    const mapSize = Math.floor(Math.sqrt(this.props.filesLength))
    this.setState({
      mapSizeMode: event.target.value
    })
    if (event.target.value === 'auto') {
      event.target = this.refs['mapSize']
      event.target.value = mapSize
      this.props.onChangeSettings(event)
    }
  }

  handleChangeSettings() {
    const settings = this.props.settings
    // change settings
    this.props.onChangeSettings(settings)
    // console.log('inside Settings.handleChangeSettings()')
    // console.log(settings)
  }

  handleKeyDown(event) {
    if (event.keyCode === ENTER_KEY) {
      this.props.onChangeSettings(event)
      event.target.value = Math.min(Math.max(
        event.target.min, event.target.valueAsNumber), event.target.max)
      // console.log(event.target)
      // console.log(event.target.value)
    }
  }

  handleFocus(event) {
    // this.setState({ value: event.target.value }, () => event.target.value = 0)
    // event.target.value = ''
  }

  handleBlur(event) {
    if (!Number.isNaN(event.target.valueAsNumber)) {
      event.target.value = Math.min(Math.max(
        event.target.min, event.target.valueAsNumber), event.target.max)
    }
  }

  render() {

    return (

      <div className="Settings">

        {this.props.filesLength ?

          <div>

            <div className="dropdown">
              <label className="settingsTitle" htmlFor="dimensionWeights">Audio Feature Weighting:</label>
              <select id="dimensionWeights">
                <option value="weighting_1">Weighting 1</option>
                <option value="weighting_2">Weighting 2</option>
                <option value="weighting_3">Weighting 3</option>
              </select>
            </div>

            <div className="slider">
              <div>
                <label className="settingsTitle" htmlFor="mapSize">Map Size:</label>
                <input
                  id="autoMapSize"
                  ref="autoMapSize"
                  name="mapSizeSwitch"
                  type="radio"
                  value="auto"
                  onChange={this.handleMapSizeModeChange}
                  defaultChecked
                  />
                <label htmlFor="autoMapSize">Automatic</label>
                <input id="manualMapSize" ref="manualMapSize" name="mapSizeSwitch" type="radio" value="manual" onChange={this.handleMapSizeModeChange}/>
                <label htmlFor="manualMapSize">Manual</label>
                <input
                  type="number"
                  id="mapSize"
                  name="mapSize"
                  ref="mapSize"
                  min="2"
                  max="32"
                  defaultValue={this.props.settings.mapSize}
                  onKeyDown={this.handleKeyDown}
                  onFocus={this.handleFocus}
                  onBlur={this.handleBlur}
                  readOnly={this.state.mapSizeMode === 'auto'}
                  />
              </div>
              <input
                type="range"
                id="mapSize"
                name="mapSize"
                ref="mapSizeSlider"
                min="2"
                max="32"
                value={this.props.settings.mapSize}
                onChange={this.handleChange}
                disabled={this.state.mapSizeMode === 'auto'}
                />
            </div>

            <div className="slider">
              <div>
                <label className="settingsTitle" htmlFor="trainingEpochs">Training Epochs:</label>
                <input
                  type="number"
                  id="trainingEpochs"
                  name="trainingEpochs"
                  ref="trainingEpochs"
                  min="1"
                  max="100"
                  defaultValue={this.props.settings.trainingEpochs}
                  onKeyDown={this.handleKeyDown}
                  onFocus={this.handleFocus}
                  onBlur={this.handleBlur}
                  />
              </div>
              <input
                type="range"
                id="trainingEpochs"
                name="trainingEpochs"
                min="1"
                max="100"
                value={this.props.settings.trainingEpochs}
                onChange={this.handleChange}
                />
            </div>

            <div className="dropdown">
              <label className="settingsTitle" htmlFor="learningRateType">Learning Rate Type:</label>
              <select id="learningRateType">
                <option value="linear">Linear</option>
                <option value="inverse">Inverse</option>
                <option value="BDH">BDH</option>
              </select>
            </div>

            <div className="slider">
              <div>
                <label className="settingsTitle" htmlFor="initialAlpha">Initial Alpha:</label>
                <input
                  type="number"
                  id="initialAlpha"
                  name="initialAlpha"
                  ref="initialAlpha"
                  min="0"
                  max="0.99"
                  step="0.01"
                  defaultValue={this.props.settings.initialAlpha}
                  onKeyDown={this.handleKeyDown}
                  onFocus={this.handleFocus}
                  onBlur={this.handleBlur}
                  />
              </div>
              <input
                type="range"
                id="initialAlpha"
                name="initialAlpha"
                min="0"
                max="0.99"
                step="0.01"
                value={this.props.settings.initialAlpha}
                onChange={this.handleChange}
                />
            </div>

            <div className="slider">
              <div>
                <label className="settingsTitle" htmlFor="radiusStart">Start Radius:</label>
                <input
                  type="number"
                  id="radiusStart"
                  name="radiusStart"
                  ref="radiusStart"
                  min="2"
                  max="32"
                  defaultValue={this.props.settings.radiusStart}
                  onKeyDown={this.handleKeyDown}
                  onFocus={this.handleFocus}
                  onBlur={this.handleBlur}
                  />
              </div>
              <input
                type="range"
                id="radiusStart"
                name="radiusStart"
                min="2"
                max="32"
                value={this.props.settings.radiusStart}
                onChange={this.handleChange}
                />
            </div>

            <div className="slider">
              <div>
                <label className="settingsTitle" htmlFor="radiusEnd">End Radius:</label>
                <input
                  type="number"
                  id="radiusEnd"
                  name="radiusEnd"
                  ref="radiusEnd"
                  min="2"
                  max="32"
                  defaultValue={this.props.settings.radiusEnd}
                  onKeyDown={this.handleKeyDown}
                  onFocus={this.handleFocus}
                  onBlur={this.handleBlur}
                  />
              </div>
              <input
                type="range"
                id="radiusEnd"
                name="radiusEnd"
                min="2"
                max="32"
                value={this.props.settings.radiusEnd}
                onChange={this.handleChange}
                />
            </div>

            <div className="slider">
              <div>
                <label className="settingsTitle" htmlFor="magnificationM">Magnification Factor:</label>
                <input
                  type="number"
                  id="magnificationMDisplay"
                  name="magnificationM"
                  ref="magnificationM"
                  min="0.01"
                  max="5"
                  step="0.01"
                  defaultValue={this.props.settings.magnificationM}
                  onKeyDown={this.handleKeyDown}
                  onFocus={this.handleFocus}
                  onBlur={this.handleBlur}
                  />
              </div>
              <input
                type="range"
                id="magnificationM"
                name="magnificationM"
                min="0.01"
                max="5"
                step="0.01"
                value={this.props.settings.magnificationM}
                onChange={this.handleChange}
                />
            </div>

          </div>

           : <p>No audio files loaded.</p>}

      </div>
    )
  }
}

export default Settings
