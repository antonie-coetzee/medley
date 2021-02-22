import React, { useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import { ModelViewEngine } from "@medley/medley-mve";

function App() {
  useEffect(() => {
    const doTest = async () => {
      const mve = new ModelViewEngine();
      mve.setBasePath("/assets/");
      await mve.load("models.json");
      const res = await mve.renderModel(
        "e0754165-d127-48be-92c5-85fc25dbca19",
        []
      );
      console.log(res);
    };
    doTest();
  });

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
