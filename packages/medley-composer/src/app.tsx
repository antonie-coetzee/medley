import React from "react";
import { Provider } from "mobx-react";
import { SnackbarProvider } from "notistack";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import "./App.css";

import { Stores } from "./stores/Stores";
import { PanelContainer } from "./components/panels/PanelContainer";
import { Header } from "./components/header/Header";
import { Dialogs } from "./components/dialogs/Dialogs";

const stores = new Stores();

function App() {
  return (
    <div id="app">
      <Provider {...stores}>
        <DndProvider backend={HTML5Backend}>
          <SnackbarProvider
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
          >
            <div id="header">
              <Header />
            </div>
            <div id="contents">
              <PanelContainer />
            </div>
            <Dialogs />
          </SnackbarProvider>
        </DndProvider>
      </Provider>
    </div>
  );
}

export default App;
