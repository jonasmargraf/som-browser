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

    let fileInfo = file ?

    <div>
      <h3>{file.name}</h3>
      { file.features ?
        <div className="FileInfoTable">
          <div className="row">
            <div className="column">
              <div className="cell feature">File Path:</div>
              <div className="cell">{file.path}</div>
            </div>
          </div>
          <div className="row">
            <div className="cell feature">Loudness:</div>
            <div className="cell value">{math.round(file.features.loudness, 2)}</div>
          </div>
          <div className="row">
            <div className="cell feature">RMS:</div>
            <div className="cell value">{math.round(file.features.rms, 4)}</div>
          </div>
          <div className="row">
            <div className="cell feature">Zero-Crossing Rate:</div>
            <div className="cell value">{math.round(file.features.zcr, 2)}</div>
          </div>
          <div className="row">
            <div className="cell feature">Spectral Centroid:</div>
            <div className="cell value">{math.round(file.features.spectralCentroid, 2)}</div>
          </div>
          <div className="row">
            <div className="cell feature">Spectral Flatness:</div>
            <div className="cell value">{math.round(file.features.spectralFlatness, 2)}</div>
          </div>
          <div className="row">
            <div className="cell feature">Spectral Slope:</div>
            <div className="cell value">{math.round(file.features.spectralSlope, 9)}</div>
          </div>
          <div className="row">
            <div className="cell feature">Spectral Rolloff:</div>
            <div className="cell value">{math.round(file.features.spectralRolloff, 0)} Hz</div>
          </div>
          <div className="row">
            <div className="cell feature">Spectral Spread:</div>
            <div className="cell value">{math.round(file.features.spectralSpread, 2)}</div>
          </div>
          <div className="row">
            <div className="cell feature">Spectral Skewness:</div>
            <div className="cell value">{math.round(file.features.spectralSkewness, 2)}</div>
          </div>
          <div className="row">
            <div className="cell feature">Spectral Kurtosis:</div>
            <div className="cell value">{math.round(file.features.spectralKurtosis, 2)}</div>
          </div>
        </div>

      :

      <div className="FileInfoTable">
        <div className="row">
          <div className="cell">File Path:</div>
          <div className="cell">{file.path}</div>
        </div>
      </div>
    }

    </div>

    :

    <div>
    <h3>File Info</h3>
    <p>No file selected.</p>
    </div>

    return (
      <div className="FileInfo">
          {
            fileInfo
//             file ?
//
//             <h3>{file.name}</h3>
//
//             :
//
//             <h3>File Info</h3>
//           }
//           {
//             if (file) {
//
//               if (file.features) {
//                 <ul className="FileInfoList">
//                   <li>File Path:            {file.path}</li>
//                   <li>Loudness:           {math.round(file.features.loudness, 2)}</li>
//                   <li>RMS:                {math.round(file.features.rms, 4)}</li>
//                   <li>Zero-Crossing Rate: {math.round(file.features.zcr, 2)}</li>
//                   <li>Spectral Centroid:  {math.round(file.features.spectralCentroid, 2)}</li>
//                   <li>Spectral Flatness:  {math.round(file.features.spectralFlatness, 2)}</li>
//                   <li>Spectral Slope:     {math.round(file.features.spectralSlope, 9)}</li>
//                   <li>Spectral Rolloff:   {math.round(file.features.spectralRolloff, 0)} Hz</li>
//                   <li>Spectral Spread:    {math.round(file.features.spectralSpread, 2)}</li>
//                   <li>Spectral Skewness:  {math.round(file.features.spectralSkewness, 2)}</li>
//                   <li>Spectral Kurtosis:  {math.round(file.features.spectralKurtosis, 2)}</li>
//                 </ul>
//               }
//
//               else {
//                 <ul className="FileInfoList">
//                   <li>File Path:            {file.path}</li>
//                 </ul>
//               }
//             }
//
//             else {
//               <p>No file selected.</p>
//             }
//
// {
//             // <div>
//             //   <ul className="FileInfoList">
//             //       <li>File Path:            {file.path}</li>
//             //
//             //     {file.features &&
//             //
//             //     <div>
//             //
//             //       <li>Loudness:           {math.round(file.features.loudness, 2)}</li>
//             //       <li>RMS:                {math.round(file.features.rms, 4)}</li>
//             //       <li>Zero-Crossing Rate: {math.round(file.features.zcr, 2)}</li>
//             //       <li>Spectral Centroid:  {math.round(file.features.spectralCentroid, 2)}</li>
//             //       <li>Spectral Flatness:  {math.round(file.features.spectralFlatness, 2)}</li>
//             //       <li>Spectral Slope:     {math.round(file.features.spectralSlope, 9)}</li>
//             //       <li>Spectral Rolloff:   {math.round(file.features.spectralRolloff, 0)} Hz</li>
//             //       <li>Spectral Spread:    {math.round(file.features.spectralSpread, 2)}</li>
//             //       <li>Spectral Skewness:  {math.round(file.features.spectralSkewness, 2)}</li>
//             //       <li>Spectral Kurtosis:  {math.round(file.features.spectralKurtosis, 2)}</li>
//             //
//             //   </div>
//             // }
//             //
//             //     </ul>
//             // </div>
//
//             // :
//
//           }
        }
      </div>
    );
  }
}

export default FileInfo;
