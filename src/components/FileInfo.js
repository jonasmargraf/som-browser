import '../assets/css/App.css';
import React, { Component } from 'react';
const math = require('mathjs');

class FileInfo extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidUpdate() {
    // console.log('FileInfo updated')
  }

  render() {
    const file = this.props.file

    return (
      <div className="FileInfo">
          {
            file ?

            <h3>{file.name}</h3>

            :

            <h3>File Info</h3>
          }
          {
            file ?

            <div>
              <ul className="FileInfoList">
                <li>Selected File:        {file.name}</li>
                <li>File Path:            {file.path}</li>
              </ul>
              {file.features &&
                <ul className="FileInfoList">
                  <li id="featuresHeader">Audio Features</li>
                  <li>Loudness:           {math.round(file.features.loudness, 2)}</li>
                  <li>RMS:                {math.round(file.features.rms, 4)}</li>
                  <li>Zero-Crossing Rate: {math.round(file.features.zcr, 2)}</li>
                  <li>Spectral Centroid:  {math.round(file.features.spectralCentroid, 2)}</li>
                  <li>Spectral Flatness:  {math.round(file.features.spectralFlatness, 2)}</li>
                  <li>Spectral Slope:     {math.round(file.features.spectralSlope, 9)}</li>
                  <li>Spectral Rolloff:   {math.round(file.features.spectralRolloff, 0)} Hz</li>
                  <li>Spectral Spread:    {math.round(file.features.spectralSpread, 2)}</li>
                  <li>Spectral Skewness:  {math.round(file.features.spectralSkewness, 2)}</li>
                  <li>Spectral Kurtosis:  {math.round(file.features.spectralKurtosis, 2)}</li>
                </ul>
              }
            </div>

            :

            <p>No file selected.</p>
          }
      </div>
    );
  }
}

export default FileInfo;
