import React, { useEffect } from "react";
import FlexLayout, { TabNode } from "flexlayout-react";

import "./App.css"
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import { AppBar, Button, IconButton, Toolbar, Typography, Icon } from "@material-ui/core";
import FileSystemNavigator from "./components/Content/Panels/TypeTree/TypeTree";

const json = {
	global: {},
	borders: [		 {
		"type":"border",
		 "location": "left",
		"children": [
			{
				"type": "tab",
				"enableClose":false,
				"name": "Types",
				"component": "typeTree",
			}
		]
	}
],
	layout:{
		"type": "row",
		"weight": 100,
		"children": [
			{
				"type": "tabset",
				"weight": 50,
				"selected": 0,
				"children": [
					{
						"type": "tab",
						"name": "FX",
						"component":"grid",
					}
				]
			},
			{
				"type": "tabset",
				"weight": 50,
				"selected": 0,
				"children": [
					{
						"type": "tab",
						"name": "FI",
						"component":"grid",
					}
				]
			}
		]
	}
};

const factory = (node:TabNode) => {
  var component = node.getComponent();
  if (component === "grid") {
      //return <button>{node.getName()}</button>;
	  return <Button variant="contained" color="primary">
      {node.getName()}
    </Button>
  }
  if (component === "typeTree"){
	  return FileSystemNavigator();
  }
}

function App() {
  return   <div id="app" >
	<div id="header">
		<AppBar position="static">
		<Toolbar>
			<IconButton edge="start" color="inherit" aria-label="menu">
				<ArrowDownwardIcon fontSize="inherit" />
			</IconButton>
			<Typography variant="h6">
			News
			</Typography>
			<Button color="inherit">Login</Button>
		</Toolbar>
		</AppBar>
	</div>
	<div id="contents">
		<FlexLayout.Layout model={FlexLayout.Model.fromJson(json)} factory={factory}/>
	</div>  
</div>
}

export default App;
