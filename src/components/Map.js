import '../assets/css/App.css';
import React, { Component } from 'react';
import { findDOMNode } from 'react-dom'

let name
let path

class Map extends React.Component {
  constructor(props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
    this.handleMouseEnter = this.handleMouseEnter.bind(this)
    this.handleMouseLeave = this.handleMouseLeave.bind(this)
    this.handleMouseMove = this.handleMouseMove.bind(this)
    this.state = {
      label: null,
      labelPosition: [0, 0],
      showLabel: false,
      rect: undefined
    }
  }

  componentDidMount() {
    this.setState({ rect: findDOMNode(this).getBoundingClientRect() })
  }

  componentDidUpdate() {
    // console.log('update')
  }

  handleClick(mapElement, _name) {
    this.props.onMapClick(mapElement)
  }

  handleMouseEnter(name) {
    this.setState({
        label: name,
        showLabel: true
    })
  }

  handleMouseLeave(e) {
    this.setState({ showLabel: false })
  }

  handleMouseMove(e) {
    this.setState({
      labelPosition: [e.clientX - this.state.rect.left + 10, e.clientY - this.state.rect.top]
    })
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
              name = files[e].name
              path = files[e].path
              return (
                  <rect
                    key={files[e].path}
                    id={files[e].path === selectedFile ? "SubNodeSelected" : null}
                    className="SubNode"
                    onMouseOver={this.handleClick.bind(this, path, name)}
                    onMouseEnter={this.handleMouseEnter.bind(this, name)}
                    onMouseMove={this.handleMouseMove}
                    onMouseLeave={this.handleMouseLeave}
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

  render() {
    const fileKey = this.props.selectedFile ? this.props.selectedFile.path : null

    return (
      <div className="Map">
        {
          this.props.som ?

          <div style={{position: 'absolute', width: 'inherit', height: 'inherit', zIndex: 1}}>
            <svg className="Drawing">
              {this.createMap(this.props.som, this.props.files, fileKey)}
            </svg>
          <span
            className="label"
            style={
              {
                left: this.state.labelPosition[0],
                top: this.state.labelPosition[1],
                display: this.state.showLabel ? 'block' : 'none'
              }
            }>
            {this.state.showLabel && this.state.label}
          </span>
          </div>

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
