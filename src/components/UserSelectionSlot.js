import '../assets/css/App.css';
import React, { Component } from 'react';
import { DropTarget, DragSource } from 'react-dnd';
import { Types } from './Constants';

const selectionSlotTarget = {
  // canDrop(props, monitor) {
  //   // You can disallow drop based on props or item
  //   const item = monitor.getItem();
  // },
  hover(props, monitor, component) {
    // This is fired very often and lets you perform side effects
    // in response to the hover. You can't handle enter and leave
    // here—if you need them, put monitor.isOver() into collect() so you
    // can just use componentDidUpdate() to handle enter/leave.
    console.log('hovering over UserSelectionSlot')

    // You can access the coordinates if you need them
    // const clientOffset = monitor.getClientOffset();
    // const componentRect = findDOMNode(component).getBoundingClientRect();

    // You can check whether we're over a nested drop target
    // const isJustOverThisOne = monitor.isOver({ shallow: true });

    // You will receive hover() even for items for which canDrop() is false
    const canDrop = monitor.canDrop();
  },

  drop(props, monitor, component) {
    if (monitor.didDrop()) {
      // If you want, you can check whether some nested
      // target already handled drop
      return;
    }

    // Obtain the dragged item
    const item = monitor.getItem();
    console.log('item.index: ' + item.index + ', props.index: ' + props.index)

    // You can do something with it
    // ChessActions.movePiece(item.fromPosition, props.position);
    props.moveSelectionSlot(item.index, props.index)

    // You can also do nothing and return a drop result,
    // which will be available as monitor.getDropResult()
    // in the drag source's endDrag() method
    return { moved: true };
  }
}

function collectTarget(connect, monitor) {
  return {
    // Call this function inside render()
    // to let React DnD handle the drag events:
    connectDropTarget: connect.dropTarget(),
    // You can ask the monitor about the current drag state:
    isOver: monitor.isOver(),
    isOverCurrent: monitor.isOver({ shallow: true }),
    canDrop: monitor.canDrop(),
    itemType: monitor.getItemType()
  };
}

const selectionSlotSource = {
  beginDrag(props) {
    const item = { id: props.id, index: props.index }
    console.log('dragging item with id: ' + item.id)
    return item
  },

  endDrag(props, monitor, component) {
    if (!monitor.didDrop()) {
      console.log(monitor.getItem().id + " didn't drop!")
      return
    }

    const item = monitor.getItem()
    const dropResult = monitor.getDropResult()
    console.log(item.id + ' dropped!')
  }
}

function collectSource(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  }
}

class UserSelectionSlot extends React.PureComponent {
  constructor(props) {
    super(props)
  }

  componentDidUpdate(prevProps, prevState) {
    // console.log('prevProps:')
    // console.log(prevProps)
    // console.log('currentProps:')
    // console.log(this.props)
  }

  render() {
    const { connectDropTarget, connectDragSource, isDragging } = this.props
    console.log('rendered')
    // isDragging && console.log('UserSelectionSlot dragging: ' + isDragging)
    return connectDragSource(
      connectDropTarget(
        <div className="UserSelectionSlot">
          <p>{this.props.label}</p>
        </div>
      )
    )
  }
}

export default DropTarget(
  Types.SELECTION_SLOT,
  selectionSlotTarget,
  collectTarget
)(
  DragSource(
    Types.SELECTION_SLOT,
    selectionSlotSource,
    collectSource
  )(UserSelectionSlot),
)
