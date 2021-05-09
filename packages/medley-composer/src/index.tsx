import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {CssBaseline} from '@material-ui/core';
import "flexlayout-react/style/light.css"

ReactDOM.render(
  <React.StrictMode>
    <React.Fragment>
    <CssBaseline />
    <div id="container">
      <App />
    </div>
    </React.Fragment> 
  </React.StrictMode>,
  document.getElementById('root')
);