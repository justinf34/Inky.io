import React, { Component } from "react";
import "./App.css";
import { BrowserRouter as Router, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CanvasContainer from "./components/GameComponents/CanvasContainer";

export default class App extends Component {
  render() {
    return (
      // <Router>
      //   <div className="App">
      //     <HomePage />
      //   </div>
      // </Router>
      <CanvasContainer />
    );
  }
}
