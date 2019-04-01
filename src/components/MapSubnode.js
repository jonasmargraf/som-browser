import '../assets/css/App.css';
import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { DragSource } from 'react-dnd';
import { Types } from './Constants';

const subnodeSource = {
  beginDrag(props) {
    const item = {
      id: props.files[props.e].name,
      path: props.files[props.e].path,
      filesIndex: props.e
    }
    console.log('dragging subnode')
    props.onBeginDrag()
    return item
  },

  endDrag(props, monitor, component) {
    if (!monitor.didDrop()) {
      console.log('drag ended')
      props.onEndDrag()
      return
    }

    if (monitor.didDrop()) {
      props.onEndDrag()
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

class MapSubnode extends React.Component {
  constructor(props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
    this.handleMouseEnter = this.handleMouseEnter.bind(this)
    this.handleMouseLeave = this.handleMouseLeave.bind(this)
    this.handleMouseMove = this.handleMouseMove.bind(this)
    var dragging = false
    this.refTest = React.createRef()
  }

  componentDidMount() {
    // console.log('MapSubnode mounted')
    console.log(this.refTest.current.offsetWidth)
  }

  componentDidUpdate() {
    console.log('MapSubnode updated')
    // console.log(this.refTest.current.width.baseVal.value)
    // console.log(this.refTest.current.parentElement.width.baseVal.value)
    // console.log(this.props.parentWidth)
  }

  handleClick() {
    // If playFile():
    // this.props.onClick(this.props.files[this.props.e].path)
    // If playFileFromMemory():
    this.props.onClick(this.props.e)
  }

  // handleMouseEnter(event, name, path) {
  handleMouseEnter(event) {
    this.props.onMouseEnter(this.props.files[this.props.e].name)
    // If playFile():
    // event.shiftKey && this.handleClick(this.props.files[this.props.e].path)
    // If playFileFromMemory():
    event.shiftKey && this.handleClick(this.props.e)
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
    const { isDragging, connectDragSource } = this.props
    const index = this.props.nodeIndex
    const i = this.props.index
    const e = this.props.e
    const som = this.props.som
    const files = this.props.files
    const xPos = this.props.xPosition
    const yPos = this.props.yPosition

    let nodeFileCount = som.neuronAssignedFiles[index].length
    let nodeGridRoot = Math.ceil(Math.sqrt(nodeFileCount))
    // let x = (i % nodeGridRoot) * (100 / nodeGridRoot)
    // let y = Math.floor(i / nodeGridRoot) * (100 / nodeGridRoot)
    let x = (i % nodeGridRoot) * (this.props.parentWidth / nodeGridRoot)
    let y = Math.floor(i / nodeGridRoot) * (this.props.parentHeight / nodeGridRoot)
    let subNodeX = x / som.mapSize[0] + 0.
    let subNodeY = y / som.mapSize[0] + 0.
    // let subNodeLength = 100 / (som.mapSize[0] * nodeGridRoot)
    let subNodeWidth = (this.props.parentWidth /
      (som.mapSize[0] * nodeGridRoot)) - 2
    let subNodeHeight = (this.props.parentHeight /
      (som.mapSize[0] * nodeGridRoot)) - 2
    let name = files[e].name
    let path = files[e].path

    // onMouseEnter={isDragging ? null : this.handleMouseEnter.bind(this, event, name, path)}


    let subnode =
    <svg key={index} x={xPos + "%"} y={yPos + "%"}>
      <rect
        key={files[e].path}
        id={
          this.props.selected ? "SubNodeSelected" : null
          // files[e].path === selectedFile ? "SubNodeSelected" : null
        }
        ref={this.refTest}
        className="SubNode"
        onMouseEnter={isDragging ? null : this.handleMouseEnter}
        onMouseMove={isDragging ? null : this.handleMouseMove}
        onMouseLeave={isDragging ? null : this.handleMouseLeave}
        onClick={this.handleClick}
        x={subNodeX + 1}
        y={subNodeY + 1}
        rx="1px"
        ry="1px"
        width={subNodeWidth}
        height={subNodeHeight}>
      </rect>
    </svg>

    return connectDragSource(
      subnode
    )
  }
}

export default DragSource(Types.SUBNODE, subnodeSource, collect)(MapSubnode)
