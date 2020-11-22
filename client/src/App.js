import React, { Component } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./Utils/ProtectedRoute";
import Game from "./pages/Game";

export default class App extends Component {
  render() {
    return (
      <div className="App">
        <Router>
          <Switch>
            <Route exact path="/login" component={LoginPage} />
            <ProtectedRoute exact path="/" component={HomePage} />
            <ProtectedRoute exact path="/game/:lobbyID" component={Game} />
          </Switch>
        </Router>
      </div>
    );
  }
}
