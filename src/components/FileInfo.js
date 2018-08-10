import '../assets/css/App.css';
import React, { Component } from 'react';

class FileInfo extends React.Component {
  constructor(props) {
    super(props)
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
        <ul>
          {
            file ?

            <div>
              <li>Selected file: {file.name}</li>
              <li>File path: {file.path}</li>
              <li>{file.features.energy}</li>
            </div>

            :

            <p>No file selected.</p>
          }
        </ul>
      </div>
    );
  }
}

export default FileInfo;
