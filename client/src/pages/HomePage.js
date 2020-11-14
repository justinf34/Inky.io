import React from "react";
import LoginPage from "./LoginPage";
import { Button } from "react-bootstrap";

class HomePage extends React.Component {
  state = {
    user: {},
    error: null,
    authenticated: false,
  };

  componentDidMount() {
    fetch("http://localhost:8888/auth/login/success", {
      method: "GET",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true,
      },
    })
      .then((response) => {
        if (response.status === 200) return response.json();
        throw new Error("failed to authenticate user");
      })
      .then((responseJson) => {
        this.setState({
          authenticated: true,
          user: responseJson.user,
        });
      })
      .catch((error) => {
        this.setState({
          authenticated: false,
          error: "Failed to authenticate user",
        });
      });
  }

  handleLogoutClick() {
    window.open("http://localhost:8888/auth/logout", "_self");
    this.setState({
      authenticated: false,
    });
  }

  render() {
    const { authenticated } = this.state;
    return (
      <div className="page">
        {!authenticated ? (
          <LoginPage />
        ) : (
          <React.Fragment>
            <h1>You have logged-in successfully!</h1>
            <Button onClick={this.handleLogoutClick}>Logout</Button>
          </React.Fragment>
        )}
      </div>
    );
  }
}

export default HomePage;
