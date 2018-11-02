import '../assets/css/App.css';
import React, { Component } from 'react';
import UserSelectionSlot from './UserSelectionSlot';

class UserSelection extends React.PureComponent {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    console.log('UserSelection mounted')
  }

  componentDidUpdate() {
    console.log('UserSelection updated')
  }


  render() {

    const userSelectionSlots = Array.from(new Array(8),(e,i) =>
      <UserSelectionSlot key={i} index={i}></UserSelectionSlot>)
    console.log(userSelectionSlots)

    return (
      <div className="UserSelection">
        { userSelectionSlots }
      </div>
    );
  }
}

export default UserSelection;
