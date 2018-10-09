import '../assets/css/App.css';
import React, { Component } from 'react';

class UserSelectionSlot extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      id: undefined
    }
  }
  render() {
    return (
      <div className="UserSelectionSlot">
        <p>Sample #{this.props.index}</p>
      </div>
    );
  }
}

export default UserSelectionSlot;
