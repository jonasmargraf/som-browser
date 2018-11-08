import React from 'react';
import { Types } from './Constants';
import { DragLayer } from 'react-dnd';

const layerStyles = {
  position: 'fixed',
  pointerEvents: 'none',
  zIndex: 100,
  left: 0,
  top: 0,
  width: '100%',
  height: '100%'
}

function getItemStyles(props) {
  const { currentOffset } = props
  if (!currentOffset) {
    return {
      display: 'none'
    }
  }

  const { x, y } = currentOffset
  const transform = `translate(${x}px, ${y}px)`;
  return {
    transform: transform
  }
}

class CustomDragPreview extends React.Component {
  renderItem(type, item) {
    switch (type) {
    case Types.SUBNODE:
      return (
        <div className="DragPreview">{item.id}</div>
      )
    case Types.SELECTION_SLOT:
      // console.log(item)
      return (
        <div className="DragPreview">Sample #{item.id}</div>
      )
    }
  }

  render() {
    const { item, itemType, isDragging } = this.props;
    // console.log(item)
    if (!isDragging) {
      return null
    }

    return (
      <div style={layerStyles}>
        <div style={getItemStyles(this.props)}>
          {this.renderItem(itemType, item)}
        </div>
      </div>
    )
  }
}

function collect(monitor) {
  return {
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging()
  };
}

export default DragLayer(collect)(CustomDragPreview);
