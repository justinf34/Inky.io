import React, { Component } from "react";
import "./App.css";
import LoginPage from "./pages/LoginPage";
import queryString from "query-string";

export default class App extends Component {
  componentDidMount() {
    var query = queryString.parse(this.props.location.search);
    if (query.token) {
      window.localStorage.setItem("jwt", query.token);
      this.props.history.push("/");
    }
  }

  render() {
    return (
      <div className="App">
        <LoginPage></LoginPage>
      </div>
    );
  }
}
