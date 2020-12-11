import React, { Component } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import ProtectedRoute from "./Utils/ProtectedRoute";

import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import Game from "./pages/Game";
import AdminPage from "./pages/AdminPage";
import BanPage from "./pages/BanPage";
import MatchHistoryPage from "./pages/MatchHistoryPage";

export default class App extends Component {
  render() {
    return (
      <div className="App">
        <Router>
          <Switch>
            <Route exact path="/login" component={LoginPage} />
            <ProtectedRoute exact path="/" component={HomePage} />
            <ProtectedRoute exact path="/banPage" component={BanPage} />
            <ProtectedRoute exact path="/profile" component={ProfilePage} />
            <ProtectedRoute exact path="/profile" component={ProfilePage} />
            <ProtectedRoute exact path="/history" component={MatchHistoryPage} />
            <ProtectedRoute exact path="/report" component={AdminPage} />
          </Switch>
        </Router>
      </div>
    );
  }
}
