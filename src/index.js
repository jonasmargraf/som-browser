import React from 'react';
import { render } from 'react-dom';
import App from './components/App';
// import HTML5Backend from 'react-dnd-html5-backend';
// import MouseBackEnd from 'react-dnd-mouse-backend';
// import { DragDropContext } from 'react-dnd'
// import { DragDropContextProvider } from 'react-dnd';
// import '!style-loader!css-loader!bootstrap/dist/css/bootstrap.css';

// Since we are using HtmlWebpackPlugin WITHOUT a template, we should create our own root node in the body element before rendering into it
let root = document.createElement('div');
root.id = "root";
document.body.appendChild( root );

// Now we can render our application into it
render(
  // <DragDropContextProvider backend={MouseBackEnd}>
    <App />,
  // </DragDropContextProvider>,
  document.getElementById('root') );
