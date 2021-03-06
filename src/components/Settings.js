import '../assets/css/App.css';
import React, { Component } from 'react';
const {dialog} = require('electron').remote;
const path = require('path');
const ENTER_KEY = 13;

class Settings extends React.PureComponent {
  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.handleChangeSettings = this.handleChangeSettings.bind(this)
    this.handleKeyDown = this.handleKeyDown.bind(this)
    this.handleFocus = this.handleFocus.bind(this)
    this.handleBlur = this.handleBlur.bind(this)
    this.handleMapSizeModeChange = this.handleMapSizeModeChange.bind(this)
    this.handleWeightingChange = this.handleWeightingChange.bind(this)
    this.handleLearningRateChange = this.handleLearningRateChange.bind(this)
    this.state = ({
      value: undefined,
      mapSize: undefined,
      mapSizeMode: 'auto',
      trainingEpochs: 4,
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
    })
  }

  componentDidMount() {

  }

  componentWillMount() {
  }

  componentDidUpdate(event) {
    // console.log('settings updated')
    if ((this.props.filesLength) && (this.state.mapSizeMode === 'auto')) {
      const mapSize = Math.floor(Math.sqrt(this.props.filesLength))
      // console.log(this.state.mapSize)
      if (mapSize !== this.state.mapSize) {
        this.handleMapSizeModeChange({ target: { value: 'auto' } })
        // console.log('called handleMapSizeModeChange()')
      }
    }
  }

  handleChange(event) {
    this.props.onChangeSettings(event)
    this.refs[event.target.name].value = event.target.value
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  handleMapSizeModeChange(event) {
    const mapSize = Math.floor(Math.sqrt(this.props.filesLength))
    this.setState({
      mapSize: mapSize,
      mapSizeMode: event.target.value
    }
    // , () => console.log(this.state)
    )
    if (event.target.value === 'auto') {
      event.target = this.refs['mapSize']
      event.target.value = mapSize
      this.props.onChangeSettings(event)
    }
  }

  handleWeightingChange(event) {
    // console.log(event.target.value)
  }

  handleLearningRateChange(event) {
    console.log(event.target)
    this.props.onChangeSettings(event)
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
      this.setState({
        [event.target.name]: event.target.value
      })
    }
  }

  handleFocus(event) {
    // this.setState({ value: event.target.value },
    // () => event.target.value = 0)
    // event.target.value = ''
  }

  handleBlur(event) {
    this.props.onChangeSettings(event)
    if (!Number.isNaN(event.target.valueAsNumber)) {
      event.target.value = Math.min(Math.max(
        event.target.min, event.target.valueAsNumber), event.target.max)
      this.setState({
        [event.target.name]: event.target.value
      })
    }
  }

  render() {

    return (

      <div className="Settings">

        {this.props.filesLength ?

          <div>

            {
            // <div className="radioGroup">
            //   <label className="settingsTitle" htmlFor="dimensionWeights">
            //     Audio Feature Weighting:
            //   </label>
            //   <div className="radioButtons">
            //     <input
            //       type="radio"
            //       id="weighting_1"
            //       name="weighting"
            //       value="1"
            //       onChange={this.handleWeightingChange}
            //       defaultChecked
            //       />
            //     <label htmlFor="weighting_1">Weighting 1</label>
            //     <input
            //       type="radio"
            //       id="weighting_2"
            //       name="weighting"
            //       value="2"
            //       onChange={this.handleWeightingChange}
            //       />
            //     <label htmlFor="weighting_2">Weighting 2</label>
            //     <input
            //       type="radio"
            //       id="weighting_3"
            //       name="weighting"
            //       value="3"
            //       onChange={this.handleWeightingChange}
            //       />
            //     <label htmlFor="weighting_3">Weighting 3</label>
            //   </div>
            // </div>
            }
            <div className="slider">
              <div>
                <label className="settingsTitle" htmlFor="mapSize">
                  Map Size:
                </label>
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
                <input
                  id="manualMapSize"
                  ref="manualMapSize"
                  name="mapSizeSwitch"
                  type="radio"
                  value="manual"
                  onChange={this.handleMapSizeModeChange}
                  />
                <label htmlFor="manualMapSize">Manual</label>
                <input
                  type="number"
                  id="mapSize"
                  name="mapSize"
                  ref="mapSize"
                  min="2"
                  max="32"
                  defaultValue={this.props.settings.mapSize[0]}
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
                value={this.props.settings.mapSize[0]}
                onChange={this.handleChange}
                disabled={this.state.mapSizeMode === 'auto'}
                />
            </div>

            <div className="slider">
              <div>
                <label className="settingsTitle" htmlFor="trainingEpochs">
                  Training Length (10<sup>n</sup>):
                </label>
                <input
                  type="number"
                  id="trainingEpochs"
                  name="trainingEpochs"
                  ref="trainingEpochs"
                  min="0"
                  max="6"
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
                min="0"
                max="6"
                value={this.props.settings.trainingEpochs}
                onChange={this.handleChange}
                />
            </div>

            <div className="radioGroup">
              <label className="settingsTitle" htmlFor="learningRateType">
                Learning Rate Type:
              </label>
              <div className="radioButtons">
                <input
                  type="radio"
                  id="linear"
                  name="learningRateType"
                  value="linear"
                  onChange={this.handleLearningRateChange}
                  defaultChecked
                  />
                <label htmlFor="linear">Linear</label>
                <input
                  type="radio"
                  id="inverse"
                  name="learningRateType"
                  value="inverse"
                  onChange={this.handleLearningRateChange}
                  />
                <label htmlFor="inverse">Inverse</label>
                <input
                  type="radio"
                  id="BDH"
                  name="learningRateType"
                  value="BDH"
                  onChange={this.handleLearningRateChange}
                  />
                <label htmlFor="BDH">BDH</label>
              </div>
            </div>

            <div className="slider">
              <div>
                <label className="settingsTitle" htmlFor="initialAlpha">
                  Initial Alpha:
                </label>
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
                <label className="settingsTitle" htmlFor="radiusStart">
                  Start Radius:
                </label>
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
                max="16"
                step="0.1"
                value={this.props.settings.radiusStart}
                onChange={this.handleChange}
                />
            </div>

            <div className="slider">
              <div>
                <label className="settingsTitle" htmlFor="radiusEnd">
                  End Radius:
                </label>
                <input
                  type="number"
                  id="radiusEnd"
                  name="radiusEnd"
                  ref="radiusEnd"
                  min="0.1"
                  max="16"
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
                min="0.1"
                max="16"
                step="0.1"
                value={this.props.settings.radiusEnd}
                onChange={this.handleChange}
                />
            </div>

            <div className="slider">
              <div>
                <label className="settingsTitle" htmlFor="magnificationM">
                  Magnification Factor:
                </label>
                <input
                  type="number"
                  id="magnificationMDisplay"
                  name="magnificationM"
                  ref="magnificationM"
                  min="-1.0"
                  max="1.0"
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
                min="-1.0"
                max="1.0"
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
