import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { CssBaseline } from "@material-ui/core";
import "flexlayout-react/style/light.css";
import {Buffer} from "buffer";

ReactDOM.render(
  <React.Fragment>
    <CssBaseline />
    <div id="container">
      <App />
    </div>
  </React.Fragment>,
  document.getElementById("root")
);
