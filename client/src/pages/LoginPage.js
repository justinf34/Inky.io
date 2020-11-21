import React, { Component } from "react";
import { Button } from "react-bootstrap";
import { Redirect } from "react-router-dom";
import AuthContext, { useAuth } from "../context/AuthContext";

class LoginPage extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <React.Fragment>
        {this.props.authCreds.auth.authenticated ? (
          <Redirect to={"/"} />
        ) : (
          <div>
            <Button
              onClick={() =>
                window.open("http://localhost:8888/auth/google", "_self")
              }
            >
              Login
            </Button>
          </div>
        )}
      </React.Fragment>
    );
  }
}

export default AuthContext(LoginPage);
