import '../assets/css/App.css';
import React, { Component } from 'react';
const {dialog} = require('electron').remote;
const path = require('path');

class Settings extends React.Component {
  constructor(props) {
    super(props)
    this.handleChangeSettings = this.handleChangeSettings.bind(this)
  }

  componentWillMount() {
    // const defaultSettings = {
    //   mapSize: [4, 4],
    //   trainingEpochs: 30,
    //   dimensionWeights: [
    //     1, // RMS
    //     1, // ZCR
    //     1, // Spectral Centroid
    //     1, // Spectral Flatness
    //     1, // Spectral Slope
    //     1, // Spectral Rolloff
    //     1, // Spectral Spread
    //     1, // Spectral Skewness
    //     1, // Spectral Kurtosis
    //     1 // Loudness
    //   ],
    //   learningRateType: 'inverse',
    //   initialAlpha: 0.5,
    //   radiusStart: 5,
    //   radiusEnd: 30,
    //   magnificationM: 1
    // }
    // this.props.onChangeSettings(defaultSettings)
  }

  handleChangeSettings() {
    const settings = this.props.settings
    // change settings
    this.props.onChangeSettings(settings)
    console.log('inside Settings.handleChangeSettings()')
    console.log(settings)
  }

  render() {

    return (
      <div className="Settings">

        <h3>Settings</h3>

        <div className="slider">
          <select id="dimensionWeights">
            <option value="weighting_1">Feature Weighting 1</option>
            <option value="weighting_2">Feature Weighting 2</option>
            <option value="weighting_3">Feature Weighting 3</option>
          </select>
        </div>

        <div className="slider">
          <label htmlFor="mapSize">Map Size:</label>
          <input
            type="number"
            id="mapSize"
            name="mapSize"
            min="2"
            max="32"
            value={this.props.settings.mapSize}
            onChange={this.props.onChangeSettings}
            />
          <input
            type="range"
            id="mapSize"
            name="mapSize"
            min="2"
            max="32"
            value={this.props.settings.mapSize}
            onChange={this.props.onChangeSettings}
            />
        </div>

        <div className="slider">
          <label htmlFor="trainingEpochs">Training Epochs:</label>
          <input
            type="number"
            id="trainingEpochs"
            name="trainingEpochs"
            min="1"
            max="100"
            value={this.props.settings.trainingEpochs}
            onChange={this.props.onChangeSettings}
            />
          <input
            type="range"
            id="trainingEpochs"
            name="trainingEpochs"
            min="2"
            max="32"
            value={this.props.settings.trainingEpochs}
            onChange={this.props.onChangeSettings}
            />
        </div>

        <div className="slider">
          <select id="learningRateType">
            <option value="linear">Linear</option>
            <option value="inverse">Inverse</option>
            <option value="BDH">BDH</option>
          </select>
        </div>

        <div className="slider">
          <label htmlFor="initialAlpha">Initial Alpha:</label>
          <input
            type="number"
            id="initialAlpha"
            name="initialAlpha"
            min="0"
            max="0.99"
            step="0.01"
            value={this.props.settings.initialAlpha}
            onChange={this.props.onChangeSettings}
            />
          <input
            type="range"
            id="initialAlpha"
            name="initialAlpha"
            min="0"
            max="0.99"
            step="0.01"
            value={this.props.settings.initialAlpha}
            onChange={this.props.onChangeSettings}
            />
        </div>

        <div className="slider">
          <label htmlFor="radiusStart">Start Radius:</label>
          <input
            type="number"
            id="radiusStart"
            name="radiusStart"
            min="2"
            max="32"
            value={this.props.settings.radiusStart}
            onChange={this.props.onChangeSettings}
            />
          <input
            type="range"
            id="radiusStart"
            name="radiusStart"
            min="2"
            max="32"
            value={this.props.settings.radiusStart}
            onChange={this.props.onChangeSettings}
            />
        </div>

        <div className="slider">
          <label htmlFor="radiusEnd">End Radius:</label>
          <input
            type="number"
            id="radiusEnd"
            name="radiusEnd"
            min="2"
            max="32"
            value={this.props.settings.radiusEnd}
            onChange={this.props.onChangeSettings}
            />
          <input
            type="range"
            id="radiusEnd"
            name="radiusEnd"
            min="2"
            max="32"
            value={this.props.settings.radiusEnd}
            onChange={this.props.onChangeSettings}
            />
        </div>

        <div className="slider">
          <label htmlFor="magnificationM">Magnification Factor:</label>
          {
            // <output id="magnificationMDisplay" name="magnificationMDisplay" htmlFor={this.state.magnificationM}>1</output>
          }
          <input
            type="number"
            id="magnificationMDisplay"
            name="magnificationM"
            min="0.01"
            max="5"
            value={this.props.settings.magnificationM}
            step="0.01"
            onChange={this.props.onChangeSettings}
            />
          <input
            type="range"
            id="magnificationM"
            name="magnificationM"
            min="0.01"
            max="5"
            step="0.01"
            value={this.props.settings.magnificationM}
            onChange={this.props.onChangeSettings}
            />
        </div>

      </div>
    )
  }
}

export default Settings
