import '../assets/css/App.css';
import React, { Component } from 'react';

class Map extends React.Component {
  constructor(props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick(mapElement) {
    this.props.onMapClick(mapElement)
  }

  createMap(som, files, selectedFile) {
    let xPos
    let yPos
    let map = som.coordinates.map((coordinate, index) => {
      xPos = (coordinate[0] * (100 / som.mapSize[0]))
      yPos = (coordinate[1] * (100 / som.mapSize[1]))
      let node =
        <svg key={index} x={xPos + "%"} y={yPos + "%"}>
          <rect
            className="Node"
            rx="1px"
            ry="1px"
            width={(100 / som.mapSize[0]) + '%'}
            height={(100 / som.mapSize[1]) + '%'}>
          </rect>
          {som.neuronAssignedFiles[index] &&
            som.neuronAssignedFiles[index].map((e, i) => {
              let nodeFileCount = som.neuronAssignedFiles[index].length
              let nodeGridRoot = Math.ceil(Math.sqrt(nodeFileCount))
              let x = (i % nodeGridRoot) * (100 / nodeGridRoot)
              let y = Math.floor(i / nodeGridRoot) * (100 / nodeGridRoot)
              return <rect
                key={files[e].path}
                id={files[e].path === selectedFile ? "SubNodeSelected" : null}
                className="SubNode"
                onClick={this.handleClick.bind(this, files[e].path)}
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
    const fileKey = this.props.selectedFile ? this.props.selectedFile.path : null

    return (
      <div className="Map">
        {
          this.props.som ?

          <svg className="Drawing" >
            {this.createMap(this.props.som, this.props.files, fileKey)}
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
