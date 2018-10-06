import '../assets/css/App.css';
import MapNode from './MapNode';
import MapSubnode from './MapSubnode';
import React, { Component } from 'react';
import { findDOMNode } from 'react-dom'

class MapLabel extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidUpdate() {
    // console.log('MapLabel updated')
  }

  render() {

    return (
      <span
        className="label"
        style={
          {
            left: this.props.label.labelPosition[0],
            top: this.props.label.labelPosition[1],
            display: this.props.label.showLabel ? 'block' : 'none'
          }
        }>
        {this.props.label.showLabel && this.props.label.label}
      </span>
    )
  }
}

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
    // console.log('Map updated')
  }

  handleClick(mapElement) {
    this.props.onMapClick(mapElement)
  }

  handleMouseEnter(name) {
    this.setState({
        label: name,
        showLabel: true
    })
  }

  handleMouseLeave() {
    this.setState({ showLabel: false })
    this.props.onMouseLeave()
  }

  handleMouseMove(position) {
    this.setState(position)
  }

  createMap(som, files, selectedFile) {
    var xPos
    var yPos

    let nodes = som.coordinates.map((coordinate, index) => {
      xPos = (coordinate[0] * (100 / som.mapSize[0]))
      yPos = (coordinate[1] * (100 / som.mapSize[1]))
      let node =
      <MapNode
        key={index}
        index={index}
        som={som}
        files={files}
        xPosition={xPos}
        yPosition={yPos}>
      </MapNode>
      return node
    })

    let subnodes = som.coordinates.map((coordinate, index) => {
      xPos = (coordinate[0] * (100 / som.mapSize[0]))
      yPos = (coordinate[1] * (100 / som.mapSize[1]))
      let nodeSubnodes = som.neuronAssignedFiles[index] &&
      som.neuronAssignedFiles[index].map((e, i) => {
        let subnode = <MapSubnode
          key={i}
          index={i}
          e={e}
          nodeIndex={index}
          som={som}
          files={files}
          selected={selectedFile === files[e].path}
          xPosition={xPos}
          yPosition={yPos}
          boundingRect={this.state.rect}
          onMouseEnter={this.handleMouseEnter}
          onMouseMove={this.handleMouseMove}
          onMouseLeave={this.handleMouseLeave}
          onClick={this.handleClick}>
        </MapSubnode>
        return subnode
      })
      return nodeSubnodes
    })

    return [ nodes, subnodes ]
  }

  render() {
    const fileKey = this.props.selectedFile ? this.props.selectedFile.path : null

    return (
      <div className="Map">
        {
          this.props.som ?

          <div
            style={
              {
                position: 'absolute',
                width: 'inherit',
                height: 'inherit',
                zIndex: 1
              }
            }>
            <svg className="Drawing">
              {this.createMap(this.props.som, this.props.files, fileKey)}
            </svg>
            <MapLabel label={this.state}></MapLabel>
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
