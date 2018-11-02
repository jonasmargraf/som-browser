import '../assets/css/App.css';
import React, { Component } from 'react';
import { DragSource } from 'react-dnd';
import { Types } from './Constants';

const selectionSlotSource = {
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

class UserSelectionSlot extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      id: undefined
    }
  }
  render() {
    const { connectDragSource, isDragging } = this.props
    isDragging && console.log('UserSelectionSlot dragging: ' + isDragging)
    return connectDragSource(
      <div className="UserSelectionSlot">
        <p>Sample #{this.props.index}</p>
      </div>
    );
  }
}

export default DragSource(Types.SELECTION_SLOT, selectionSlotSource, collect)(UserSelectionSlot);
