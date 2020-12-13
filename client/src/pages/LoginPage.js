import React, { Component } from "react";
import { Button } from "react-bootstrap";
import { Redirect } from "react-router-dom";
import AuthContext, { useAuth } from "../context/AuthContext";
import "../styles/loginPage.css";
import logo from "../images/INKY.png";
import { SERVER_URL } from "../Utils/Constants";
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
          <div className="container">
            <div className="internal-container">
              <img src={logo} className="logo"></img>
              <Button
                className="login-button"
                onClick={() =>
                  window.open(SERVER_URL + "/auth/google", "_self")
                }
              >
                Sign in With Google
              </Button>
              <div className="infoContainer">
                <h3>About</h3>
                <p>
                  Inky io is an online pictionary game to cure quarantine
                  boredom
                </p>
                <p>
                  Developed by Julian Pinto, Christina Lu, Dheeraj Kumar, Justin
                  Flores, Richard Williams and Jen-Wei Huang
                </p>
                <p>Enjoy!</p>
              </div>
            </div>
          </div>
        )}
      </React.Fragment>
    );
  }
}

export default AuthContext(LoginPage);
