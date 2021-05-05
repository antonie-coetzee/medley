import React, {useRef} from 'react';
import ReactDOM from 'react-dom';

import {CssBaseline, Button } from "@material-ui/core";


ReactDOM.render(
  <React.StrictMode>
    <React.Fragment>
    <CssBaseline />
    <div id="container">
      <Button variant="contained" color="primary">Hello World</Button>
    </div>
    </React.Fragment> 
  </React.StrictMode>,
  document.getElementById('root')
);