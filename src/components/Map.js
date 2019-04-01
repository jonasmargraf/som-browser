import '../assets/css/App.css';
import MapNode from './MapNode';
import MapSubnode from './MapSubnode';
import MapLabel from './MapLabel'
import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
const { ipcRenderer, remote } = require('electron');

class Map extends React.Component {
  constructor(props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
    this.handleMouseEnter = this.handleMouseEnter.bind(this)
    this.handleMouseLeave = this.handleMouseLeave.bind(this)
    this.handleMouseMove = this.handleMouseMove.bind(this)
    this.handleBeginDrag = this.handleBeginDrag.bind(this)
    this.handleEndDrag = this.handleEndDrag.bind(this)
    this.state = {
      label: null,
      labelPosition: [0, 0],
      showLabel: false,
      rect: undefined,
      width: undefined,
      height: undefined,
      dragging: false
    }
    this.mapRef = React.createRef()
    ipcRenderer.on('resize', (event, value) => {
      console.log('resize')
      // console.log(this.mapRef.current.clientWidth)
      this.setState({
        width: this.mapRef.current.clientWidth,
        height: this.mapRef.current.clientHeight
      })
    })
  }

  componentWillMount() {
    // this.setState({ width: this.mapRef.current.clientWidth })
  }

  componentDidMount() {
    this.setState({
      width: this.mapRef.current.clientWidth,
      height: this.mapRef.current.clientHeight,
      rect: findDOMNode(this).getBoundingClientRect()
    })
  }

  componentWillUpdate() {
    // console.log('map will update')
  }

  componentDidUpdate() {
    // console.log('Map updated')
    // console.log(this.mapRef.current.clientWidth)
  }

  handleClick(mapElement) {
    !this.state.dragging && this.props.onMapClick(mapElement)
  }

  handleMouseEnter(name) {
    !this.state.dragging && this.setState({
        label: name,
        showLabel: true
    })
  }

  handleMouseLeave() {
    !this.state.dragging && this.setState({ showLabel: false })
    !this.state.dragging && this.props.onMouseLeave()
  }

  handleMouseMove(position) {
    !this.state.dragging && this.setState(position)
  }

  handleBeginDrag() {
    console.log('handleBeginDrag() in Map.js called')
    this.setState({
      dragging: true,
      showLabel: false
    })
  }

  handleEndDrag() {
    console.log('handleEndDrag() in Map.js called')
    this.setState({ dragging: false })
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
          parentWidth={this.state.width}
          parentHeight={this.state.height}
          boundingRect={this.state.rect}
          onMouseEnter={this.handleMouseEnter}
          onMouseMove={this.handleMouseMove}
          onMouseLeave={this.handleMouseLeave}
          onClick={this.handleClick}
          onBeginDrag={this.handleBeginDrag}
          onEndDrag={this.handleEndDrag}>
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
      <div className="Map" ref={this.mapRef}>
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
            <p>{this.props.progress}</p>
            {
              // <p>This is where the Map visualization will be shown.</p>
            }
          </div>
        }

      </div>
    );
  }
}

export default Map;
