import '../assets/css/App.css';
import React, { Component } from 'react';
import { findDOMNode } from 'react-dom'

let label = {
  name: null,
  position: [0, 0],
  show: false
}

class Map extends React.Component {
  constructor(props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick(mapElement, name) {
    this.props.onMapClick(mapElement)
    label.name = name
  }

  handleMouseEnter(e) {
    label.show = true
    const rect = findDOMNode(this).getBoundingClientRect()
    label.position = [e.clientX - rect.left + 20, e.clientY - rect.top]
  }

  createMap(som, files, selectedFile) {
    var xPos
    var yPos
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
              let subNodeX = x / som.mapSize[0] + 0.5
              let subNodeY = y / som.mapSize[0] + 0.5
              let subNodeLength = 100 / (som.mapSize[0] * nodeGridRoot)
              return (
                  <rect
                    key={files[e].path}
                    id={files[e].path === selectedFile ? "SubNodeSelected" : null}
                    className="SubNode"
                    onMouseOver={this.handleClick.bind(this, files[e].path, files[e].name)}
                    onMouseEnter={this.handleMouseEnter.bind(this)}
                    onMouseLeave={() => {label.show = false; this.createLabel(label)}}
                    onClick={this.handleClick.bind(this, files[e].path, files[e].name)}
                    x={subNodeX + "%"}
                    y={subNodeY + "%"}
                    rx="1px"
                    ry="1px"
                    width={subNodeLength - 1 + "%"}
                    height={subNodeLength - 1 + "%"}>
                  </rect>
              )
            })
          }
        </svg>
      return node
    })
    return map
  }

  createLabel(label) {
    // console.log(label)
    let returnValue
    returnValue = <text
      className="label"
      x={label.position[0]}
      y={label.position[1]}>
      {label.show ? label.name : "fuq"}
    </text>
    // console.log(returnValue)
    return returnValue
  }

  render() {
    const fileKey = this.props.selectedFile ? this.props.selectedFile.path : null

    return (
      <div className="Map">
        {
          this.props.som ?

          <svg className="Drawing">
            {this.createMap(this.props.som, this.props.files, fileKey)}
            {label.show && this.createLabel(label)}
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
