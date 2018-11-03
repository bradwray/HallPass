import React from "react";
import { Route } from "react-router";
import { BrowserRouter } from "react-router-dom";
import Pass from "./Pass.js";

export default class Root extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          <Route exact path="/" component={Pass} />
          <Route exact path="/:key" component={Pass} />
        </div>
      </BrowserRouter>
    );
  }
}
