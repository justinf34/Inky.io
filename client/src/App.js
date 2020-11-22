import React, { Component } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./Utils/ProtectedRoute";
import ProfilePage from "./pages/ProfilePage";
import AdminPage from "./pages/AdminPage";
export default class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <div className="App">
            <Route exact path="/login">
              <LoginPage />
            </Route>
            <ProtectedRoute exact path="/profile" component={ProfilePage} />
            <ProtectedRoute exact path="/" component={HomePage} />
            <ProtectedRoute exact path="/report" component={AdminPage} />
          </div>
        </Switch>
      </Router>
    );
  }
}
