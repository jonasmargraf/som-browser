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
        <input className="changeSettings" type="button" value="Change settings..."
          onClick={this.handleChangeSettings}/>

        <div className="slider">
          <select id="dimensionWeights">
            <option value="weighting_1">Feature Weighting 1</option>
            <option value="weighting_2">Feature Weighting 2</option>
            <option value="weighting_3">Feature Weighting 3</option>
          </select>
        </div>

        <div className="slider">
          <label htmlFor="mapSize">Map Size:</label>
          <output id="mapSizeDisplay" name="mapSizeDisplay" htmlFor="mapSize">2</output>
          <input type="range" id="mapSize" name="mapSize" min="2" max="32" onInput={ () => mapSizeDisplay.value=mapSize.value}/>
        </div>

        <div className="slider">
          <label htmlFor="trainingEpochs">Training Epochs:</label>
          <output id="trainingEpochsDisplay" name="trainingEpochsDisplay" htmlFor="trainingEpochs">1</output>
          <input type="range" id="trainingEpochs" name="trainingEpochs" min="1" max="100" defaultValue="30" onInput={ () => trainingEpochsDisplay.value=trainingEpochs.value}/>
        </div>

        <div className="slider">
          <label htmlFor="initialAlpha">Initial Alpha:</label>
          <output id="initialAlphaDisplay" name="initialAlphaDisplay" htmlFor="initialAlpha">0.5</output>
          <input type="range" id="initialAlpha" name="initialAlpha" min="0" max="0.99" defaultValue="0.5" step="0.01" onInput={ () => initialAlphaDisplay.value=initialAlpha.value}/>
        </div>

        <div className="slider">
          <label htmlFor="radiusStart">Start Radius:</label>
          <output id="radiusStartDisplay" name="radiusStartDisplay" htmlFor="radiusStart">5</output>
          <input type="range" id="radiusStart" name="radiusStart" min="2" max="32" defaultValue="5" onInput={ () => radiusStartDisplay.value=radiusStart.value}/>
        </div>

        <div className="slider">
          <label htmlFor="radiusEnd">End Radius:</label>
          <output id="radiusEndDisplay" name="radiusEndDisplay" htmlFor="radiusEnd">30</output>
          <input type="range" id="radiusEnd" name="radiusEnd" min="2" max="32" defaultValue="30" onInput={ () => radiusEndDisplay.value=radiusEnd.value}/>
        </div>

        <div className="slider">
          <label htmlFor="magnificationM">Magnification Factor:</label>
          <output id="magnificationMDisplay" name="magnificationMDisplay" htmlFor="magnificationM">1</output>
          <input type="range" id="radiusEnd" name="radiusEnd" min="0.01" max="5" defaultValue="1" step="0.01" onInput={ () => magnificationMDisplay.value=magnificationM.value}/>
        </div>

      </div>
    )
  }

}

export default Settings
