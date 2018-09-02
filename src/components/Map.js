import '../assets/css/App.css';
import React, { Component } from 'react';

class Map extends React.Component {
  constructor(props) {
    super(props)
  }

  createMap(som, files) {
    let xPos
    let yPos
    let map = som.coordinates.map((coordinate, index) => {
      xPos = (coordinate[0] * (100 / som.mapSize[0]))
      yPos = (coordinate[1] * (100 / som.mapSize[1]))
      let node =
        <svg x={xPos + "%"} y={yPos + "%"}>
          <rect
            className="Node"
            rx="1px"
            ry="1px"
            width={(100 / som.mapSize[0]) + '%'}
            height={(100 / som.mapSize[1]) + '%'}>
          </rect>
          {som.neuronAssignedFiles[index] &&
            som.neuronAssignedFiles[index].map((e, i) => {
              var nodeFileCount = som.neuronAssignedFiles[index].length
              var nodeGridRoot = Math.ceil(Math.sqrt(nodeFileCount))
              var x = (i % nodeGridRoot) * (100 / nodeGridRoot)
              var y = Math.floor(i / nodeGridRoot) * (100 / nodeGridRoot)
              return <rect
                className="SubNode"
                x={x / som.mapSize[0] + 0.5 + "%"}
                y={y / som.mapSize[1] + 0.5 + "%"}
                rx="1px"
                ry="1px"
                width={100 / (som.mapSize[0] * nodeGridRoot) - 1 + "%"}
                height={100 / (som.mapSize[1] * nodeGridRoot) - 1 + "%"}>
              </rect>
            })
          }
        </svg>
      return node
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
