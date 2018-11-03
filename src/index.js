import React from "react";
import ReactDOM from "react-dom";
import Pass from "./Pass.js";
import Routes from "./routes.js";
import "./styles.css";

function App() {
  return (
    <div className="App">
      <Routes />
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
