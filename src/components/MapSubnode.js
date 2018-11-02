import '../assets/css/App.css';
import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { DragSource } from 'react-dnd';
import { Types } from './Constants';

const subnodeSource = {
  beginDrag(props) {
    const item = { id: props.id }
    return item
  },

  endDrag(props, monitor, component) {
    if (!monitor.didDrop()) {
      return
    }

    const item = monitor.getItem()
    const dropResult = monitor.getDropResult()
    console.log(item.id + 'dropped!')
  }
}

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  }
}

class MapSubnode extends React.PureComponent {
  constructor(props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
    this.handleMouseEnter = this.handleMouseEnter.bind(this)
    this.handleMouseLeave = this.handleMouseLeave.bind(this)
    this.handleMouseMove = this.handleMouseMove.bind(this)
  }

  componentDidMount() {
    // console.log('MapSubnode mounted')
  }

  componentDidUpdate() {
    console.log('MapSubnode updated')
  }

  handleClick(mapElement) {
    this.props.onClick(mapElement)
  }

  handleMouseEnter(name, path) {
    this.props.onMouseEnter(name)
    this.handleClick(path)
  }

  handleMouseLeave(e) {
    this.props.onMouseLeave()
  }

  handleMouseMove(e) {
    this.props.onMouseMove({
      labelPosition: [
        e.clientX - this.props.boundingRect.left + 10,
        e.clientY - this.props.boundingRect.top
      ]
    })
  }

  render() {

    const { isDragging, connectDragSource } = this.props;
    isDragging && console.log('subnode dragging: ' + isDragging)

    const index = this.props.nodeIndex
    const i = this.props.index
    const e = this.props.e
    const som = this.props.som
    const files = this.props.files
    // const selectedFile = this.props.selectedFile
    const xPos = this.props.xPosition
    const yPos = this.props.yPosition

    let nodeFileCount = som.neuronAssignedFiles[index].length
    let nodeGridRoot = Math.ceil(Math.sqrt(nodeFileCount))
    let x = (i % nodeGridRoot) * (100 / nodeGridRoot)
    let y = Math.floor(i / nodeGridRoot) * (100 / nodeGridRoot)
    let subNodeX = x / som.mapSize[0] + 0.5
    let subNodeY = y / som.mapSize[0] + 0.5
    let subNodeLength = 100 / (som.mapSize[0] * nodeGridRoot)
    let name = files[e].name
    let path = files[e].path

    let subnode =
    <svg key={index} x={xPos + "%"} y={yPos + "%"}>
      <rect
        key={files[e].path}
        id={
          this.props.selected ? "SubNodeSelected" : null
          // files[e].path === selectedFile ? "SubNodeSelected" : null
        }
        className="SubNode"
        onMouseEnter={this.handleMouseEnter.bind(this, name, path)}
        onMouseMove={this.handleMouseMove}
        onMouseLeave={this.handleMouseLeave}
        onClick={this.handleClick.bind(this, path)}
        x={subNodeX + "%"}
        y={subNodeY + "%"}
        rx="1px"
        ry="1px"
        width={subNodeLength - 1 + "%"}
        height={subNodeLength - 1 + "%"}>
      </rect>
    </svg>

    return connectDragSource(
      subnode
    )
  }
}

export default DragSource(Types.SUBNODE, subnodeSource, collect)(MapSubnode)
// export default MapSubnode
