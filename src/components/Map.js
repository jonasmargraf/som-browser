import '../assets/css/App.css';
import React, { Component } from 'react';

class Map extends React.Component {

  createMap() {
    let map = []
    let xPos
    let yPos
    for (var i = 0; i < 8; i++) {
      xPos = 0.25 + ((100 / 8) * i) + '%'
      for (var j = 0; j < 8; j++) {
        yPos = 0.25 + ((100 / 8) * j) + '%'
        map.push(<rect
          className="Node"
          x={xPos}
          y={yPos}
          rx="1px"
          ry="1px"
          width="12%"
          height="12%">
        </rect>)
      }
    }
    return map
  }

  render() {

    return (
      <div className="Map">
        {
          // <h3>Map</h3>
          // <p>This is where the Map visualization will be shown.</p>
        }
        <svg className="Drawing">
          {this.createMap()}
        </svg>

      </div>
    );
  }
}

export default Map;
