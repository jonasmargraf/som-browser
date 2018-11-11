import '../assets/css/App.css';
import React, { Component } from 'react';
import { DropTarget } from 'react-dnd';
import { Types } from './Constants';
import UserSelectionSlot from './UserSelectionSlot';

const selectionTarget = {
  // canDrop(props, monitor) {
  //   // You can disallow drop based on props or item
  //   const item = monitor.getItem();
  // },
  hover(props, monitor, component) {
    // This is fired very often and lets you perform side effects
    // in response to the hover. You can't handle enter and leave
    // here—if you need them, put monitor.isOver() into collect() so you
    // can just use componentDidUpdate() to handle enter/leave.
    // console.log('hovering over UserSelection')

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
    // console.log('item: ' + item)

    // You can do something with it
    // ChessActions.movePiece(item.fromPosition, props.position);

    // You can also do nothing and return a drop result,
    // which will be available as monitor.getDropResult()
    // in the drag source's endDrag() method
    return { moved: true };
  }
}

function collect(connect, monitor) {
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

class UserSelection extends React.Component {
  constructor(props) {
    super(props)
    this.moveSelectionSlot = this.moveSelectionSlot.bind(this)
    this.dropSample = this.dropSample.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.state = {
      userSelectionSlots: [
        {
          id: 1,
          label: 'Sample #1',
          file: undefined,
          path: undefined
        },
        {
          id: 2,
          label: 'Sample #2',
          file: undefined,
          path: undefined
        },
        {
          id: 3,
          label: 'Sample #3',
          file: undefined,
          path: undefined
        },
        {
          id: 4,
          label: 'Sample #4',
          file: undefined,
          path: undefined
        },
        {
          id: 5,
          label: 'Sample #5',
          file: undefined,
          path: undefined
        },
        {
          id: 6,
          label: 'Sample #6',
          file: undefined,
          path: undefined
        },
        {
          id: 7,
          label: 'Sample #7',
          file: undefined,
          path: undefined
        },
        {
          id: 8,
          label: 'Sample #8',
          file: undefined,
          path: undefined
        }
      ]
    }
  }

  componentWillMount() {
    const userSelection = [
      {
        id: 1,
        label: 'Sample #1',
        file: undefined,
        path: undefined
      },
      {
        id: 2,
        label: 'Sample #2',
        file: undefined,
        path: undefined
      },
      {
        id: 3,
        label: 'Sample #3',
        file: undefined,
        path: undefined
      },
      {
        id: 4,
        label: 'Sample #4',
        file: undefined,
        path: undefined
      },
      {
        id: 5,
        label: 'Sample #5',
        file: undefined,
        path: undefined
      },
      {
        id: 6,
        label: 'Sample #6',
        file: undefined,
        path: undefined
      },
      {
        id: 7,
        label: 'Sample #7',
        file: undefined,
        path: undefined
      },
      {
        id: 8,
        label: 'Sample #8',
        file: undefined,
        path: undefined
      }
    ]
    this.props.onUserSelectionUpdate(userSelection)
  }

  componentDidMount() {
    // console.log('UserSelection mounted')
    // this.moveSelectionSlot(0, 4)
  }

  componentDidUpdate() {
    // console.log('UserSelection updated')
    // console.log(this.state)
    // this.forceUpdate()
    // console.log(userSelectionSlots)
  }

  moveSelectionSlot(fromPosition, toPosition) {
    console.log('inside moveSelectionSlot')
    console.log(this.state)
    // const fromPosition = 2
    // const toPosition = 4
    // let { userSelectionSlots } = this.state
    let userSelectionSlots = this.props.userSelection
    const movingSlot = userSelectionSlots[fromPosition]

    userSelectionSlots.splice(toPosition, 0,
      userSelectionSlots.splice(fromPosition, 1)[0])
    // let newSel = userSelectionSlots
    // console.log(newSel)

    // this.setState({
    //   userSelectionSlots: userSelectionSlots
    // })
    this.props.onUserSelectionUpdate(userSelectionSlots)
  }

  dropSample(item, position) {
    // let { userSelectionSlots } = this.state
    let userSelectionSlots = this.props.userSelection
    userSelectionSlots[position].file = item.id
    userSelectionSlots[position].path = item.path
    // this.setState({
    //   userSelectionSlots: userSelectionSlots
    // })
    this.props.onUserSelectionUpdate(userSelectionSlots)
  }

  handleClick(file) {
    console.log('UserSelection click')
    this.props.onClick(file)
  }

  render() {
    // console.log('rendered')
    // const userSelectionSlots = this.state.userSelectionSlots
    const userSelectionSlots = this.props.userSelection
    // console.log(userSelectionSlots)
    const { isOver, canDrop, connectDropTarget } = this.props
    // console.log(userSelectionSlots)

    // isOver && console.log('isOver == ' + isOver + ', canDrop == ' + canDrop)

    // isOver && this.moveSelectionSlot(0, 4)

    // return connectDropTarget(
    return (
      <div className="UserSelection">
        { userSelectionSlots.map((e, i) =>
          <UserSelectionSlot
            key={e.id}
            id={e.id}
            index={i}
            label={e.label}
            file={e.file}
            path={e.path}
            moveSelectionSlot={this.moveSelectionSlot}
            dropSample={this.dropSample}
            onClick={this.handleClick}/>
          // </UserSelectionSlot>
        )}
        {
          // <button onClick={this.moveSelectionSlot}/>
        }
      </div>
    );
  }
}

export default UserSelection
// export default DropTarget(
  // Types.SELECTION_SLOT, selectionTarget, collect)(UserSelection);
