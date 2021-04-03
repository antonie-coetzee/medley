import React, { useEffect } from "react";
import { Provider } from "mobx-react";

import "./App.css";

import { Stores } from "./stores/Stores";
import { PanelContainer } from "./components/panels/PanelContainer";
import { Header } from "./components/header/Header";

const stores = new Stores();

function App() {
  return   <div id="app" >
	<Provider {...stores}>
		<div id="header">
			<Header/>
		</div>
		<div id="contents">
			<PanelContainer/>
		</div>
	</Provider>
</div>
}

export default App;
