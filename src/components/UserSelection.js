import '../assets/css/App.css';
import React, { Component } from 'react';
import UserSelectionSlot from './UserSelectionSlot';

class UserSelection extends React.Component {
  constructor(props) {
    super(props)
    this.moveSelectionSlot = this.moveSelectionSlot.bind(this)
    this.resetUserSelection = this.resetUserSelection.bind(this)
    this.dropSample = this.dropSample.bind(this)
    this.handleClick = this.handleClick.bind(this)
}

  componentWillMount(){
    this.resetUserSelection()
  }

  resetUserSelection() {
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
  }

  componentDidUpdate() {
    // console.log('UserSelection updated')
  }

  componentWillUpdate() {
    (Array.isArray(this.props.userSelection) && !this.props.userSelection.length)
    && this.resetUserSelection()
  }

  moveSelectionSlot(fromPosition, toPosition) {
    console.log('inside moveSelectionSlot')
    console.log(this.state)
    let userSelectionSlots = this.props.userSelection
    const movingSlot = userSelectionSlots[fromPosition]

    userSelectionSlots.splice(toPosition, 0,
      userSelectionSlots.splice(fromPosition, 1)[0])

    this.props.onUserSelectionUpdate(userSelectionSlots)
  }

  dropSample(item, position) {
    let userSelectionSlots = this.props.userSelection

    userSelectionSlots[position].file = item.id
    userSelectionSlots[position].path = item.path
    userSelectionSlots[position].filesIndex = item.filesIndex

    this.props.onUserSelectionUpdate(userSelectionSlots)
  }

  handleClick(file) {
    console.log('UserSelection click')
    this.props.onClick(file)
  }

  render() {
    // console.log('rendered')
    const userSelectionSlots = this.props.userSelection
    const { isOver, canDrop, connectDropTarget } = this.props

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
            filesIndex={e.filesIndex}
            moveSelectionSlot={this.moveSelectionSlot}
            dropSample={this.dropSample}
            onClick={this.handleClick}/>
        )}
      </div>
    );
  }
}

export default UserSelection
