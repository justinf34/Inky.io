import React, { Component } from "react";
import { Button } from "react-bootstrap";

export default class LoginPage extends Component {
  render() {
    return (
      <div>
        <Button
          onClick={() =>
            window.open("http://localhost:8888/auth/google", "_self")
          }
        >
          Login
        </Button>
      </div>
    );
  }
}
