import '../assets/css/App.css';
import MapNode from './MapNode';
import MapSubnode from './MapSubnode';
import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';

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

export default MapLabel;
