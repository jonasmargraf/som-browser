import '../assets/css/App.css';
import React, { Component } from 'react';
import { findDOMNode } from 'react-dom'

class MapNode extends React.PureComponent {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    // console.log('MapNode mounted')
  }

  componentDidUpdate() {
    // console.log('MapNode updated')
  }

  render() {
    let node =
    <rect
      key={this.props.index}
      x={this.props.xPosition + "%"}
      y={this.props.yPosition + "%"}
      className="Node"
      rx="1px"
      ry="1px"
      width={(100 / this.props.som.mapSize[0]) + '%'}
      height={(100 / this.props.som.mapSize[1]) + '%'}>
    </rect>

    return (
      node
    )
  }
}

export default MapNode;
