import '../assets/css/App.css';
import React, { Component } from 'react';

class Map extends React.Component {
  constructor(props) {
    super(props)
  }

  createMap(som) {
    let map = []
    let xPos
    let yPos
    som.coordinates.forEach((coordinate, index) => {
      xPos = (coordinate[0] * (100 / som.mapSize[0]))
      yPos = (coordinate[1] * (100 / som.mapSize[1]))
      map.push(
        <svg>
          <rect
            className="Node"
            x={xPos + '%'}
            y={yPos + '%'}
            rx="1px"
            ry="1px"
            width={(100 / som.mapSize[0]) + '%'}
            height={(100 / som.mapSize[1]) + '%'}>
          </rect>
          <rect
            x={xPos + '%'}
            y={yPos + '%'}
            width={(100 / som.mapSize[0] - 2) + '%'}
            height={(100 / som.mapSize[0] - 2) + '%'}
            fill="white">
          </rect>
          <text
            x={xPos + '%'}
            y={yPos + '%'}
            dx="1%"
            dy="3%">
            {som.neuronAssignedFiles[index] ?
              som.neuronAssignedFiles[index].length
              :
              "nuthin'"}
            </text>
        </svg>
      )
    })

    return map
  }

  render() {

    return (
      <div className="Map">
        {
          this.props.som ?

          <svg className="Drawing">
            {this.createMap(this.props.som)}
          </svg>
          :
          <div>
            <h3>Map</h3>
            <p>This is where the Map visualization will be shown.</p>
          </div>
        }

      </div>
    );
  }
}

export default Map;
